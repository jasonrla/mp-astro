import React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { currentStep } from "../store/paymentStore";
import PaymentBrickWrapper from "./PaymentBrickWrapper";
import StatusScreenBrickWrapper from "./StatusScreenBrickWrapper";

interface PaymentFlowProps {
  amount: number;
  payer: {
    email: string;
  };
  description?: string;
  externalReference?: string;
}

const PaymentFlow = ({
  amount,
  payer,
  description,
  externalReference,
}: PaymentFlowProps) => {
  useSignals();

  // Prevent accidental page exit during payment
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning during payment step
      if (currentStep.value === "payment") {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
        return "¿Estás seguro de que deseas salir? Se perderán los datos de tu compra.";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    // <div className="w-full">
    <div>
      {/* Warning Banner - Fixed at top, only during payment */}
      {currentStep.value === "payment" && (
        <div className="mb-3 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-3 shadow-sm md:mb-4 md:p-4">
          <div className="flex items-start">
            <svg
              className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-yellow-600 md:mr-3 md:h-5 md:w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-yellow-800 md:text-sm">
                Importante
              </h3>
              <p className="mt-1 text-xs text-yellow-700 md:text-sm">
                Por favor, no cierres esta ventana ni presiones el botón "Atrás"
                durante el proceso de pago.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Card with Header Inside */}
      <div className="rounded-lg bg-white p-4 shadow-lg md:p-6">
        {/* Header - Only show during payment step */}
        {currentStep.value === "payment" && (
          <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-3 md:mb-6 md:flex-row md:items-center md:justify-between md:gap-0 md:pb-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                Checkout Seguro
              </h1>
              <p className="mt-1 text-xs text-gray-500 md:text-sm">
                Completa tu pago de forma segura.
              </p>
              {/* Amount Display */}
              <div className="mt-2 flex items-baseline gap-2 md:mt-3">
                <span className="text-xs text-gray-500 md:text-sm">
                  Total a pagar:
                </span>
                <span className="text-lg font-bold text-blue-600 md:text-xl">
                  S/ {amount.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <svg
                className="h-5 w-5 text-green-600 md:h-6 md:w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium text-gray-700 md:text-sm">
                Conexión segura
              </span>
            </div>
          </div>
        )}

        {/* Brick Content */}
        <div className={currentStep.value === "payment" ? "mt-4 md:mt-6" : ""}>
          {currentStep.value === "payment" && (
            <PaymentBrickWrapper
              amount={amount}
              payer={payer}
              description={description}
              externalReference={externalReference}
            />
          )}
          {currentStep.value === "status" && <StatusScreenBrickWrapper />}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 text-center md:mt-4">
        <p className="text-xs text-gray-400 md:text-sm">
          Protegido por Mercado Pago • Todos los datos están encriptados
        </p>
      </div>
    </div>
  );
};

export default PaymentFlow;
