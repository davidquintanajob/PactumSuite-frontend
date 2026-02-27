import { ref, computed, mergeProps, h, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderTeleport, ssrRenderList } from 'vue/server-renderer';
import { S as SeoMeta } from './SeoMeta-BiOiuKZ0.mjs';
import { N as Navbar } from './Navbar-B8bjDViK.mjs';
import { D as DataTable } from './DataTable-CB1qJ3I1.mjs';
import { _ as _sfc_main$4 } from './MessageBanner-UgGYw58j.mjs';
import { _ as _sfc_main$5 } from './ConfirmBanner-D2jJGKTl.mjs';
import { _ as _export_sfc, b as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$6 } from './SelectSearchAPI-C4OFsj20.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import './v3-Dku30dXH.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$3 = {
  __name: "VentaModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, required: true },
    listaVenta: { type: Object, default: () => ({}) }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const ventasPage = ref(1);
    function formatTime12(timeStr) {
      if (!timeStr) return "";
      const t = String(timeStr).substring(0, 8);
      const parts = t.split(":");
      if (parts.length < 2) return timeStr;
      let hh = parseInt(parts[0], 10);
      const mm = parts[1];
      const ampm = hh >= 12 ? "PM" : "AM";
      hh = hh % 12;
      if (hh === 0) hh = 12;
      return `${hh}:${mm} ${ampm}`;
    }
    const ventasColumns = [
      { key: "fecha", label: "Fecha" },
      { key: "hora", label: "Hora" },
      { key: "productoNombre", label: "Producto" },
      { key: "cantidad", label: "Cantidad" },
      { key: "precio_cobrado", label: "Precio Cobrado" },
      { key: "total", label: "Total" },
      { key: "forma_pago", label: "Forma Pago" },
      { key: "usuario", label: "Usuario" }
    ];
    const ventasData = computed(() => {
      var _a;
      const v = Array.isArray((_a = props.listaVenta) == null ? void 0 : _a.ventas) ? props.listaVenta.ventas : [];
      return v.map((item) => {
        const fecha = item.fecha_hora ? item.fecha_hora.substring(0, 10) : item.createdAt ? item.createdAt.substring(0, 10) : "";
        const horaRaw = item.fecha_hora ? item.fecha_hora.substring(11, 19) : item.createdAt ? item.createdAt.substring(11, 19) : "";
        const hora = formatTime12(horaRaw);
        return {
          fecha,
          hora,
          productoNombre: item.producto ? item.producto.nombre : item.servicio ? item.servicio.nombre : "",
          cantidad: item.cantidad,
          precio_cobrado: item.precio_cobrado,
          total: (Number(item.cantidad || 0) * (parseFloat(item.precio_cobrado) || 0)).toFixed(2),
          usuario: item.usuario ? item.usuario.nombre_usuario : "",
          forma_pago: item.forma_pago || ""
        };
      });
    });
    const ventasTotal = computed(() => ventasData.value.length);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      if (__props.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" }, _attrs))} data-v-5a98fab4><div class="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto" data-v-5a98fab4><div class="flex justify-between items-center mb-6" data-v-5a98fab4><h2 class="text-2xl font-bold text-gray-800" data-v-5a98fab4>Detalles de Lista de Ventas</h2><button class="text-gray-500 hover:text-gray-700" data-v-5a98fab4><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-5a98fab4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-5a98fab4></path></svg></button></div><div class="mb-4" data-v-5a98fab4><div class="text-sm text-gray-600" data-v-5a98fab4>Nota: <span class="font-medium" data-v-5a98fab4>${ssrInterpolate(((_a = __props.listaVenta) == null ? void 0 : _a.nota) || "-")}</span></div><div class="text-sm text-gray-600" data-v-5a98fab4>Creado: <span class="font-medium" data-v-5a98fab4>${ssrInterpolate(((_b = __props.listaVenta) == null ? void 0 : _b.createdAt) ? __props.listaVenta.createdAt.substring(0, 19).replace("T", " ") : "-")}</span></div></div><div data-v-5a98fab4>`);
        _push(ssrRenderComponent(DataTable, {
          columns: ventasColumns,
          items: ventasData.value,
          "is-loading": false,
          "items-per-page": 5,
          "total-items": ventasTotal.value,
          "current-page": ventasPage.value
        }, null, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VentaModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const VentaModal = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-5a98fab4"]]);
const _sfc_main$2 = {
  __name: "VentaModalSell",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, required: true },
    mode: { type: String, default: "create" },
    // 'create' | 'edit' | 'view'
    initialData: { type: Object, default: null }
  },
  emits: ["update:modelValue", "submit", "open-comprobante"],
  setup(__props, { emit: __emit }) {
    const config = useRuntimeConfig();
    const props = __props;
    const emit = __emit;
    const ventas2 = ref([]);
    const currentUsuarioNombre = ref("");
    const notaVenta = ref("");
    const formaPagoOptions = ["Efectivo CUP", "Efectivo USD", "Transferencia CUP", "Transferencia USD", "Efectivo y Transferencia"];
    const formaPago = ref(formaPagoOptions[0]);
    const isSubmitting = ref(false);
    const loadingBanner = ref(null);
    const errorBanner = ref(null);
    const showPrintConfirm = ref(false);
    const createdListaId = ref(null);
    const createdListaRaw = ref(null);
    const PrintIcon = {
      render() {
        return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
          h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 9V2h12v7" }),
          h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 18h12v-5H6v5z" })
        ]);
      }
    };
    const scannerActive = ref(false);
    ref(null);
    const cambioMoneda = ref(1);
    function loadCambioMoneda() {
      try {
        const cfg = localStorage.getItem("config");
        if (cfg) {
          const parsed = JSON.parse(cfg);
          const cm = Number(parsed == null ? void 0 : parsed.cambio_moneda);
          cambioMoneda.value = cm && cm > 0 ? cm : 1;
        } else {
          cambioMoneda.value = 1;
        }
      } catch (e) {
        cambioMoneda.value = 1;
      }
    }
    const canAddElement = computed(() => {
      if (ventas2.value.length === 0) return true;
      const last = ventas2.value[ventas2.value.length - 1];
      return !!(last && last.id_producto);
    });
    const isViewMode = computed(() => props.mode === "view");
    const propsModeTitle = computed(() => {
      if (props.mode === "edit") return "Editar Venta";
      if (props.mode === "view") return "Ver Venta";
      return "Nueva Venta";
    });
    const totalSeleccionado = computed(() => {
      return ventas2.value.reduce((acc, v) => {
        if (!v || !v.id_producto) return acc;
        const qty = Number(v.cantidad || 0);
        const price = parseFloat(v.precio_cobrado) || 0;
        return acc + qty * price;
      }, 0);
    });
    const totalPagadoTransferencia = computed(() => {
      if (formaPago.value !== "Efectivo y Transferencia") return 0;
      return ventas2.value.reduce((acc, v) => {
        if (!v || !v.id_producto) return acc;
        const cpt = Number(v.cantidad_pagada_transferencia_cup || 0);
        return acc + cpt;
      }, 0);
    });
    watch(() => ventas2.value, () => {
      ventas2.value.forEach((v) => {
        if (v && v.id_producto) {
          const itemTotal = Number(v.cantidad || 0) * Number(v.precio_cobrado || 0);
          if (Number(v.cantidad_pagada_transferencia_cup) > itemTotal) {
            v.cantidad_pagada_transferencia_cup = itemTotal;
          }
          if (Number(v.cantidad_pagada_transferencia_cup) < 0) {
            v.cantidad_pagada_transferencia_cup = 0;
          }
        }
      });
    }, { deep: true });
    function newItem() {
      return {
        _id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        id_producto: "",
        cantidad: 1,
        costo_venta: 0,
        precio_original_venta: 0,
        precio_cobrado: 0,
        initialLabel: "",
        cantidad_pagada_transferencia_cup: 0
      };
    }
    function addVenta() {
      ventas2.value.push(newItem());
    }
    function onProductoSeleccionado(p, idx) {
      var _a, _b, _c;
      if (!p) {
        if (ventas2.value[idx]) {
          ventas2.value[idx].id_producto = "";
          ventas2.value[idx].initialLabel = "";
          ventas2.value[idx].precio_cobrado = 0;
          ventas2.value[idx].productoObj = null;
        }
        return;
      }
      ventas2.value[idx].id_producto = p.id_producto || p.id_producto;
      ventas2.value[idx].initialLabel = p.nombre || p.label || "";
      ventas2.value[idx].productoObj = p;
      const precio = (_c = (_b = (_a = p.precio) != null ? _a : p.precio_cobrado) != null ? _b : p.precioVenta) != null ? _c : null;
      if (precio != null) ventas2.value[idx].precio_cobrado = Number(precio) || 0;
      if (idx === ventas2.value.length - 1) {
        addVenta();
      }
    }
    function getItemImageSrc(item) {
      try {
        if (item && item.productoObj && item.productoObj.foto) {
          const f = item.productoObj.foto;
          if (typeof f === "string" && (f.startsWith("http") || f.startsWith("data:"))) return f;
          return `${config.public.backendHost}${f}`;
        }
      } catch (e) {
      }
      return "/image.png";
    }
    function clearBanners() {
      errorBanner.value = null;
      loadingBanner.value = null;
    }
    function formatMoney(v) {
      return Number(v || 0).toFixed(2);
    }
    function formatDate(s) {
      if (!s) return "-";
      try {
        return new Date(s).toLocaleString();
      } catch (e) {
        return s;
      }
    }
    function buildFlatVentas(data) {
      if (!data) return [];
      if (Array.isArray(data.ventas)) return data.ventas;
      if (Array.isArray(data.data) && data.data.length && Array.isArray(data.data[0].ventas)) return data.data[0].ventas;
      return [];
    }
    function createPrintWindowFromData(data) {
      const flatVentas = buildFlatVentas(data);
      const total = flatVentas.reduce((acc, v) => acc + (Number(v.precio_cobrado) || 0) * (Number(v.cantidad) || 0), 0);
      const contentRows = flatVentas.map((v) => {
        const nombre = v.producto && v.producto.nombre || v.servicio && v.servicio.nombre || v.nombre || "---";
        const cantidad = v.cantidad || 0;
        const precio = formatMoney(v.precio_cobrado);
        const totalRow = formatMoney((Number(v.precio_cobrado) || 0) * (Number(v.cantidad) || 0));
        return `<tr class="border-b"><td class="py-2">${nombre}</td><td class="py-2 text-right">${cantidad}</td><td class="py-2 text-right">${precio}</td><td class="py-2 text-right">${totalRow}</td></tr>`;
      }).join("\n");
      const fecha = formatDate((data == null ? void 0 : data.createdAt) || (data == null ? void 0 : data.created_at) || (data == null ? void 0 : data.fecha) || "");
      const css = `body{font-family: Helvetica,Arial,sans-serif;padding:20px;color:#111;} table{width:100%;border-collapse:collapse;} th,td{padding:8px;border-bottom:1px solid #eee;} .text-right{text-align:right;} .title{font-weight:700;margin-bottom:8px}`;
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Comprobante</title><style>${css}</style></head><body><div class="text-center"><div class="title">Comprobante de pago</div></div><div class="mb-4"><div><strong>Fecha creaci\xF3n:</strong> ${fecha}</div></div><table class="w-full text-sm border-collapse"><thead><tr class="border-b"><th class="text-left py-2">Producto</th><th class="text-right py-2">Cantidad</th><th class="text-right py-2">Precio</th><th class="text-right py-2">Total</th></tr></thead><tbody>${contentRows}</tbody></table><div class="mt-4 text-right"><div><strong>Total:</strong> ${formatMoney(total)}</div></div></body></html>`;
      const w = (void 0).open("", "_blank");
      if (!w) {
        alert("No se pudo abrir la ventana de impresi\xF3n. Revisa bloqueadores de ventanas emergentes.");
        return null;
      }
      w.document.open();
      w.document.write(html);
      w.document.close();
      const tryPrint = () => {
        try {
          w.focus();
          w.print();
        } catch (e) {
          console.warn("Print failed", e);
        }
      };
      w.onload = () => setTimeout(tryPrint, 300);
      setTimeout(tryPrint, 800);
      return w;
    }
    async function printCreatedVenta() {
      showPrintConfirm.value = false;
      const idLista = createdListaId.value;
      if (!idLista) {
        createPrintWindowFromData(createdListaRaw.value || null);
        emit("update:modelValue", false);
        ventas2.value = [];
        createdListaId.value = null;
        createdListaRaw.value = null;
        return;
      }
      try {
        isSubmitting.value = true;
        loadingBanner.value = { title: "Cargando comprobante", description: "Obteniendo lista de venta...", type: "info" };
        const token = localStorage.getItem("token");
        const resp = await fetch(`${config.public.backendHost}/ListaVenta/${idLista}`, {
          method: "GET",
          headers: { "Accept": "application/json", "Authorization": token }
        });
        if (resp.status === 401) {
          errorBanner.value = { title: "Sesi\xF3n Expirada", description: "Tu sesi\xF3n ha expirado.", type: "warning" };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigateTo("/"), 2e3);
          return;
        }
        if (!resp.ok) {
          let txt = await resp.text();
          try {
            txt = JSON.parse(txt);
          } catch (e) {
          }
          errorBanner.value = { title: `Error ${resp.status}`, description: JSON.stringify(txt), type: "error" };
          return;
        }
        const data = await resp.json();
        createPrintWindowFromData(data);
        emit("update:modelValue", false);
        ventas2.value = [];
        createdListaId.value = null;
        createdListaRaw.value = null;
      } catch (err) {
        console.error("Error fetching lista venta for print:", err);
        errorBanner.value = { title: "Error", description: "No se pudo obtener la lista para imprimir.", type: "error" };
      } finally {
        isSubmitting.value = false;
        loadingBanner.value = null;
      }
    }
    function handlePrintCancel() {
      showPrintConfirm.value = false;
      emit("update:modelValue", false);
      ventas2.value = [];
      createdListaId.value = null;
      createdListaRaw.value = null;
      clearBanners();
    }
    watch(() => props.modelValue, (val) => {
      if (val) {
        loadCambioMoneda();
        if ((props.mode === "edit" || props.mode === "view") && props.initialData) {
          ventas2.value = Array.isArray(props.initialData.ventas) ? props.initialData.ventas.map((v) => ({
            _id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            id_venta: v.id_venta,
            id_producto: v.id_producto || v.producto && v.producto.id_producto || "",
            cantidad: v.cantidad || 1,
            costo_venta: v.costo_venta || 0,
            precio_original_venta: v.precio_original_venta || 0,
            precio_cobrado: Number(v.precio_cobrado) || 0,
            forma_pago: v.forma_pago || "",
            initialLabel: v.producto ? v.producto.nombre || "" : "",
            productoObj: v.producto || null,
            cantidad_pagada_transferencia_cup: Number(v.cantidad_pagada_transferencia_cup) || 0
          })) : [];
          notaVenta.value = props.initialData.nota || "";
          try {
            let fpRaw = "";
            if (ventas2.value[0] && ventas2.value[0].forma_pago) fpRaw = ventas2.value[0].forma_pago;
            else if (props.initialData && (props.initialData.forma_pago || props.initialData.formaPago)) fpRaw = props.initialData.forma_pago || props.initialData.formaPago;
            let fp = "";
            if (fpRaw && typeof fpRaw === "object") fp = fpRaw.nombre || fpRaw.name || "";
            else fp = String(fpRaw || "");
            fp = fp.trim();
            if (!fp) {
              formaPago.value = formaPagoOptions[0];
            } else {
              const lfp = fp.toLowerCase();
              const found = formaPagoOptions.find((o) => o.toLowerCase() === lfp);
              if (found) {
                formaPago.value = found;
              } else if (lfp.includes("efectivo") && lfp.includes("transfer")) {
                formaPago.value = "Efectivo y Transferencia";
              } else if (lfp.includes("transfer") && lfp.includes("usd")) {
                formaPago.value = "Transferencia USD";
              } else if (lfp.includes("transfer") && lfp.includes("cup")) {
                formaPago.value = "Transferencia CUP";
              } else if (lfp.includes("transfer")) {
                formaPago.value = "Transferencia CUP";
              } else if (lfp.includes("efectivo") && lfp.includes("usd")) {
                formaPago.value = "Efectivo USD";
              } else if (lfp.includes("efectivo") && lfp.includes("cup")) {
                formaPago.value = "Efectivo CUP";
              } else if (lfp.includes("efectivo")) {
                formaPago.value = "Efectivo CUP";
              } else {
                formaPago.value = formaPagoOptions[0];
              }
            }
            let cp = 0;
            if (props.initialData && typeof props.initialData.cantidad_pagada_transferencia_cup !== "undefined") {
              cp = Number(props.initialData.cantidad_pagada_transferencia_cup) || 0;
            } else if (props.initialData && props.initialData.data && typeof props.initialData.data.cantidad_pagada_transferencia_cup !== "undefined") {
              cp = Number(props.initialData.data.cantidad_pagada_transferencia_cup) || 0;
            }
          } catch (e) {
            formaPago.value = formaPagoOptions[0];
          }
        } else if (props.mode === "create") {
          ventas2.value = [newItem()];
          notaVenta.value = "";
          formaPago.value = formaPagoOptions[0];
        } else {
          if (!ventas2.value.length) addVenta();
          formaPago.value = formaPagoOptions[0];
          notaVenta.value = "";
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" }, _attrs))} data-v-a62a7cdf>`);
        if (isSubmitting.value) {
          _push(`<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" data-v-a62a7cdf><div class="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4" data-v-a62a7cdf><div class="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" data-v-a62a7cdf></div><p class="text-gray-700 font-medium" data-v-a62a7cdf>Procesando, espere...</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass(["bg-white rounded-lg p-6 w-full max-w-7xl max-h-[80vh] overflow-y-auto", isSubmitting.value && "pointer-events-none opacity-50"])}" data-v-a62a7cdf><div class="flex justify-between items-center mb-6" data-v-a62a7cdf><h2 class="text-2xl font-bold text-gray-800" data-v-a62a7cdf>${ssrInterpolate(propsModeTitle.value)}</h2><button${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" data-v-a62a7cdf><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-a62a7cdf><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-a62a7cdf></path></svg></button></div>`);
        if (errorBanner.value || loadingBanner.value) {
          ssrRenderTeleport(_push, (_push2) => {
            _push2(`<div class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none" data-v-a62a7cdf><div class="w-full max-w-xl pointer-events-auto px-4" data-v-a62a7cdf>`);
            if (errorBanner.value) {
              _push2(ssrRenderComponent(_sfc_main$4, {
                title: errorBanner.value.title || "Error",
                description: errorBanner.value.description || "",
                type: errorBanner.value.type || "error",
                onClose: clearBanners
              }, null, _parent));
            } else {
              _push2(ssrRenderComponent(_sfc_main$4, {
                title: loadingBanner.value.title || "Cargando",
                description: loadingBanner.value.description || "",
                type: loadingBanner.value.type || "warning",
                persistent: true,
                onClose: clearBanners
              }, null, _parent));
            }
            _push2(`</div></div>`);
          }, "body", false, _parent);
        } else {
          _push(`<!---->`);
        }
        if (showPrintConfirm.value) {
          ssrRenderTeleport(_push, (_push2) => {
            _push2(`<div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto" data-v-a62a7cdf>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              title: "\xBFDeseas imprimir la venta creada?",
              description: "\xBFDeseas imprimir la lista de venta que acabas de crear?",
              icon: PrintIcon,
              type: "warning",
              onConfirm: printCreatedVenta,
              onClose: handlePrintCancel
            }, null, _parent));
            _push2(`</div>`);
          }, "body", false, _parent);
        } else {
          _push(`<!---->`);
        }
        ssrRenderTeleport(_push, (_push2) => {
          if (scannerActive.value) {
            _push2(`<div class="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-80 p-4" data-v-a62a7cdf><div class="w-full max-w-lg bg-black rounded-lg overflow-hidden relative" data-v-a62a7cdf><button class="absolute top-2 right-2 z-20 bg-white/80 rounded-full p-1" data-v-a62a7cdf><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-800" viewBox="0 0 20 20" fill="currentColor" data-v-a62a7cdf><path fill-rule="evenodd" d="M10 9.293l4.146-4.147a.5.5 0 11.708.708L10.707 10l4.147 4.146a.5.5 0 01-.708.708L10 10.707l-4.146 4.147a.5.5 0 01-.708-.708L9.293 10 5.146 5.854a.5.5 0 11.708-.708L10 9.293z" clip-rule="evenodd" data-v-a62a7cdf></path></svg></button><video autoplay muted playsinline class="w-full h-72 object-cover bg-black" data-v-a62a7cdf></video><div class="absolute inset-0 flex items-center justify-center pointer-events-none" data-v-a62a7cdf><div class="w-3/4 h-1/3 border-2 border-white/70 rounded" data-v-a62a7cdf></div></div><div class="absolute bottom-2 left-0 right-0 text-center text-white text-sm" data-v-a62a7cdf>Apunta al c\xF3digo QR o de barras</div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        if (isSubmitting.value) {
          _push(`<div class="absolute inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center" data-v-a62a7cdf><div class="text-center" data-v-a62a7cdf><div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4" data-v-a62a7cdf></div><div class="text-sm text-gray-700" data-v-a62a7cdf>Enviando datos...</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div data-v-a62a7cdf><div class="mb-4" data-v-a62a7cdf><div class="grid grid-cols-1 gap-4" data-v-a62a7cdf><!--[-->`);
        ssrRenderList(ventas2.value, (item, idx) => {
          _push(`<div class="p-2 sm:p-3 border rounded bg-gray-50" data-v-a62a7cdf><div class="hidden sm:flex items-center gap-2 w-full" data-v-a62a7cdf><img${ssrRenderAttr("src", getItemImageSrc(item))} class="w-10 h-10 rounded-full object-cover bg-white border flex-shrink-0" alt="foto-producto" data-v-a62a7cdf><div class="flex items-end gap-2 flex-1" data-v-a62a7cdf><div class="flex-1 min-w-[200px]" data-v-a62a7cdf><label class="block text-xs text-gray-600 mb-1" data-v-a62a7cdf>Producto</label>`);
          _push(ssrRenderComponent(_sfc_main$6, {
            modelValue: item.id_producto,
            "onUpdate:modelValue": ($event) => item.id_producto = $event,
            disabled: isViewMode.value,
            endpoint: "/producto/filterProductos/1/10",
            method: "POST",
            "search-key": "nombre",
            "label-key": "nombre",
            "value-key": "id_producto",
            "initial-label": item.initialLabel,
            placeholder: "Buscar...",
            onProductoSeleccionado: (p) => onProductoSeleccionado(p, idx)
          }, null, _parent));
          _push(`</div><div class="min-w-[70px]" data-v-a62a7cdf><label class="block text-xs text-gray-600 mb-1" data-v-a62a7cdf>Cant.</label><input type="number"${ssrRenderAttr("value", item.cantidad)}${ssrIncludeBooleanAttr(isViewMode.value) ? " disabled" : ""} min="1" class="w-full px-2 py-1 rounded border text-center text-sm" data-v-a62a7cdf></div><div class="min-w-[85px]" data-v-a62a7cdf><label class="block text-xs text-gray-600 mb-1" data-v-a62a7cdf>Precio</label><input type="number" step="0.01"${ssrRenderAttr("value", item.precio_cobrado)}${ssrIncludeBooleanAttr(isViewMode.value) ? " disabled" : ""} class="w-full px-2 py-1 rounded border text-center text-sm" data-v-a62a7cdf></div>`);
          if (formaPago.value === "Efectivo y Transferencia") {
            _push(`<div class="min-w-[85px]" data-v-a62a7cdf><label class="block text-xs text-gray-600 mb-1" data-v-a62a7cdf>Transfer. <span class="text-xs text-gray-500" data-v-a62a7cdf>L\xEDmite: CUP ${ssrInterpolate(formatMoney(Number(item.cantidad || 0) * Number(item.precio_cobrado || 0)))}</span></label><input type="number" step="0.01" min="0"${ssrRenderAttr("max", Number(item.cantidad || 0) * Number(item.precio_cobrado || 0))}${ssrRenderAttr("value", item.cantidad_pagada_transferencia_cup)}${ssrIncludeBooleanAttr(isViewMode.value) ? " disabled" : ""} class="w-full px-2 py-1 rounded border text-center text-sm" data-v-a62a7cdf></div>`);
          } else {
            _push(`<!---->`);
          }
          if (!isViewMode.value) {
            _push(`<button type="button" class="px-2 py-1 bg-red-500 text-white rounded flex items-center gap-1 text-sm hover:bg-red-600 flex-shrink-0" title="Eliminar" data-v-a62a7cdf><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-a62a7cdf><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" data-v-a62a7cdf></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="block sm:hidden" data-v-a62a7cdf><div class="flex items-center gap-2 mb-2" data-v-a62a7cdf><img${ssrRenderAttr("src", getItemImageSrc(item))} class="w-12 h-12 rounded-full object-cover bg-white border flex-shrink-0" alt="foto-producto" data-v-a62a7cdf><div class="flex-1" data-v-a62a7cdf><label class="block text-xs text-gray-600 mb-1" data-v-a62a7cdf>Producto</label>`);
          _push(ssrRenderComponent(_sfc_main$6, {
            modelValue: item.id_producto,
            "onUpdate:modelValue": ($event) => item.id_producto = $event,
            disabled: isViewMode.value,
            endpoint: "/producto/filterProductos/1/10",
            method: "POST",
            "search-key": "nombre",
            "label-key": "nombre",
            "value-key": "id_producto",
            "initial-label": item.initialLabel,
            placeholder: "Buscar...",
            onProductoSeleccionado: (p) => onProductoSeleccionado(p, idx)
          }, null, _parent));
          _push(`</div>`);
          if (!isViewMode.value) {
            _push(`<button type="button" class="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex-shrink-0" data-v-a62a7cdf><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-a62a7cdf><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" data-v-a62a7cdf></path></svg></button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="grid grid-cols-2 gap-2 mb-2" data-v-a62a7cdf><div data-v-a62a7cdf><label class="block text-xs text-gray-600 mb-1" data-v-a62a7cdf>Cantidad</label><input type="number"${ssrRenderAttr("value", item.cantidad)}${ssrIncludeBooleanAttr(isViewMode.value) ? " disabled" : ""} min="1" class="w-full px-2 py-1 rounded border text-center text-sm" data-v-a62a7cdf></div><div data-v-a62a7cdf><label class="block text-xs text-gray-600 mb-1" data-v-a62a7cdf>Precio</label><input type="number" step="0.01"${ssrRenderAttr("value", item.precio_cobrado)}${ssrIncludeBooleanAttr(isViewMode.value) ? " disabled" : ""} class="w-full px-2 py-1 rounded border text-center text-sm" data-v-a62a7cdf></div></div>`);
          if (formaPago.value === "Efectivo y Transferencia") {
            _push(`<div data-v-a62a7cdf><label class="block text-xs text-gray-600 mb-1" data-v-a62a7cdf>A Transferencia <span class="text-xs text-gray-500" data-v-a62a7cdf>L\xEDmite: CUP ${ssrInterpolate(formatMoney(Number(item.cantidad || 0) * Number(item.precio_cobrado || 0)))}</span></label><input type="number" step="0.01" min="0"${ssrRenderAttr("max", Number(item.cantidad || 0) * Number(item.precio_cobrado || 0))}${ssrRenderAttr("value", item.cantidad_pagada_transferencia_cup)}${ssrIncludeBooleanAttr(isViewMode.value) ? " disabled" : ""} class="w-full px-2 py-1 rounded border text-center text-sm" data-v-a62a7cdf></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div><div class="mt-3 flex justify-between items-center" data-v-a62a7cdf><div class="flex items-center gap-2" data-v-a62a7cdf>`);
        if (!isViewMode.value) {
          _push(`<button type="button"${ssrIncludeBooleanAttr(!canAddElement.value) ? " disabled" : ""} class="px-4 py-2 bg-primary text-neutral rounded disabled:opacity-50" data-v-a62a7cdf>+ Agregar elemento</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="text-sm text-gray-600" data-v-a62a7cdf>Usuario: ${ssrInterpolate(currentUsuarioNombre.value || "-")}</div></div><div class="mt-3" data-v-a62a7cdf><div class="text-sm font-medium text-gray-700" data-v-a62a7cdf>Total a cobrar</div><div class="text-xl font-bold" data-v-a62a7cdf>CUP ${ssrInterpolate(formatMoney(totalSeleccionado.value))} - USD: ${ssrInterpolate(formatMoney(totalSeleccionado.value / cambioMoneda.value))}</div></div>`);
        if (formaPago.value === "Efectivo y Transferencia") {
          _push(`<div class="mt-3 p-3 bg-blue-50 rounded border border-blue-200" data-v-a62a7cdf><div class="text-sm font-medium text-gray-700" data-v-a62a7cdf>Total pagado por transferencia</div><div class="text-lg font-bold text-blue-600" data-v-a62a7cdf>CUP ${ssrInterpolate(formatMoney(totalPagadoTransferencia.value))}</div><div class="text-sm text-gray-600 mt-1" data-v-a62a7cdf>Efectivo: CUP ${ssrInterpolate(formatMoney(totalSeleccionado.value - totalPagadoTransferencia.value))}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-4" data-v-a62a7cdf><label class="block text-sm font-medium text-gray-700 mb-1" data-v-a62a7cdf>Nota (opcional)</label><textarea${ssrIncludeBooleanAttr(isViewMode.value) ? " disabled" : ""} class="w-full px-3 py-2 rounded border" rows="2" placeholder="Nota para estas ventas" data-v-a62a7cdf>${ssrInterpolate(notaVenta.value)}</textarea></div><div class="mt-3" data-v-a62a7cdf><div class="mb-1 text-sm font-medium text-gray-700" data-v-a62a7cdf>Forma de pago</div><div class="flex flex-wrap w-full gap-2 md:max-w-xs" data-v-a62a7cdf><!--[-->`);
        ssrRenderList(formaPagoOptions, (opt) => {
          _push(`<button type="button"${ssrIncludeBooleanAttr(isViewMode.value) ? " disabled" : ""} class="${ssrRenderClass([formaPago.value === opt ? "text-neutral bg-primary" : "text-dark bg-secondary", "flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-center"])}" data-v-a62a7cdf>${ssrInterpolate(opt)}</button>`);
        });
        _push(`<!--]--></div></div></div><div class="flex justify-end gap-3" data-v-a62a7cdf><button${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed" data-v-a62a7cdf>${ssrInterpolate(isViewMode.value ? "Cerrar" : "Cancelar")}</button>`);
        if (!isViewMode.value) {
          _push(`<button${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all" data-v-a62a7cdf>${ssrInterpolate(isSubmitting.value ? props.mode === "edit" ? "Guardando..." : "Creando..." : props.mode === "edit" ? "Guardar cambios" : "Crear Ventas")}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VentaModalSell.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const VentaModalSell = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-a62a7cdf"]]);
const _imports_0 = publicAssetsURL("/whasapChanel.png");
const _sfc_main$1 = {
  __name: "VentaComprobante",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, default: false },
    data: { type: [Object, Array, null], default: null }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    const dependienteNombre = ref("");
    const items = computed(() => {
      const d = props.data;
      if (!d) return [];
      if (Array.isArray(d)) return d;
      const candidates = ["items", "lista", "detalles", "listaVenta", "ventas", "lista_venta", "listaVentaDetalle", "detalle", "productos"];
      for (const key of candidates) {
        if (d[key] && Array.isArray(d[key])) return d[key];
      }
      if (d.nombre || d.nombre_producto || d.productoNombre) return [d];
      return [];
    });
    const processedItems = computed(() => {
      function parseProduct(prod) {
        if (!prod) return null;
        if (typeof prod === "string") {
          try {
            return JSON.parse(prod);
          } catch (e) {
            return null;
          }
        }
        if (typeof prod === "object") return prod;
        return null;
      }
      function productNameFrom(prod) {
        if (!prod) return null;
        return prod.nombre || prod.name || prod.nombre_producto || prod.productoNombre || prod.descripcion || prod.codigo || null;
      }
      return items.value.map((it) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
        const prodRaw = (_c = (_b = (_a = it.producto) != null ? _a : it.producto_detalle) != null ? _b : it.producto_obj) != null ? _c : null;
        const prod = parseProduct(prodRaw) || null;
        const nombreFromTop = it.nombre || it.nombre_producto || it.productoNombre || (typeof it.producto === "string" ? it.producto : null) || null;
        const nombre = productNameFrom(prod) || (typeof nombreFromTop === "string" ? nombreFromTop : null) || "-";
        const cantidad = Number((_h = (_g = (_f = (_e = (_d = it.cantidad) != null ? _d : it.qty) != null ? _e : it.cant) != null ? _f : it.quantity) != null ? _g : it.unidades) != null ? _h : 0);
        const precio = Number(
          (_n = (_m = (_k = (_j = (_i = it.precio) != null ? _i : it.precio_cobrado) != null ? _j : it.precio_unitario) != null ? _k : it.price) != null ? _m : prod && ((_l = prod.precio) != null ? _l : prod.price)) != null ? _n : 0
        );
        return { original: it, nombre, cantidad, precio };
      });
    });
    const total = computed(() => {
      return processedItems.value.reduce((s, it) => {
        return s + Number(it.cantidad || 0) * Number(it.precio || 0);
      }, 0);
    });
    const totalQuantity = computed(() => {
      return processedItems.value.reduce((s, it) => {
        return s + Number(it.cantidad || 0);
      }, 0);
    });
    const formattedDate = computed(() => {
      try {
        const d = props.data && (props.data.fecha || props.data.created_at || props.data.createdAt || props.data.date);
        const date = d ? new Date(d) : /* @__PURE__ */ new Date();
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch (e) {
        return "";
      }
    });
    function formatNumberWithSpaces(numStr) {
      const parts = numStr.split(".");
      const integerPart = parts[0];
      const decimalPart = parts[1] || "";
      const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return decimalPart ? `${formatted}.${decimalPart}` : formatted;
    }
    function formatMoney(v) {
      const n = Number(v || 0);
      const formatted = n.toFixed(2);
      const withSpaces = formatNumberWithSpaces(formatted);
      return `$${withSpaces}`;
    }
    function formatQty(v) {
      const n = Number(v || 0);
      const formatted = Number.isInteger(n) ? n.toString() : n.toFixed(2);
      return formatNumberWithSpaces(formatted);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      if (__props.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-[12000] flex items-center justify-center" }, _attrs))} data-v-51acbb8f><div class="absolute inset-0 bg-black/50" data-v-51acbb8f></div><div class="bg-white rounded-md shadow-lg max-w-[90%] w-[400px] mx-auto z-10 p-4" data-v-51acbb8f><div class="flex justify-between items-center mb-3" data-v-51acbb8f><h3 class="text-lg font-semibold" data-v-51acbb8f>Comprobante</h3><button class="text-sm text-gray-600" data-v-51acbb8f>Cerrar \u2715</button></div><div class="overflow-auto max-h-[60vh] p-2" data-v-51acbb8f><div class="receipt-preview mx-auto" data-v-51acbb8f><div class="receipt-header text-center mb-3" data-v-51acbb8f><div class="text-xl font-bold mb-1" data-v-51acbb8f>ALMACEN 5TA KILO 12</div><div class="text-base font-semibold text-gray-700" data-v-51acbb8f>Comprobante de Venta</div><div class="text-sm text-gray-600 mt-1" data-v-51acbb8f>${ssrInterpolate(formattedDate.value)}</div><div class="text-xs text-gray-500 mt-1" data-v-51acbb8f>Direcci\xF3n: Calle 5ta, #24</div><div class="text-xs font-semibold mt-1 uppercase" data-v-51acbb8f>Dependiente: ${ssrInterpolate(dependienteNombre.value)}</div>`);
        if (((_a = __props.data) == null ? void 0 : _a.codigo) || ((_b = __props.data) == null ? void 0 : _b.folio)) {
          _push(`<div class="text-xs font-semibold mt-1" data-v-51acbb8f> Folio: ${ssrInterpolate(__props.data.codigo || __props.data.folio || "N/A")}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="receipt-body" data-v-51acbb8f><table class="w-full text-sm border-collapse" data-v-51acbb8f><thead data-v-51acbb8f><tr class="border-b border-gray-300 border-dashed" data-v-51acbb8f><th class="text-left py-2 px-0 font-semibold w-[45%]" data-v-51acbb8f>Producto</th><th class="text-center py-2 px-0 font-semibold w-[20%]" data-v-51acbb8f>Cant.</th><th class="text-right py-2 px-0 font-semibold w-[35%]" data-v-51acbb8f>Total</th></tr></thead><tbody data-v-51acbb8f><!--[-->`);
        ssrRenderList(processedItems.value, (it, idx) => {
          _push(`<tr class="border-b border-gray-100 border-dashed" data-v-51acbb8f><td class="py-2 px-0" data-v-51acbb8f><div data-v-51acbb8f>${ssrInterpolate(it.nombre)}</div></td><td class="py-2 px-0 text-center" data-v-51acbb8f>${ssrInterpolate(formatQty(it.cantidad))}</td><td class="py-2 px-0 text-right" data-v-51acbb8f>${ssrInterpolate(formatMoney(it.cantidad * it.precio))}</td></tr>`);
        });
        _push(`<!--]--></tbody><tfoot data-v-51acbb8f><tr class="border-t border-gray-300 border-dashed" data-v-51acbb8f><td class="py-3 px-0 text-left font-bold" data-v-51acbb8f>TOTAL</td><td class="py-3 px-0 text-center font-bold" data-v-51acbb8f>${ssrInterpolate(formatQty(totalQuantity.value))}</td><td class="py-3 px-0 text-right font-bold" data-v-51acbb8f>${ssrInterpolate(formatMoney(total.value))}</td></tr></tfoot></table>`);
        if (((_c = __props.data) == null ? void 0 : _c.cliente) || ((_d = __props.data) == null ? void 0 : _d.metodo_pago)) {
          _push(`<div class="mt-4 pt-3 border-t border-gray-300 border-dashed text-xs" data-v-51acbb8f>`);
          if (__props.data.cliente) {
            _push(`<div class="mb-1" data-v-51acbb8f><span class="font-semibold" data-v-51acbb8f>Cliente:</span> ${ssrInterpolate(__props.data.cliente)}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (__props.data.metodo_pago) {
            _push(`<div class="mb-1" data-v-51acbb8f><span class="font-semibold" data-v-51acbb8f>M\xE9todo de pago:</span> ${ssrInterpolate(__props.data.metodo_pago)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-4 pt-3 border-t border-gray-300 border-dashed text-center" data-v-51acbb8f><div class="text-xs font-semibold mb-2" data-v-51acbb8f>S\xEDguenos en WhatsApp</div><img${ssrRenderAttr("src", _imports_0)} alt="C\xF3digo QR WhatsApp" class="w-24 h-24 mx-auto mb-2 qr-code-print" data-v-51acbb8f><div class="text-xs text-gray-600" data-v-51acbb8f>Escanea para unirte a nuestro<br data-v-51acbb8f>canal de WhatsApp</div></div><div class="mt-4 pt-3 border-t border-gray-300 border-dashed text-center text-xs" data-v-51acbb8f><div class="font-semibold mb-1" data-v-51acbb8f>\xA1Gracias por su compra!</div><div class="text-gray-500" data-v-51acbb8f>Vuelva pronto</div></div></div></div></div><div class="mt-4 flex gap-2 justify-end" data-v-51acbb8f><button class="px-3 py-1 bg-accent text-white rounded-md text-sm" data-v-51acbb8f>Imprimir</button><button class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm" data-v-51acbb8f>Descargar</button><button class="px-3 py-1 bg-green-600 text-white rounded-md text-sm" data-v-51acbb8f>Compartir</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VentaComprobante.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const VentaComprobante = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-51acbb8f"]]);
const _sfc_main = {
  __name: "ventas",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const filters = ref({
      nota: "",
      nombre_producto: "",
      codigo_producto: "",
      fecha_hora_min: "",
      fecha_hora_max: "",
      precio_cobrado_min: null,
      precio_cobrado_max: null
    });
    const viewMode = ref("normal");
    const showFilters = ref(false);
    function formatTime12(timeStr) {
      if (!timeStr) return "";
      const t = String(timeStr).substring(0, 8);
      const parts = t.split(":");
      if (parts.length < 2) return timeStr;
      let hh = parseInt(parts[0], 10);
      const mm = parts[1];
      const ampm = hh >= 12 ? "PM" : "AM";
      hh = hh % 12;
      if (hh === 0) hh = 12;
      return `${hh}:${mm} ${ampm}`;
    }
    function formatNumber(value, decimals = 2) {
      const n = Number(value);
      if (!isFinite(n)) return 0 .toFixed(decimals);
      if (decimals === 0) {
        return String(Math.trunc(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
      const fixed = n.toFixed(decimals);
      const parts = fixed.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return parts.join(".");
    }
    const currentPage = ref(1);
    const totalItems = ref(0);
    const isLoading = ref(false);
    const itemsPorPage = ref(50);
    const itemsData = ref([]);
    const paginationData = ref({});
    const showModal = ref(false);
    const selectedLista = ref(null);
    const showSellModal = ref(false);
    const modalMode = ref("create");
    const modalInitialData = ref(null);
    const modalLoading = ref(false);
    const showComprobante = ref(false);
    const comprobanteData = ref(null);
    const errorBanner = ref(null);
    const showConfirmBanner = ref(false);
    const ventaAEliminar = ref(null);
    ref(1);
    const ventasColumns = computed(() => {
      if (viewMode.value === "normal") {
        return [
          { key: "fecha", label: "Fecha" },
          { key: "hora", label: "Hora" },
          { key: "totalCobrado", label: "Total Cobrado" },
          // Mostrar TOTAL COBRADO USD solo si NO es Vendedor
          ...isVendedor.value ? [] : [{ key: "totalCobradoUSD", label: "TOTAL COBRADO USD" }],
          {
            key: "formaPago",
            label: "Forma de Pago",
            cellRenderer: (value) => {
              if (!value) return "";
              const v = String(value).toLowerCase();
              const hasEfectivo = v.includes("efectivo");
              const hasTransfer = v.includes("transferencia");
              if (hasEfectivo && hasTransfer) {
                return `<span class="px-2 py-1 rounded-full text-sm font-medium"><span class="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-l">Efectivo</span><span class="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-r">Transferencia</span></span>`;
              }
              let bg = "bg-gray-100 text-gray-800";
              if (hasTransfer) bg = "bg-blue-100 text-blue-800";
              else if (hasEfectivo) bg = "bg-green-100 text-green-800";
              return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bg}">${value}</span>`;
            }
          },
          { key: "usuario", label: "Usuario" }
        ];
      }
      return [
        { key: "fecha", label: "Fecha" },
        { key: "hora", label: "Hora" },
        { key: "productoNombre", label: "Producto" },
        { key: "cantidad", label: "Cantidad" },
        { key: "precio_cobrado", label: "Precio Cobrado" },
        // Mostrar columna USD en detallado solo si NO es Vendedor
        ...isVendedor.value ? [] : [{ key: "totalUSD", label: "TOTAL COBRADO USD" }],
        { key: "total", label: "Total" },
        {
          key: "forma_pago",
          label: "Forma de Pago",
          cellRenderer: (value) => {
            if (!value) return "";
            const v = String(value).toLowerCase();
            const hasEfectivo = v.includes("efectivo");
            const hasTransfer = v.includes("transferencia");
            if (hasEfectivo && hasTransfer) {
              return `<span class="px-2 py-1 rounded-full text-sm font-medium"><span class="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-l">Efectivo</span><span class="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-r">Transferencia</span></span>`;
            }
            let bg = "bg-gray-100 text-gray-800";
            if (hasTransfer) bg = "bg-blue-100 text-blue-800";
            else if (hasEfectivo) bg = "bg-green-100 text-green-800";
            return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bg}">${value}</span>`;
          }
        },
        { key: "usuario", label: "Usuario" }
      ];
    });
    const ventasActions = [
      // Imprimir (placeholder)
      {
        name: "Imprimir",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 9V2h12v7" }),
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 18h12v-5H6v5z" })
            ]);
          }
        },
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90",
        handler: async (item) => {
          if (viewMode.value === "normal") {
            comprobanteData.value = item.rawItem || item;
            showComprobante.value = true;
            return;
          }
          const raw = item.rawItem || item;
          const idLista = raw.id_lista_venta || raw.id_lista || raw.id;
          if (!idLista) {
            errorBanner.value = { title: "Error", description: "ID de lista no encontrado.", type: "error" };
            return;
          }
          try {
            modalLoading.value = true;
            const token = localStorage.getItem("token");
            const resp = await fetch(`${config.public.backendHost}/ListaVenta/${idLista}`, {
              method: "GET",
              headers: { "Accept": "application/json", "Authorization": token }
            });
            if (resp.status === 401) {
              errorBanner.value = { title: "Sesi\xF3n Expirada", description: "Tu sesi\xF3n ha expirado.", type: "warning" };
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setTimeout(() => navigateTo("/"), 2e3);
              return;
            }
            if (!resp.ok) {
              let txt = await resp.text();
              try {
                txt = JSON.parse(txt);
              } catch (e) {
              }
              errorBanner.value = { title: `Error ${resp.status}`, description: JSON.stringify(txt), type: "error" };
              return;
            }
            const data = await resp.json();
            comprobanteData.value = data;
            showComprobante.value = true;
          } catch (err) {
            console.error("Error fetching lista venta for comprobante:", err);
            errorBanner.value = { title: "Error", description: "No se pudo cargar la lista de venta.", type: "error" };
          } finally {
            modalLoading.value = false;
          }
        }
      },
      // Editar (placeholder)
      /*/
        {
          name: 'Editar',
          icon: {
            render() {
              return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
                h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5h6M4 21v-7a4 4 0 014-4h2l8 8v4H4z' })
              ])
            }
          },
          buttonClass: 'px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700',
            handler: async (item) => {
              // Abrir VentaModalSell en modo editar.
              if (viewMode.value === 'normal') {
                // item.rawItem es la lista completa
                modalMode.value = 'edit';
                modalInitialData.value = item.rawItem || item;
                showSellModal.value = true;
                return;
              }
      
              // modo detallado: obtener la lista mediante GET /ListaVenta/{id_lista_venta}
              const raw = item.rawItem || item;
              const idLista = raw.id_lista_venta || raw.id_lista || raw.id;
              if (!idLista) {
                errorBanner.value = { title: 'Error', description: 'ID de lista no encontrado.', type: 'error' };
                return;
              }
              try {
                modalLoading.value = true;
                const token = localStorage.getItem('token');
                const resp = await fetch(`${config.public.backendHost}/ListaVenta/${idLista}`, {
                  method: 'GET',
                  headers: { 'Accept': 'application/json', 'Authorization': token }
                });
                if (resp.status === 401) {
                  errorBanner.value = { title: 'Sesión Expirada', description: 'Tu sesión ha expirado.', type: 'warning' };
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setTimeout(() => navigateTo('/'), 2000);
                  return;
                }
                if (!resp.ok) {
                  let txt = await resp.text();
                  try { txt = JSON.parse(txt); } catch (e) {}
                  errorBanner.value = { title: `Error ${resp.status}`, description: JSON.stringify(txt), type: 'error' };
                  return;
                }
                const data = await resp.json();
                modalMode.value = 'edit';
                modalInitialData.value = data;
                showSellModal.value = true;
              } catch (err) {
                console.error('Error fetching lista venta:', err);
                errorBanner.value = { title: 'Error', description: 'No se pudo cargar la lista de venta.', type: 'error' };
              } finally {
                modalLoading.value = false;
              }
            }
        },
        */
      // Eliminar (ejecuta DELETE al endpoint según viewMode)
      {
        name: "Eliminar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" })
            ]);
          }
        },
        buttonClass: "px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700",
        handler: (item) => {
          ventaAEliminar.value = { raw: item.rawItem || item, mode: viewMode.value };
          showConfirmBanner.value = true;
        }
      }
    ];
    const isInvitado = computed(() => {
      try {
        const usuarioStr = localStorage.getItem("usuario");
        if (!usuarioStr) return false;
        const usuario = JSON.parse(usuarioStr);
        const rawRole = usuario && (usuario.rol || usuario.role || usuario.perfil && usuario.perfil.rol || usuario.profile && usuario.profile.role) ? usuario.rol || usuario.role || usuario.perfil && usuario.perfil.rol || usuario.profile && usuario.profile.role : null;
        if (!rawRole) return false;
        return String(rawRole).trim().toLowerCase() === "invitado";
      } catch (e) {
        return false;
      }
    });
    const isVendedor = computed(() => {
      try {
        const usuarioStr = localStorage.getItem("usuario");
        if (!usuarioStr) return false;
        const usuario = JSON.parse(usuarioStr);
        const rawRole = usuario && (usuario.rol || usuario.role || usuario.perfil && usuario.perfil.rol || usuario.profile && usuario.profile.role) ? usuario.rol || usuario.role || usuario.perfil && usuario.perfil.rol || usuario.profile && usuario.profile.role : null;
        if (!rawRole) return false;
        return String(rawRole).trim().toLowerCase() === "vendedor";
      } catch (e) {
        return false;
      }
    });
    function buildBodyFromFilters(obj, mode = "normal") {
      const body = {};
      for (const key in obj) {
        if (mode === "detallado" && key === "nota") continue;
        const val = obj[key];
        if (val === null || val === void 0) continue;
        if (typeof val === "string" && val.trim() === "") continue;
        body[key] = val;
      }
      return body;
    }
    async function fetchItems(page = 1, limit = 20) {
      try {
        isLoading.value = true;
        const token = localStorage.getItem("token");
        const bodyData = buildBodyFromFilters(filters.value, viewMode.value);
        const endpoint = viewMode.value === "normal" ? "ListaVenta" : "Venta";
        const response = await fetch(`${config.public.backendHost}/${endpoint}/filter/${page}/${limit}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
            "Accept": "application/json"
          },
          body: JSON.stringify(bodyData)
        });
        if (response.status === 401) {
          errorBanner.value = { title: "Sesi\xF3n Expirada", description: "Tu sesi\xF3n ha expirado.", type: "warning" };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigateTo("/"), 2e3);
          return;
        }
        if (response.status === 403) {
          errorBanner.value = { title: "Acceso Denegado", description: "No tienes permisos.", type: "error" };
          return;
        }
        const data = await response.json();
        if (viewMode.value === "normal") {
          const mapped = (data.data || []).map((item) => {
            const ventas2 = Array.isArray(item.ventas) ? item.ventas : [];
            const dateCount = {};
            const timeCount = {};
            let total = 0;
            const formas = /* @__PURE__ */ new Set();
            let usuarioNombre = "";
            let usdTotal = 0;
            ventas2.forEach((v) => {
              if (v.fecha_hora) {
                const d = v.fecha_hora.substring(0, 10);
                const t = v.fecha_hora.substring(11, 19);
                dateCount[d] = (dateCount[d] || 0) + 1;
                timeCount[t] = (timeCount[t] || 0) + 1;
              }
              const precio = parseFloat(v.precio_cobrado) || 0;
              const cantidad = Number(v.cantidad) || 0;
              total += precio * cantidad;
              const cambio = parseFloat(v.cambioUSD_al_vender);
              const usd = cambio && cambio !== 0 ? precio / cambio : 0;
              usdTotal += usd;
              if (v.forma_pago) formas.add(String(v.forma_pago).toLowerCase());
              if (v.usuario && v.usuario.nombre_usuario) usuarioNombre = v.usuario.nombre_usuario;
            });
            function mostCommon(obj) {
              let max = 0;
              let val = "";
              for (const k in obj) {
                if (obj[k] > max) {
                  max = obj[k];
                  val = k;
                }
              }
              return val;
            }
            let formaPago = "";
            const formasArr = Array.from(formas);
            if (formasArr.length === 0) {
              formaPago = "";
            } else if (formasArr.length === 1) {
              formaPago = formasArr[0].split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
            } else {
              const hasEfectivo = formasArr.some((s) => s.includes("efectivo"));
              const hasTransfer = formasArr.some((s) => s.includes("transferencia"));
              if (hasEfectivo && hasTransfer) formaPago = "Efectivo y Transferencia";
              else {
                formaPago = formasArr.map((s) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")).join(" y ");
              }
            }
            const rawHora = mostCommon(timeCount) || (item.createdAt ? item.createdAt.substring(11, 19) : "");
            const hora12 = formatTime12(rawHora);
            return {
              fecha: mostCommon(dateCount) || (item.createdAt ? item.createdAt.substring(0, 10) : ""),
              hora: hora12,
              nota: item.nota || "",
              totalCobrado: total.toFixed(2),
              totalCobradoUSD: usdTotal.toFixed(2),
              formaPago,
              usuario: usuarioNombre || (item.usuario ? item.usuario.nombre_usuario : ""),
              rawItem: item
            };
          });
          itemsData.value = mapped;
          totalItems.value = data.pagination ? data.pagination.total : mapped.length;
          try {
            let sumPrecioCobradoUSD = 0;
            let sumCostoVentaUSD = 0;
            let sumGananciaTotalUSD = 0;
            let sumEfectivoCUP = 0;
            let sumEfectivoUSD = 0;
            let sumTransferenciaCUP = 0;
            let sumTransferenciaUSD = 0;
            let sumCantidad = 0;
            let sumCostoVenta = 0;
            let sumPrecioCobrado = 0;
            (data.data || []).forEach((listItem) => {
              const ventasArr = Array.isArray(listItem.ventas) ? listItem.ventas : [];
              ventasArr.forEach((v) => {
                const precio = parseFloat(v.precio_cobrado) || 0;
                const cantidad = Number(v.cantidad) || 0;
                const cambio = parseFloat(v.cambioUSD_al_vender) || 0;
                const costo = parseFloat(v.costo_venta) || parseFloat(v.costoVenta) || 0;
                const formaPago = String(v.forma_pago || "").toLowerCase();
                const cantidadPagadaTransferencia = parseFloat(v.cantidad_pagada_transferencia_cup) || 0;
                sumCantidad += cantidad;
                sumCostoVenta += costo * cantidad;
                sumPrecioCobrado += precio * cantidad;
                if (cambio && cambio !== 0) {
                  sumPrecioCobradoUSD += precio * cantidad / cambio;
                  sumCostoVentaUSD += costo * cantidad / cambio;
                  sumGananciaTotalUSD += (precio - costo) * cantidad / cambio;
                }
                if (formaPago.includes("efectivo")) {
                  if (formaPago === "efectivo cup") {
                    const montoCUP = precio * cantidad;
                    sumEfectivoCUP += montoCUP;
                  } else if (formaPago.includes("efectivo") && formaPago.includes("transferencia")) {
                    const montoCUP = precio * cantidad - cantidadPagadaTransferencia;
                    sumEfectivoCUP += montoCUP;
                  }
                }
                if (formaPago.includes("transferencia")) {
                  if (formaPago === "transferencia cup") {
                    const montoCUP = precio * cantidad;
                    sumTransferenciaCUP += montoCUP;
                  } else if (formaPago.includes("efectivo") && formaPago.includes("transferencia")) {
                    const montoCUP = cantidadPagadaTransferencia;
                    sumTransferenciaCUP += montoCUP;
                  }
                }
                if (formaPago === "efectivo usd") {
                  const montoUSD = precio * cantidad / (cambio && cambio !== 0 ? cambio : 1);
                  sumEfectivoUSD += montoUSD;
                }
                if (formaPago === "transferencia usd") {
                  const montoUSD = precio * cantidad / (cambio && cambio !== 0 ? cambio : 1);
                  sumTransferenciaUSD += montoUSD;
                }
              });
            });
            paginationData.value = data.pagination || {};
            paginationData.value.sumCantidad = sumCantidad;
            paginationData.value.sumCostoVenta = sumCostoVenta;
            paginationData.value.sumPrecioCobrado = sumPrecioCobrado;
            paginationData.value.sumTotalVentas = sumPrecioCobrado;
            paginationData.value.sumPrecioCobradoUSD = sumPrecioCobradoUSD;
            paginationData.value.sumCostoVentaUSD = sumCostoVentaUSD;
            paginationData.value.sumGananciaTotalUSD = sumGananciaTotalUSD;
            paginationData.value.sumEfectivoCUP = sumEfectivoCUP;
            paginationData.value.sumEfectivoUSD = sumEfectivoUSD;
            paginationData.value.sumTransferenciaCUP = sumTransferenciaCUP;
            paginationData.value.sumTransferenciaUSD = sumTransferenciaUSD;
          } catch (e) {
            paginationData.value = data.pagination || {};
            console.error("Error calculando totales:", e);
          }
        } else {
          const mapped = (data.data || []).map((item) => {
            const rawFecha = item.fecha_hora ? item.fecha_hora.substring(0, 10) : item.createdAt ? item.createdAt.substring(0, 10) : "";
            const rawHoraStr = item.fecha_hora ? item.fecha_hora.substring(11, 19) : item.createdAt ? item.createdAt.substring(11, 19) : "";
            const hora12 = formatTime12(rawHoraStr);
            const cambio = parseFloat(item.cambioUSD_al_vender);
            const totalUSD = cambio && cambio !== 0 ? (parseFloat(item.precio_cobrado) || 0) / cambio : 0;
            return {
              fecha: rawFecha,
              hora: hora12,
              productoNombre: item.producto ? item.producto.nombre : item.servicio ? item.servicio.nombre : "",
              cantidad: item.cantidad,
              precio_cobrado: (parseFloat(item.precio_cobrado) || 0).toFixed(2),
              totalUSD: totalUSD.toFixed(2),
              total: (Number(item.cantidad || 0) * (parseFloat(item.precio_cobrado) || 0)).toFixed(2),
              forma_pago: item.forma_pago || "",
              usuario: item.usuario ? item.usuario.nombre_usuario : "",
              rawItem: item
            };
          });
          itemsData.value = mapped;
          totalItems.value = data.pagination ? data.pagination.total : mapped.length;
          paginationData.value = data.pagination || {};
        }
      } catch (error) {
        console.error("Error al cargar ventas:", error);
        errorBanner.value = { title: "Error", description: "Ocurri\xF3 un error al cargar ventas.", type: "error" };
      } finally {
        isLoading.value = false;
      }
    }
    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
      fetchItems(newPage, itemsPorPage.value);
    };
    const handleRowClick = (item) => {
      if (viewMode.value === "normal") {
        modalMode.value = "view";
        modalInitialData.value = item.rawItem || item;
        showSellModal.value = true;
        return;
      }
      (async () => {
        const raw = item.rawItem || item;
        const idLista = raw.id_lista_venta || raw.id_lista || raw.id;
        if (!idLista) {
          errorBanner.value = { title: "Error", description: "ID de lista no encontrado.", type: "error" };
          return;
        }
        try {
          modalLoading.value = true;
          const token = localStorage.getItem("token");
          const resp = await fetch(`${config.public.backendHost}/ListaVenta/${idLista}`, {
            method: "GET",
            headers: { "Accept": "application/json", "Authorization": token }
          });
          if (resp.status === 401) {
            errorBanner.value = { title: "Sesi\xF3n Expirada", description: "Tu sesi\xF3n ha expirado.", type: "warning" };
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setTimeout(() => navigateTo("/"), 2e3);
            return;
          }
          if (!resp.ok) {
            let txt = await resp.text();
            try {
              txt = JSON.parse(txt);
            } catch (e) {
            }
            errorBanner.value = { title: `Error ${resp.status}`, description: JSON.stringify(txt), type: "error" };
            return;
          }
          const data = await resp.json();
          modalMode.value = "view";
          modalInitialData.value = data;
          showSellModal.value = true;
        } catch (err) {
          console.error("Error fetching lista venta:", err);
          errorBanner.value = { title: "Error", description: "No se pudo cargar la lista de venta.", type: "error" };
        } finally {
          modalLoading.value = false;
        }
      })();
    };
    const handleNewVentas = async (ventasPayload) => {
      let items = [];
      let nota = "";
      let forma = "";
      if (Array.isArray(ventasPayload)) {
        items = ventasPayload;
      } else if (ventasPayload && ventasPayload.items) {
        items = ventasPayload.items;
        nota = ventasPayload.nota || "";
        forma = ventasPayload.formaPago || "";
      }
      const count = items.length;
      if (ventasPayload && ventasPayload.mode === "edit") {
        errorBanner.value = { title: "Ventas actualizadas", description: `${count} venta(s) actualizada(s). ${nota ? "Nota: " + nota : ""} ${forma ? "Forma: " + forma : ""}`, type: "success" };
      } else {
        errorBanner.value = { title: "Ventas creadas", description: `${count} venta(s) listas. ${nota ? "Nota: " + nota : ""} ${forma ? "Forma: " + forma : ""}`, type: "success" };
      }
      await fetchItems(1, itemsPorPage.value);
      modalMode.value = "create";
      modalInitialData.value = null;
      showSellModal.value = false;
    };
    function openComprobanteFromModal(data) {
      comprobanteData.value = data || null;
      showComprobante.value = true;
    }
    async function confirmDeleteVenta() {
      showConfirmBanner.value = false;
      if (!ventaAEliminar.value) return;
      try {
        isLoading.value = true;
        const token = localStorage.getItem("token");
        const raw = ventaAEliminar.value.raw || {};
        const mode = ventaAEliminar.value.mode || "normal";
        const endpoint = mode === "normal" ? "ListaVenta" : "Venta";
        let idToDelete = null;
        if (mode === "normal") idToDelete = raw.id_lista_venta || raw.id_lista_venta;
        else idToDelete = raw.id_venta || raw.id_venta;
        if (!idToDelete) {
          errorBanner.value = { title: "Error", description: "ID no encontrado para eliminar.", type: "error" };
          return;
        }
        const response = await fetch(`${config.public.backendHost}/${endpoint}/${idToDelete}`, {
          method: "DELETE",
          headers: {
            "Accept": "application/json",
            "Authorization": token
          }
        });
        if (response.status === 401) {
          errorBanner.value = { title: "Sesi\xF3n Expirada", description: "Tu sesi\xF3n ha expirado.", type: "warning" };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigateTo("/"), 2e3);
          return;
        }
        if (response.status === 403) {
          errorBanner.value = { title: "Acceso Denegado", description: "No tienes permisos.", type: "error" };
          return;
        }
        let responseData = null;
        try {
          responseData = await response.json();
        } catch (e) {
          responseData = null;
        }
        if (!response.ok) {
          let errorMessage = "Error desconocido";
          if (responseData && responseData.errors && Array.isArray(responseData.errors)) {
            errorMessage = responseData.errors.join("\n\u2022 ");
          } else if (responseData && typeof responseData.error === "string") {
            errorMessage = responseData.error;
          } else if (responseData && (responseData.message || responseData.description)) {
            errorMessage = responseData.message || responseData.description;
          } else if (responseData) {
            errorMessage = JSON.stringify(responseData);
          }
          errorBanner.value = { title: `Error ${response.status}`, description: errorMessage, type: "error" };
          return;
        }
        errorBanner.value = { title: "Eliminado", description: "Elemento eliminado correctamente.", type: "success" };
        await fetchItems(currentPage.value, itemsPorPage.value);
      } catch (err) {
        console.error("Error al eliminar:", err);
        errorBanner.value = { title: "Error", description: "Ocurri\xF3 un error al eliminar.", type: "error" };
      } finally {
        isLoading.value = false;
        ventaAEliminar.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))} data-v-f2bf4a4b>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Ventas - Contract Manager",
        description: "Lista de ventas agrupadas.",
        canonical: "/ventas"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none" data-v-f2bf4a4b>`);
        _push(ssrRenderComponent(_sfc_main$4, {
          title: errorBanner.value.title,
          description: errorBanner.value.description,
          type: errorBanner.value.type,
          onClose: ($event) => errorBanner.value = null,
          class: "pointer-events-auto"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (showConfirmBanner.value) {
        _push(`<div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto" data-v-f2bf4a4b>`);
        _push(ssrRenderComponent(_sfc_main$5, {
          title: "\xBFEst\xE1s seguro que deseas eliminar esta venta?",
          description: "Esta acci\xF3n no se puede deshacer.",
          type: "warning",
          onConfirm: confirmDeleteVenta,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0" data-v-f2bf4a4b><div class="bg-white rounded-lg shadow-md p-4" data-v-f2bf4a4b><div class="mb-4" data-v-f2bf4a4b><label class="block text-sm font-medium text-gray-700 mb-1" data-v-f2bf4a4b>Buscar por nombre de producto</label><div class="relative" data-v-f2bf4a4b><input type="text"${ssrRenderAttr("value", filters.value.nombre_producto)} placeholder="Nombre producto..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-f2bf4a4b><div class="absolute left-3 top-2.5" data-v-f2bf4a4b><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-f2bf4a4b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-f2bf4a4b></path></svg></div></div></div><div class="mb-4" data-v-f2bf4a4b><div class="relative flex w-full max-w-xs" data-v-f2bf4a4b><div class="${ssrRenderClass([viewMode.value === "normal" ? "transform translate-x-0" : "transform translate-x-full", "absolute top-0 left-0 w-1/2 h-full bg-primary rounded-lg transition-transform duration-300"])}" data-v-f2bf4a4b></div><button type="button" class="${ssrRenderClass([viewMode.value === "normal" ? "text-neutral bg-transparent" : "text-dark bg-secondary", "relative flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-10"])}"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-f2bf4a4b> Normal </button><button type="button" class="${ssrRenderClass([viewMode.value === "detallado" ? "text-neutral bg-transparent" : "text-dark bg-secondary", "relative flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 z-10"])}"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-f2bf4a4b> Detallado </button></div></div><div class="md:hidden flex justify-between items-center mb-4" data-v-f2bf4a4b><button class="flex items-center text-primary hover:brightness-90" data-v-f2bf4a4b><span class="mr-2" data-v-f2bf4a4b>Filtros adicionales</span><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([{ "rotate-180": showFilters.value }, "h-5 w-5 transform transition-transform"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-f2bf4a4b><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-f2bf4a4b></path></svg></button></div><div class="${ssrRenderClass([{ "hidden md:grid": !showFilters.value }, "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"])}" data-v-f2bf4a4b>`);
      if (viewMode.value === "normal") {
        _push(`<div data-v-f2bf4a4b><label class="block text-sm font-medium text-gray-700 mb-1" data-v-f2bf4a4b>Nota</label><input${ssrRenderAttr("value", filters.value.nota)} type="text" placeholder="Nota" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-f2bf4a4b></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div data-v-f2bf4a4b><label class="block text-sm font-medium text-gray-700 mb-1" data-v-f2bf4a4b>C\xF3digo Producto</label><input${ssrRenderAttr("value", filters.value.codigo_producto)} type="text" placeholder="C\xF3digo producto" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-f2bf4a4b></div><div class="grid grid-cols-2 gap-2" data-v-f2bf4a4b><div data-v-f2bf4a4b><label class="block text-sm font-medium text-gray-700 mb-1" data-v-f2bf4a4b>Precio cobrado min</label><input${ssrRenderAttr("value", filters.value.precio_cobrado_min)} type="number" min="0" step="0.01" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-f2bf4a4b></div><div data-v-f2bf4a4b><label class="block text-sm font-medium text-gray-700 mb-1" data-v-f2bf4a4b>Precio cobrado max</label><input${ssrRenderAttr("value", filters.value.precio_cobrado_max)} type="number" min="0" step="0.01" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-f2bf4a4b></div></div></div><div class="${ssrRenderClass([{ "hidden md:grid": !showFilters.value }, "mb-4 grid grid-cols-1 md:grid-cols-3 gap-4"])}" data-v-f2bf4a4b><div data-v-f2bf4a4b><label class="block text-sm font-medium text-gray-700 mb-1" data-v-f2bf4a4b>Fecha m\xEDnima</label><input${ssrRenderAttr("value", filters.value.fecha_hora_min)} type="date" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-f2bf4a4b></div><div data-v-f2bf4a4b><label class="block text-sm font-medium text-gray-700 mb-1" data-v-f2bf4a4b>Fecha m\xE1xima</label><input${ssrRenderAttr("value", filters.value.fecha_hora_max)} type="date" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-f2bf4a4b></div><div class="flex items-end justify-end" data-v-f2bf4a4b><button class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors" data-v-f2bf4a4b> Buscar </button></div></div></div></div><div class="w-[95%] mx-auto px-4 py-4" data-v-f2bf4a4b><div class="flex justify-between items-center mb-4" data-v-f2bf4a4b><h2 class="text-2xl font-bold" data-v-f2bf4a4b>Ventas</h2><div data-v-f2bf4a4b>`);
      if (!isInvitado.value) {
        _push(`<button class="px-3 py-1 bg-green-600 text-white rounded-md" data-v-f2bf4a4b>+ Agregar Venta</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: ventasColumns.value,
        items: itemsData.value,
        actions: isInvitado.value ? [] : ventasActions,
        "total-items": totalItems.value,
        "items-per-page": itemsPorPage.value,
        "current-page": currentPage.value,
        "is-loading": isLoading.value,
        onPageChange: handlePageChange,
        onRowClick: handleRowClick
      }, null, _parent));
      _push(`<div class="mt-4 bg-white rounded-lg shadow-md p-4 w-[95%] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4" data-v-f2bf4a4b><div class="flex flex-col md:flex-row md:items-center gap-4" data-v-f2bf4a4b><label class="text-sm font-medium text-gray-700" data-v-f2bf4a4b>Elementos por p\xE1gina:</label><div class="relative w-32" data-v-f2bf4a4b><input${ssrRenderAttr("value", itemsPorPage.value)} type="number" min="1" max="1000" list="itemsPerPageOptions" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-f2bf4a4b><datalist id="itemsPerPageOptions" data-v-f2bf4a4b><option value="10" data-v-f2bf4a4b>10</option><option value="20" data-v-f2bf4a4b>20</option><option value="50" data-v-f2bf4a4b>50</option><option value="100" data-v-f2bf4a4b>100</option><option value="200" data-v-f2bf4a4b>200</option></datalist></div></div><div class="text-sm text-gray-600" data-v-f2bf4a4b> Total: <span class="font-semibold" data-v-f2bf4a4b>${ssrInterpolate(totalItems.value)}</span> elementos </div></div>`);
      if (viewMode.value === "normal") {
        _push(`<div class="mt-6 bg-white rounded-lg shadow-md p-4 w-[95%] mx-auto" data-v-f2bf4a4b><h3 class="text-xl font-semibold mb-4" data-v-f2bf4a4b>Resumen de Totales - Reporte de las ${ssrInterpolate(itemsPorPage.value)} elementos</h3><div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center" data-v-f2bf4a4b><div class="bg-gray-100 text-gray-800 rounded p-3" data-v-f2bf4a4b><div class="text-sm font-medium" data-v-f2bf4a4b>Suma Cantidad de productos vendidos</div><div class="text-lg font-bold" data-v-f2bf4a4b>${ssrInterpolate(formatNumber((_a = paginationData.value.sumCantidad) != null ? _a : 0, 0))}</div></div><div class="bg-green-100 text-green-800 rounded p-3" data-v-f2bf4a4b><div class="text-sm font-medium" data-v-f2bf4a4b>Suma Total CUP vendido (Efectivo y Transferencia)</div><div class="text-lg font-bold" data-v-f2bf4a4b>${ssrInterpolate(formatNumber((_b = paginationData.value.sumTotalVentas) != null ? _b : 0, 2))}</div></div>`);
        if (!isVendedor.value) {
          _push(`<div class="bg-blue-100 text-blue-800 rounded p-3" data-v-f2bf4a4b><div class="text-sm font-medium" data-v-f2bf4a4b>Suma Total Costos CUP de las ventas</div><div class="text-lg font-bold" data-v-f2bf4a4b>${ssrInterpolate(formatNumber((_c = paginationData.value.sumCostoVenta) != null ? _c : 0, 2))}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!isVendedor.value) {
          _push(`<div class="bg-yellow-100 text-yellow-800 rounded p-3" data-v-f2bf4a4b><div class="text-sm font-medium" data-v-f2bf4a4b>Ganancia Total en CUP</div><div class="text-lg font-bold" data-v-f2bf4a4b>${ssrInterpolate(formatNumber(((_d = paginationData.value.sumTotalVentas) != null ? _d : 0) - ((_e = paginationData.value.sumCostoVenta) != null ? _e : 0) || 0, 2))}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-6 pt-6 border-t border-gray-300" data-v-f2bf4a4b><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-f2bf4a4b><div data-v-f2bf4a4b><h4 class="text-lg font-semibold mb-3" data-v-f2bf4a4b>Suma de Efectivo</h4><div class="grid grid-cols-1 gap-4 text-center" data-v-f2bf4a4b><div class="bg-purple-50 text-purple-800 rounded p-3" data-v-f2bf4a4b><div class="text-sm font-medium" data-v-f2bf4a4b>Total Efectivo CUP</div><div class="text-lg font-bold" data-v-f2bf4a4b>${ssrInterpolate(formatNumber((_f = paginationData.value.sumEfectivoCUP) != null ? _f : 0, 2))}</div></div><div class="bg-purple-100 text-purple-800 rounded p-3" data-v-f2bf4a4b><div class="text-sm font-medium" data-v-f2bf4a4b>Total Efectivo USD</div><div class="text-lg font-bold" data-v-f2bf4a4b>${ssrInterpolate(formatNumber((_g = paginationData.value.sumEfectivoUSD) != null ? _g : 0, 2))}</div></div></div></div><div data-v-f2bf4a4b><h4 class="text-lg font-semibold mb-3" data-v-f2bf4a4b>Suma de Transferencia</h4><div class="grid grid-cols-1 gap-4 text-center" data-v-f2bf4a4b><div class="bg-indigo-50 text-indigo-800 rounded p-3" data-v-f2bf4a4b><div class="text-sm font-medium" data-v-f2bf4a4b>Total Transferencia CUP</div><div class="text-lg font-bold" data-v-f2bf4a4b>${ssrInterpolate(formatNumber((_h = paginationData.value.sumTransferenciaCUP) != null ? _h : 0, 2))}</div></div><div class="bg-indigo-100 text-indigo-800 rounded p-3" data-v-f2bf4a4b><div class="text-sm font-medium" data-v-f2bf4a4b>Total Transferencia USD</div><div class="text-lg font-bold" data-v-f2bf4a4b>${ssrInterpolate(formatNumber((_i = paginationData.value.sumTransferenciaUSD) != null ? _i : 0, 2))}</div></div></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(VentaModal, {
        modelValue: showModal.value,
        "onUpdate:modelValue": ($event) => showModal.value = $event,
        listaVenta: selectedLista.value
      }, null, _parent));
      if (modalLoading.value) {
        _push(`<div class="fixed inset-0 z-[11000] bg-black bg-opacity-50 flex items-center justify-center" data-v-f2bf4a4b><div class="bg-white rounded p-6 flex flex-col items-center gap-4" data-v-f2bf4a4b><div class="loader-border w-12 h-12 border-4 border-primary rounded-full animate-spin" data-v-f2bf4a4b></div><div data-v-f2bf4a4b>Cargando lista de venta...</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(VentaModalSell, {
        modelValue: showSellModal.value,
        "onUpdate:modelValue": ($event) => showSellModal.value = $event,
        mode: modalMode.value,
        initialData: modalInitialData.value,
        onSubmit: handleNewVentas,
        onOpenComprobante: openComprobanteFromModal
      }, null, _parent));
      _push(ssrRenderComponent(VentaComprobante, {
        modelValue: showComprobante.value,
        "onUpdate:modelValue": ($event) => showComprobante.value = $event,
        data: comprobanteData.value
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ventas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ventas = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f2bf4a4b"]]);

export { ventas as default };
//# sourceMappingURL=ventas-B5cylw4d.mjs.map
