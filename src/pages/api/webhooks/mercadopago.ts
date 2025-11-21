import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    console.log("Mercado Pago Webhook received:", {
      type: body.type,
      action: body.action,
      data: body.data,
    });

    // Validate webhook signature (recommended for production)
    // const signature = request.headers.get("x-signature");
    // const requestId = request.headers.get("x-request-id");
    // TODO: Implement signature validation

    // Handle different event types
    switch (body.type) {
      case "payment":
        console.log("Payment event:", body.data.id);
        // TODO: Fetch payment details from Mercado Pago API
        // TODO: Update order status in database
        break;

      case "merchant_order":
        console.log("Merchant order event:", body.data.id);
        // TODO: Handle merchant order updates
        break;

      default:
        console.log("Unknown event type:", body.type);
    }

    // Return 200 to acknowledge receipt
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
