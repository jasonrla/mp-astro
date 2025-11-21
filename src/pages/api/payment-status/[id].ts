import type { APIRoute } from "astro";
import { MercadoPagoConfig, Payment } from "mercadopago";

export const prerender = false;

const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MERCADO_PAGO_ACCESS_TOKEN,
});
const payment = new Payment(client);

export const GET: APIRoute = async ({ params }) => {
  try {
    const paymentId = params.id;

    if (!paymentId) {
      return new Response(JSON.stringify({ error: "Payment ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Checking payment status for ID:", paymentId);

    const result = await payment.get({ id: paymentId });
    console.log("Payment status response:", result);

    return new Response(
      JSON.stringify({
        id: result.id,
        status: result.status,
        status_detail: result.status_detail,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Error checking payment status:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message || "Unknown error",
        cause: error.cause || [],
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
