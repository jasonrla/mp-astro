import type { APIRoute } from "astro";
import { MercadoPagoConfig, Payment } from "mercadopago";

export const prerender = false;

const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MERCADO_PAGO_ACCESS_TOKEN,
});
const payment = new Payment(client);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("Received payment data:", body);

    if (!body.token || !body.transaction_amount || !body.payment_method_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const paymentData = {
      token: body.token,
      transaction_amount: Number(body.transaction_amount),
      payment_method_id: body.payment_method_id,
      payer: {
        email: body.payer?.email || body.email,
        identification: body.payer?.identification,
      },
      description: body.description || "Payment",
      installments: Number(body.installments) || 1,
      three_d_secure_mode: "optional", // Enable 3DS authentication
      statement_descriptor: body.statement_descriptor,
      external_reference: body.external_reference || `${Date.now()}`,
      metadata: body.metadata || {},
    };

    console.log("Sending to Mercado Pago:", paymentData);

    const idempotencyKey = crypto.randomUUID();

    const requestOptions = {
      idempotencyKey: idempotencyKey,
    };

    const result = await payment.create({
      body: paymentData,
      requestOptions: requestOptions,
    });

    console.log("Mercado Pago response:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Payment processing error:", error);
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
