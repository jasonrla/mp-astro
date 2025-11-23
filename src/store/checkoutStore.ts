import { signal, computed, effect } from "@preact/signals-react";
import { FREE_SHIPPING_THRESHOLD, DELIVERY_COSTS } from "../constants/checkout";

export type CheckoutStep =
  | "personal"
  | "delivery"
  | "payment_method"
  | "summary"
  | "payment";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  hasDiscount?: boolean;
}

export interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  deliveryMethod: "oficina" | "delivery";
  address: string;
  district: string;
  apartment: string;
  reference: string;
  coords?: { lat: number; lng: number } | null;
  place_id?: string | null;
  coords_url?: string | null;
  paymentMethod: "yape" | "tarjeta";
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minimum_order_amount: number;
  maximum_discount_amount: number;
  usage_limit: number;
  usage_limit_per_customer: number;
  used_count: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
}

// Mock Coupons DB
const discount_coupons: Coupon[] = [
  {
    id: "c1",
    code: "WELCOME20",
    name: "Welcome Discount",
    description: "20% off for new customers",
    type: "percentage",
    value: 20,
    minimum_order_amount: 100,
    maximum_discount_amount: 50,
    usage_limit: 1000,
    usage_limit_per_customer: 1,
    used_count: 150,
    is_active: true,
    starts_at: "2024-01-01T00:00:00Z",
    expires_at: "2025-12-31T23:59:59Z",
  },
  {
    id: "c2",
    code: "SUMMER10",
    name: "Summer Sale",
    description: "10% off on all items",
    type: "percentage",
    value: 10,
    minimum_order_amount: 0,
    maximum_discount_amount: 100,
    usage_limit: 500,
    usage_limit_per_customer: 2,
    used_count: 10,
    is_active: true,
    starts_at: "2024-06-01T00:00:00Z",
    expires_at: "2024-08-31T23:59:59Z", // Expired example
  },
  {
    id: "c3",
    code: "FLASH50",
    name: "Flash Sale",
    description: "50 soles off",
    type: "fixed",
    value: 50,
    minimum_order_amount: 200,
    maximum_discount_amount: 50,
    usage_limit: 50,
    usage_limit_per_customer: 1,
    used_count: 49,
    is_active: true,
    starts_at: "2024-01-01T00:00:00Z",
    expires_at: "2025-12-31T23:59:59Z",
  },
];

// localStorage helpers
const CHECKOUT_DATA_KEY = "mp-gravity-checkout-data";

