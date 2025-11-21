import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CJOMfcep.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_Da7TWlYG.mjs';
export { renderers } from '../renderers.mjs';

const $$Success = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Payment Successful" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4"> <div class="rounded-lg bg-green-100 p-8 text-center shadow-lg"> <div class="mb-4 flex justify-center"> <svg class="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> </div> <h1 class="mb-2 text-3xl font-bold text-green-800">
Payment Successful!
</h1> <p class="mb-6 text-green-700">
Thank you for your purchase. Your order is being processed.
</p> <a href="/" class="rounded bg-green-600 px-6 py-2 font-bold text-white hover:bg-green-700">
Return to Home
</a> </div> </main> ` })}`;
}, "/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/success.astro", void 0);

const $$file = "/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/success.astro";
const $$url = "/success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Success,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
