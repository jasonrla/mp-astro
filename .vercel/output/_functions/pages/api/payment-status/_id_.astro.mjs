import { MercadoPagoConfig, Payment } from 'mercadopago';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const client = new MercadoPagoConfig({
  accessToken: "TEST-3611335909682354-082716-df269a8fc5f39116c7c06204a4df1ae5-2650411167"
});
const payment = new Payment(client);
const GET = async ({ params }) => {
  try {
    const paymentId = params.id;
    if (!paymentId) {
      return new Response(JSON.stringify({ error: "Payment ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Checking payment status for ID:", paymentId);
    const result = await payment.get({ id: paymentId });
    console.log("Payment status response:", result);
    return new Response(
      JSON.stringify({
        id: result.id,
        status: result.status,
        status_detail: result.status_detail
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error checking payment status:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message || "Unknown error",
        cause: error.cause || []
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
