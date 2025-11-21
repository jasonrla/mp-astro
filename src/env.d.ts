/// <reference types="astro/client" />

// Mercado Pago Brick Controllers
interface Window {
  paymentBrickController?: {
    unmount: () => void;
  };
  statusScreenBrickController?: {
    unmount: () => void;
  };
}
