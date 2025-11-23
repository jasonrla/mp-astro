import React, { useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  isPaymentModalOpen,
  closePaymentModal,
  checkoutData,
  total,
} from "../store/checkoutStore";
import PaymentFlow from "./PaymentFlow";

const PaymentModal = () => {
  useSignals();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isPaymentModalOpen.value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPaymentModalOpen.value]);

  if (!isPaymentModalOpen.value) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closePaymentModal}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500">Total a pagar:</span>
              <span className="text-xl font-bold text-blue-500">
                S/ {total.value.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:mr-8">
            <svg
              className="h-5 w-5 text-purple-600"
              fill="green"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Conexión segura
            </span>
          </div>
          <button
            onClick={closePaymentModal}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
            aria-label="Cerrar"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-0 pr-4 pl-4 md:pr-8 md:pl-8">
          <PaymentFlow
            amount={total.value}
            payer={{
              email: checkoutData.value.email,
              firstName: checkoutData.value.firstName,
              lastName: checkoutData.value.lastName,
              identification: {
                type: "DNI",
                number: checkoutData.value.dni,
              },
            }}
            description={`Pedido de ${checkoutData.value.firstName} ${checkoutData.value.lastName}`}
            externalReference={`${Date.now()}`}
            statementDescriptor="CRAZZULA"
          />
        </div>

        {/* Trust Badges Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <svg
                className="h-4 w-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Pago 100% seguro</span>
              <span className="text-gray-300">|</span>
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Certificado SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Procesado por</span>
              <img
                src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.19.5/mercadopago/logo__large.png"
                alt="Mercado Pago"
                className="h-6 opacity-80 grayscale transition-all hover:grayscale-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
