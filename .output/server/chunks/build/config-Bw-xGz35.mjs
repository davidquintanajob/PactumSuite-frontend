import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass } from 'vue/server-renderer';
import { N as Navbar } from './Navbar-B8bjDViK.mjs';
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
import './server.mjs';
import 'vue-router';

const _sfc_main = {
  __name: "config",
  __ssrInlineRender: true,
  setup(__props) {
    const cambio = ref("");
    const saving = ref(false);
    const currentUsdRate = ref(null);
    const currentEurRate = ref(null);
    const loadingRate = ref(false);
    computed(() => {
      if (currentUsdRate.value) return (1 / currentUsdRate.value).toFixed(6);
      return null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4 max-w-md mx-auto" }, _attrs))}>`);
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      _push(`<h1 class="text-xl font-semibold mb-4">Configuraci\xF3n</h1><div class="mb-6 p-4 bg-gray-50 rounded-lg border"><h2 class="font-medium mb-3 text-gray-700">Tasa actual del mercado</h2><div class="flex items-center mb-2"><div class="w-8 h-6 bg-gray-200 rounded flex items-center justify-center mr-3"><span class="text-sm">EU</span></div><div class="flex-1"><div class="flex justify-between items-center"><span class="text-gray-600">1 Euro (EUR)</span><span class="font-semibold">`);
      if (currentEurRate.value) {
        _push(`<span>${ssrInterpolate(currentEurRate.value.toFixed(2))}</span>`);
      } else {
        _push(`<span class="text-gray-400">--.--</span>`);
      }
      _push(`<span class="text-gray-500 text-sm ml-1">CUP</span></span></div></div></div><div class="flex items-center mt-3 pt-3 border-t"><div class="w-8 h-6 bg-gray-200 rounded flex items-center justify-center mr-3"><span class="text-sm">US</span></div><div class="flex-1"><div class="flex justify-between items-center"><span class="text-gray-600">1 D\xF3lar estadounidense (USD)</span><span class="font-semibold">`);
      if (currentUsdRate.value) {
        _push(`<span>${ssrInterpolate(currentUsdRate.value.toFixed(2))}</span>`);
      } else {
        _push(`<span class="text-gray-400">--.--</span>`);
      }
      _push(`<span class="text-gray-500 text-sm ml-1">CUP</span></span></div><div class="text-xs text-gray-500 mt-1">`);
      if (loadingRate.value) {
        _push(`<span class="text-blue-500">Actualizando...</span>`);
      } else if (currentUsdRate.value) {
        _push(`<span>Valor obtenido del mercado informal</span>`);
      } else {
        _push(`<span class="text-amber-600">No disponible</span>`);
      }
      _push(`</div></div></div><button${ssrIncludeBooleanAttr(loadingRate.value) ? " disabled" : ""} class="mt-4 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400">${ssrInterpolate(loadingRate.value ? "Actualizando..." : "Actualizar tasa")}</button></div><label class="block mb-2 font-medium">Cambio Moneda del Software (USD \u2194 CUP)</label><p class="text-sm text-gray-500 mb-3"> Este valor se usar\xE1 en la aplicaci\xF3n para calcular automaticamente precios y costos por todos los usuarios del sistema. </p><input type="number"${ssrRenderAttr("value", cambio.value)} placeholder="Ej: 485.00" step="0.01" min="0" class="border border-gray-300 p-3 w-full mb-4 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"><div class="flex items-center justify-between"><div class="text-sm text-gray-500">`);
      if (currentUsdRate.value && cambio.value) {
        _push(`<span> Diferencia: <span class="${ssrRenderClass(Math.abs(Number(cambio.value) - currentUsdRate.value) > 5 ? "text-amber-600" : "text-green-600")}">${ssrInterpolate((Number(cambio.value) - currentUsdRate.value).toFixed(2))} CUP </span></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button${ssrIncludeBooleanAttr(saving.value || !cambio.value) ? " disabled" : ""} class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">${ssrInterpolate(saving.value ? "Guardando..." : "Guardar cambios")}</button></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/config.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=config-Bw-xGz35.mjs.map
