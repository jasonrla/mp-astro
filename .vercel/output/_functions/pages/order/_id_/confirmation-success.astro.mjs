import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_CJOMfcep.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../../chunks/Layout_Da7TWlYG.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$ConfirmationSuccess = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ConfirmationSuccess;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Confirmaci\xF3n - Orden ${id}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50 py-8"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <!-- Header --> <div class="mb-8 text-center"> <h1 class="text-2xl font-bold text-gray-900">¡Pago exitoso!</h1> <p class="mt-1 text-sm text-gray-600">
Orden #${id?.slice(0, 8)} </p> </div> <!-- Confirmation Content --> <div class="mx-auto max-w-3xl"> ${renderComponent($$result2, "OrderConfirmation", null, { "client:only": "react", "orderId": id, "client:component-hydration": "only", "client:component-path": "/Users/jasonrla/Documents/Projects/mp-gravity/src/components/OrderConfirmation", "client:component-export": "default" })} </div> </div> </main> ` })}`;
}, "/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/order/[id]/confirmation-success.astro", void 0);

const $$file = "/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/order/[id]/confirmation-success.astro";
const $$url = "/order/[id]/confirmation-success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ConfirmationSuccess,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
