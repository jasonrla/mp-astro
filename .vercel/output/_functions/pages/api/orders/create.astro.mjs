import { s as supabase } from '../../../chunks/supabase_CBd_KlGC.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      id,
      // UUID created on frontend
      trackingCode,
      customer,
      items,
      totals,
      paymentStatus,
      paymentMethod
    } = body;
    console.log("Creating order in Supabase:", id);
    console.log("Request body:", JSON.stringify(body, null, 2));
    const { error: orderError } = await supabase.from("orders").insert({
      id,
      tracking_code: trackingCode,
      customer_name: `${customer.firstName} ${customer.lastName}`,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: customer.address,
      // Assuming address is the full string for now
      shipping_place_id: null,
      // customer.zipCode is not a UUID, so sending null
      // shipping_coords: null, // Not available in current checkout data
      // shipping_coords_url: null,
      subtotal: totals.subtotal,
      discounts: totals.discount,
      total: totals.total,
      status: "pending",
      // Order fulfillment status
      payment_status: paymentStatus || "approved",
      payment_method: paymentMethod || "tarjeta_credito",
      email_sent: false,
      notes: ""
    });
    if (orderError) {
      console.error("Error inserting order:", orderError);
      return new Response(JSON.stringify({ error: orderError.message }), {
        status: 500
      });
    }
    const orderItems = items.map((item) => ({
      order_id: id,
      product_id: item.id,
      // Assuming item.id is UUID or string
      // variant_id: null,
      product_name: item.name,
      product_image: item.image,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error("Error inserting order items:", itemsError);
      return new Response(JSON.stringify({ error: itemsError.message }), {
        status: 500
      });
    }
    return new Response(
      JSON.stringify({ success: true, message: "Order created successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing create order request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
