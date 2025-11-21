import { s as supabase } from '../../chunks/supabase_CBd_KlGC.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async () => {
  const { data, error } = await supabase.from("products").select("id").limit(1);
  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
  return new Response(JSON.stringify({ data }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