const loadCheckoutDataFromStorage = (): CheckoutData => {
  if (typeof window === "undefined") {
    return {
      email: "",
      firstName: "",
      lastName: "",
      dni: "",
      phone: "",
      deliveryMethod: "oficina",
      address: "",
      district: "",
      apartment: "",
      reference: "",
      paymentMethod: "tarjeta",
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
    dni: "",
    phone: "",
    deliveryMethod: "oficina",
    address: "",
    district: "",
    apartment: "",
    reference: "",
    coords: null,
    place_id: null,
    coords_url: null,
    paymentMethod: "tarjeta",
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

// Mock Cart Data (6 items)
export const cart = signal<Product[]>([
  {
    id: "p1",
    name: "Premium Wireless Headphones",
    price: 350.0,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
    quantity: 1,
    hasDiscount: false,
  },
  {
    id: "p2",
    name: "Ergonomic Mouse",
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80",
    quantity: 1,
    hasDiscount: true, // Already discounted
  },
  {
    id: "p3",
    name: "Mechanical Keyboard",
    price: 450.0,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200&q=80",
    quantity: 1,
    hasDiscount: false,
  },
  {
    id: "p4",
    name: "USB-C Hub",
    price: 80.0,
    image:
      "https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=200&q=80",
    quantity: 2,
    hasDiscount: false,
  },
  {
    id: "p5",
    name: "Laptop Stand",
    price: 65.0,
    image:
      "https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=200&q=80", // Placeholder
    quantity: 1,
    hasDiscount: false,
  },
  {
    id: "p6",
    name: "Webcam 4K",
    price: 299.0,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80", // Placeholder
    quantity: 1,
    hasDiscount: true,
  },
]);

export const checkoutStep = signal<CheckoutStep>("personal");

export const checkoutData = signal<CheckoutData>(loadCheckoutDataFromStorage());

export const appliedCoupon = signal<Coupon | null>(null);
export const couponError = signal<string | null>(null);

if (typeof window !== "undefined") {
  effect(() => {
    saveCheckoutDataToStorage(checkoutData.value);
  });
}

export const subtotal = computed(() =>
  cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
);

// Calculate discount based on coupon
export const couponDiscount = computed(() => {
  if (!appliedCoupon.value) return 0;

  const coupon = appliedCoupon.value;
  let discountAmount = 0;

  if (coupon.type === "fixed") {
    // Fixed amount discount (applied once per order, or logic could vary)
    // Here we apply it to the total eligible amount
    const eligibleSubtotal = cart.value.reduce((acc, item) => {
      if (!item.hasDiscount) {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);

    if (eligibleSubtotal > 0) {
      discountAmount = Math.min(coupon.value, eligibleSubtotal);
    }
  } else {
    // Percentage discount
    cart.value.forEach((item) => {
      if (!item.hasDiscount) {
        const itemTotal = item.price * item.quantity;
        discountAmount += itemTotal * (coupon.value / 100);
      }
    });
  }

  // Cap at maximum discount amount if set
  if (coupon.maximum_discount_amount > 0) {
    discountAmount = Math.min(discountAmount, coupon.maximum_discount_amount);
  }

  return discountAmount;
});

export const discount = computed(() => couponDiscount.value);

export const cartItemCount = computed(() =>
  cart.value.reduce((acc, item) => acc + item.quantity, 0),
);

export const deliveryCost = computed(() => {
  if (checkoutData.value.deliveryMethod === "oficina") {
    return 0;
  }

  // Free shipping logic
  if (subtotal.value - discount.value >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  return DELIVERY_COSTS[checkoutData.value.district] || 0;
});

export const isFreeShipping = computed(() => {
  return (
    checkoutData.value.deliveryMethod === "delivery" &&
    subtotal.value - discount.value >= FREE_SHIPPING_THRESHOLD
  );
});

export const total = computed(
  () => subtotal.value - discount.value + deliveryCost.value,
);

export const applyCoupon = (code: string) => {
  couponError.value = null;
  const coupon = discount_coupons.find((c) => c.code === code);

  if (!coupon) {
    couponError.value = "Cupón no válido";
    return false;
  }

  if (!coupon.is_active) {
    couponError.value = "Este cupón ya no está activo";
    return false;
  }

  const now = new Date();
  if (now < new Date(coupon.starts_at) || now > new Date(coupon.expires_at)) {
    couponError.value = "Este cupón ha expirado o aún no es válido";
    return false;
  }

  if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
    couponError.value = "Este cupón ha alcanzado su límite de uso";
    return false;
  }

  if (subtotal.value < coupon.minimum_order_amount) {
    couponError.value = `El monto mínimo para este cupón es S/ ${coupon.minimum_order_amount}`;
    return false;
  }

  // Check if there are eligible items (items without existing discount)
  const hasEligibleItems = cart.value.some((item) => !item.hasDiscount);
  if (!hasEligibleItems) {
    couponError.value =
      "Este cupón no aplica a productos con descuento existente";
    return false;
  }

  // Simulate usage limit per customer (mock logic using localStorage)
  if (typeof window !== "undefined") {
    const usedCoupons = JSON.parse(
      localStorage.getItem("used_coupons") || "{}",
    );
    const count = usedCoupons[coupon.code] || 0;
    if (
      coupon.usage_limit_per_customer > 0 &&
      count >= coupon.usage_limit_per_customer
    ) {
      couponError.value =
        "Ya has usado este cupón el máximo de veces permitido";
      return false;
    }
  }

  appliedCoupon.value = coupon;
  return true;
};

export const removeCoupon = () => {
  appliedCoupon.value = null;
  couponError.value = null;
};

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
    dni: "",
    phone: "",
    deliveryMethod: "oficina",
    address: "",
    district: "",
    apartment: "",
    reference: "",
    paymentMethod: "tarjeta",
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

// Cart Actions
export const updateQuantity = (id: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }

  cart.value = cart.value.map((item) =>
    item.id === id ? { ...item, quantity } : item,
  );
};

export const removeFromCart = (id: string) => {
  cart.value = cart.value.filter((item) => item.id !== id);
};

export const nextStep = () => {
  if (checkoutStep.value === "personal") checkoutStep.value = "delivery";
  else if (checkoutStep.value === "delivery")
    checkoutStep.value = "payment_method";
  else if (checkoutStep.value === "payment_method")
    checkoutStep.value = "summary";
  else if (checkoutStep.value === "summary") checkoutStep.value = "payment";
};

export const prevStep = () => {
  if (checkoutStep.value === "payment") checkoutStep.value = "summary";
  else if (checkoutStep.value === "summary")
    checkoutStep.value = "payment_method";
  else if (checkoutStep.value === "payment_method")
    checkoutStep.value = "delivery";
  else if (checkoutStep.value === "delivery") checkoutStep.value = "personal";
};
