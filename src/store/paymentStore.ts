import { signal } from "@preact/signals-react";

export type PaymentStep = "payment" | "status";

export const currentStep = signal<PaymentStep>("payment");
export const paymentId = signal<string | null>(null);
export const paymentStatus = signal<string | null>(null);
export const threeDSInfo = signal<any>(null); // For 3DS challenge info

export const resetPaymentState = () => {
  currentStep.value = "payment";
  paymentId.value = null;
  paymentStatus.value = null;
  threeDSInfo.value = null;
};
