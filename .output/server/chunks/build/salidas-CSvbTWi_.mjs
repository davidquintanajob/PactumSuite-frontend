import { ref, computed, mergeProps, h, reactive, watch, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, withDirectives, vModelText, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { N as Navbar } from './Navbar-B8bjDViK.mjs';
import { S as SeoMeta } from './SeoMeta-BiOiuKZ0.mjs';
import { D as DataTable } from './DataTable-CB1qJ3I1.mjs';
import { _ as _sfc_main$2 } from './MessageBanner-UgGYw58j.mjs';
import { _ as _sfc_main$3 } from './ConfirmBanner-D2jJGKTl.mjs';
import { _ as _sfc_main$4 } from './Modal-CafyytEG.mjs';
import { _ as _sfc_main$5 } from './SelectSearchAPI-C4OFsj20.mjs';
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
  __name: "SalidaModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, default: false },
    salida: { type: Object, default: () => ({}) },
    isViewing: { type: Boolean, default: true },
    isEditing: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const form = reactive({
      id_producto: null,
      id_usuario: null,
      cantidad: null,
      descripcion: "",
      fecha: ""
    });
    const usuarioNombre = ref("");
    const productoNombre = ref("");
    const errorList = ref([]);
    watch(() => props.salida, (val) => {
      var _a, _b, _c;
      if (val && Object.keys(val).length) {
        form.id_producto = val.id_producto || ((_a = val.producto) == null ? void 0 : _a.id_producto) || null;
        productoNombre.value = ((_b = val.producto) == null ? void 0 : _b.nombre) || "";
        form.cantidad = val.cantidad || null;
        form.descripcion = val.descripcion || "";
        form.fecha = val.fecha ? val.fecha.substring(0, 10) : "";
        form.id_usuario = val.id_usuario || null;
        usuarioNombre.value = ((_c = val.usuario) == null ? void 0 : _c.nombre) || "";
      } else {
        form.id_producto = null;
        productoNombre.value = "";
        form.cantidad = null;
        form.descripcion = "";
        form.fecha = "";
      }
    }, { immediate: true, deep: true });
    function handleProductoSeleccionado(selected) {
      if (selected) {
        form.id_producto = selected.id_producto;
        productoNombre.value = selected.nombre;
      } else {
        form.id_producto = null;
        productoNombre.value = "";
      }
    }
    function onSubmit() {
      errorList.value = [];
      if (!form.id_producto) errorList.value.push("Debe seleccionar un producto");
      if (form.cantidad == null || Number(form.cantidad) <= 0) errorList.value.push("La cantidad debe ser mayor que 0");
      if (!form.fecha) errorList.value.push("Debe seleccionar una fecha");
      if (!form.descripcion) errorList.value.push("Debe a\xF1adir una descripci\xF3n");
      if (errorList.value.length) return;
      const payload = {
        id_producto: form.id_producto,
        id_usuario: form.id_usuario,
        fecha: form.fecha,
        descripcion: form.descripcion,
        cantidad: Number(form.cantidad)
      };
      emit("submit", payload);
    }
    watch(() => props.modelValue, (open) => {
      if (open) {
        if (!props.isEditing && !props.isViewing) ;
      } else {
        errorList.value = [];
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$4, mergeProps({
        show: __props.modelValue,
        onClose: ($event) => _ctx.$emit("update:modelValue", false),
        size: "2xl"
      }, _attrs), {
        title: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold text-gray-900"${_scopeId}>${ssrInterpolate(__props.isViewing ? "Detalles de la Salida" : __props.isEditing ? "Editar Salida" : "Nueva Salida")}</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold text-gray-900" }, toDisplayString(__props.isViewing ? "Detalles de la Salida" : __props.isEditing ? "Editar Salida" : "Nueva Salida"), 1)
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f;
          if (_push2) {
            if (__props.isViewing) {
              _push2(`<div class="space-y-6"${_scopeId}><div class="bg-gray-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n del Producto</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Nombre</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_a = __props.salida.producto) == null ? void 0 : _a.nombre) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>C\xF3digo</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_b = __props.salida.producto) == null ? void 0 : _b.codigo) || "N/A")}</p></div></div></div><div class="bg-blue-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n de la Salida</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Cantidad</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.salida.cantidad)}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Fecha</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.salida.fecha ? new Date(__props.salida.fecha).toLocaleDateString("es-ES") : "N/A")}</p></div><div class="md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Descripci\xF3n</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.salida.descripcion || "Sin descripci\xF3n")}</p></div></div></div><div class="bg-gray-50 rounded-lg p-4"${_scopeId}><h4 class="text-md font-medium text-gray-900 mb-3"${_scopeId}>Informaci\xF3n del Sistema</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Creado por</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(((_c = __props.salida.usuario) == null ? void 0 : _c.nombre) || "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>Creado</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.salida.createdAt ? new Date(__props.salida.createdAt).toLocaleString("es-ES") : "N/A")}</p></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700"${_scopeId}>\xDAltima Actualizaci\xF3n</label><p class="mt-1 text-sm text-gray-900"${_scopeId}>${ssrInterpolate(__props.salida.updatedAt ? new Date(__props.salida.updatedAt).toLocaleString("es-ES") : "N/A")}</p></div></div></div></div>`);
            } else {
              _push2(`<div class="space-y-6"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Producto</label>`);
              _push2(ssrRenderComponent(_sfc_main$5, {
                modelValue: form.id_producto,
                "onUpdate:modelValue": ($event) => form.id_producto = $event,
                endpoint: "/Producto/filterProductos/1/10",
                method: "POST",
                "search-key": "nombre",
                "label-key": "nombre",
                "value-key": "id_producto",
                placeholder: "Buscar producto...",
                "initial-label": productoNombre.value,
                onProductoSeleccionado: handleProductoSeleccionado
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Fecha</label><input type="date"${ssrRenderAttr("value", form.fecha)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Cantidad</label><input type="number"${ssrRenderAttr("value", form.cantidad)} min="0" step="0.01" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Usuario</label><input type="text"${ssrRenderAttr("value", usuarioNombre.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100" disabled${_scopeId}></div><div class="md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Descripci\xF3n</label><input type="text"${ssrRenderAttr("value", form.descripcion)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Descripci\xF3n..."${_scopeId}></div></div>`);
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
          } else {
            return [
              __props.isViewing ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-6"
              }, [
                createVNode("div", { class: "bg-gray-50 rounded-lg p-4" }, [
                  createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n del Producto"),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Nombre"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_d = __props.salida.producto) == null ? void 0 : _d.nombre) || "N/A"), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "C\xF3digo"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_e = __props.salida.producto) == null ? void 0 : _e.codigo) || "N/A"), 1)
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-blue-50 rounded-lg p-4" }, [
                  createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n de la Salida"),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Cantidad"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.salida.cantidad), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Fecha"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.salida.fecha ? new Date(__props.salida.fecha).toLocaleDateString("es-ES") : "N/A"), 1)
                    ]),
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Descripci\xF3n"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.salida.descripcion || "Sin descripci\xF3n"), 1)
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-gray-50 rounded-lg p-4" }, [
                  createVNode("h4", { class: "text-md font-medium text-gray-900 mb-3" }, "Informaci\xF3n del Sistema"),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Creado por"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(((_f = __props.salida.usuario) == null ? void 0 : _f.nombre) || "N/A"), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Creado"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.salida.createdAt ? new Date(__props.salida.createdAt).toLocaleString("es-ES") : "N/A"), 1)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "\xDAltima Actualizaci\xF3n"),
                      createVNode("p", { class: "mt-1 text-sm text-gray-900" }, toDisplayString(__props.salida.updatedAt ? new Date(__props.salida.updatedAt).toLocaleString("es-ES") : "N/A"), 1)
                    ])
                  ])
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "space-y-6"
              }, [
                createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Producto"),
                    createVNode(_sfc_main$5, {
                      modelValue: form.id_producto,
                      "onUpdate:modelValue": ($event) => form.id_producto = $event,
                      endpoint: "/Producto/filterProductos/1/10",
                      method: "POST",
                      "search-key": "nombre",
                      "label-key": "nombre",
                      "value-key": "id_producto",
                      placeholder: "Buscar producto...",
                      "initial-label": productoNombre.value,
                      onProductoSeleccionado: handleProductoSeleccionado
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "initial-label"])
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
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Cantidad"),
                    withDirectives(createVNode("input", {
                      type: "number",
                      "onUpdate:modelValue": ($event) => form.cantidad = $event,
                      min: "0",
                      step: "0.01",
                      class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [
                        vModelText,
                        form.cantidad,
                        void 0,
                        { number: true }
                      ]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Usuario"),
                    createVNode("input", {
                      type: "text",
                      value: usuarioNombre.value,
                      class: "w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100",
                      disabled: ""
                    }, null, 8, ["value"])
                  ]),
                  createVNode("div", { class: "md:col-span-2" }, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Descripci\xF3n"),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.descripcion = $event,
                      class: "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary",
                      placeholder: "Descripci\xF3n..."
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.descripcion]
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
            ];
          }
        }),
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            if (!__props.isViewing) {
              _push2(`<button class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90"${_scopeId}>${ssrInterpolate(__props.isEditing ? "Guardar" : "Crear")}</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"${_scopeId}>Cerrar</button></div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-end gap-2" }, [
                !__props.isViewing ? (openBlock(), createBlock("button", {
                  key: 0,
                  onClick: onSubmit,
                  class: "px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90"
                }, toDisplayString(__props.isEditing ? "Guardar" : "Crear"), 1)) : createCommentVNode("", true),
                createVNode("button", {
                  onClick: ($event) => _ctx.$emit("update:modelValue", false),
                  class: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                }, "Cerrar", 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SalidaModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "salidas",
  __ssrInlineRender: true,
  setup(__props) {
    const descripcion = ref("");
    const fecha_desde = ref("");
    const fecha_hasta = ref("");
    const producto_nombre = ref("");
    const usuario_nombre = ref("");
    const cantidad_min = ref("");
    const cantidad_max = ref("");
    const showModal = ref(false);
    const selectedSalida = ref({});
    const isViewing = ref(false);
    const isEditing = ref(false);
    const showConfirmBanner = ref(false);
    const salidaAEliminar = ref(null);
    const salidasColumns = [
      {
        key: "fecha",
        label: "Fecha",
        cellRenderer: (value) => {
          if (!value) return "";
          const fechaFormateada = value.substring(0, 10);
          return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
        }
      },
      { key: "producto.nombre", label: "Producto" },
      { key: "cantidad", label: "Cantidad" },
      { key: "descripcion", label: "Descripci\xF3n" },
      { key: "usuario.nombre", label: "Usuario" }
    ];
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
    const salidasActions = [
      {
        name: "Editar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" })
            ]);
          }
        },
        handler: (item) => abrirModalSalida(item, "editar"),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90"
      },
      {
        name: "Eliminar",
        icon: deleteIcon,
        handler: (item) => eliminarSalida(item),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90"
      }
    ];
    async function fetchSalidas(page = 1) {
      var _a, _b;
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        isLoading.value = true;
        const body = {
          descripcion: descripcion.value || void 0,
          fecha_desde: fecha_desde.value || void 0,
          fecha_hasta: fecha_hasta.value || void 0,
          producto_nombre: producto_nombre.value || void 0,
          usuario_nombre: usuario_nombre.value || void 0
        };
        if (cantidad_min.value !== "" || cantidad_max.value !== "") {
          body.cantidad = {};
          if (cantidad_min.value !== "") {
            body.cantidad.min = cantidad_min.value;
          }
          if (cantidad_max.value !== "") {
            body.cantidad.max = cantidad_max.value;
          }
        }
        const res = await fetch(`${config.public.backendHost}/salida/filterSalidas/${page}/${itemsPorPage.value}`, {
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
        errorBanner.value = { title: "Error", description: "No se pudieron cargar las salidas", type: "error" };
      } finally {
        isLoading.value = false;
      }
    }
    function abrirModalSalida(item, modo) {
      selectedSalida.value = { ...item };
      isViewing.value = modo === "ver";
      isEditing.value = modo === "editar";
      showModal.value = true;
    }
    function handleRowClick(item) {
      abrirModalSalida(item, "ver");
    }
    function eliminarSalida(item) {
      salidaAEliminar.value = item;
      showConfirmBanner.value = true;
    }
    async function confirmDeleteSalida() {
      if (!salidaAEliminar.value) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${config.public.backendHost}/salida/deleteSalida/${salidaAEliminar.value.id_salida}`, {
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
          const msg = Array.isArray(err.errors) ? err.errors.join("\n") : err.error || "No se pudo eliminar la salida";
          errorBanner.value = { title: "Error", description: msg, type: "error" };
          return;
        }
        errorBanner.value = { title: "Salida eliminada", description: "Se elimin\xF3 correctamente", type: "success" };
        await fetchSalidas(currentPage.value);
      } catch (e) {
        errorBanner.value = { title: "Error", description: "Ocurri\xF3 un error al eliminar", type: "error" };
      } finally {
        showConfirmBanner.value = false;
        salidaAEliminar.value = null;
      }
    }
    async function handleSalidaSubmit(payload) {
      var _a;
      try {
        const token = localStorage.getItem("token");
        const url = isEditing.value && ((_a = selectedSalida.value) == null ? void 0 : _a.id_salida) ? `${config.public.backendHost}/salida/updateSalida/${selectedSalida.value.id_salida}` : `${config.public.backendHost}/salida/createSalida`;
        const method = isEditing.value ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const msg = Array.isArray(err.errors) ? err.errors.join("\n") : err.error || "Error en la operaci\xF3n";
          errorBanner.value = { title: "Error", description: msg, type: "error" };
          return;
        }
        errorBanner.value = { title: isEditing.value ? "Salida actualizada" : "Salida creada", description: "Operaci\xF3n exitosa", type: "success" };
        showModal.value = false;
        selectedSalida.value = {};
        isEditing.value = false;
        isViewing.value = false;
        await fetchSalidas(currentPage.value);
      } catch (e) {
        errorBanner.value = { title: "Error", description: "Ocurri\xF3 un error al guardar", type: "error" };
      }
    }
    function handlePageChange(page) {
      fetchSalidas(page);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))}>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Salidas - Pactum",
        description: "Lista y gesti\xF3n de salidas de productos.",
        canonical: "/salidas"
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
          title: "\xBFEst\xE1s seguro que deseas eliminar esta salida?",
          description: "Esta acci\xF3n no se puede deshacer.",
          icon: deleteIcon,
          type: "warning",
          onConfirm: confirmDeleteSalida,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0"><div class="bg-white rounded-lg shadow-md p-4"><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Descripci\xF3n</label><input type="text"${ssrRenderAttr("value", descripcion.value)} placeholder="Descripci\xF3n..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label><input type="text"${ssrRenderAttr("value", producto_nombre.value)} placeholder="Nombre del producto..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label><input type="text"${ssrRenderAttr("value", usuario_nombre.value)} placeholder="Nombre de usuario..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Cantidad m\xEDnima</label><input type="number"${ssrRenderAttr("value", cantidad_min.value)} placeholder="Cantidad min..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Cantidad m\xE1xima</label><input type="number"${ssrRenderAttr("value", cantidad_max.value)} placeholder="Cantidad max..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label><input type="date"${ssrRenderAttr("value", fecha_desde.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label><input type="date"${ssrRenderAttr("value", fecha_hasta.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div></div><div class="flex justify-end mt-4"><button class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"> Buscar </button></div></div></div><div class="w-[95%] mx-auto px-4 py-4"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Salidas</h2>`);
      if (!isInvitado.value) {
        _push(`<button class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Nueva Salida </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: salidasColumns,
        items: itemsData.value,
        actions: isInvitado.value ? [] : salidasActions,
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
        salida: selectedSalida.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        onSubmit: handleSalidaSubmit
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/salidas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=salidas-CSvbTWi_.mjs.map
