import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './logo-DkoFc4aV.mjs';
import { N as Navbar } from './Navbar-BXeboE4m.mjs';
import { _ as _sfc_main$1 } from './MessageBanner-BfG2bL-b.mjs';
import { S as SeoMeta } from './SeoMeta-qEdMXUp-.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './v3-CVirIiRo.mjs';
import 'vue-router';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const verificationBanner = ref(null);
    const contratosProximosCount = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))} data-v-790933e2>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Inicio - Contract Manager",
        description: "La plataforma integral para la gesti\xF3n eficiente de contratos, entidades y trabajadores.",
        canonical: "/"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (verificationBanner.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none" data-v-790933e2>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          title: verificationBanner.value.title,
          description: verificationBanner.value.description,
          type: verificationBanner.value.type,
          persistent: verificationBanner.value.persistent,
          onClose: ($event) => verificationBanner.value = null,
          class: "pointer-events-auto"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-8 md:mt-0 flex-1 flex flex-col" data-v-790933e2><header class="flex flex-col items-center justify-center py-12" data-v-790933e2><img${ssrRenderAttr("src", _imports_0)} alt="Logo" class="h-40 w-40 shadow-md mb-4" data-v-790933e2><h1 class="text-4xl md:text-5xl font-extrabold text-primary/80 mb-2 text-center drop-shadow" data-v-790933e2>Pactum Suite</h1><p class="text-lg md:text-xl text-dark/70 text-center max-w-2xl" data-v-790933e2>La plataforma integral para la gesti\xF3n eficiente de contratos, entidades, facturas y productos de tu organizaci\xF3n orientado al comercio.</p></header><section class="flex-1 flex flex-col items-center justify-center px-4" data-v-790933e2><div class="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-7xl w-full mb-12" data-v-790933e2><div class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group" data-v-790933e2><svg class="h-12 w-12 text-primary mb-4 group-hover:brightness-90 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-790933e2><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" data-v-790933e2></path></svg><h3 class="text-xl font-semibold text-primary mb-2" data-v-790933e2>Contratos</h3><p class="text-dark text-center" data-v-790933e2>Gestiona todos los contratos de tu organizaci\xF3n.</p></div><div class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group relative" data-v-790933e2>`);
      if (contratosProximosCount.value > 0) {
        _push(`<div class="absolute -top-2 -right-2 bg-danger text-neutral text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg" data-v-790933e2>${ssrInterpolate(contratosProximosCount.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<svg class="h-12 w-12 text-accent mb-4 group-hover:text-primary transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-790933e2><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-v-790933e2></path></svg><h3 class="text-xl font-semibold text-primary mb-2" data-v-790933e2>Entidades</h3><p class="text-dark text-center" data-v-790933e2>Administra proveedores, clientes y otras entidades.</p></div><div class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group" data-v-790933e2><svg class="h-12 w-12 text-accent mb-4 group-hover:text-primary transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-790933e2><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" data-v-790933e2></path></svg><h3 class="text-xl font-semibold text-primary mb-2" data-v-790933e2>Facturas</h3><p class="text-dark text-center" data-v-790933e2>Consulta y administra las facturas asociadas a contratos.</p></div><div class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group" data-v-790933e2><svg class="h-12 w-12 text-accent mb-4 group-hover:text-primary transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-790933e2><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-790933e2></path></svg><h3 class="text-xl font-semibold text-primary mb-2" data-v-790933e2>Productos</h3><p class="text-dark text-center" data-v-790933e2>Gestiona los productos que tienes para la venta y la existencia de estos.</p></div><div class="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer group" data-v-790933e2><svg class="h-12 w-12 text-accent mb-4 group-hover:text-primary transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-790933e2><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" data-v-790933e2></path></svg><h3 class="text-xl font-semibold text-primary mb-2" data-v-790933e2>Trabajadores</h3><p class="text-dark text-center" data-v-790933e2>Registra y gestiona trabajadores autorizados y sus contratos.</p></div></div><button class="mt-4 px-8 py-3 bg-primary text-neutral text-lg font-semibold rounded-full shadow hover:bg-primary/90 transition" data-v-790933e2>Iniciar sesi\xF3n</button></section><footer class="w-full py-6 text-center text-dark text-sm bg-transparent mt-auto" data-v-790933e2> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Pactum Suite. Desarrollado por David Quintana Vald\xE9s, Soporte: +53 56242671 </footer></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-790933e2"]]);

export { index as default };
//# sourceMappingURL=index-BPcMiuM0.mjs.map
