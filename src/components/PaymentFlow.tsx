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
  statementDescriptor?: string;
}

const PaymentFlow = ({
  amount,
  payer,
  description,
  externalReference,
  statementDescriptor,
}: PaymentFlowProps) => {
  useSignals();

  return (
    <div className="w-full">

      <div className="min-h-[850px] overflow-hidden rounded-lg bg-white shadow-lg">
        {currentStep.value === "payment" ? (
          <>
            <div className="p-4 md:p-6">

              <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-3 md:mb-6 md:flex-row md:items-center md:justify-between md:gap-0 md:pb-4">
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                    Checkout Seguro
                  </h1>
                  <p className="mt-1 text-xs text-gray-500 md:text-sm">
                    Completa tu pago de forma segura.
                  </p>

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


              <div className="mt-4 md:mt-6">
                <PaymentBrickWrapper
                  amount={amount}
                  payer={payer}
                  description={description}
                  externalReference={externalReference}
                  statementDescriptor={statementDescriptor}
                />
              </div>
            </div>
          </>
        ) : (

          <div className="flex h-full w-full flex-col items-center justify-center p-4 pt-8 md:p-6">
            <StatusScreenBrickWrapper />
          </div>
        )}
      </div>


      <div className="mt-3 text-center md:mt-4">
        <p className="text-xs text-gray-400 md:text-sm">
          Protegido por Mercado Pago • Todos los datos están encriptados
        </p>
      </div>
    </div>
  );
};

export default PaymentFlow;
