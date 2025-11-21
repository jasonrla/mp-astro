import React, { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  checkoutData,
  cart,
  total,
  trackingCode,
} from "../store/checkoutStore";

interface OrderConfirmationProps {
  orderId?: string;
}

// Fetch order data from the backend API
const fetchOrderById = async (id: string) => {
  const response = await fetch(`/api/orders/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Order not found");
    }
    throw new Error("Failed to fetch order");
  }

  return await response.json();
};

const OrderConfirmation = ({ orderId }: OrderConfirmationProps) => {
  useSignals();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        // Validate UUID format (simple regex)
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(orderId)) {
          setLoading(false);
          setError("Orden no encontrada");
          return;
        }

        setLoading(true);
        try {
          const data = await fetchOrderById(orderId);
          setOrderData(data);
        } catch (error) {
          console.error("Error fetching order:", error);
          // If the error message is "Order not found", show the 404 state
          if (error instanceof Error && error.message === "Order not found") {
            setError("Orden no encontrada");
          } else {
            setError("Error al cargar la orden");
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to store data if no ID provided (shouldn't happen in this flow)
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
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
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Orden no encontrada
          </h2>
          <p className="mt-2 text-gray-600">
            No pudimos encontrar la orden que buscas. Verifica el enlace o
            intenta nuevamente.
          </p>
          <a
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  // Use fetched data or fallback to store data
  const displayData = orderData || {
    trackingCode: trackingCode.value,
    total: total.value,
    items: cart.value,
    customer: checkoutData.value,
    deliveryDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString("es-PE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Success Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">¡Pago exitoso!</h2>
        <p className="mt-2 text-sm text-gray-600">
          Tu pedido ha sido confirmado y está en proceso
        </p>
      </div>

      {/* Tracking Code */}
      <div className="mb-6 rounded-lg bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-blue-900">
              Código de seguimiento
            </p>
            <p className="mt-1 text-lg font-bold text-blue-600">
              {displayData.trackingCode}
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(displayData.trackingCode || "");
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Copiar
          </button>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Detalles del pedido
        </h3>

        {/* Products */}
        <div className="space-y-3">
          {displayData.items.map((item: any) => (
            <div key={item.id} className="flex gap-3">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
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
                <span className="text-xs text-gray-500">
                  Cantidad: {item.quantity}
                </span>
              </div>
              <div className="flex items-center text-sm font-semibold text-gray-900">
                S/ {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">
              Total pagado
            </span>
            <span className="text-lg font-bold text-blue-600">
              S/ {displayData.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Información de envío
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Destinatario:</span>{" "}
            {displayData.customer.firstName} {displayData.customer.lastName}
          </p>
          <p>
            <span className="font-medium">Dirección:</span>{" "}
            {displayData.customer.address}
          </p>
          <p>
            <span className="font-medium">Ciudad:</span>{" "}
            {displayData.customer.city}, {displayData.customer.zipCode}
          </p>
          <p>
            <span className="font-medium">Teléfono:</span>{" "}
            {displayData.customer.phone}
          </p>
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
        <svg
          className="h-6 w-6 flex-shrink-0 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-green-900">Entrega estimada</p>
          <p className="text-xs text-green-700">{displayData.deliveryDate}</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Próximos pasos
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Recibirás un email de confirmación en {displayData.customer.email}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600">•</span>
            <span>Te notificaremos cuando tu pedido sea enviado</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600">•</span>
            <span>Puedes rastrear tu pedido con el código de seguimiento</span>
          </li>
        </ul>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <a
          href="/"
          className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
        >
          Volver a la tienda
        </a>
      </div>
    </div>
  );
};

export default OrderConfirmation;
