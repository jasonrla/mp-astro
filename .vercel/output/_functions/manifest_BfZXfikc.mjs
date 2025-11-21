import 'piccolore';
import { o as decodeKey } from './chunks/astro/server_CJOMfcep.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BQQnTO3D.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/jasonrla/Documents/Projects/mp-gravity/","cacheDir":"file:///Users/jasonrla/Documents/Projects/mp-gravity/node_modules/.astro/","outDir":"file:///Users/jasonrla/Documents/Projects/mp-gravity/dist/","srcDir":"file:///Users/jasonrla/Documents/Projects/mp-gravity/src/","publicDir":"file:///Users/jasonrla/Documents/Projects/mp-gravity/public/","buildClientDir":"file:///Users/jasonrla/Documents/Projects/mp-gravity/dist/client/","buildServerDir":"file:///Users/jasonrla/Documents/Projects/mp-gravity/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/debug-product","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/debug-product\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"debug-product","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/debug-product.ts","pathname":"/api/debug-product","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/orders/create","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/orders\\/create\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}],[{"content":"create","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/orders/create.ts","pathname":"/api/orders/create","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/orders/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/orders\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"orders","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/orders/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/payment-status/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/payment-status\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"payment-status","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/payment-status/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/process-payment","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/process-payment\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"process-payment","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/process-payment.ts","pathname":"/api/process-payment","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/webhooks/mercadopago","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/webhooks\\/mercadopago\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"webhooks","dynamic":false,"spread":false}],[{"content":"mercadopago","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/webhooks/mercadopago.ts","pathname":"/api/webhooks/mercadopago","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/checkout.cCt665Tn.css"}],"routeData":{"route":"/checkout","isIndex":false,"type":"page","pattern":"^\\/checkout\\/?$","segments":[[{"content":"checkout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/checkout.astro","pathname":"/checkout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/checkout.cCt665Tn.css"}],"routeData":{"route":"/order/[id]/confirmation-success","isIndex":false,"type":"page","pattern":"^\\/order\\/([^/]+?)\\/confirmation-success\\/?$","segments":[[{"content":"order","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"confirmation-success","dynamic":false,"spread":false}]],"params":["id"],"component":"src/pages/order/[id]/confirmation-success.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/checkout.cCt665Tn.css"}],"routeData":{"route":"/success","isIndex":false,"type":"page","pattern":"^\\/success\\/?$","segments":[[{"content":"success","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/success.astro","pathname":"/success","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/checkout.astro",{"propagation":"none","containsHead":true}],["/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/order/[id]/confirmation-success.astro",{"propagation":"none","containsHead":true}],["/Users/jasonrla/Documents/Projects/mp-gravity/src/pages/success.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/debug-product@_@ts":"pages/api/debug-product.astro.mjs","\u0000@astro-page:src/pages/api/orders/create@_@ts":"pages/api/orders/create.astro.mjs","\u0000@astro-page:src/pages/api/orders/[id]@_@ts":"pages/api/orders/_id_.astro.mjs","\u0000@astro-page:src/pages/api/payment-status/[id]@_@ts":"pages/api/payment-status/_id_.astro.mjs","\u0000@astro-page:src/pages/api/process-payment@_@ts":"pages/api/process-payment.astro.mjs","\u0000@astro-page:src/pages/api/webhooks/mercadopago@_@ts":"pages/api/webhooks/mercadopago.astro.mjs","\u0000@astro-page:src/pages/checkout@_@astro":"pages/checkout.astro.mjs","\u0000@astro-page:src/pages/order/[id]/confirmation-success@_@astro":"pages/order/_id_/confirmation-success.astro.mjs","\u0000@astro-page:src/pages/success@_@astro":"pages/success.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BfZXfikc.mjs","/Users/jasonrla/Documents/Projects/mp-gravity/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_D7svDYkH.mjs","/Users/jasonrla/Documents/Projects/mp-gravity/src/components/CheckoutWizard":"_astro/CheckoutWizard.D32u_3z4.js","/Users/jasonrla/Documents/Projects/mp-gravity/src/components/OrderSummary":"_astro/OrderSummary.BgvevE6s.js","/Users/jasonrla/Documents/Projects/mp-gravity/src/components/PaymentModal":"_astro/PaymentModal.DnT57u3e.js","/Users/jasonrla/Documents/Projects/mp-gravity/src/components/OrderConfirmation":"_astro/OrderConfirmation.uNsDOeWO.js","@astrojs/react/client.js":"_astro/client.cczbvjaZ.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/checkout.cCt665Tn.css","/favicon.svg","/_astro/CheckoutWizard.D32u_3z4.js","/_astro/OrderConfirmation.uNsDOeWO.js","/_astro/OrderSummary.BgvevE6s.js","/_astro/PaymentModal.DnT57u3e.js","/_astro/checkoutStore.BjY-Dy3Q.js","/_astro/client.cczbvjaZ.js","/_astro/index.Be8AcK8B.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"s008yUar2b8DnlBaydrCSVTfNeDTxD3JH3vjWZVMOjc="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
