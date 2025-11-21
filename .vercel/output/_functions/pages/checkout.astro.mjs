import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CJOMfcep.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_Da7TWlYG.mjs';
export { renderers } from '../renderers.mjs';

const $$Checkout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Checkout - Mercado Pago" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gray-50 py-8"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <!-- Header --> <div class="mb-8 text-center"> <h1 class="text-3xl font-bold text-gray-900 md:text-4xl">Checkout</h1> <p class="mt-2 text-sm text-gray-600">
Completa tu compra de forma segura
</p> </div> <!-- 2-Column Layout --> <div class="grid grid-cols-1 gap-6 lg:grid-cols-3"> <!-- Left Column: Checkout Wizard (2/3 width on large screens) --> <div class="lg:col-span-2"> ${renderComponent($$result2, "CheckoutWizard", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/jasonrla/Documents/Projects/mp-gravity/src/components/CheckoutWizard", "client:component-export": "default" })} </div> <!-- Right Column: Order Summary (1/3 width on large screens) --> <div class="lg:col-span-1"> <div class="lg:sticky lg:top-8"> ${renderComponent($$result2, "OrderSummary", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/jasonrla/Documents/Projects/mp-gravity/src/components/OrderSummary", "client:component-export": "default" })} </div> </div> </div> </div> <!-- Payment Modal --> ${renderComponent($$result2, "PaymentModal", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/jasonrla/Documents/Projects/mp-gravity/src/components/PaymentModal", "client:component-export": "default" })} </main> ` })}`;
}, "/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/checkout.astro", void 0);

const $$file = "/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/checkout.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Checkout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
