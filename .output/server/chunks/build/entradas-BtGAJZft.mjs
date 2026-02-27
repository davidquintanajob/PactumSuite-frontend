import { ref, computed, mergeProps, h, reactive, watch, nextTick, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, withDirectives, vModelText, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { N as Navbar } from './Navbar-B8bjDViK.mjs';
import { S as SeoMeta } from './SeoMeta-BiOiuKZ0.mjs';
import { D as DataTable } from './DataTable-CB1qJ3I1.mjs';
import { _ as _sfc_main$2 } from './MessageBanner-UgGYw58j.mjs';
import { _ as _sfc_main$5 } from './SelectSearch-DgMSQ3ZM.mjs';
import { _ as _sfc_main$4 } from './SelectSearchAPI-C4OFsj20.mjs';
import { _ as _sfc_main$3 } from './ConfirmBanner-D2jJGKTl.mjs';
import { _ as _sfc_main$6 } from './Modal-CafyytEG.mjs';
import { b as useRuntimeConfig, n as navigateTo } from './server.mjs';
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

const _sfc_main$1 = {
  __name: "EntradaModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, default: false },
    entrada: { type: Object, default: () => ({}) },
    isViewing: { type: Boolean, default: true },
    isEditing: { type: Boolean, default: false },
    // Optional: function that will be called to create the entrada.
    // Should return the created entrada object on success.
    submitHandler: { type: Function, required: false }
  },
  emits: ["update:modelValue", "submit", "success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = reactive({ id_producto: null, cantidadEntrada: null, nota: "", fecha: "", costo: null, costo_usd: null });
    const selectedProducto = ref(null);
    const errorList = ref([]);
    const isLoading = ref(false);
    const confirmVisible = ref(false);
    const confirmInfo = reactive({
      id_producto: null,
      nombre_producto: "",
      currentCosto: 0,
      currentCostoUsd: 0,
      suggestedCosto: 0,
      suggestedCostoUsd: 0,
      existingQty: 0,
      entryQty: 0
    });
    const message = ref(null);
    const contentWrapper = ref(null);
    const cambioMoneda = ref(1);
    computed(() => {
      try {
        const usuarioStr = localStorage.getItem("usuario");
        if (!usuarioStr) return false;
        const usuario = JSON.parse(usuarioStr);
        const rawRole = usuario && (usuario.rol || usuario.role || usuario.perfil && usuario.perfil.rol || usuario.profile && usuario.profile.role) ? usuario.rol || usuario.role || usuario.perfil && usuario.perfil.rol || usuario.profile && usuario.profile.role : null;
        if (!rawRole) return false;
        return String(rawRole).trim().toLowerCase() === "admin";
      } catch (e) {
        return false;
      }
    });
    const totalCUP = computed(() => {
      const q = Number(form.cantidadEntrada) || 0;
      const c = Number(form.costo) || 0;
      return (q * c).toFixed(5);
    });
    const totalUSD = computed(() => {
      const q = Number(form.cantidadEntrada) || 0;
      const cu = Number(form.costo_usd) || 0;
      return (q * cu).toFixed(5);
    });
    watch(() => props.entrada, (val) => {
      var _a, _b, _c;
      if (val && Object.keys(val).length) {
        form.id_producto = val.id_producto || ((_a = val.producto) == null ? void 0 : _a.id_producto) || null;
        form.cantidadEntrada = val.cantidadEntrada || null;
        form.nota = val.nota || "";
        form.fecha = val.fecha ? val.fecha.substring(0, 10) : "";
        form.costo = val.costo != null ? val.costo : ((_b = val.producto) == null ? void 0 : _b.costo) != null ? val.producto.costo : null;
        form.costo_usd = val.costo_usd != null ? val.costo_usd : ((_c = val.producto) == null ? void 0 : _c.costo_usd) != null ? val.producto.costo_usd : null;
        selectedProducto.value = val.producto || null;
      } else {
        form.id_producto = null;
        form.cantidadEntrada = null;
        form.nota = "";
        form.fecha = "";
        form.costo = null;
        form.costo_usd = null;
        selectedProducto.value = null;
      }
    }, { immediate: true });
    function onProductoSeleccionado(producto) {
      selectedProducto.value = producto;
      form.costo = (producto == null ? void 0 : producto.costo) != null ? producto.costo : null;
      form.costo_usd = (producto == null ? void 0 : producto.costo_usd) != null ? producto.costo_usd : null;
    }
    async function onSubmit() {
      errorList.value = [];
      if (!form.id_producto) errorList.value.push("Debe seleccionar un producto");
      if (form.cantidadEntrada == null || Number(form.cantidadEntrada) <= 0) errorList.value.push("La cantidad debe ser mayor que 0");
      if (!form.fecha) errorList.value.push("Debe seleccionar una fecha");
      if (errorList.value.length) return;
      const payload = { id_producto: form.id_producto, cantidadEntrada: Number(form.cantidadEntrada), nota: form.nota, fecha: form.fecha };
      if (form.costo !== null && form.costo !== "") {
        const c = Number(form.costo);
        if (!isNaN(c)) payload.costo = c;
      }
      if (form.costo_usd !== null && form.costo_usd !== "") {
        const cu = Number(form.costo_usd);
        if (!isNaN(cu)) payload.costo_usd = cu;
      }
      if (props.submitHandler && typeof props.submitHandler === "function") {
        try {
          isLoading.value = true;
          const created = await props.submitHandler(payload);
          if (created && created.id_producto) {
            await handlePostCreate(created);
          } else {
            console.warn("ERROR: La entrada creada no tiene id_producto. created:", created, "payload:", payload);
            errorList.value.push("Error: La entrada fue creada pero sin ID de producto. La confirmaci\xF3n del costo fue cancelada.");
            isLoading.value = false;
          }
        } catch (e) {
          console.error("Error en onSubmit:", e);
          errorList.value.push(e.message || "Error al crear la entrada");
          isLoading.value = false;
        }
        return;
      }
      emit("submit", payload);
    }
    async function handlePostCreate(createdEntrada) {
      const id = createdEntrada.id_producto || form.id_producto;
      if (!id) {
        errorList.value.push("No se pudo obtener el ID del producto. La entrada fue creada pero sin c\xE1lculo de costo promedio.");
        isLoading.value = false;
        return;
      }
      const config = useRuntimeConfig();
      const token = localStorage.getItem("token");
      const tryUrls = [
        `${config.public.backendHost}/Producto/getProducto/${id}`,
        `${config.public.backendHost}/Producto/${id}`,
        `${config.public.backendHost}/Producto/Get/${id}`
      ];
      let prod = null;
      for (const u of tryUrls) {
        try {
          const res = await fetch(u, { method: "GET", headers: { Authorization: token, Accept: "application/json" } });
          if (res.ok) {
            const data = await res.json();
            prod = data && data.data ? data.data : data;
            if (prod) break;
          } else {
            console.log(`Respuesta no ok: ${res.status}`);
          }
        } catch (e) {
          console.log(`Error en obtener producto desde ${u}:`, e);
        }
      }
      if (!prod) {
        errorList.value.push("No se pudo obtener los datos del producto. Verifique la conexi\xF3n e intente nuevamente o cierre este modal.");
        isLoading.value = false;
        return;
      }
      const entryQty = Number(createdEntrada.cantidadEntrada != null ? createdEntrada.cantidadEntrada : form.cantidadEntrada) || 0;
      const existingQty = (Number(prod.cantidadExistencia) || 0) - entryQty;
      const existingCosto = Number(prod.costo) || 0;
      const existingCostoUsd = Number(prod.costo_usd) || 0;
      const entryCosto = Number(createdEntrada.costo != null ? createdEntrada.costo : form.costo) || 0;
      const entryCostoUsd = Number(createdEntrada.costo_usd != null ? createdEntrada.costo_usd : form.costo_usd) || 0;
      const combinedQty = existingQty + entryQty;
      const suggestedCosto = combinedQty > 0 ? (existingQty * existingCosto + entryQty * entryCosto) / combinedQty : entryCosto;
      const suggestedCostoUsd = combinedQty > 0 ? (existingQty * existingCostoUsd + entryQty * entryCostoUsd) / combinedQty : entryCostoUsd;
      confirmInfo.id_producto = id;
      confirmInfo.nombre_producto = prod.nombre || `Producto ${id}`;
      confirmInfo.currentCosto = existingCosto;
      confirmInfo.currentCostoUsd = existingCostoUsd;
      confirmInfo.suggestedCosto = suggestedCosto;
      confirmInfo.suggestedCostoUsd = suggestedCostoUsd;
      confirmInfo.existingQty = existingQty;
      confirmInfo.entryQty = entryQty;
      confirmVisible.value = true;
      isLoading.value = false;
    }
    watch(confirmVisible, async (val) => {
      if (val) {
        await nextTick();
        try {
          const wrapper = contentWrapper.value;
          const scrollContainer = wrapper && wrapper.parentElement ? wrapper.parentElement : null;
          if (scrollContainer && typeof scrollContainer.scrollTo === "function") {
            scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
          } else if (wrapper && typeof wrapper.scrollIntoView === "function") {
            wrapper.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } catch (e) {
        }
      }
    });
    function onRequestClose() {
      if (confirmVisible.value) return;
      emit("update:modelValue", false);
    }
    async function applyProductUpdate() {
      const id = confirmInfo.id_producto;
      if (!id) return;
      const config = useRuntimeConfig();
      const token = localStorage.getItem("token");
      const body = {
        costo: Number(confirmInfo.suggestedCosto).toFixed(5),
        costo_usd: Number(confirmInfo.suggestedCostoUsd).toFixed(5)
      };
      try {
        isLoading.value = true;
        const url = `${config.public.backendHost}/Producto/updateProducto/${id}`;
        const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: token, Accept: "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) {
          message.value = { title: "Actualizaci\xF3n fallida", description: "No se pudo actualizar el costo del producto.", type: "warning" };
        } else {
          message.value = { title: "Producto actualizado", description: "Se actualiz\xF3 el costo del producto con el nuevo costo promedio.", type: "success" };
        }
      } catch (e) {
        message.value = { title: "Error", description: e.message || "Error al actualizar producto", type: "error" };
      } finally {
        confirmVisible.value = false;
        isLoading.value = false;
        emit("success", { title: "Entrada creada", description: "Entrada agregada con \xE9xito" });
        emit("update:modelValue", false);
      }
    }
    function closeConfirmNoUpdate() {
      confirmVisible.value = false;
      emit("success", { title: "Entrada creada", description: "Entrada agregada con \xE9xito" });
      emit("update:modelValue", false);
    }
    watch(() => props.modelValue, (open) => {
      if (open) {
        try {
          const cfg = localStorage.getItem("config");
          if (cfg) {
            const parsed = JSON.parse(cfg);
            if (parsed && parsed.cambio_moneda) cambioMoneda.value = Number(parsed.cambio_moneda) || 1;
          }
        } catch (e) {
          cambioMoneda.value = 1;
        }
        if (!props.isEditing && !props.isViewing) {
          form.id_producto = null;
          form.cantidadEntrada = null;
          form.nota = "";
          form.fecha = "";
          form.costo = null;
          form.costo_usd = null;
          selectedProducto.value = null;
          errorList.value = [];
        }
      } else {
        errorList.value = [];
      }
    }, { immediate: false });
    function onCostoInput(e) {
      const val = e.target.value;
      form.costo = val;
      if (!val) return;
      const n = Number(val);
      if (isNaN(n) || !cambioMoneda.value) return;
      form.costo_usd = (n / cambioMoneda.value).toFixed(5);
    }
    function onCostoUsdInput(e) {
      const val = e.target.value;
      form.costo_usd = val;
      if (!val) return;
      const n = Number(val);
      if (isNaN(n) || !cambioMoneda.value) return;
      form.costo = (n * cambioMoneda.value).toFixed(5);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$6, mergeProps({
        show: __props.modelValue,
        onClose: onRequestClose,
        size: "2xl"
      }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold text-gray-900"${_scopeId}>${ssrInterpolate(__props.isViewing ? "Detalles de la Entrada" : __props.isEditing ? "Editar Entrada" : "Nueva Entrada")}</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold text-gray-900" }, toDisplayString(__props.isViewing ? "Detalles de la Entrada" : __props.isEditing ? "Editar Entrada" : "Nueva Entrada"), 1)
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J;
          if (_push2) {
            _push2(`<div class="${ssrRenderClass(["transition-opacity", isLoading.value && "pointer-events-none opacity-50"])}"${_scopeId}>`);
            if (isLoading.value) {
              _push2(`<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"${_scopeId}><div class="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4"${_scopeId}><div class="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"${_scopeId}></div><p class="text-gray-700 font-medium"${_scopeId}>Procesando, espere...</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (message.value) {
              _push2(`<div class="mb-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                title: message.value.title,
                description: message.value.description,
                type: message.value.type,
                onClose: ($event) => message.value = null
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (confirmVisible.value) {
              _push2(`<div class="mb-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$3, {
                title: `\xBFActualizar costo del producto ${confirmInfo.nombre_producto}?`,
                description: `Costo actual: CUP ${Number(confirmInfo.currentCosto).toFixed(5)} - USD ${Number(confirmInfo.currentCostoUsd).toFixed(5)}.
Costo sugerido: CUP ${Number(confirmInfo.suggestedCosto).toFixed(5)} - USD ${Number(confirmInfo.suggestedCostoUsd).toFixed(5)}.
Existencia actual: ${confirmInfo.existingQty}, entrada: ${confirmInfo.entryQty}.`,
                icon: "",
                type: "warning",
                onConfirm: applyProductUpdate,
                onClose: closeConfirmNoUpdate
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.isViewing) {
              _push2(`<div class="space-y-6"${_scopeId}><div class="bg-gray-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n del Producto</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Nombre</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_a = __props.entrada.producto) == null ? void 0 : _a.nombre) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Unidad de Medida</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_b = __props.entrada.producto) == null ? void 0 : _b.unidadMedida) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Tipo de Producto</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_c = __props.entrada.producto) == null ? void 0 : _c.tipoProducto) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Precio Unitario</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>$${ssrInterpolate(Number(((_d = __props.entrada.producto) == null ? void 0 : _d.precio) || 0).toFixed(5))}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Costo USD</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>$${ssrInterpolate(Number(((_e = __props.entrada.producto) == null ? void 0 : _e.costo_usd) || 0).toFixed(5))}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Existencia Actual</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_f = __props.entrada.producto) == null ? void 0 : _f.cantidadExistencia) || 0)}</p></div></div><div class="mt-4"${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Nota del Producto</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_g = __props.entrada.producto) == null ? void 0 : _g.nota) || "Sin nota")}</p></div></div><div class="bg-blue-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n de la Entrada</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Cantidad Entrada</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.entrada.cantidadEntrada)}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Costo</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>$${ssrInterpolate(Number(__props.entrada.costo || 0).toFixed(5))}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Costo USD</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>$${ssrInterpolate(Number(__props.entrada.costo_usd || ((_h = __props.entrada.producto) == null ? void 0 : _h.costo_usd) || 0).toFixed(5))}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Total</label><p class="mt-1 text-sm font-semibold text-gray-900"${_scopeId}>$${ssrInterpolate((Number(__props.entrada.cantidadEntrada) * Number(((_i = __props.entrada.producto) == null ? void 0 : _i.precio) || 0)).toFixed(5))}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Fecha</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.entrada.fecha ? new Date(__props.entrada.fecha).toLocaleDateString("es-ES") : "N/A")}</p></div></div><div class="mt-4"${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Nota de la Entrada</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.entrada.nota || "Sin nota")}</p></div></div>`);
              if (__props.entrada.contrato) {
                _push2(`<div class="bg-green-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n del Contrato</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>N\xFAmero Consecutivo</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_j = __props.entrada.contrato) == null ? void 0 : _j.num_consecutivo) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Cliente o Proveedor</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_k = __props.entrada.contrato) == null ? void 0 : _k.ClienteOProveedor) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Fecha Inicio</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_l = __props.entrada.contrato) == null ? void 0 : _l.fecha_inicio) ? new Date(__props.entrada.contrato.fecha_inicio).toLocaleDateString("es-ES") : "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Fecha Fin</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_m = __props.entrada.contrato) == null ? void 0 : _m.fecha_fin) ? new Date(__props.entrada.contrato.fecha_fin).toLocaleDateString("es-ES") : "N/A")}</p></div></div><div class="mt-4"${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Nota del Contrato</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_n = __props.entrada.contrato) == null ? void 0 : _n.nota) || "Sin nota")}</p></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.entrada.factura) {
                _push2(`<div class="bg-yellow-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n de Factura</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>N\xFAmero Consecutivo</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_o = __props.entrada.factura) == null ? void 0 : _o.num_consecutivo) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Estado</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_p = __props.entrada.factura) == null ? void 0 : _p.estado) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Fecha</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_q = __props.entrada.factura) == null ? void 0 : _q.fecha) ? new Date(__props.entrada.factura.fecha).toLocaleDateString("es-ES") : "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Importe Total</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>$${ssrInterpolate(Number(((_r = __props.entrada.factura) == null ? void 0 : _r.suma_general) || 0).toFixed(5))}</p></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="bg-gray-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n del Sistema</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Creado</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.entrada.createdAt ? new Date(__props.entrada.createdAt).toLocaleString("es-ES") : "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>\xDAltima Actualizaci\xF3n</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.entrada.updatedAt ? new Date(__props.entrada.updatedAt).toLocaleString("es-ES") : "N/A")}</p></div></div></div></div>`);
            } else {
              _push2(`<div class="space-y-6"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Producto</label>`);
              _push2(ssrRenderComponent(_sfc_main$4, {
                modelValue: form.id_producto,
                "onUpdate:modelValue": ($event) => form.id_producto = $event,
                endpoint: "/Producto/filterProductos/1/10",
                method: "POST",
                "search-key": "nombre",
                "label-key": "nombre",
                "value-key": "id_producto",
                placeholder: "Buscar producto...",
                onProductoSeleccionado
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Fecha</label><input type="date"${ssrRenderAttr("value", form.fecha)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Costo</label><input type="number"${ssrRenderAttr("step", "any")}${ssrRenderAttr("value", form.costo)} placeholder="Costo..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Costo USD</label><input type="number"${ssrRenderAttr("step", "any")}${ssrRenderAttr("value", form.costo_usd)} placeholder="Costo USD..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Cantidad</label><input type="number"${ssrRenderAttr("value", form.cantidadEntrada)} min="0" step="any" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Costos * Cantidad</label><input type="text" readonly${ssrRenderAttr("value", `CUP: ${totalCUP.value} - USD: ${totalUSD.value}`)} class="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700"${_scopeId}></div><div class="md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Nota</label><input type="text"${ssrRenderAttr("value", form.nota)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nota..."${_scopeId}></div></div>`);
              if (selectedProducto.value) {
                _push2(`<div class="bg-gray-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n del Producto</h4><div class="grid grid-cols-1 md:grid-cols-3 gap-4"${_scopeId}><div${_scopeId}><div class="text-sm text-gray-600"${_scopeId}>Existencia</div><div class="text-sm font-semibold"${_scopeId}>${ssrInterpolate(selectedProducto.value.cantidadExistencia || 0)}</div></div><div${_scopeId}><div class="text-sm text-gray-600"${_scopeId}>Unidad</div><div class="text-sm font-semibold"${_scopeId}>${ssrInterpolate(selectedProducto.value.unidadMedida)}</div></div><div${_scopeId}><div class="text-sm text-gray-600"${_scopeId}>Tipo</div><div class="text-sm font-semibold"${_scopeId}>${ssrInterpolate(selectedProducto.value.tipoProducto)}</div></div><div${_scopeId}><div class="text-sm text-gray-600"${_scopeId}>Precio</div><div class="text-sm font-semibold"${_scopeId}>${ssrInterpolate(Number(selectedProducto.value.precio || 0).toFixed(5))}</div></div><div${_scopeId}><div class="text-sm text-gray-600"${_scopeId}>Costo</div><div class="text-sm font-semibold"${_scopeId}>${ssrInterpolate(Number(selectedProducto.value.costo || 0).toFixed(5))}</div></div><div${_scopeId}><div class="text-sm text-gray-600"${_scopeId}>Costo USD</div><div class="text-sm font-semibold"${_scopeId}>${ssrInterpolate(Number(selectedProducto.value.costo_usd || 0).toFixed(5))}</div></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"${_scopeId}><div${_scopeId}><div class="text-sm text-gray-600"${_scopeId}>Precio \xD7 Cantidad</div><div class="text-sm font-semibold"${_scopeId}>${ssrInterpolate((Number(selectedProducto.value.precio || 0) * Number(form.cantidadEntrada || 0)).toFixed(5))}</div></div><div${_scopeId}><div class="text-sm text-gray-600"${_scopeId}>Costo \xD7 Cantidad</div><div class="text-sm font-semibold"${_scopeId}>${ssrInterpolate((Number(selectedProducto.value.costo || 0) * Number(form.cantidadEntrada || 0)).toFixed(5))}</div></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (errorList.value.length) {
                _push2(`<div class="bg-red-50 border border-red-200 text-red-700 p-3 rounded"${_scopeId}><!--[-->`);
                ssrRenderList(errorList.value, (e, idx) => {
                  _push2(`<div${_scopeId}>${ssrInterpolate(e)}</div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                ref_key: "contentWrapper",
                ref: contentWrapper,
                class: ["transition-opacity", isLoading.value && "pointer-events-none opacity-50"]
              }, [
                isLoading.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
                }, [
                  createVNode("div", { class: "bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4" }, [
                    createVNode("div", { class: "w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" }),
                    createVNode("p", { class: "text-gray-700 font-medium" }, "Procesando, espere...")
                  ])
                ])) : createCommentVNode("", true),
                message.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mb-4"
                }, [
                  createVNode(_sfc_main$2, {
                    title: message.value.title,
                    description: message.value.description,
                    type: message.value.type,
                    onClose: ($event) => message.value = null
                  }, null, 8, ["title", "description", "type", "onClose"])
                ])) : createCommentVNode("", true),
                confirmVisible.value ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mb-4"
                }, [
                  createVNode(_sfc_main$3, {
                    title: `\xBFActualizar costo del producto ${confirmInfo.nombre_producto}?`,
                    description: `Costo actual: CUP ${Number(confirmInfo.currentCosto).toFixed(5)} - USD ${Number(confirmInfo.currentCostoUsd).toFixed(5)}.
Costo sugerido: CUP ${Number(confirmInfo.suggestedCosto).toFixed(5)} - USD ${Number(confirmInfo.suggestedCostoUsd).toFixed(5)}.
Existencia actual: ${confirmInfo.existingQty}, entrada: ${confirmInfo.entryQty}.`,
                    icon: "",
                    type: "warning",
                    onConfirm: applyProductUpdate,
                    onClose: closeConfirmNoUpdate
                  }, null, 8, ["title", "description"])
                ])) : createCommentVNode("", true),
                __props.isViewing ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "space-y-6"
                }, [
                  createVNode("div", { class: "bg-gray-50 rounded-lg p-4" }, [
                    createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n del Producto"),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Nombre"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_s = __props.entrada.producto) == null ? void 0 : _s.nombre) || "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Unidad de Medida"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_t = __props.entrada.producto) == null ? void 0 : _t.unidadMedida) || "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Tipo de Producto"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_u = __props.entrada.producto) == null ? void 0 : _u.tipoProducto) || "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Precio Unitario"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, "$" + toDisplayString(Number(((_v = __props.entrada.producto) == null ? void 0 : _v.precio) || 0).toFixed(5)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Costo USD"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, "$" + toDisplayString(Number(((_w = __props.entrada.producto) == null ? void 0 : _w.costo_usd) || 0).toFixed(5)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Existencia Actual"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_x = __props.entrada.producto) == null ? void 0 : _x.cantidadExistencia) || 0), 1)
                      ])
                    ]),
                    createVNode("div", { class: "mt-4" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Nota del Producto"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_y = __props.entrada.producto) == null ? void 0 : _y.nota) || "Sin nota"), 1)
                    ])
                  ]),
                  createVNode("div", { class: "bg-blue-50 rounded-lg p-4" }, [
                    createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n de la Entrada"),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Cantidad Entrada"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.entrada.cantidadEntrada), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Costo"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, "$" + toDisplayString(Number(__props.entrada.costo || 0).toFixed(5)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Costo USD"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, "$" + toDisplayString(Number(__props.entrada.costo_usd || ((_z = __props.entrada.producto) == null ? void 0 : _z.costo_usd) || 0).toFixed(5)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Total"),
                        createVNode("p", { class: "mt-1 text-sm font-semibold text-gray-900" }, "$" + toDisplayString((Number(__props.entrada.cantidadEntrada) * Number(((_A = __props.entrada.producto) == null ? void 0 : _A.precio) || 0)).toFixed(5)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Fecha"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.entrada.fecha ? new Date(__props.entrada.fecha).toLocaleDateString("es-ES") : "N/A"), 1)
                      ])
                    ]),
                    createVNode("div", { class: "mt-4" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Nota de la Entrada"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.entrada.nota || "Sin nota"), 1)
                    ])
                  ]),
                  __props.entrada.contrato ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bg-green-50 rounded-lg p-4"
                  }, [
                    createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n del Contrato"),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "N\xFAmero Consecutivo"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_B = __props.entrada.contrato) == null ? void 0 : _B.num_consecutivo) || "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Cliente o Proveedor"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_C = __props.entrada.contrato) == null ? void 0 : _C.ClienteOProveedor) || "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Fecha Inicio"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_D = __props.entrada.contrato) == null ? void 0 : _D.fecha_inicio) ? new Date(__props.entrada.contrato.fecha_inicio).toLocaleDateString("es-ES") : "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Fecha Fin"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_E = __props.entrada.contrato) == null ? void 0 : _E.fecha_fin) ? new Date(__props.entrada.contrato.fecha_fin).toLocaleDateString("es-ES") : "N/A"), 1)
                      ])
                    ]),
                    createVNode("div", { class: "mt-4" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Nota del Contrato"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_F = __props.entrada.contrato) == null ? void 0 : _F.nota) || "Sin nota"), 1)
                    ])
                  ])) : createCommentVNode("", true),
                  __props.entrada.factura ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "bg-yellow-50 rounded-lg p-4"
                  }, [
                    createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n de Factura"),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "N\xFAmero Consecutivo"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_G = __props.entrada.factura) == null ? void 0 : _G.num_consecutivo) || "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Estado"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_H = __props.entrada.factura) == null ? void 0 : _H.estado) || "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Fecha"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_I = __props.entrada.factura) == null ? void 0 : _I.fecha) ? new Date(__props.entrada.factura.fecha).toLocaleDateString("es-ES") : "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Importe Total"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, "$" + toDisplayString(Number(((_J = __props.entrada.factura) == null ? void 0 : _J.suma_general) || 0).toFixed(5)), 1)
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "bg-gray-50 rounded-lg p-4" }, [
                    createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n del Sistema"),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Creado"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.entrada.createdAt ? new Date(__props.entrada.createdAt).toLocaleString("es-ES") : "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "\xDAltima Actualizaci\xF3n"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.entrada.updatedAt ? new Date(__props.entrada.updatedAt).toLocaleString("es-ES") : "N/A"), 1)
                      ])
                    ])
                  ])
                ])) : (openBlock(), createBlock("div", {
                  key: 4,
                  class: "space-y-6"
                }, [
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Producto"),
                      createVNode(_sfc_main$4, {
                        modelValue: form.id_producto,
                        "onUpdate:modelValue": ($event) => form.id_producto = $event,
                        endpoint: "/Producto/filterProductos/1/10",
                        method: "POST",
                        "search-key": "nombre",
                        "label-key": "nombre",
                        "value-key": "id_producto",
                        placeholder: "Buscar producto...",
                        onProductoSeleccionado
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Fecha"),
                      withDirectives(createVNode("input", {
                        type: "date",
                        "onUpdate:modelValue": ($event) => form.fecha = $event,
                        class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.fecha]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Costo"),
                      createVNode("input", {
                        type: "number",
                        step: "any",
                        value: form.costo,
                        onInput: onCostoInput,
                        placeholder: "Costo...",
                        class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      }, null, 40, ["value"])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Costo USD"),
                      createVNode("input", {
                        type: "number",
                        step: "any",
                        value: form.costo_usd,
                        onInput: onCostoUsdInput,
                        placeholder: "Costo USD...",
                        class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      }, null, 40, ["value"])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Cantidad"),
                      withDirectives(createVNode("input", {
                        type: "number",
                        "onUpdate:modelValue": ($event) => form.cantidadEntrada = $event,
                        min: "0",
                        step: "any",
                        class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [
                          vModelText,
                          form.cantidadEntrada,
                          void 0,
                          { number: true }
                        ]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Costos * Cantidad"),
                      createVNode("input", {
                        type: "text",
                        readonly: "",
                        value: `CUP: ${totalCUP.value} - USD: ${totalUSD.value}`,
                        class: "w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700"
                      }, null, 8, ["value"])
                    ]),
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Nota"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => form.nota = $event,
                        class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary",
                        placeholder: "Nota..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.nota]
                      ])
                    ])
                  ]),
                  selectedProducto.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bg-gray-50 rounded-lg p-4"
                  }, [
                    createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n del Producto"),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm text-gray-600" }, "Existencia"),
                        createVNode("div", { class: "text-sm font-semibold" }, toDisplayString(selectedProducto.value.cantidadExistencia || 0), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm text-gray-600" }, "Unidad"),
                        createVNode("div", { class: "text-sm font-semibold" }, toDisplayString(selectedProducto.value.unidadMedida), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm text-gray-600" }, "Tipo"),
                        createVNode("div", { class: "text-sm font-semibold" }, toDisplayString(selectedProducto.value.tipoProducto), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm text-gray-600" }, "Precio"),
                        createVNode("div", { class: "text-sm font-semibold" }, toDisplayString(Number(selectedProducto.value.precio || 0).toFixed(5)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm text-gray-600" }, "Costo"),
                        createVNode("div", { class: "text-sm font-semibold" }, toDisplayString(Number(selectedProducto.value.costo || 0).toFixed(5)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm text-gray-600" }, "Costo USD"),
                        createVNode("div", { class: "text-sm font-semibold" }, toDisplayString(Number(selectedProducto.value.costo_usd || 0).toFixed(5)), 1)
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" }, [
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm text-gray-600" }, "Precio \xD7 Cantidad"),
                        createVNode("div", { class: "text-sm font-semibold" }, toDisplayString((Number(selectedProducto.value.precio || 0) * Number(form.cantidadEntrada || 0)).toFixed(5)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm text-gray-600" }, "Costo \xD7 Cantidad"),
                        createVNode("div", { class: "text-sm font-semibold" }, toDisplayString((Number(selectedProducto.value.costo || 0) * Number(form.cantidadEntrada || 0)).toFixed(5)), 1)
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  errorList.value.length ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "bg-red-50 border border-red-200 text-red-700 p-3 rounded"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(errorList.value, (e, idx) => {
                      return openBlock(), createBlock("div", { key: idx }, toDisplayString(e), 1);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ]))
              ], 2)
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            if (!__props.isViewing) {
              _push2(`<button${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"${_scopeId}>${ssrInterpolate(isLoading.value ? __props.isEditing ? "Guardando..." : "Creando..." : __props.isEditing ? "Guardar" : "Crear")}</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId}>Cerrar</button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-end gap-2" }, [
                !__props.isViewing ? (openBlock(), createBlock("button", {
                  key: 0,
                  onClick: onSubmit,
                  disabled: isLoading.value,
                  class: "px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                }, toDisplayString(isLoading.value ? __props.isEditing ? "Guardando..." : "Creando..." : __props.isEditing ? "Guardar" : "Crear"), 9, ["disabled"])) : createCommentVNode("", true),
                createVNode("button", {
                  onClick: onRequestClose,
                  disabled: isLoading.value,
                  class: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                }, "Cerrar", 8, ["disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EntradaModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "entradas",
  __ssrInlineRender: true,
  setup(__props) {
    const id_producto = ref("");
    const id_contrato = ref("");
    const cantidad_min = ref("");
    const cantidad_max = ref("");
    const costo_min = ref("");
    const costo_max = ref("");
    const nota = ref("");
    const fecha_desde = ref("");
    const fecha_hasta = ref("");
    const contratos = ref([]);
    const showModal = ref(false);
    const selectedEntrada = ref({});
    const isViewing = ref(false);
    const isEditing = ref(false);
    const showConfirmBanner = ref(false);
    const entradaAEliminar = ref(null);
    const entradasColumns = [
      { key: "producto.nombre", label: "Producto" },
      { key: "producto.codigo", label: "C\xF3digo" },
      { key: "producto.unidadMedida", label: "Unidad" },
      { key: "cantidadEntrada", label: "Cantidad" },
      {
        key: "costo",
        label: "Costo Unitario",
        cellRenderer: (value, item) => {
          var _a;
          const val = item.costo != null ? item.costo : ((_a = item.producto) == null ? void 0 : _a.costo) != null ? item.producto.costo : null;
          if (val == null || val === "") return "";
          const num = parseFloat(val);
          if (isNaN(num)) return val;
          return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(2)}</span>`;
        }
      },
      {
        key: "costo_usd",
        label: "Costo USD",
        cellRenderer: (value, item) => {
          var _a;
          const val = item.costo_usd != null ? item.costo_usd : ((_a = item.producto) == null ? void 0 : _a.costo_usd) != null ? item.producto.costo_usd : null;
          if (val == null || val === "") return "";
          const num = parseFloat(val);
          if (isNaN(num)) return val;
          return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(5)}</span>`;
        }
      },
      {
        key: "total",
        label: "Total",
        cellRenderer: (value, item) => {
          var _a;
          const cantidad = parseFloat(item.cantidadEntrada || 0);
          const costo = parseFloat(item.costo != null ? item.costo : ((_a = item.producto) == null ? void 0 : _a.costo) || 0);
          const total = cantidad * costo;
          return `<span class="px-2 py-1 rounded text-sm font-semibold">${total.toFixed(2)}</span>`;
        }
      },
      {
        key: "total_usd",
        label: "Total USD",
        cellRenderer: (value, item) => {
          var _a;
          const cantidad = parseFloat(item.cantidadEntrada || 0);
          const cu = parseFloat(item.costo_usd != null ? item.costo_usd : ((_a = item.producto) == null ? void 0 : _a.costo_usd) || 0);
          const total = cantidad * cu;
          if (isNaN(total)) return "";
          return `<span class="px-2 py-1 rounded text-sm font-semibold">${total.toFixed(5)}</span>`;
        }
      },
      {
        key: "fecha",
        label: "Fecha",
        cellRenderer: (value) => {
          if (!value) return "";
          const fechaFormateada = value.substring(0, 10);
          return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
        }
      }
    ];
    const visibleEntradasColumns = computed(() => {
      return entradasColumns;
    });
    const currentPage = ref(1);
    const totalItems = ref(0);
    const isLoading = ref(false);
    const itemsPorPage = ref(20);
    const itemsData = ref([]);
    const errorBanner = ref(null);
    const config = useRuntimeConfig();
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
    const deleteIcon = {
      render() {
        return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
          h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" })
        ]);
      }
    };
    const entradasActions = [
      {
        name: "Editar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" })
            ]);
          }
        },
        handler: (item) => abrirModalEntrada(item, "editar"),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90",
        visible: (item) => !item.id_contrato && !item.id_factura || item.id_contrato === "" && item.id_factura === ""
      },
      {
        name: "Eliminar",
        icon: deleteIcon,
        handler: (item) => eliminarEntrada(item),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90",
        visible: (item) => !item.id_contrato && !item.id_factura || item.id_contrato === "" && item.id_factura === ""
      }
    ];
    async function fetchEntradas(page = 1) {
      var _a, _b;
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        isLoading.value = true;
        const body = {
          nota: nota.value || "",
          fecha_desde: fecha_desde.value || "",
          fecha_hasta: fecha_hasta.value || ""
        };
        if (id_producto.value !== "") {
          body.id_producto = id_producto.value;
        }
        if (id_contrato.value !== "") {
          body.id_contrato = id_contrato.value;
        }
        if (cantidad_min.value !== "" || cantidad_max.value !== "") {
          body.cantidadEntrada = {
            min: cantidad_min.value || 0,
            max: cantidad_max.value || 0
          };
        }
        if (costo_min.value !== "" || costo_max.value !== "") {
          body.costo = {
            min: costo_min.value || 0,
            max: costo_max.value || 0
          };
        }
        console.log(body);
        const res = await fetch(`${config.public.backendHost}/entrada/filterEntradas/${page}/${itemsPorPage.value}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify(body)
        });
        if (res.status === 401) {
          errorBanner.value = {
            title: "Sesi\xF3n Expirada",
            description: "Tu sesi\xF3n ha expirado. Por favor, inicia sesi\xF3n nuevamente.",
            type: "warning"
          };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            navigateTo("/");
          }, 3e3);
          return;
        }
        if (res.status === 403) {
          errorBanner.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        const data = await res.json();
        itemsData.value = data.data || [];
        totalItems.value = ((_a = data.pagination) == null ? void 0 : _a.total) || 0;
        currentPage.value = ((_b = data.pagination) == null ? void 0 : _b.currentPage) || 1;
      } catch (err) {
        errorBanner.value = { title: "Error", description: "No se pudieron cargar las entradas", type: "error" };
      } finally {
        isLoading.value = false;
      }
    }
    function abrirModalEntrada(item, modo) {
      if ((item.id_factura || item.id_contrato) && modo !== "ver") {
        errorBanner.value = {
          title: "Entrada no editable",
          description: "Esta entrada fue creada por una factura de un proveedor, solo es editable desde la factura misma",
          type: "warning"
        };
        return;
      }
      selectedEntrada.value = { ...item };
      isViewing.value = modo === "ver";
      isEditing.value = modo === "editar";
      showModal.value = true;
    }
    function handleRowClick(item) {
      abrirModalEntrada(item, "ver");
    }
    function eliminarEntrada(item) {
      if (item.id_factura || item.id_contrato) {
        errorBanner.value = {
          title: "Entrada no eliminable",
          description: "Esta entrada fue creada por una factura de un proveedor, solo es eliminable desde la factura misma",
          type: "warning"
        };
        return;
      }
      entradaAEliminar.value = item;
      showConfirmBanner.value = true;
    }
    async function confirmDeleteEntrada() {
      if (!entradaAEliminar.value) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${config.public.backendHost}/Entrada/deleteEntrada/${entradaAEliminar.value.id_entrada}`, {
          method: "DELETE",
          headers: { "Authorization": token, "Accept": "application/json" }
        });
        if (res.status === 401) {
          errorBanner.value = {
            title: "Sesi\xF3n Expirada",
            description: "Tu sesi\xF3n ha expirado. Por favor, inicia sesi\xF3n nuevamente.",
            type: "warning"
          };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            navigateTo("/");
          }, 3e3);
          return;
        }
        if (res.status === 403) {
          errorBanner.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const msg = Array.isArray(err.errors) ? err.errors.join("\n") : err.error || "No se pudo eliminar la entrada";
          errorBanner.value = { title: "Error", description: msg, type: "error" };
          return;
        }
        errorBanner.value = { title: "Entrada eliminada", description: "Se elimin\xF3 correctamente", type: "success" };
        await fetchEntradas(currentPage.value);
      } catch (e) {
        errorBanner.value = { title: "Error", description: "Ocurri\xF3 un error al eliminar", type: "error" };
      } finally {
        showConfirmBanner.value = false;
        entradaAEliminar.value = null;
      }
    }
    async function createEntrada(payload) {
      var _a;
      try {
        const token = localStorage.getItem("token");
        const url = isEditing.value && ((_a = selectedEntrada.value) == null ? void 0 : _a.id_entrada) ? `${config.public.backendHost}/Entrada/updateEntrada/${selectedEntrada.value.id_entrada}` : `${config.public.backendHost}/Entrada/createEntrada`;
        const method = isEditing.value ? "PUT" : "POST";
        console.log("createEntrada - Enviando payload:", payload);
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.status === 401) {
          errorBanner.value = { title: "Sesi\xF3n Expirada", description: "Tu sesi\xF3n ha expirado. Por favor, inicia sesi\xF3n nuevamente.", type: "warning" };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => {
            navigateTo("/");
          }, 3e3);
          throw new Error("Sesi\xF3n Expirada");
        }
        if (res.status === 403) {
          errorBanner.value = { title: "Acceso Denegado", description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.", type: "error" };
          throw new Error("Acceso Denegado");
        }
        let responseData = null;
        try {
          responseData = await res.json();
        } catch (e) {
          responseData = null;
        }
        if (!res.ok) {
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
          errorBanner.value = { title: `Error ${res.status}`, description: errorMessage, type: "error" };
          throw new Error(errorMessage);
        }
        let created = null;
        if (responseData) {
          created = responseData && responseData.data ? responseData.data : responseData;
        } else {
          try {
            const data = await res.json();
            created = data && data.data ? data.data : data;
          } catch (e) {
            created = null;
          }
        }
        console.log("createEntrada - Response data:", responseData);
        console.log("createEntrada - Created object:", created);
        if (created && !created.id_producto && payload.id_producto) {
          console.log("Agregando id_producto al objeto creado:", payload.id_producto);
          created.id_producto = payload.id_producto;
        }
        if (!created || !created.id_producto) {
          console.warn("ADVERTENCIA: El objeto creado no tiene id_producto. created:", created, "payload:", payload);
        }
        return created;
      } catch (e) {
        console.error("Error en createEntrada:", e);
        throw e;
      }
    }
    async function onEntradaSuccess(payload) {
      try {
        errorBanner.value = { title: (payload == null ? void 0 : payload.title) || "Entrada creada", description: (payload == null ? void 0 : payload.description) || "", type: "success" };
        showModal.value = false;
        selectedEntrada.value = {};
        isEditing.value = false;
        isViewing.value = false;
        await fetchEntradas(currentPage.value);
      } catch (e) {
        console.error(e);
      }
    }
    function handlePageChange(page) {
      fetchEntradas(page);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))}>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Entradas - Pactum",
        description: "Lista y gesti\xF3n de entradas de productos.",
        canonical: "/entradas"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">`);
        _push(ssrRenderComponent(_sfc_main$2, {
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
        _push(`<div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">`);
        _push(ssrRenderComponent(_sfc_main$3, {
          title: "\xBFEst\xE1s seguro que deseas eliminar esta entrada?",
          description: "Esta acci\xF3n no se puede deshacer.",
          icon: deleteIcon,
          type: "warning",
          onConfirm: confirmDeleteEntrada,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0"><div class="bg-white rounded-lg shadow-md p-4"><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Producto por c\xF3digo</label>`);
      _push(ssrRenderComponent(_sfc_main$4, {
        modelValue: id_producto.value,
        "onUpdate:modelValue": ($event) => id_producto.value = $event,
        endpoint: "/Producto/filterProductos/1/10",
        method: "POST",
        "search-key": "codigo",
        "label-key": "codigo",
        "value-key": "id_producto",
        placeholder: "Buscar producto por c\xF3digo..."
      }, null, _parent));
      _push(`</div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Contrato por n\xFAmero consecutivo</label>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        modelValue: id_contrato.value,
        "onUpdate:modelValue": ($event) => id_contrato.value = $event,
        options: contratos.value,
        labelKey: "displayLabel",
        valueKey: "id_contrato",
        placeholder: "Buscar contrato..."
      }, null, _parent));
      _push(`</div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Cantidad m\xEDnima</label><input type="number"${ssrRenderAttr("value", cantidad_min.value)} placeholder="Cantidad min..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Cantidad m\xE1xima</label><input type="number"${ssrRenderAttr("value", cantidad_max.value)} placeholder="Cantidad max..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Costo m\xEDnimo</label><input type="number"${ssrRenderAttr("value", costo_min.value)} step="any" placeholder="Costo min..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Costo m\xE1ximo</label><input type="number"${ssrRenderAttr("value", costo_max.value)} step="any" placeholder="Costo max..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nota</label><input type="text"${ssrRenderAttr("value", nota.value)} placeholder="Nota..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label><input type="date"${ssrRenderAttr("value", fecha_desde.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label><input type="date"${ssrRenderAttr("value", fecha_hasta.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div></div><div class="flex justify-end mt-4 gap-2 flex-wrap"><button class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"> Buscar </button>`);
      if (!isInvitado.value) {
        _push(`<button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z"></path></svg> Exportar a Excel </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="w-[95%] mx-auto px-4 py-4"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Entradas</h2>`);
      if (!isInvitado.value) {
        _push(`<button class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Nueva Entrada </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: visibleEntradasColumns.value,
        items: itemsData.value,
        actions: isInvitado.value ? [] : entradasActions,
        "total-items": totalItems.value,
        "items-per-page": itemsPorPage.value,
        "current-page": currentPage.value,
        "is-loading": isLoading.value,
        onPageChange: handlePageChange,
        onRowClick: handleRowClick
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: showModal.value,
        "onUpdate:modelValue": ($event) => showModal.value = $event,
        entrada: selectedEntrada.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        submitHandler: createEntrada,
        onSuccess: onEntradaSuccess
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/entradas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=entradas-BtGAJZft.mjs.map
