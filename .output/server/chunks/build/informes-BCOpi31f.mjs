import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { N as Navbar } from './Navbar-B8bjDViK.mjs';
import { S as SeoMeta } from './SeoMeta-BiOiuKZ0.mjs';
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
import './v3-Dku30dXH.mjs';
import 'vue-router';

const metricsTotalSteps = 5;
const _sfc_main = {
  __name: "informes",
  __ssrInlineRender: true,
  setup(__props) {
    const showInfoA = ref(false);
    ref(false);
    const selectedInforme = ref("A");
    const fechaInicio = ref("");
    const fechaFin = ref("");
    const isLoadingInformeB = ref(false);
    const informeBData = ref([]);
    const informeBError = ref(null);
    const isLoadingInformeA = ref(false);
    const comprasTotal = ref(0);
    const inventarioTotal = ref(0);
    const ventasTotal = ref(0);
    const costoVentasTotal = ref(0);
    const salidasTotal = ref(0);
    const retirosTotal = ref(0);
    const isMetricsLoading = ref(false);
    const metricsCompleted = ref(0);
    ref(false);
    ref("");
    const metricsProgressPercent = computed(() => {
      return Math.min(100, Math.round(metricsCompleted.value / metricsTotalSteps * 100));
    });
    const pieStyle = computed(() => {
      const visibleValues = [comprasTotal.value, inventarioTotal.value, ventasTotal.value, salidasTotal.value];
      const colors = ["#F97316", "#0369A1", "#10B981", "#EF4444"];
      const visibleTotal = visibleValues.reduce((s, v) => s + Math.max(0, v), 0);
      const gap = 0.6;
      let acc = 0;
      const parts = [];
      if (!visibleTotal || visibleTotal <= 0) {
        return "conic-gradient(#eef2f7 0% 100%)";
      }
      for (let i = 0; i < visibleValues.length; i++) {
        const v = Math.max(0, visibleValues[i]);
        const pct = v / visibleTotal * 100;
        const colorPct = Math.max(0, pct - gap);
        if (colorPct > 0) {
          const start = acc;
          const end = acc + colorPct;
          parts.push(`${colors[i]} ${start}% ${end}%`);
          acc = end;
        }
        acc += gap;
        parts.push(`transparent ${Math.max(0, acc - gap)}% ${acc}%`);
      }
      if (acc < 100) parts.push(`transparent ${acc}% 100%`);
      return `conic-gradient(${parts.join(", ")})`;
    });
    const percentages = computed(() => {
      const values = [comprasTotal.value, inventarioTotal.value, ventasTotal.value, salidasTotal.value, retirosTotal.value, costoVentasTotal.value];
      const total = values.reduce((s, v) => s + Math.max(0, v), 0) || 0;
      if (total === 0) return values.map(() => 0);
      return values.map((v) => Math.max(0, v) / total * 100);
    });
    const gananciaTotal = computed(() => {
      return (ventasTotal.value || 0) - (costoVentasTotal.value || 0) - (salidasTotal.value || 0) - (retirosTotal.value || 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))} data-v-d25b3a0e>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Informes - Pactum",
        description: "Panel de Informes en Pactum",
        canonical: "/informes"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      _push(`<div class="w-[95%] mx-auto px-4 py-6 mt-20 md:mt-6" data-v-d25b3a0e><div class="bg-white rounded-lg shadow-md p-4" data-v-d25b3a0e><h2 class="text-2xl font-bold mb-4" data-v-d25b3a0e>Informes</h2><div class="flex flex-col md:flex-row md:items-center md:gap-6 gap-4" data-v-d25b3a0e><div class="relative" data-v-d25b3a0e><button class="${ssrRenderClass(["px-6 py-3 rounded-lg transition relative", selectedInforme.value === "A" ? "bg-primary text-neutral hover:bg-primary/90" : "bg-white text-gray-700 border"])}" data-v-d25b3a0e> Resumen General de Inventario y Ventas </button><button class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shadow" aria-label="info informe A" data-v-d25b3a0e>!</button>`);
      if (showInfoA.value) {
        _push(`<div class="absolute top-10 right-0 bg-white text-sm text-gray-700 p-2 rounded shadow w-56 z-20" data-v-d25b3a0e> Muestra gr\xE1ficamente el resumen de costos de compra, valor del inventario y ventas en USD y resumiendolo todo en la ganancia hasta el momento. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="mt-6 bg-white rounded-lg shadow-md p-6 h-[80vh] flex flex-col" data-v-d25b3a0e><h3 class="text-xl font-semibold mb-2" data-v-d25b3a0e>Vista de Informe</h3><div class="flex-1 border-2 border-dashed border-gray-200 rounded p-4 text-gray-400" data-v-d25b3a0e>`);
      if (selectedInforme.value === "A") {
        _push(`<div class="flex flex-col md:flex-row items-center justify-center" data-v-d25b3a0e><div class="w-full md:w-1/2 flex flex-col items-center justify-center p-4" data-v-d25b3a0e>`);
        if (isLoadingInformeA.value) {
          _push(`<div class="text-center" data-v-d25b3a0e>Cargando informe...</div>`);
        } else {
          _push(`<div class="relative w-48 h-48 md:w-64 md:h-64 max-w-full" data-v-d25b3a0e><div class="absolute inset-0 rounded-full" style="${ssrRenderStyle({ background: pieStyle.value, borderRadius: "9999px", boxShadow: "0 6px 12px rgba(0,0,0,0.08)" })}" data-v-d25b3a0e></div></div>`);
        }
        _push(`</div>`);
        if (isMetricsLoading.value) {
          _push(`<div class="fixed inset-0 z-[20000] flex items-center justify-center bg-black/60" data-v-d25b3a0e><div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4" data-v-d25b3a0e><h3 class="text-lg font-semibold mb-2" data-v-d25b3a0e>Consultando datos del informe...</h3><div class="w-full bg-gray-100 rounded h-3 overflow-hidden mb-3" data-v-d25b3a0e><div style="${ssrRenderStyle({ width: metricsProgressPercent.value + "%" })}" class="h-3 bg-primary transition-all" data-v-d25b3a0e></div></div><div class="text-sm text-gray-600" data-v-d25b3a0e>Progreso: ${ssrInterpolate(metricsCompleted.value)} / ${ssrInterpolate(metricsTotalSteps)} \u2014 ${ssrInterpolate(metricsProgressPercent.value)}%</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="w-full md:w-1/2 p-4 overflow-hidden" data-v-d25b3a0e><div class="flex flex-col gap-4" data-v-d25b3a0e><div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0" data-v-d25b3a0e><div data-v-d25b3a0e><div class="flex items-center gap-3" data-v-d25b3a0e><span class="w-4 h-4 rounded-sm bg-orange-400 inline-block" data-v-d25b3a0e></span><span class="font-medium" data-v-d25b3a0e>Costos de compra</span></div><div class="text-xs text-gray-500" data-v-d25b3a0e>Sumatoria de (<em data-v-d25b3a0e>cantidad-de-entradas * costo-de-entrada-usd</em>) de todo el inventario.</div></div><div class="font-semibold text-right" data-v-d25b3a0e>${ssrInterpolate(comprasTotal.value.toFixed(2))} <span class="text-sm text-gray-500" data-v-d25b3a0e>(${ssrInterpolate(percentages.value[0].toFixed(1))}%)</span></div></div><div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0" data-v-d25b3a0e><div data-v-d25b3a0e><div class="flex items-center gap-3" data-v-d25b3a0e><span class="w-4 h-4 rounded-sm bg-blue-500 inline-block" data-v-d25b3a0e></span><span class="font-medium" data-v-d25b3a0e>Inventario (valor)</span></div><div class="text-xs text-gray-500" data-v-d25b3a0e>Sumatoria de (<em data-v-d25b3a0e>costo-usd * cantidad-en-existencia</em>) de todos los productos en el sistema.</div></div><div class="font-semibold text-right" data-v-d25b3a0e>${ssrInterpolate(inventarioTotal.value.toFixed(2))} <span class="text-sm text-gray-500" data-v-d25b3a0e>(${ssrInterpolate(percentages.value[1].toFixed(1))}%)</span></div></div><div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0" data-v-d25b3a0e><div data-v-d25b3a0e><div class="flex items-center gap-3" data-v-d25b3a0e><span class="w-4 h-4 rounded-sm bg-green-500 inline-block" data-v-d25b3a0e></span><span class="font-medium" data-v-d25b3a0e>Ventas (USD)</span></div><div class="text-xs text-gray-500" data-v-d25b3a0e>Sumatoria de (<em data-v-d25b3a0e>precio-usd-cobrado-de-venta * cantidad</em>) de todas las ventas.</div></div><div class="font-semibold text-right" data-v-d25b3a0e>${ssrInterpolate(ventasTotal.value.toFixed(2))} <span class="text-sm text-gray-500" data-v-d25b3a0e>(${ssrInterpolate(percentages.value[2].toFixed(1))}%)</span></div></div><div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0" data-v-d25b3a0e><div data-v-d25b3a0e><div class="flex items-center gap-3" data-v-d25b3a0e><span class="w-4 h-4 rounded-sm bg-red-500 inline-block" data-v-d25b3a0e></span><span class="font-medium" data-v-d25b3a0e>Salidas (P\xE9rdidas)</span></div><div class="text-xs text-gray-500" data-v-d25b3a0e>Sumatoria de (<em data-v-d25b3a0e>cantidad * producto.costo_usd</em>) de las salidas (p\xE9rdidas).</div></div><div class="font-semibold text-right" data-v-d25b3a0e>${ssrInterpolate(salidasTotal.value.toFixed(2))} <span class="text-sm text-gray-500" data-v-d25b3a0e>(${ssrInterpolate(percentages.value[3].toFixed(1))}%)</span></div></div><div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0" data-v-d25b3a0e><div data-v-d25b3a0e><div class="flex items-center gap-3" data-v-d25b3a0e><span class="w-4 h-4 rounded-sm bg-white border border-gray-300 inline-block" data-v-d25b3a0e></span><span class="font-medium" data-v-d25b3a0e>Retiros (USD)</span></div><div class="text-xs text-gray-500" data-v-d25b3a0e>Sumatoria convertida en USD: (<em data-v-d25b3a0e>cantidad_retirada_cup / cambio_moneda</em>) + <em data-v-d25b3a0e>cantidad_retirada_usd</em>.</div></div><div class="font-semibold text-right" data-v-d25b3a0e>${ssrInterpolate(retirosTotal.value.toFixed(2))}</div></div><div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0" data-v-d25b3a0e><div data-v-d25b3a0e><div class="flex items-center gap-3" data-v-d25b3a0e><span class="w-4 h-4 rounded-sm border border-gray-300 inline-block" data-v-d25b3a0e></span><span class="font-medium" data-v-d25b3a0e>Costo Ventas (USD)</span></div><div class="text-xs text-gray-500" data-v-d25b3a0e>Sumatoria de (<em data-v-d25b3a0e>costo-venta * cantidad</em>) de todas las ventas registradas.</div></div><div class="font-semibold text-right" data-v-d25b3a0e>${ssrInterpolate(costoVentasTotal.value.toFixed(2))}</div></div><div class="flex items-start justify-between flex-col sm:flex-row gap-2 sm:gap-0" data-v-d25b3a0e><div data-v-d25b3a0e><div class="flex items-center gap-3" data-v-d25b3a0e><span class="w-4 h-4 rounded-sm border border-gray-300 inline-block" data-v-d25b3a0e></span><span class="font-medium" data-v-d25b3a0e>Ganancia (Ventas - Costos - Retiros)</span></div><div class="text-xs text-gray-500" data-v-d25b3a0e>Ganancia neta: <em data-v-d25b3a0e>Ventas - Costo de ventas - P\xE9rdidas - Retiros</em></div></div><div class="font-semibold text-right" data-v-d25b3a0e>${ssrInterpolate(gananciaTotal.value.toFixed(2))}</div></div></div></div></div>`);
      } else {
        _push(`<div class="w-full flex flex-col items-center justify-start p-4 gap-4" data-v-d25b3a0e><h4 class="text-lg font-medium" data-v-d25b3a0e>Informe B \u2014 Rango de fechas</h4><div class="w-full max-w-xl flex flex-col sm:flex-row gap-3 items-stretch" data-v-d25b3a0e><label class="flex-1" data-v-d25b3a0e><div class="text-sm text-gray-600 mb-1" data-v-d25b3a0e>Fecha inicio</div><input type="date"${ssrRenderAttr("value", fechaInicio.value)} class="w-full px-3 py-2 border rounded" data-v-d25b3a0e></label><label class="flex-1" data-v-d25b3a0e><div class="text-sm text-gray-600 mb-1" data-v-d25b3a0e>Fecha fin</div><input type="date"${ssrRenderAttr("value", fechaFin.value)} class="w-full px-3 py-2 border rounded" data-v-d25b3a0e></label><div class="flex items-end" data-v-d25b3a0e><button class="px-4 py-2 bg-primary text-neutral rounded" data-v-d25b3a0e>Generar</button></div></div><div class="text-xs text-gray-500" data-v-d25b3a0e>Valores iniciales: mes anterior (inicio=1, fin=\xFAltimo d\xEDa).</div><div class="w-full mt-4" data-v-d25b3a0e>`);
        if (isLoadingInformeB.value) {
          _push(`<div class="text-center py-6" data-v-d25b3a0e>Generando informe...</div>`);
        } else if (informeBError.value) {
          _push(`<div class="text-center text-sm text-red-600" data-v-d25b3a0e>Error: ${ssrInterpolate(informeBError.value)}</div>`);
        } else if (informeBData.value.length === 0) {
          _push(`<div class="text-center text-sm text-gray-600" data-v-d25b3a0e>No hay ventas en el rango seleccionado.</div>`);
        } else {
          _push(`<div class="w-full overflow-auto" data-v-d25b3a0e><svg viewBox="0 0 100 50" class="w-full h-40" data-v-d25b3a0e><polyline${ssrRenderAttr("points", informeBData.value.map((p, i) => {
            const x = i / (informeBData.value.length - 1 || 1) * 100;
            const min = Math.min(...informeBData.value.map((a) => a.value));
            const max = Math.max(...informeBData.value.map((a) => a.value));
            const y = max === min ? 25 : 10 + (1 - (p.value - min) / (max - min)) * 30;
            return x + "," + y;
          }).join(" "))} fill="none" stroke="#2563eb" stroke-width="0.8" stroke-linejoin="round" stroke-linecap="round" data-v-d25b3a0e></polyline><g data-v-d25b3a0e><!--[-->`);
          ssrRenderList(informeBData.value, (p, i) => {
            _push(`<circle${ssrRenderAttr("cx", i / (informeBData.value.length - 1 || 1) * 100)}${ssrRenderAttr("cy", (function() {
              const min = Math.min(...informeBData.value.map((a) => a.value));
              const max = Math.max(...informeBData.value.map((a) => a.value));
              return max === min ? 25 : 10 + (1 - (p.value - min) / (max - min)) * 30;
            })())} r="1.2" fill="#2563eb" data-v-d25b3a0e></circle>`);
          });
          _push(`<!--]--></g></svg><div class="mt-2 text-xs text-gray-600 flex flex-wrap gap-2" data-v-d25b3a0e><!--[-->`);
          ssrRenderList(informeBData.value, (p) => {
            _push(`<div class="px-2 py-1 bg-gray-50 rounded border text-xs" data-v-d25b3a0e>${ssrInterpolate(p.day)}: ${ssrInterpolate(p.value.toFixed(2))}</div>`);
          });
          _push(`<!--]--></div></div>`);
        }
        _push(`</div></div>`);
      }
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/informes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const informes = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d25b3a0e"]]);

export { informes as default };
//# sourceMappingURL=informes-BCOpi31f.mjs.map
