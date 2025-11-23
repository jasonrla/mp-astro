import React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  cart,
  updateQuantity,
  removeFromCart,
  subtotal,
  cartItemCount,
} from "../store/checkoutStore";

const Cart = () => {
  useSignals();

  if (cart.value.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          Tu carrito está vacío
        </h3>
        <p className="mb-6 text-gray-500">
          ¡Agrega algunos productos increíbles para comenzar!
        </p>
        <a
          href="/"
          className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
        >
          Explorar productos
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="font-heading text-lg font-semibold text-gray-900 uppercase">
          Carrito de Compras ({cartItemCount.value})
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {cart.value.map((item) => (
          <div key={item.id} className="flex gap-4 p-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-base font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-base font-semibold text-gray-900">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Precio unitario: S/ {item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 text-gray-600 hover:text-purple-600 disabled:opacity-50"
                    aria-label="Disminuir cantidad"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 text-gray-600 hover:text-purple-600"
                    aria-label="Aumentar cantidad"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <div className="flex items-center justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>S/ {subtotal.value.toFixed(2)}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          El envío y los descuentos se calculan en el checkout.
        </p>
        <div className="mt-6">
          <a
            href="/checkout"
            className="flex w-full items-center justify-center rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            Ir a Checkout
          </a>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            o{" "}
            <a
              href="/"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Continuar Comprando
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
