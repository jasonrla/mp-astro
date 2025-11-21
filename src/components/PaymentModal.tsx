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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closePaymentModal}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={closePaymentModal}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
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

        {/* Payment Flow */}
        <div className="p-6">
          <PaymentFlow
            amount={total.value}
            payer={{ email: checkoutData.value.email }}
            description={`Pedido de ${checkoutData.value.firstName} ${checkoutData.value.lastName}`}
            externalReference={`${Date.now()}`}
            statementDescriptor="CRAZZULA"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
