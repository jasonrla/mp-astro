import React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import {
  checkoutStep,
  checkoutData,
  nextStep,
  prevStep,
  total,
  openPaymentModal,
  createOrder,
} from "../store/checkoutStore";
import { DISTRICTS } from "../constants/checkout";
import AddressMap from "./AddressMap";

import { z } from "zod";

const personalDataSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z.string().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos"),
  phone: z.string().regex(/^\d{9}$/, "El teléfono debe tener 9 dígitos"),
  email: z.string().email("Ingresa un email válido"),
});

import TermsModal from "./TermsModal";
import YapeModal from "./YapeModal";

// ... (imports)

const CheckoutWizard = () => {
  useSignals();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);
  const [isYapeModalOpen, setIsYapeModalOpen] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Allow only numbers for DNI and Phone
    if ((name === "dni" || name === "phone") && !/^\d*$/.test(value)) {
      return;
    }

    checkoutData.value = { ...checkoutData.value, [name]: value };

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validatePersonalData = () => {
    const result = personalDataSchema.safeParse({
      firstName: checkoutData.value.firstName,
      lastName: checkoutData.value.lastName,
      dni: checkoutData.value.dni,
      phone: checkoutData.value.phone,
      email: checkoutData.value.email,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const isPersonalValid = personalDataSchema.safeParse({
    firstName: checkoutData.value.firstName,
    lastName: checkoutData.value.lastName,
    dni: checkoutData.value.dni,
    phone: checkoutData.value.phone,
    email: checkoutData.value.email,
  }).success;

  const isDeliveryValid =
    checkoutData.value.deliveryMethod === "oficina" ||
    (checkoutData.value.deliveryMethod === "delivery" &&
      checkoutData.value.address &&
      checkoutData.value.district &&
      checkoutData.value.reference);

  const isPaymentMethodValid = !!checkoutData.value.paymentMethod;

  const toggleSection = (
    step: "personal" | "delivery" | "payment_method" | "summary" | "payment",
  ) => {
    if (step === "personal") {
      checkoutStep.value = "personal";
    } else if (step === "delivery") {
      if (validatePersonalData()) checkoutStep.value = "delivery";
    } else if (step === "payment_method") {
      if (validatePersonalData() && isDeliveryValid)
        checkoutStep.value = "payment_method";
    } else if (step === "summary") {
      if (validatePersonalData() && isDeliveryValid && isPaymentMethodValid)
        checkoutStep.value = "summary";
    } else if (step === "payment") {
      if (
        validatePersonalData() &&
        isDeliveryValid &&
        isPaymentMethodValid &&
        termsAccepted
      )
        checkoutStep.value = "payment";
    }
  };

  const handlePayment = () => {
    createOrder();
    if (checkoutData.value.paymentMethod === "yape") {
      setIsYapeModalOpen(true);
    } else {
      openPaymentModal();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section 1: Datos Personales */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => toggleSection("personal")}
          className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors ${
            checkoutStep.value === "personal"
              ? "bg-purple-50"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                checkoutStep.value === "personal"
                  ? "gradient-background text-white"
                  : isPersonalValid
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {isPersonalValid && checkoutStep.value !== "personal" ? (
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
                "1"
              )}
            </div>
            <h2 className="font-heading text-lg font-semibold text-gray-900 uppercase">
              Datos Personales
            </h2>
          </div>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${
              checkoutStep.value === "personal" ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {checkoutStep.value === "personal" && (
          <div className="border-t border-gray-100 p-6">
            {/* ... (Personal Data Form Inputs - same as before) ... */}
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
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none ${
                    errors.firstName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="Juan"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName}
                  </p>
                )}
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
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none ${
                    errors.lastName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="Pérez"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  DNI
                </label>
                <input
                  type="text"
                  name="dni"
                  value={checkoutData.value.dni}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none ${
                    errors.dni
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="12345678"
                  maxLength={8}
                />
                {errors.dni && (
                  <p className="mt-1 text-xs text-red-500">{errors.dni}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={checkoutData.value.phone}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none ${
                    errors.phone
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="999999999"
                  maxLength={9}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
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
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                  placeholder="juan@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (validatePersonalData()) {
                    nextStep();
                  }
                }}
                className="gradient-button px-8 py-3 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                Continuar a Envío
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Envío */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => toggleSection("delivery")}
          disabled={!isPersonalValid}
          className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            checkoutStep.value === "delivery"
              ? "bg-purple-50"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                checkoutStep.value === "delivery"
                  ? "gradient-background text-white"
                  : isDeliveryValid
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {isDeliveryValid && checkoutStep.value !== "delivery" ? (
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
                "2"
              )}
            </div>
            <h2 className="font-heading text-lg font-semibold text-gray-900 uppercase">
              Método de entrega
            </h2>
          </div>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${
              checkoutStep.value === "delivery" ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {checkoutStep.value === "delivery" && (
          <div className="border-t border-gray-100 p-6">
            {/* ... (Delivery Form Inputs - same as before) ... */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    (checkoutData.value = {
                      ...checkoutData.value,
                      deliveryMethod: "oficina",
                    })
                  }
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    checkoutData.value.deliveryMethod === "oficina"
                      ? "border-purple-600 bg-purple-50 text-purple-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="text-sm font-semibold">
                    Recojo en Oficina
                  </span>
                  <span className="text-xs text-gray-500">Gratis</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    (checkoutData.value = {
                      ...checkoutData.value,
                      deliveryMethod: "delivery",
                    })
                  }
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    checkoutData.value.deliveryMethod === "delivery"
                      ? "border-purple-600 bg-purple-50 text-purple-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                  <span className="text-sm font-semibold">Delivery</span>
                  <span className="text-xs text-gray-500">Según distrito</span>
                </button>
              </div>
            </div>

            {/* Oficina Address Display */}
            {checkoutData.value.deliveryMethod === "oficina" && (
              <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-purple-900">
                      Dirección de recojo
                    </p>
                    <p className="mt-1 text-sm text-purple-700">
                      Av Angamos Este 1533, Surquillo (10:00 am - 6:00 pm)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Fields */}
            {checkoutData.value.deliveryMethod === "delivery" && (
              <div className="mt-4 grid grid-cols-1 gap-4">
                {/* Google Maps Address Selection */}
                <AddressMap />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Distrito
                  </label>
                  <select
                    name="district"
                    value={checkoutData.value.district}
                    onChange={(e) =>
                      (checkoutData.value = {
                        ...checkoutData.value,
                        district: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  >
                    <option value="">Selecciona un distrito</option>
                    {DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Departamento/Interior
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={checkoutData.value.apartment}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                      placeholder="Opcional"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Referencia
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={checkoutData.value.reference}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                      placeholder="Ej: Casa azul"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={nextStep}
                disabled={!isDeliveryValid}
                className="gradient-button px-8 py-3 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                Continuar a Medio de Pago
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Medio de Pago */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => toggleSection("payment_method")}
          disabled={!isDeliveryValid}
          className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            checkoutStep.value === "payment_method"
              ? "bg-purple-50"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                checkoutStep.value === "payment_method"
                  ? "gradient-background text-white"
                  : isPaymentMethodValid
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {isPaymentMethodValid &&
              checkoutStep.value !== "payment_method" ? (
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
                "3"
              )}
            </div>
            <h2 className="font-heading text-lg font-semibold text-gray-900 uppercase">
              Medio de Pago
            </h2>
          </div>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${
              checkoutStep.value === "payment_method" ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {checkoutStep.value === "payment_method" && (
          <div className="border-t border-gray-100 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Yape Option */}
              <button
                type="button"
                onClick={() =>
                  (checkoutData.value = {
                    ...checkoutData.value,
                    paymentMethod: "yape",
                  })
                }
                className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
                  checkoutData.value.paymentMethod === "yape"
                    ? "border-purple-600 bg-purple-50 text-purple-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <img
                  src="https://seeklogo.com/images/Y/yape-logo-1D6F3F36A0-seeklogo.com.png"
                  alt="Yape"
                  className="h-16 w-auto object-contain"
                />
                <span className="text-sm font-semibold">Pago con Yape</span>
                <span className="text-center text-xs text-gray-500">
                  Transferencia instantánea
                </span>
              </button>

              {/* Card Option */}
              <button
                type="button"
                onClick={() =>
                  (checkoutData.value = {
                    ...checkoutData.value,
                    paymentMethod: "tarjeta",
                  })
                }
                className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
                  checkoutData.value.paymentMethod === "tarjeta"
                    ? "border-purple-600 bg-purple-50 text-purple-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://static.cdnlogo.com/logos/v/40/visa.svg"
                    alt="Visa"
                    className="h-10 w-auto object-contain"
                  />
                  <img
                    src="https://static.cdnlogo.com/logos/m/24/mastercard.svg"
                    alt="Mastercard"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <span className="text-sm font-semibold">
                  Tarjeta de Crédito/Débito
                </span>
                <span className="text-center text-xs text-gray-500">
                  Visa, Mastercard, etc.
                </span>
              </button>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={nextStep}
                disabled={!isPaymentMethodValid}
                className="gradient-button px-8 py-3 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                Continuar a Resumen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Resumen */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <button
          onClick={() => toggleSection("summary")}
          disabled={!isPaymentMethodValid}
          className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            checkoutStep.value === "summary"
              ? "bg-purple-50"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                checkoutStep.value === "summary"
                  ? "gradient-background text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              4
            </div>
            <h2 className="font-heading text-lg font-semibold text-gray-900 uppercase">
              Resumen
            </h2>
          </div>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform ${
              checkoutStep.value === "summary" ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {checkoutStep.value === "summary" && (
          <div className="border-t border-gray-100 p-6">
            <div className="space-y-6">
              {/* Personal Data Summary */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Datos Personales
                </h3>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Nombre:</span>{" "}
                    {checkoutData.value.firstName} {checkoutData.value.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {checkoutData.value.email}
                  </p>
                  <p>
                    <span className="font-medium">Teléfono:</span>{" "}
                    {checkoutData.value.phone}
                  </p>
                  <p>
                    <span className="font-medium">DNI:</span>{" "}
                    {checkoutData.value.dni}
                  </p>
                </div>
              </div>

              {/* Delivery Data Summary */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Datos de Envío
                </h3>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Método:</span>{" "}
                    {checkoutData.value.deliveryMethod === "oficina"
                      ? "Recojo en Oficina"
                      : "Delivery"}
                  </p>
                  {checkoutData.value.deliveryMethod === "delivery" && (
                    <>
                      <p>
                        <span className="font-medium">Dirección:</span>{" "}
                        {checkoutData.value.address}
                      </p>
                      <p>
                        <span className="font-medium">Distrito:</span>{" "}
                        {checkoutData.value.district}
                      </p>
                      {checkoutData.value.apartment && (
                        <p>
                          <span className="font-medium">Dpto/Int:</span>{" "}
                          {checkoutData.value.apartment}
                        </p>
                      )}
                      {checkoutData.value.reference && (
                        <p>
                          <span className="font-medium">Referencia:</span>{" "}
                          {checkoutData.value.reference}
                        </p>
                      )}
                    </>
                  )}
                  {checkoutData.value.deliveryMethod === "oficina" && (
                    <p>
                      <span className="font-medium">Lugar:</span> Av Angamos
                      Este 1533, Surquillo
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method Summary */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Medio de Pago
                </h3>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Método:</span>{" "}
                    {checkoutData.value.paymentMethod === "yape"
                      ? "Yape"
                      : "Tarjeta de Crédito/Débito"}
                  </p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3 pt-2">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    Acepto los{" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-purple-600 hover:underline"
                    >
                      Términos y Condiciones
                    </button>
                  </label>
                  <p className="text-gray-500">
                    Al aceptar, confirmas que has leído y estás de acuerdo con
                    nuestras políticas de compra y devolución.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handlePayment}
                  disabled={!termsAccepted}
                  className="gradient-button px-8 py-3 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  Ir a Pagar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
      <YapeModal
        isOpen={isYapeModalOpen}
        onClose={() => setIsYapeModalOpen(false)}
      />
    </div>
  );
};

export default CheckoutWizard;
