import React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { currentStep } from "../store/paymentStore";
import PaymentBrickWrapper from "./PaymentBrickWrapper";
import StatusScreenBrickWrapper from "./StatusScreenBrickWrapper";

interface PaymentFlowProps {
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
      <div className="min-h-[850px] overflow-hidden rounded-lg bg-white">
        {currentStep.value === "payment" ? (
          <>
            <div>
              <div className="mt-2 text-center">
                {/* <h2 className="text-xl font-bold text-gray-900">
                  Selecciona tu medio de pago
                </h2> */}
                <p className="mt-1 text-sm text-gray-500">
                  Recuerda activar tus compras por internet
                </p>
              </div>
              <div className="">
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

      {/* <div className="mt-3 text-center md:mt-4">
        <p className="text-xs text-gray-400 md:text-sm">
          Protegido por Mercado Pago • Todos los datos están encriptados
        </p>
      </div> */}
    </div>
  );
};

export default PaymentFlow;
