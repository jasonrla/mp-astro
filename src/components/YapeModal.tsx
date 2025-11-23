import React from "react";
import { orderId } from "../store/checkoutStore";

interface YapeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const YapeModal = ({ isOpen, onClose }: YapeModalProps) => {
  if (!isOpen) return null;

  const handleContinue = () => {
    if (orderId.value) {
      window.location.href = `/order/${orderId.value}/confirmation-pending`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Pago con Yape</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Yape Logo */}
            <div className="flex justify-center">
              <div className="rounded-lg bg-purple-600 px-6 py-3">
                <span className="text-2xl font-bold text-white">YAPE</span>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Código QR</p>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <p className="text-sm font-medium text-purple-900">
                Número de Yape
              </p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                970 700 879
              </p>
              <p className="mt-1 text-sm text-purple-700">Jason Lopez</p>
            </div>

            {/* Instructions */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-900">
                Instrucciones:
              </h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="font-semibold text-purple-600">1.</span>
                  <span>Escanea el código QR o yapea al número indicado.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-purple-600">2.</span>
                  <span>
                    Envía la constancia de pago por WhatsApp al{" "}
                    <a
                      href="https://wa.me/51970700879"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-green-600 hover:underline"
                    >
                      970 700 879
                    </a>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-purple-600">3.</span>
                  <span>
                    Confirmaremos tu pedido una vez recibamos tu comprobante.
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={handleContinue}
            className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default YapeModal;
