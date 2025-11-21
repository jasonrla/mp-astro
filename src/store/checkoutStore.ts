import { signal, computed, effect } from "@preact/signals-react";

export type CheckoutStep = "personal" | "delivery" | "payment";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

// localStorage helpers
const CHECKOUT_DATA_KEY = "mp-gravity-checkout-data";

const loadCheckoutDataFromStorage = (): CheckoutData => {
  if (typeof window === "undefined") {
    return {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
    };
  }

  try {
    const stored = localStorage.getItem(CHECKOUT_DATA_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading checkout data from localStorage:", error);
  }

  return {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  };
};

const saveCheckoutDataToStorage = (data: CheckoutData) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CHECKOUT_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving checkout data to localStorage:", error);
  }
};

// Mock Cart Data
export const cart = signal<Product[]>([
  {
    id: "e9f22c16-6adf-40ce-a11b-611914e75579",
    name: "Premium Wireless Headphones",
    price: 350.0,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
    quantity: 1,
  },
  {
    id: "e9f22c16-6adf-40ce-a11b-611914e75579", // Using same valid ID for demo
    name: "Ergonomic Mouse",
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80",
    quantity: 1,
  },
]);

export const checkoutStep = signal<CheckoutStep>("personal");

export const checkoutData = signal<CheckoutData>(loadCheckoutDataFromStorage());

if (typeof window !== "undefined") {
  effect(() => {
    saveCheckoutDataToStorage(checkoutData.value);
  });
}

export const subtotal = computed(() =>
  cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
);

export const discount = computed(() => subtotal.value * 0.1); // 10% discount
export const total = computed(() => subtotal.value - discount.value);

export const orderId = signal<string | null>(null);

export const isPaymentModalOpen = signal<boolean>(false);

export const paymentCompleted = signal<boolean>(false);
export const trackingCode = signal<string | null>(null);

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const createOrder = () => {
  const uuid = generateUUID();
  orderId.value = uuid;

  trackingCode.value = `TRK-${Date.now().toString().slice(-8)}`;

  if (typeof window !== "undefined") {
    try {
      const validOrders = JSON.parse(
        localStorage.getItem("valid_orders") || "[]",
      );
      validOrders.push(uuid);
      localStorage.setItem("valid_orders", JSON.stringify(validOrders));
    } catch (e) {
      console.error("Error saving valid order:", e);
    }
  }

  return uuid;
};

export const openPaymentModal = () => {
  isPaymentModalOpen.value = true;
};

export const closePaymentModal = () => {
  isPaymentModalOpen.value = false;
};

export const completePayment = () => {
  paymentCompleted.value = true;
  closePaymentModal();
};

export const clearCheckoutData = () => {
  if (typeof window === "undefined") return;

  checkoutData.value = {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  };

  try {
    localStorage.removeItem(CHECKOUT_DATA_KEY);
  } catch (error) {
    console.error("Error clearing checkout data from localStorage:", error);
  }
};

export const submitOrderToBackend = async (uuid: string) => {
  try {
    const orderData = {
      id: uuid,
      trackingCode: trackingCode.value,
      customer: checkoutData.value,
      items: cart.value,
      totals: {
        subtotal: subtotal.value,
        discount: discount.value,
        total: total.value,
      },
      paymentStatus: "approved", // Assuming this is called only on approval
      paymentMethod: "tarjeta_credito", // Default to valid enum value from DB constraint
    };

    const response = await fetch("/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit order to backend");
    }

    const result = await response.json();
    console.log("Order submitted to backend:", result);
    return result;
  } catch (error) {
    console.error("Error submitting order:", error);
    // We might want to handle this error gracefully, maybe retry or show a warning
    // For now, we log it. The user still sees the success screen locally.
  }
};

export const nextStep = () => {
  if (checkoutStep.value === "personal") checkoutStep.value = "delivery";
  else if (checkoutStep.value === "delivery") checkoutStep.value = "payment";
};

export const prevStep = () => {
  if (checkoutStep.value === "payment") checkoutStep.value = "delivery";
  else if (checkoutStep.value === "delivery") checkoutStep.value = "personal";
};
