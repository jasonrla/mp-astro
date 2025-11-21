import { useEffect, useMemo, useCallback, useState } from "react";
import { StatusScreen } from "@mercadopago/sdk-react";
import {
  paymentId,
  paymentStatus,
  threeDSInfo,
  resetPaymentState,
} from "../store/paymentStore";
import { orderId } from "../store/checkoutStore";

const StatusScreenBrickWrapper = () => {
  const [isReady, setIsReady] = useState(false);

  // Transform snake_case to camelCase for the SDK
  // Based on TS error, additionalInfo expects externalResourceURL and creq directly
  // Transform snake_case to camelCase for the SDK
  const initialization = useMemo(() => {
    const rawThreeDSInfo = threeDSInfo.value;

    // Construct additionalInfo only if we have the required URL
    let additionalInfo;

    if (rawThreeDSInfo && rawThreeDSInfo.external_resource_url) {
      additionalInfo = {
        externalResourceURL: rawThreeDSInfo.external_resource_url,
        creq: rawThreeDSInfo.creq || undefined, // Only include if present
      };
    }

    console.log("StatusScreen initialization:", {
      paymentId: String(paymentId.value),
      hasThreeDS: !!rawThreeDSInfo,
      additionalInfo,
    });

    return {
      paymentId: String(paymentId.value!),
      additionalInfo,
    };
  }, [threeDSInfo.value, paymentId.value]);

  // Customization for redirect URLs and button labels
  const customization = useMemo(() => {
    // If we are in 3DS flow, we should NOT pass customization to avoid interfering with the 3DS iframe/UI
    if (threeDSInfo.value) {
      console.log("Skipping customization for 3DS flow");
      return undefined;
    }

    const uuid = orderId.value || "";
    const status = paymentStatus.value;

    console.log("StatusScreen configuration:", { uuid, status });

    // Determine return URL based on payment status
    let returnUrl = `${window.location.origin}/checkout`; // Default: back to checkout

    if (status === "approved" && uuid) {
      // Approved: go to confirmation
      returnUrl = `${window.location.origin}/order/${uuid}/confirmation-success`;
    } else if (status === "pending" || status === "rejected") {
      // Pending or rejected: back to checkout
      returnUrl = `${window.location.origin}/checkout`;
    }

    console.log("Return URL:", returnUrl);

    return {
      backUrls: {
        error: `${window.location.origin}/checkout`,
        return: returnUrl,
      },
      visual: {
        showExternalReference: true,
        texts: {
          ctaGeneralErrorLabel: "Elegir otro medio de pago",
          ctaCardErrorLabel: "Reintentar pago",
          ctaReturnLabel: status === "approved" ? "Continuar" : "Volver",
        },
      },
    };
  }, [orderId.value, paymentStatus.value, threeDSInfo.value]);

  const onReady = useCallback(async () => {
    console.log("StatusScreen Brick Ready");
    setIsReady(true);
  }, []);

  const onError = useCallback(async (error: any) => {
    console.error("StatusScreen Brick Error:", error);
  }, []);

  const handleBack = useCallback(() => {
    resetPaymentState();
  }, []);

  // Poll payment status if pending (for 3DS flow)
  useEffect(() => {
    if (!isReady || !paymentId.value) return;

    const currentStatus = paymentStatus.value;
    console.log("Current payment status:", currentStatus);

    // Only poll if status is pending
    if (currentStatus !== "pending") {
      return;
    }

    console.log("Payment is pending - starting status polling");

    let pollCount = 0;
    const maxPolls = 30; // Poll for max 30 times (30 seconds with 1s interval)

    const pollInterval = setInterval(async () => {
      pollCount++;
      console.log(`Polling payment status (attempt ${pollCount}/${maxPolls})`);

      try {
        const response = await fetch(`/api/payment-status/${paymentId.value}`);
        const result = await response.json();

        console.log("Poll result:", result);

        if (result.status !== "pending") {
          console.log("Payment status changed to:", result.status);
          paymentStatus.value = result.status;

          threeDSInfo.value = null;

          if (result.status === "approved") {
            console.log("Payment approved - creating order UUID");
            const { createOrder, submitOrderToBackend } = await import(
              "../store/checkoutStore"
            );
            const uuid = createOrder();
            console.log("Order UUID created:", uuid);
            await submitOrderToBackend(uuid);
          }

          clearInterval(pollInterval);
        } else if (pollCount >= maxPolls) {
          console.log("Max polling attempts reached");
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
        clearInterval(pollInterval);
      }
    }, 1000); // Poll every 1 second

    return () => {
      clearInterval(pollInterval);
    };
  }, [isReady, paymentId.value, paymentStatus.value]);

  useEffect(() => {
    return () => {
      console.log("Unmounting Status Screen Brick");
      if (window.statusScreenBrickController) {
        window.statusScreenBrickController.unmount();
      }
    };
  }, []);

  return (
    <div className="relative min-h-[600px] w-full">
      <StatusScreen
        key={`${paymentId.value}-${threeDSInfo.value ? "3ds" : "std"}`}
        initialization={initialization}
        customization={customization}
        onReady={onReady}
        onError={onError}
      />
    </div>
  );
};

export default StatusScreenBrickWrapper;
