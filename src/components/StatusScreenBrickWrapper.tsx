import { useEffect, useMemo, useCallback } from "react";
import { StatusScreen } from "@mercadopago/sdk-react";
import {
  paymentId,
  threeDSInfo,
  resetPaymentState,
} from "../store/paymentStore";

const StatusScreenBrickWrapper = () => {
  // Transform snake_case to camelCase for the SDK
  // Based on TS error, additionalInfo expects externalResourceURL and creq directly
  const initialization = useMemo(() => {
    const rawThreeDSInfo = threeDSInfo.value;
    const additionalInfo = rawThreeDSInfo
      ? {
          externalResourceURL: rawThreeDSInfo.external_resource_url,
          creq: rawThreeDSInfo.creq,
        }
      : undefined;

    console.log("StatusScreen initialization:", {
      paymentId: paymentId.value,
      rawThreeDSInfo,
      additionalInfo,
    });

    return {
      paymentId: paymentId.value!, // We assume this is set if we are in this step
      additionalInfo,
    };
  }, []);

  // Customization for redirect URLs and button labels
  const customization = useMemo(
    () => ({
      backUrls: {
        error: `${window.location.origin}/checkout`, // Redirect to checkout on error
        return: `${window.location.origin}/`, // Redirect to home page
      },
      visual: {
        showExternalReference: true, // Show external reference on status screen
        texts: {
          ctaGeneralErrorLabel: "Elegir otro medio de pago",
          ctaCardErrorLabel: "Reintentar pago",
          ctaReturnLabel: "Volver a la tienda",
        },
      },
    }),
    [],
  );

  const onReady = useCallback(async () => {
    console.log("StatusScreen Brick Ready");
  }, []);

  const onError = useCallback(async (error: any) => {
    console.error("StatusScreen Brick Error:", error);
  }, []);

  const handleBack = useCallback(() => {
    resetPaymentState();
  }, []);

  // Cleanup: Unmount Status Screen Brick when component unmounts
  useEffect(() => {
    return () => {
      console.log("Unmounting Status Screen Brick");
      if (window.statusScreenBrickController) {
        window.statusScreenBrickController.unmount();
      }
    };
  }, []);

  return (
    <StatusScreen
      initialization={initialization}
      customization={customization}
      onReady={onReady}
      onError={onError}
    />
  );
};

export default StatusScreenBrickWrapper;
