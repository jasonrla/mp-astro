import React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  checkoutStep,
  checkoutData,
  nextStep,
  prevStep,
  openPaymentModal,
} from "../store/checkoutStore";

const CheckoutWizard = () => {
  useSignals();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    checkoutData.value = { ...checkoutData.value, [name]: value };
  };

  const isPersonalValid =
    checkoutData.value.email &&
    checkoutData.value.firstName &&
    checkoutData.value.lastName &&
    checkoutData.value.phone;

  const isDeliveryValid =
    checkoutData.value.address &&
    checkoutData.value.city &&
    checkoutData.value.zipCode;

  const handleProceedToPayment = () => {
    openPaymentModal();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {["personal", "delivery", "payment"].map((step, index) => {
          const stepNames = ["Datos Personales", "Envío", "Pago"];
          const isActive = checkoutStep.value === step;
          const isCompleted =
            (checkoutStep.value === "delivery" && index === 0) ||
            (checkoutStep.value === "payment" && index <= 1);

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "border-2 border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {stepNames[index]}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`h-0.5 flex-1 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {checkoutStep.value === "personal" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Datos Personales
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={checkoutData.value.firstName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={checkoutData.value.lastName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="Pérez"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={checkoutData.value.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={checkoutData.value.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="+51 999 999 999"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={nextStep}
                disabled={!isPersonalValid}
                className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {checkoutStep.value === "delivery" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Envío</h2>
              <button
                onClick={prevStep}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Editar datos personales
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={checkoutData.value.address}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="Av. Principal 123"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={checkoutData.value.city}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    placeholder="Lima"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={checkoutData.value.zipCode}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    placeholder="15000"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <button
                onClick={prevStep}
                className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                Atrás
              </button>
              <button
                onClick={handleProceedToPayment}
                disabled={!isDeliveryValid}
                className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
              >
                Ir a Pagar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutWizard;
