import { useEffect, useState, useMemo, useCallback } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import {
  currentStep,
  paymentId,
  paymentStatus,
  threeDSInfo,
} from "../store/paymentStore";

// Initialize Mercado Pago with your public key
initMercadoPago(import.meta.env.PUBLIC_MERCADO_PAGO_PUBLIC_KEY, {
  locale: "es-PE",
});

interface PaymentBrickWrapperProps {
  amount: number;
  payer: {
    email: string;
  };
  description?: string;
  externalReference?: string;
}

const PaymentBrickWrapper = ({
  amount,
  payer,
  description,
  externalReference,
}: PaymentBrickWrapperProps) => {
  const [isReady, setIsReady] = useState(false);

  const initialization = useMemo(
    () => ({
      amount: amount,
      payer: {
        email: payer.email,
      },
    }),
    [amount, payer],
  );

  const customization = useMemo(
    () => ({
      paymentMethods: {
        ticket: "all",
        bankTransfer: "all",
        creditCard: "all",
        debitCard: "all",
        mercadoPago: "all",
        maxInstallments: 1,
      } as any,
    }),
    [],
  );

  const onSubmit = useCallback(
    async ({ selectedPaymentMethod, formData }: any) => {
      try {
        // Add description and external_reference to formData
        const paymentData = {
          ...formData,
          description: description || "Payment description",
          external_reference: externalReference || `ORDER-${Date.now()}`,
        };

        const response = await fetch("/api/process-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        const data = await response.json();

        if (response.ok) {
          paymentId.value = data.id;
          paymentStatus.value = data.status;

          if (data.status_detail === "pending_challenge") {
            threeDSInfo.value = data.three_ds_info;
          }

          currentStep.value = "status";
        } else {
          console.error("Payment failed", data);
          // Handle error (show alert, etc.)
        }
      } catch (error) {
        console.error("Error submitting payment", error);
      }
    },
    [description, externalReference],
  );

  const onError = useCallback(async (error: any) => {
    console.error("Payment Brick Error:", error);
  }, []);

  const onReady = useCallback(async () => {
    console.log("Payment Brick Ready");
    setIsReady(true);
  }, []);

  // Cleanup: Unmount Payment Brick when component unmounts
  useEffect(() => {
    return () => {
      console.log("Unmounting Payment Brick");
      if (window.paymentBrickController) {
        window.paymentBrickController.unmount();
      }
    };
  }, []);

  return (
    <Payment
      initialization={initialization}
      customization={customization}
      onSubmit={onSubmit}
      onReady={onReady}
      onError={onError}
    />
  );
};

export default PaymentBrickWrapper;
