import React, { useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  cart,
  subtotal,
  discount,
  total,
  deliveryCost,
  checkoutData,
  applyCoupon,
  removeCoupon,
  appliedCoupon,
  couponError,
  isFreeShipping,
} from "../store/checkoutStore";

const OrderSummary = () => {
  useSignals();
  const [showAllItems, setShowAllItems] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const visibleItems = showAllItems ? cart.value : cart.value.slice(0, 5);
  const hasMoreItems = cart.value.length > 5;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (success) {
      setCouponCode("");
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading mb-6 text-lg font-semibold text-gray-900 uppercase">
        Resumen de tu pedido
      </h2>

      <div className="mb-6 flex flex-col gap-4">
        {visibleItems.map((item) => (
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

        {hasMoreItems && (
          <button
            onClick={() => setShowAllItems(!showAllItems)}
            className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
          >
            {showAllItems
              ? "Ver menos"
              : `Ver más (${cart.value.length - 5} más)`}
          </button>
        )}
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        {/* Coupon Section */}
        <div className="mb-4">
          {!appliedCoupon.value ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Código de cupón"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim()}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Aplicar
              </button>
            </div>
          ) : (
            <div className="relative flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-900">
                    Cupón: {appliedCoupon.value.code}
                  </span>
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="text-green-600 hover:text-green-800 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                    </button>

                    {/* Tooltip */}
                    {showTooltip && (
                      <div className="absolute top-6 right-0 z-50 w-64 origin-top-right rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
                        <h4 className="mb-2 text-xs font-bold text-gray-900 uppercase">
                          Condiciones del cupón
                        </h4>
                        <ul className="space-y-1 text-xs text-gray-600">
                          <li>
                            <span className="font-medium">Válido:</span>{" "}
                            {new Date(
                              appliedCoupon.value.starts_at,
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              appliedCoupon.value.expires_at,
                            ).toLocaleDateString()}
                          </li>
                          {appliedCoupon.value.minimum_order_amount > 0 && (
                            <li>
                              <span className="font-medium">
                                Compra mínima:
                              </span>{" "}
                              S/ {appliedCoupon.value.minimum_order_amount}
                            </li>
                          )}
                          {appliedCoupon.value.maximum_discount_amount > 0 && (
                            <li>
                              <span className="font-medium">
                                Tope de descuento:
                              </span>{" "}
                              S/ {appliedCoupon.value.maximum_discount_amount}
                            </li>
                          )}
                          <li>
                            <span className="font-medium">Nota:</span> No aplica
                            con otros descuentos.
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-green-700">
                  {appliedCoupon.value.description}
                </span>
              </div>
              <button
                onClick={removeCoupon}
                className="rounded-full p-1 text-green-600 hover:bg-green-100 hover:text-green-800"
                title="Remover cupón"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          {couponError.value && (
            <p className="mt-2 text-xs text-red-600">{couponError.value}</p>
          )}
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            S/ {subtotal.value.toFixed(2)}
          </span>
        </div>

        {discount.value > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Descuento</span>
            <span className="font-medium text-green-600">
              - S/ {discount.value.toFixed(2)}
            </span>
          </div>
        )}

        {checkoutData.value.deliveryMethod === "delivery" && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Delivery{" "}
              {checkoutData.value.district
                ? `(${checkoutData.value.district})`
                : ""}
            </span>
            <span
              className={`font-medium ${isFreeShipping.value ? "text-green-600" : "text-gray-900"}`}
            >
              {isFreeShipping.value
                ? "Gratis"
                : `S/ ${deliveryCost.value.toFixed(2)}`}
            </span>
          </div>
        )}

        <div className="flex justify-between border-t border-gray-200 pt-3">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-purple-600">
            S/ {total.value.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-purple-50 py-3 text-xs text-purple-700">
        <svg
          className="h-4 w-4 text-purple-500"
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
