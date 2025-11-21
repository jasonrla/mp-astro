export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("Mercado Pago Webhook received:", {
      type: body.type,
      action: body.action,
      data: body.data
    });
    switch (body.type) {
      case "payment":
        console.log("Payment event:", body.data.id);
        break;
      case "merchant_order":
        console.log("Merchant order event:", body.data.id);
        break;
      default:
        console.log("Unknown event type:", body.type);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
