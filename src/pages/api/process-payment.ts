import type { APIRoute } from "astro";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MERCADO_PAGO_ACCESS_TOKEN,
});
const payment = new Payment(client);

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.text();

    if (!rawBody) {
      throw new Error("Empty request body");
    }

    const body = JSON.parse(rawBody);
    const {
      transaction_amount,
      token,
      description,
      installments,
      payment_method_id,
      issuer_id,
      payer,
      external_reference,
    } = body;

    // Validate required fields
    if (!transaction_amount || !token || !payment_method_id || !payer) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Generate Idempotency Key (UUID v4)
    // In a real scenario, this might come from the client or be generated here to prevent double processing
    // if the client retries the same request.
    const idempotencyKey = crypto.randomUUID();

    const paymentData = {
      transaction_amount,
      token,
      description: description || "Payment description",
      installments,
      payment_method_id,
      issuer_id,
      payer: {
        email: payer.email,
        identification: payer.identification,
      },
      three_d_secure_mode: "optional", // Requirement 4
      statement_descriptor: "CRAZZULA",
      external_reference: external_reference || `ORDER-${Date.now()}`, // Unique order reference
    };

    const requestOptions = {
      idempotencyKey, // Requirement 3
    };

    const result = await payment.create({ body: paymentData, requestOptions });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Payment error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error",
        details: error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
