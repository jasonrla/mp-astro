import React from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Términos y Condiciones
          </h3>
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
        <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-600">
          <div className="space-y-4">
            <p>
              <strong>1. Introducción</strong>
              <br />
              Bienvenido a nuestra tienda. Al realizar una compra, aceptas los
              siguientes términos y condiciones.
            </p>
            <p>
              <strong>2. Envíos y Entregas</strong>
              <br />
              Los tiempos de entrega son estimados y pueden variar según la
              ubicación. Nos esforzamos por cumplir con los plazos establecidos.
            </p>
            <p>
              <strong>3. Política de Devoluciones</strong>
              <br />
              Aceptamos devoluciones dentro de los 7 días posteriores a la
              recepción del producto, siempre que esté en su estado original.
            </p>
            <p>
              <strong>4. Privacidad de Datos</strong>
              <br />
              Tus datos personales serán tratados con confidencialidad y solo se
              utilizarán para procesar tu pedido y mejorar tu experiencia de
              compra.
            </p>
            <p>
              <strong>5. Pagos</strong>
              <br />
              Aceptamos pagos a través de Mercado Pago. Todas las transacciones
              son seguras y encriptadas.
            </p>
            <p>
              <strong>6. Cambios en los Términos</strong>
              <br />
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Las modificaciones entrarán en vigor inmediatamente
              después de su publicación.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
