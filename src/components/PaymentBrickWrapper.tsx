import { useEffect, useState, useMemo, useCallback } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import {
  currentStep,
  paymentId,
  paymentStatus,
  threeDSInfo,
} from "../store/paymentStore";

initMercadoPago(import.meta.env.PUBLIC_MERCADO_PAGO_PUBLIC_KEY, {
  locale: "es-PE",
});

interface PaymentBrickWrapperProps {
  amount: number;
  payer: {
    email: string;
    firstName?: string;
    lastName?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  description?: string;
  externalReference?: string;
  statementDescriptor?: string;
}

const PaymentBrickWrapper = ({
  amount,
  payer,
  description,
  externalReference,
  statementDescriptor,
}: PaymentBrickWrapperProps) => {
  const [isReady, setIsReady] = useState(false);

  const initialization = useMemo(
    () => ({
      amount: amount,
      payer: {
        email: payer.email,
        firstName: payer.firstName || "Usuario",
        lastName: payer.lastName || "Prueba",
        identification: {
          type: "DNI",
          number: payer.identification?.number || "11111111",
        },
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
      visual: {
        hideFormTitle: true,
      },
    }),
    [],
  );

  const onSubmit = useCallback(
    async ({ selectedPaymentMethod, formData }: any) => {
      console.log("Payment Brick onSubmit:", {
        selectedPaymentMethod,
        formData,
      });

      try {
        const paymentData = {
          ...formData,
          description: description || "Payment",
          installments: 1,
          external_reference: externalReference,
          statement_descriptor: statementDescriptor,
        };

        console.log("Sending payment data:", paymentData);

        const response = await fetch("/api/process-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        const result = await response.json();
        console.log("Payment processing result:", result);

        if (result.id) {
          paymentId.value = result.id;
          paymentStatus.value = result.status;

          if (result.status === "approved") {
            console.log("Payment approved - creating order UUID");
            const { createOrder, submitOrderToBackend } = await import(
              "../store/checkoutStore"
            );
            const uuid = createOrder();
            console.log("Order UUID created:", uuid);
            await submitOrderToBackend(uuid);
          }

          if (result.three_ds_info) {
            console.log("3DS authentication required", result.three_ds_info);
            threeDSInfo.value = result.three_ds_info;
          }

          currentStep.value = "status";
        } else {
          console.error("Payment failed:", result);
        }
      } catch (error) {
        console.error("Error processing payment:", error);
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

  useEffect(() => {
    return () => {
      console.log("Unmounting Payment Brick");
      if (window.paymentBrickController) {
        window.paymentBrickController.unmount();
      }
    };
  }, []);

  return (
    <div className="relative min-h-[700px] w-full">
      <Payment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    </div>
  );
};

export default PaymentBrickWrapper;
