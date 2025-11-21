import React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { cart, subtotal, discount, total } from "../store/checkoutStore";

const OrderSummary = () => {
  useSignals();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        Resumen de tu pedido
      </h2>

      <div className="mb-6 flex flex-col gap-4">
        {cart.value.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
              <span className="mt-1 text-xs text-gray-500">
                Cant: {item.quantity}
              </span>
            </div>
            <div className="flex items-center text-sm font-semibold text-gray-900">
              S/ {(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            S/ {subtotal.value.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Descuento</span>
          <span className="font-medium text-green-600">
            - S/ {discount.value.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-3">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-blue-600">
            S/ {total.value.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-gray-50 py-3 text-xs text-gray-600">
        <svg
          className="h-4 w-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span className="font-medium">Compra 100% Segura</span>
      </div>
    </div>
  );
};

export default OrderSummary;
