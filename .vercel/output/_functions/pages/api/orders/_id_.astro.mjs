import { s as supabase } from '../../../chunks/supabase_CBd_KlGC.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Order ID is required" }), {
      status: 400
    });
  }
  try {
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", id).single();
    if (orderError || !order) {
      console.error("Error fetching order:", orderError);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404
      });
    }
    const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", id);
    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return new Response(
        JSON.stringify({ error: "Error fetching order items" }),
        { status: 500 }
      );
    }
    const formattedOrder = {
      id: order.id,
      trackingCode: order.tracking_code,
      total: order.total,
      status: order.payment_status,
      // Or order.status depending on what we want to show
      items: items.map((item) => ({
        id: item.product_id,
        name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        image: item.product_image
      })),
      customer: {
        firstName: order.customer_name.split(" ")[0],
        lastName: order.customer_name.split(" ").slice(1).join(" "),
        email: order.customer_email,
        phone: order.customer_phone,
        address: order.shipping_address,
        city: "Lima",
        // Placeholder as city isn't explicitly stored in schema provided, or extract from address
        zipCode: order.shipping_place_id
      },
      deliveryDate: new Date(
        new Date(order.created_at || Date.now()).getTime() + 7 * 24 * 60 * 60 * 1e3
      ).toLocaleDateString("es-PE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };
    return new Response(JSON.stringify(formattedOrder), { status: 200 });
  } catch (error) {
    console.error("Error processing get order request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
