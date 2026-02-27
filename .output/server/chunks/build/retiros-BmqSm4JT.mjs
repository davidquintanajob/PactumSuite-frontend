import { ref, computed, mergeProps, h, reactive, watch, nextTick, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, createTextVNode, withDirectives, vModelText, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { N as Navbar } from './Navbar-B8bjDViK.mjs';
import { S as SeoMeta } from './SeoMeta-BiOiuKZ0.mjs';
import { D as DataTable } from './DataTable-CB1qJ3I1.mjs';
import { _ as _sfc_main$2 } from './MessageBanner-UgGYw58j.mjs';
import { _ as _sfc_main$3 } from './ConfirmBanner-D2jJGKTl.mjs';
import { _ as _sfc_main$4 } from './Modal-CafyytEG.mjs';
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
  __name: "RetiroModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, default: false },
    retiro: { type: Object, default: () => ({}) },
    isViewing: { type: Boolean, default: true },
    isEditing: { type: Boolean, default: false },
    submitHandler: { type: Function, default: null }
  },
  emits: ["update:modelValue", "submit", "success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = reactive({
      cantidad_retirada_cup: null,
      cantidad_retirada_usd: null,
      cambio_moneda: null,
      motivo: "",
      fecha: "",
      id_usuario: null
    });
    const cambioMoneda = ref(null);
    const errorList = ref([]);
    const isLoading = ref(false);
    const message = ref(null);
    const contentWrapper = ref(null);
    const cambioMonedaInitialized = ref(false);
    const convertedFromCUP = computed(() => {
      if (!cambioMoneda.value || !form.cantidad_retirada_cup) return "";
      const num = Number(form.cantidad_retirada_cup) || 0;
      return (num / cambioMoneda.value).toFixed(5);
    });
    const convertedFromUSD = computed(() => {
      if (!cambioMoneda.value || !form.cantidad_retirada_usd) return "";
      const num = Number(form.cantidad_retirada_usd) || 0;
      return (num * cambioMoneda.value).toFixed(5);
    });
    const cambioMonedaDisplay = computed(() => cambioMoneda.value != null ? Number(cambioMoneda.value).toFixed(5) : "-");
    function loadCambioMoneda() {
      try {
        const cfg = localStorage.getItem("config");
        if (cfg) {
          const parsed = JSON.parse(cfg);
          if (parsed && parsed.cambio_moneda) {
            cambioMoneda.value = Number(parsed.cambio_moneda) || 1;
          } else {
            cambioMoneda.value = 1;
          }
        } else {
          cambioMoneda.value = 1;
        }
      } catch (e) {
        cambioMoneda.value = 1;
      }
      cambioMonedaInitialized.value = true;
    }
    watch(
      () => props.modelValue,
      async (open) => {
        var _a, _b;
        if (open) {
          if (!cambioMonedaInitialized.value) {
            loadCambioMoneda();
          } else {
            try {
              const cfg = localStorage.getItem("config");
              if (cfg) {
                const parsed = JSON.parse(cfg);
                if (parsed && parsed.cambio_moneda) {
                  cambioMoneda.value = Number(parsed.cambio_moneda) || 1;
                }
              }
            } catch (e) {
            }
          }
          await nextTick();
          if (!props.isEditing && !props.isViewing) {
            form.cantidad_retirada_cup = 0;
            form.cantidad_retirada_usd = 0;
            form.motivo = "";
            const today = /* @__PURE__ */ new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const dd = String(today.getDate()).padStart(2, "0");
            form.fecha = `${yyyy}-${mm}-${dd}`;
            form.cambio_moneda = cambioMoneda.value != null ? cambioMoneda.value : 1;
            errorList.value = [];
            message.value = null;
          } else {
            cambioMoneda.value = ((_a = props.retiro) == null ? void 0 : _a.cambio_moneda) || cambioMoneda.value || 1;
            form.cambio_moneda = ((_b = props.retiro) == null ? void 0 : _b.cambio_moneda) || null;
            errorList.value = [];
            message.value = null;
          }
        } else {
          errorList.value = [];
          message.value = null;
        }
      },
      { immediate: false, flush: "post" }
    );
    watch(
      () => props.retiro,
      (val) => {
        if (val && Object.keys(val).length) {
          form.cantidad_retirada_cup = val.cantidad_retirada_cup || 0;
          form.cantidad_retirada_usd = val.cantidad_retirada_usd || 0;
          form.cambio_moneda = val.cambio_moneda || null;
          cambioMoneda.value = val.cambio_moneda || cambioMoneda.value || 1;
          form.motivo = val.motivo || "";
          form.fecha = val.fecha ? val.fecha.substring(0, 10) : "";
          form.id_usuario = val.id_usuario || null;
        } else {
          form.cantidad_retirada_cup = 0;
          form.cantidad_retirada_usd = 0;
          form.cambio_moneda = null;
          cambioMoneda.value = null;
          form.motivo = "";
          const today = /* @__PURE__ */ new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          form.fecha = `${yyyy}-${mm}-${dd}`;
        }
      },
      { immediate: true, deep: true }
    );
    function onRequestClose() {
      if (isLoading.value) return;
      emit("update:modelValue", false);
    }
    async function onSubmit() {
      console.log("onSubmit called, submitHandler:", props.submitHandler);
      errorList.value = [];
      if ((!form.id_usuario || form.id_usuario === null) && false) ;
      if (form.cantidad_retirada_cup == null && form.cantidad_retirada_usd == null) {
        errorList.value.push("Debe ingresar al menos un monto en CUP o USD");
      }
      if (!form.motivo) errorList.value.push("Debe indicar un motivo");
      if (!form.fecha) errorList.value.push("Debe seleccionar una fecha");
      if (!form.id_usuario) errorList.value.push("Usuario inv\xE1lido");
      if (errorList.value.length) {
        console.log("form validation failed", errorList.value);
        return;
      }
      const payload = {
        cantidad_retirada_cup: form.cantidad_retirada_cup != null ? Number(form.cantidad_retirada_cup) : null,
        cantidad_retirada_usd: form.cantidad_retirada_usd != null ? Number(form.cantidad_retirada_usd) : null,
        cambio_moneda: cambioMoneda.value != null ? Number(cambioMoneda.value) : null,
        motivo: form.motivo,
        fecha: form.fecha,
        id_usuario: form.id_usuario
      };
      console.log("onSubmit payload", payload);
      if (props.submitHandler && typeof props.submitHandler === "function") {
        try {
          isLoading.value = true;
          const created = await props.submitHandler(payload);
          emit("success", { title: props.isEditing ? "Retiro actualizado" : "Retiro creado", description: "" });
          emit("update:modelValue", false);
        } catch (e) {
          errorList.value.push(e.message || "Error al guardar");
        } finally {
          isLoading.value = false;
        }
        return;
      }
      emit("submit", payload);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$4, mergeProps({
        show: __props.modelValue,
        onClose: onRequestClose,
        size: "2xl"
      }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold text-gray-900"${_scopeId}>${ssrInterpolate(__props.isViewing ? "Detalles del Retiro" : __props.isEditing ? "Editar Retiro" : "Nuevo Retiro")}</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold text-gray-900" }, toDisplayString(__props.isViewing ? "Detalles del Retiro" : __props.isEditing ? "Editar Retiro" : "Nuevo Retiro"), 1)
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
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
            if (__props.isViewing) {
              _push2(`<div class="space-y-6"${_scopeId}><div class="bg-blue-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n del Retiro</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Usuario</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_a = __props.retiro.usuario) == null ? void 0 : _a.nombre) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Cantidad CUP</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(Number(__props.retiro.cantidad_retirada_cup || 0).toFixed(2))}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Cantidad USD</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(Number(__props.retiro.cantidad_retirada_usd || 0).toFixed(2))}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Cambio moneda</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(Number(__props.retiro.cambio_moneda || 0).toFixed(2))}</p></div><div class="md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Motivo</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.retiro.motivo || "Sin motivo")}</p></div><div class="md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Fecha</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.retiro.fecha ? new Date(__props.retiro.fecha).toLocaleDateString("es-ES") : "N/A")}</p></div></div></div><div class="bg-gray-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-2"${_scopeId}>Conversi\xF3n de montos</h4><p class="text-sm"${_scopeId}>Tasa utilizada: <strong${_scopeId}>${ssrInterpolate(__props.retiro.cambio_moneda ? Number(__props.retiro.cambio_moneda).toFixed(2) : "-")}</strong></p><p class="text-sm"${_scopeId}>CUP \u2192 USD: <strong${_scopeId}>${ssrInterpolate(__props.retiro.cantidad_retirada_cup && __props.retiro.cambio_moneda ? (Number(__props.retiro.cantidad_retirada_cup) / Number(__props.retiro.cambio_moneda)).toFixed(5) : "")}</strong></p><p class="text-sm"${_scopeId}>USD \u2192 CUP: <strong${_scopeId}>${ssrInterpolate(__props.retiro.cantidad_retirada_usd && __props.retiro.cambio_moneda ? (Number(__props.retiro.cantidad_retirada_usd) * Number(__props.retiro.cambio_moneda)).toFixed(5) : "")}</strong></p></div><div class="bg-gray-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n del Sistema</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Creado</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.retiro.createdAt ? new Date(__props.retiro.createdAt).toLocaleString("es-ES") : "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>\xDAltima Actualizaci\xF3n</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.retiro.updatedAt ? new Date(__props.retiro.updatedAt).toLocaleString("es-ES") : "N/A")}</p></div></div></div></div>`);
            } else {
              _push2(`<div class="space-y-6"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Cantidad CUP</label><input type="number"${ssrRenderAttr("value", form.cantidad_retirada_cup)} step="any" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Cantidad en CUP..."${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Cantidad USD</label><input type="number"${ssrRenderAttr("value", form.cantidad_retirada_usd)} step="any" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Cantidad en USD..."${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Fecha</label><input type="date"${ssrRenderAttr("value", form.fecha)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}></div><div class="md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Motivo</label><input type="text"${ssrRenderAttr("value", form.motivo)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Motivo..."${_scopeId}></div><div class="md:col-span-2 bg-gray-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-2"${_scopeId}>Cambio de moneda</h4><p class="text-sm"${_scopeId}>Tasa utilizada: <strong${_scopeId}>${ssrInterpolate(cambioMonedaDisplay.value)}</strong></p><p class="text-sm"${_scopeId}>CUP \u2192 USD: <strong${_scopeId}>${ssrInterpolate(convertedFromCUP.value)}</strong></p><p class="text-sm"${_scopeId}>USD \u2192 CUP: <strong${_scopeId}>${ssrInterpolate(convertedFromUSD.value)}</strong></p></div></div>`);
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
                __props.isViewing ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "space-y-6"
                }, [
                  createVNode("div", { class: "bg-blue-50 rounded-lg p-4" }, [
                    createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n del Retiro"),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Usuario"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_b = __props.retiro.usuario) == null ? void 0 : _b.nombre) || "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Cantidad CUP"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(Number(__props.retiro.cantidad_retirada_cup || 0).toFixed(2)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Cantidad USD"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(Number(__props.retiro.cantidad_retirada_usd || 0).toFixed(2)), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Cambio moneda"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(Number(__props.retiro.cambio_moneda || 0).toFixed(2)), 1)
                      ]),
                      createVNode("div", { class: "md:col-span-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Motivo"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.retiro.motivo || "Sin motivo"), 1)
                      ]),
                      createVNode("div", { class: "md:col-span-2" }, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Fecha"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.retiro.fecha ? new Date(__props.retiro.fecha).toLocaleDateString("es-ES") : "N/A"), 1)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-gray-50 rounded-lg p-4" }, [
                    createVNode("h4", { class: "text-md font-medium text-gray-900 mb-2" }, "Conversi\xF3n de montos"),
                    createVNode("p", { class: "text-sm" }, [
                      createTextVNode("Tasa utilizada: "),
                      createVNode("strong", null, toDisplayString(__props.retiro.cambio_moneda ? Number(__props.retiro.cambio_moneda).toFixed(2) : "-"), 1)
                    ]),
                    createVNode("p", { class: "text-sm" }, [
                      createTextVNode("CUP \u2192 USD: "),
                      createVNode("strong", null, toDisplayString(__props.retiro.cantidad_retirada_cup && __props.retiro.cambio_moneda ? (Number(__props.retiro.cantidad_retirada_cup) / Number(__props.retiro.cambio_moneda)).toFixed(5) : ""), 1)
                    ]),
                    createVNode("p", { class: "text-sm" }, [
                      createTextVNode("USD \u2192 CUP: "),
                      createVNode("strong", null, toDisplayString(__props.retiro.cantidad_retirada_usd && __props.retiro.cambio_moneda ? (Number(__props.retiro.cantidad_retirada_usd) * Number(__props.retiro.cambio_moneda)).toFixed(5) : ""), 1)
                    ])
                  ]),
                  createVNode("div", { class: "bg-gray-50 rounded-lg p-4" }, [
                    createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n del Sistema"),
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Creado"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.retiro.createdAt ? new Date(__props.retiro.createdAt).toLocaleString("es-ES") : "N/A"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "\xDAltima Actualizaci\xF3n"),
                        createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.retiro.updatedAt ? new Date(__props.retiro.updatedAt).toLocaleString("es-ES") : "N/A"), 1)
                      ])
                    ])
                  ])
                ])) : (openBlock(), createBlock("div", {
                  key: 3,
                  class: "space-y-6"
                }, [
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Cantidad CUP"),
                      withDirectives(createVNode("input", {
                        type: "number",
                        "onUpdate:modelValue": ($event) => form.cantidad_retirada_cup = $event,
                        step: "any",
                        class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary",
                        placeholder: "Cantidad en CUP..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [
                          vModelText,
                          form.cantidad_retirada_cup,
                          void 0,
                          { number: true }
                        ]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Cantidad USD"),
                      withDirectives(createVNode("input", {
                        type: "number",
                        "onUpdate:modelValue": ($event) => form.cantidad_retirada_usd = $event,
                        step: "any",
                        class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary",
                        placeholder: "Cantidad en USD..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [
                          vModelText,
                          form.cantidad_retirada_usd,
                          void 0,
                          { number: true }
                        ]
                      ])
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
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Motivo"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => form.motivo = $event,
                        class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary",
                        placeholder: "Motivo..."
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.motivo]
                      ])
                    ]),
                    createVNode("div", { class: "md:col-span-2 bg-gray-50 rounded-lg p-4" }, [
                      createVNode("h4", { class: "text-md font-medium text-gray-900 mb-2" }, "Cambio de moneda"),
                      createVNode("p", { class: "text-sm" }, [
                        createTextVNode("Tasa utilizada: "),
                        createVNode("strong", null, toDisplayString(cambioMonedaDisplay.value), 1)
                      ]),
                      createVNode("p", { class: "text-sm" }, [
                        createTextVNode("CUP \u2192 USD: "),
                        createVNode("strong", null, toDisplayString(convertedFromCUP.value), 1)
                      ]),
                      createVNode("p", { class: "text-sm" }, [
                        createTextVNode("USD \u2192 CUP: "),
                        createVNode("strong", null, toDisplayString(convertedFromUSD.value), 1)
                      ])
                    ])
                  ]),
                  errorList.value.length ? (openBlock(), createBlock("div", {
                    key: 0,
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
            _push2(`<button${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId}> Cerrar </button></div>`);
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
                }, " Cerrar ", 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RetiroModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const metricsTotalSteps = 5;
const _sfc_main = {
  __name: "retiros",
  __ssrInlineRender: true,
  setup(__props) {
    const motivo = ref("");
    const fecha_desde = ref("");
    const fecha_hasta = ref("");
    const showModal = ref(false);
    const selectedRetiro = ref({});
    const isViewing = ref(false);
    const isEditing = ref(false);
    const showConfirmBanner = ref(false);
    const retiroAEliminar = ref(null);
    const RetirosColumns = [
      { key: "usuario.nombre", label: "Usuario" },
      {
        key: "cantidad_retirada_cup",
        label: "CUP",
        cellRenderer: (value) => {
          if (value == null || value === "") return "";
          const num = parseFloat(value);
          if (isNaN(num)) return value;
          return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(2)}</span>`;
        }
      },
      {
        key: "cantidad_retirada_usd",
        label: "USD",
        cellRenderer: (value) => {
          if (value == null || value === "") return "";
          const num = parseFloat(value);
          if (isNaN(num)) return value;
          return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(2)}</span>`;
        }
      },
      { key: "motivo", label: "Motivo" },
      {
        key: "fecha",
        label: "Fecha",
        cellRenderer: (value) => {
          if (!value) return "";
          return `<span class="px-2 py-1 rounded text-sm">${value.substring(0, 10)}</span>`;
        }
      }
    ];
    const visibleRetirosColumns = computed(() => RetirosColumns);
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
    const ventasTotal = ref(0);
    const salidasTotal = ref(0);
    const costoVentasTotal = ref(0);
    const gananciaCUPVentasBase = ref(0);
    const gananciaUSDVentasBase = ref(0);
    ref(0);
    ref(0);
    const isMetricsLoading = ref(false);
    const metricsCompleted = ref(0);
    const metricsError = ref(false);
    const metricsErrorMessage = ref("");
    const gananciaResumen = computed(() => {
      return (ventasTotal.value || 0) - (costoVentasTotal.value || 0) - (salidasTotal.value || 0);
    });
    const gananciaCUPVentas = computed(() => {
      return (gananciaCUPVentasBase.value || 0) - retirosCUPFilteredTotal.value;
    });
    const gananciaUSDVentas = computed(() => {
      return (gananciaUSDVentasBase.value || 0) - retirosUSDFilteredTotal.value;
    });
    const retirosCUPFilteredTotal = computed(() => {
      return (itemsData.value || []).reduce((sum, item) => sum + safeNumLocal(item.cantidad_retirada_cup), 0);
    });
    const retirosUSDFilteredTotal = computed(() => {
      return (itemsData.value || []).reduce((sum, item) => sum + safeNumLocal(item.cantidad_retirada_usd), 0);
    });
    const metricsProgressPercent = computed(() => {
      return Math.min(100, Math.round(metricsCompleted.value / metricsTotalSteps * 100));
    });
    function safeNumLocal(v) {
      if (v === null || v === void 0 || v === "") return 0;
      const n = Number(v);
      return isNaN(n) ? 0 : n;
    }
    const deleteIcon = {
      render() {
        return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
          h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" })
        ]);
      }
    };
    const retirosActions = [
      {
        name: "Editar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" })
            ]);
          }
        },
        handler: (item) => abrirModalRetiro(item, "editar"),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90"
      },
      {
        name: "Eliminar",
        icon: deleteIcon,
        handler: (item) => eliminarRetiro(item),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90"
      }
    ];
    async function fetchRetiros(page = 1) {
      var _a, _b;
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        isLoading.value = true;
        const body = {};
        if (motivo.value) body.motivo = motivo.value;
        if (fecha_desde.value || fecha_hasta.value) {
          body.fecha = {};
          if (fecha_desde.value) body.fecha.inicio = fecha_desde.value;
          if (fecha_hasta.value) body.fecha.fin = fecha_hasta.value;
        }
        const res = await fetch(`${config.public.backendHost}/Retiro/filterRetiros/null/null`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": token },
          body: JSON.stringify(body)
        });
        if (res.status === 401) {
          errorBanner.value = { title: "Sesi\xF3n Expirada", description: "Tu sesi\xF3n ha expirado.", type: "warning" };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigateTo("/"), 3e3);
          return;
        }
        if (res.status === 403) {
          errorBanner.value = { title: "Acceso Denegado", description: "No tienes permisos.", type: "error" };
          return;
        }
        const data = await res.json();
        itemsData.value = data.data || [];
        totalItems.value = ((_a = data.pagination) == null ? void 0 : _a.total) || 0;
        currentPage.value = ((_b = data.pagination) == null ? void 0 : _b.currentPage) || 1;
      } catch (err) {
        errorBanner.value = { title: "Error", description: "No se pudieron cargar los retiros", type: "error" };
      } finally {
        isLoading.value = false;
      }
    }
    function abrirModalRetiro(item, modo) {
      selectedRetiro.value = { ...item };
      isViewing.value = modo === "ver";
      isEditing.value = modo === "editar";
      showModal.value = true;
    }
    function handleRowClick(item) {
      abrirModalRetiro(item, "ver");
    }
    function eliminarRetiro(item) {
      retiroAEliminar.value = item;
      showConfirmBanner.value = true;
    }
    async function confirmDeleteRetiro() {
      if (!retiroAEliminar.value) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${config.public.backendHost}/Retiro/deleteRetiro/${retiroAEliminar.value.id_retiro}`, {
          method: "DELETE",
          headers: { Authorization: token, Accept: "application/json" }
        });
        if (res.status === 401) {
          errorBanner.value = { title: "Sesi\xF3n Expirada", description: "Tu sesi\xF3n ha expirado.", type: "warning" };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigateTo("/"), 3e3);
          return;
        }
        let responseData = null;
        try {
          responseData = await res.json();
        } catch {
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
          return;
        }
        errorBanner.value = { title: "Retiro eliminado", description: "Se elimin\xF3 correctamente", type: "success" };
        await fetchRetiros(currentPage.value);
      } catch (e) {
        errorBanner.value = { title: "Error", description: "Ocurri\xF3 un error al eliminar", type: "error" };
      } finally {
        showConfirmBanner.value = false;
        retiroAEliminar.value = null;
      }
    }
    async function createOrUpdateRetiro(payload) {
      var _a;
      try {
        const token = localStorage.getItem("token");
        const url = isEditing.value && ((_a = selectedRetiro.value) == null ? void 0 : _a.id_retiro) ? `${config.public.backendHost}/Retiro/updateRetiro/${selectedRetiro.value.id_retiro}` : `${config.public.backendHost}/Retiro/createRetiro`;
        const method = isEditing.value ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.status === 401) {
          errorBanner.value = { title: "Sesi\xF3n Expirada", description: "Tu sesi\xF3n ha expirado.", type: "warning" };
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigateTo("/"), 3e3);
          throw new Error("Sesi\xF3n expirada");
        }
        if (res.status === 403) {
          errorBanner.value = { title: "Acceso Denegado", description: "No tienes permisos.", type: "error" };
          throw new Error("Acceso denegado");
        }
        let responseData = null;
        try {
          responseData = await res.json();
        } catch {
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
        return responseData && responseData.data ? responseData.data : responseData;
      } catch (e) {
        console.error("Error en createOrUpdateRetiro:", e);
        throw e;
      }
    }
    async function onRetiroSuccess(payload) {
      errorBanner.value = { title: (payload == null ? void 0 : payload.title) || "Retiro guardado", description: (payload == null ? void 0 : payload.description) || "", type: "success" };
      showModal.value = false;
      selectedRetiro.value = {};
      isEditing.value = false;
      isViewing.value = false;
      await fetchRetiros(currentPage.value);
    }
    function handlePageChange(page) {
      fetchRetiros(page);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))}>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Retiros - Pactum",
        description: "Lista y gesti\xF3n de retiros de efectivo.",
        canonical: "/retiros"
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
          title: "\xBFEst\xE1s seguro que deseas eliminar este retiro?",
          description: "Esta acci\xF3n no se puede deshacer.",
          icon: deleteIcon,
          type: "warning",
          onConfirm: confirmDeleteRetiro,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0"><div class="bg-white rounded-lg shadow-md p-4"><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Motivo</label><input type="text"${ssrRenderAttr("value", motivo.value)} placeholder="Motivo..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label><input type="date"${ssrRenderAttr("value", fecha_desde.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label><input type="date"${ssrRenderAttr("value", fecha_hasta.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div></div><div class="w-[95%] mx-auto px-4 py-4"><div class="bg-white rounded-lg shadow-md p-4"><h2 class="text-xl font-bold mb-4">Resumen r\xE1pido</h2><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div class="p-4 bg-gray-50 rounded"><div class="text-sm text-gray-600">Ventas (USD)</div><div class="text-lg font-semibold">${ssrInterpolate(ventasTotal.value.toFixed(2))}</div><div class="text-xs text-gray-500 mt-2">Sumatoria de (precio cobrado \xD7 cantidad) convertidos a USD por la tasa usada en la venta.</div></div><div class="p-4 bg-gray-50 rounded"><div class="text-sm text-gray-600">Salidas (P\xE9rdidas)</div><div class="text-lg font-semibold">${ssrInterpolate(salidasTotal.value.toFixed(2))}</div><div class="text-xs text-gray-500 mt-2">Sumatoria de (cantidad \xD7 costo del producto en USD) por salidas/p\xE9rdidas.</div></div><div class="p-4 bg-gray-50 rounded"><div class="text-sm text-gray-600">Costo Ventas (USD)</div><div class="text-lg font-semibold">${ssrInterpolate(costoVentasTotal.value.toFixed(2))}</div><div class="text-xs text-gray-500 mt-2">Sumatoria de (costo de venta en USD \xD7 cantidad) de todas las ventas.</div></div><div class="p-4 bg-gray-50 rounded"><div class="text-sm text-gray-600">Ganancia (Ventas - Costos)</div><div class="text-lg font-semibold">${ssrInterpolate(gananciaResumen.value.toFixed(2))}</div><div class="text-xs text-gray-500 mt-2">Ventas \u2212 Costo de ventas \u2212 Salidas (p\xE9rdidas).</div></div></div><div class="grid grid-cols-2 gap-4 mt-4"><div class="p-4 bg-gray-50 rounded"><div class="text-sm text-gray-600">Ganancia en CUP de Ventas Restante</div><div class="text-lg font-semibold">${ssrInterpolate(gananciaCUPVentas.value.toFixed(2))}</div><div class="text-xs text-gray-500 mt-2"><span class="font-bold italic"> \u2211 (precio-cobrado-cup \u2212 costo-venta-cup) \u2212 \u2211 (retiros-cup) </span></div></div><div class="p-4 bg-gray-50 rounded"><div class="text-sm text-gray-600">Ganancia en USD de Ventas Restante</div><div class="text-lg font-semibold">${ssrInterpolate(gananciaUSDVentas.value.toFixed(2))}</div><div class="text-xs text-gray-500 mt-2"><span class="font-bold italic"> \u2211 (precio-cobrado-usd \u2212 costo-venta-usd) \u2212 \u2211 (retiros-usd) </span></div></div></div></div>`);
      if (isMetricsLoading.value || metricsError.value) {
        _push(`<div class="fixed inset-0 z-[20000] flex items-center justify-center bg-black/60"><div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">`);
        if (isMetricsLoading.value) {
          _push(`<div><h3 class="text-lg font-semibold mb-2">Consultando datos...</h3><div class="w-full bg-gray-100 rounded h-3 overflow-hidden mb-3"><div style="${ssrRenderStyle({ width: metricsProgressPercent.value + "%" })}" class="h-3 bg-primary transition-all"></div></div><div class="text-sm text-gray-600">Progreso: ${ssrInterpolate(metricsCompleted.value)} / ${ssrInterpolate(metricsTotalSteps)} \u2014 ${ssrInterpolate(metricsProgressPercent.value)}%</div></div>`);
        } else if (metricsError.value) {
          _push(`<div><h3 class="text-lg font-semibold mb-2 text-red-600">Ocurri\xF3 un error</h3><p class="text-sm text-gray-700 mb-4">${ssrInterpolate(metricsErrorMessage.value || "ocurri\xF3 un error al consultar o calcular datos")}</p><div class="flex gap-2 justify-end"><button class="px-4 py-2 bg-primary text-white rounded">Refrescar p\xE1gina</button><button class="px-4 py-2 bg-gray-200 rounded">Volver al inicio</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex justify-end mt-4 gap-2 flex-wrap"><button class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"> Buscar </button>`);
      if (!isInvitado.value) {
        _push(`<button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z"></path></svg> Exportar a Excel </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="w-[95%] mx-auto px-4 py-4"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Retiros</h2>`);
      if (!isInvitado.value) {
        _push(`<button class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Nuevo Retiro </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: visibleRetirosColumns.value,
        items: itemsData.value,
        actions: isInvitado.value ? [] : retirosActions,
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
        retiro: selectedRetiro.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        submitHandler: createOrUpdateRetiro,
        onSuccess: onRetiroSuccess
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/retiros.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=retiros-BmqSm4JT.mjs.map
