import { ref, mergeProps, h, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { S as SeoMeta } from './SeoMeta-qEdMXUp-.mjs';
import { N as Navbar } from './Navbar-BXeboE4m.mjs';
import { D as DataTable } from './DataTable-m2GVgsth.mjs';
import { _ as _sfc_main$2 } from './MessageBanner-BfG2bL-b.mjs';
import { _ as _sfc_main$3 } from './ConfirmBanner-D2jJGKTl.mjs';
import { u as useRouter, b as useRuntimeConfig } from './server.mjs';
import './v3-CVirIiRo.mjs';
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
import 'vue-router';

const _sfc_main$1 = {
  __name: "ProductoModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, required: true },
    producto: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
    isViewing: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formData = ref({
      codigo: "",
      nombre: "",
      precio: "",
      nota: "",
      unidadMedida: "",
      tipoProducto: "",
      cantidadExistencia: 0,
      costo: 0
    });
    const errorMsg = ref("");
    const isLoading = ref(false);
    const loadingBanner = ref(null);
    watch(() => props.producto, (producto) => {
      if (producto && Object.keys(producto).length > 0) {
        formData.value = {
          codigo: producto.codigo || "",
          nombre: producto.nombre || "",
          precio: producto.precio || "",
          nota: producto.nota || "",
          unidadMedida: producto.unidadMedida || "",
          tipoProducto: producto.tipoProducto || "",
          cantidadExistencia: producto.cantidadExistencia || 0,
          costo: producto.costo || 0
        };
      } else {
        formData.value = {
          codigo: "",
          nombre: "",
          precio: "",
          nota: "",
          unidadMedida: "",
          tipoProducto: "",
          cantidadExistencia: 0,
          costo: 0
        };
      }
    }, { immediate: true });
    function renderEstado(value) {
      if (!value) return "";
      let bgColor = "";
      let textColor = "";
      if (value === "Facturado") {
        bgColor = "bg-green-100";
        textColor = "text-green-800";
      } else if (value === "No Facturado") {
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
      } else if (value === "Cancelado") {
        bgColor = "bg-red-100";
        textColor = "text-red-800";
      }
      return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}">${value}</span>`;
    }
    function renderClienteProveedor(value) {
      if (!value) return "";
      let bgColor = "";
      let textColor = "";
      if (value === "Proveedor") {
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
      } else if (value === "Cliente") {
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
      } else {
        return "";
      }
      return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}">${value}</span>`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" }, _attrs))}>`);
        if (loadingBanner.value) {
          _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">`);
          _push(ssrRenderComponent(_sfc_main$2, {
            title: loadingBanner.value.title,
            description: loadingBanner.value.description,
            type: loadingBanner.value.type,
            onClose: ($event) => loadingBanner.value = null,
            class: "pointer-events-auto"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-gray-800">${ssrInterpolate(__props.isViewing ? "Detalles de Producto" : __props.isEditing ? "Editar Producto" : "Nuevo Producto")}</h2><button class="text-gray-500 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">C\xF3digo</label><input${ssrRenderAttr("value", formData.value.codigo)} type="text" required${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el c\xF3digo del producto"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label><input${ssrRenderAttr("value", formData.value.nombre)} type="text" required${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el nombre del producto"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Precio</label><input${ssrRenderAttr("value", formData.value.precio)} type="number" step="0.01" required${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el precio"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label><input${ssrRenderAttr("value", formData.value.unidadMedida)} type="text" required${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese la unidad de medida"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Producto</label><input${ssrRenderAttr("value", formData.value.tipoProducto)} type="text" required${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el tipo de producto"></div>`);
        if (__props.isEditing || __props.isViewing) {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-1">Cantidad en Existencia</label><input${ssrRenderAttr("value", formData.value.cantidadExistencia)} type="number"${ssrIncludeBooleanAttr(__props.isEditing) ? " required" : ""}${ssrIncludeBooleanAttr(true) ? " readonly" : ""}${ssrIncludeBooleanAttr(true) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border bg-gray-100 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese la cantidad en existencia"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-1">Costo</label><input${ssrRenderAttr("value", formData.value.costo)} type="number" step="0.01" required${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el costo"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Nota</label><textarea${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese una nota (opcional)" rows="3">${ssrInterpolate(formData.value.nota)}</textarea></div>`);
        if (!__props.isViewing) {
          _push(`<div class="flex justify-end space-x-4 mt-6"><button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}> Cancelar </button><button type="submit" class="px-4 py-2 text-neutral bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
          if (isLoading.value) {
            _push(`<span class="flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${ssrInterpolate(__props.isEditing ? "Guardando..." : "Creando...")}</span>`);
          } else {
            _push(`<span>${ssrInterpolate(__props.isEditing ? "Guardar Cambios" : "Crear Producto")}</span>`);
          }
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
        if ((__props.isViewing || __props.isEditing) && props.producto.facturaProductos && props.producto.facturaProductos.length > 0) {
          _push(`<div class="mt-6"><h3 class="text-lg font-semibold text-gray-800 mb-4">Historial de Facturas</h3><div class="overflow-x-auto"><table class="min-w-full bg-white border border-gray-300"><thead><tr class="bg-gray-50"><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N\xB0 Consecu</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente/Proveedor</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th><th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Venta</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
          ssrRenderList(props.producto.facturaProductos, (fp) => {
            var _a, _b;
            _push(`<tr><td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${ssrInterpolate(fp.factura.num_consecutivo)}</td><td class="px-4 py-2 whitespace-nowrap text-sm"><span>${(_a = renderClienteProveedor(fp.factura.contrato.ClienteOProveedor)) != null ? _a : ""}</span></td><td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${ssrInterpolate(new Date(fp.factura.fecha).toLocaleDateString())}</td><td class="px-4 py-2 whitespace-nowrap text-sm"><span>${(_b = renderEstado(fp.factura.estado)) != null ? _b : ""}</span></td><td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${ssrInterpolate(fp.cantidad)}</td><td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${ssrInterpolate(fp.precioVenta)}</td><td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">${ssrInterpolate(fp.costoVenta)}</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (errorMsg.value) {
          _push(`<div class="text-red-600 text-sm mt-2">${ssrInterpolate(errorMsg.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductoModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "productos",
  __ssrInlineRender: true,
  setup(__props) {
    const { navigateTo } = useRouter();
    const searchCodigo = ref("");
    const searchNombre = ref("");
    const searchPrecioMin = ref("");
    const searchPrecioMax = ref("");
    const searchNota = ref("");
    const productosData = ref([]);
    const totalProductos = ref(0);
    const itemsPorPage = ref(10);
    const currentPage = ref(1);
    const isLoading = ref(false);
    const showModal = ref(false);
    const selectedProducto = ref(null);
    const isEditing = ref(false);
    const isViewing = ref(false);
    const errorBanner = ref(null);
    const showConfirmBanner = ref(false);
    const productoAEliminar = ref(null);
    const productosColumns = [
      { key: "codigo", label: "C\xF3digo" },
      { key: "nombre", label: "Nombre" },
      { key: "unidadMedida", label: "Unidad de Medida" },
      { key: "precio", label: "Precio" },
      { key: "costo", label: "Costo" },
      { key: "tipoProducto", label: "Tipo de Producto" },
      { key: "cantidadExistencia", label: "Existencia" }
    ];
    const deleteIcon = {
      render() {
        return h("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          class: "h-6 w-6 text-neutral",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor"
        }, [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          })
        ]);
      }
    };
    const productosActions = [
      {
        name: "Editar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" })
            ]);
          }
        },
        handler: (producto) => {
          selectedProducto.value = producto;
          isEditing.value = true;
          isViewing.value = false;
          showModal.value = true;
        },
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90"
      },
      {
        name: "Eliminar",
        icon: deleteIcon,
        handler: (producto) => {
          productoAEliminar.value = producto;
          showConfirmBanner.value = true;
        },
        buttonClass: "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90"
      }
    ];
    const fetchProductos = async (page = currentPage.value, limit = itemsPorPage.value) => {
      var _a;
      isLoading.value = true;
      try {
        const token = localStorage.getItem("token");
        const config = useRuntimeConfig();
        const body = {
          codigo: searchCodigo.value,
          nombre: searchNombre.value,
          precio: {
            min: searchPrecioMin.value ? Number(searchPrecioMin.value) : void 0,
            max: searchPrecioMax.value ? Number(searchPrecioMax.value) : void 0
          },
          nota: searchNota.value
        };
        if (!body.precio.min && !body.precio.max) delete body.precio;
        else {
          if (!body.precio.min) delete body.precio.min;
          if (!body.precio.max) delete body.precio.max;
        }
        const res = await fetch(`${config.public.backendHost}/Producto/filterProductos/${page}/${limit}`, {
          method: "POST",
          headers: {
            "Authorization": token,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        productosData.value = Array.isArray(data.data) ? data.data.map((p) => ({ ...p, precio: Number(p.precio).toFixed(2) })) : [];
        totalProductos.value = ((_a = data.pagination) == null ? void 0 : _a.total) || 0;
      } catch (error) {
        productosData.value = [];
        totalProductos.value = 0;
      } finally {
        isLoading.value = false;
      }
    };
    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchProductos(page);
    };
    const handleRowClick = (item) => {
      selectedProducto.value = item;
      isEditing.value = false;
      isViewing.value = true;
      showModal.value = true;
    };
    const handleSubmit = async (producto) => {
      try {
        const token = localStorage.getItem("token");
        const config = useRuntimeConfig();
        const url = isEditing.value ? `${config.public.backendHost}/Producto/updateProducto/${selectedProducto.value.id_producto}` : `${config.public.backendHost}/Producto/createProducto`;
        const response = await fetch(url, {
          method: isEditing.value ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
            "Accept": "application/json"
          },
          body: JSON.stringify(producto)
        });
        if (response.status === 401) {
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
        if (response.status === 403) {
          errorBanner.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        if (response.status === 400 || response.status === 500) {
          const errorData = await response.json();
          if (errorData.error) {
            errorBanner.value = {
              title: `Errores de validaci\xF3n: ${response.status}`,
              description: errorData.message,
              type: "error"
            };
          } else {
            errorBanner.value = {
              title: `Error: ${response.status}`,
              description: JSON.stringify(errorData),
              type: "error"
            };
          }
          return;
        }
        if (response.ok) {
          if (isEditing.value) {
            errorBanner.value = {
              title: `Producto Actualizado: ${response.status}`,
              description: `El producto ${producto.nombre} se actualiz\xF3 con \xE9xito`,
              type: "success"
            };
          } else {
            errorBanner.value = {
              title: `Producto Creado: ${response.status}`,
              description: `El producto ${producto.nombre} se cre\xF3 con \xE9xito`,
              type: "success"
            };
          }
          await fetchProductos(currentPage.value, itemsPorPage.value);
          showModal.value = false;
          selectedProducto.value = null;
          isEditing.value = false;
          isViewing.value = false;
        } else {
          console.error("Error al guardar el producto");
        }
      } catch (error) {
        console.error("Error:", error);
        errorBanner.value = {
          title: "Error",
          description: error.message,
          type: "error"
        };
      }
    };
    async function confirmDeleteProducto() {
      showConfirmBanner.value = false;
      if (!productoAEliminar.value) return;
      try {
        const token = localStorage.getItem("token");
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.backendHost}/Producto/DeleteProducto/${productoAEliminar.value.id_producto}`, {
          method: "DELETE",
          headers: {
            "Authorization": token,
            "Accept": "application/json"
          }
        });
        if (response.status === 401) {
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
        if (response.status === 403) {
          errorBanner.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        if (!response.ok) {
          const errorData = await response.json();
          errorBanner.value = {
            title: `Error al eliminar: ${response.status}`,
            description: errorData.message || JSON.stringify(errorData),
            type: "error"
          };
          return;
        }
        errorBanner.value = {
          title: "Producto eliminado",
          description: `El producto fue eliminado correctamente`,
          type: "success"
        };
        await fetchProductos(currentPage.value, itemsPorPage.value);
      } catch (error) {
        errorBanner.value = {
          title: "Error",
          description: error.message,
          type: "error"
        };
      } finally {
        productoAEliminar.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))}>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Productos - Contract Manager",
        description: "Registra y gestiona productos.",
        canonical: "/productos"
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
          title: "\xBFEst\xE1s seguro que deseas eliminar este producto?",
          description: "Esta acci\xF3n no se puede deshacer.",
          type: "warning",
          onConfirm: confirmDeleteProducto,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0"><div class="bg-white rounded-lg shadow-md p-4"><div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 md:mb-2"><div><label class="block text-sm font-medium text-gray-700 mb-1">Buscar por c\xF3digo</label><div class="relative"><input type="text"${ssrRenderAttr("value", searchCodigo.value)} placeholder="Ingrese el c\xF3digo..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"><div class="absolute left-3 top-2.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label><input type="text"${ssrRenderAttr("value", searchNombre.value)} placeholder="Ingrese el nombre..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="flex space-x-2"><div class="flex-1"><label class="block text-sm font-medium text-gray-700 mb-1">Precio m\xEDnimo</label><input type="number"${ssrRenderAttr("value", searchPrecioMin.value)} placeholder="Precio min..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div class="flex-1"><label class="block text-sm font-medium text-gray-700 mb-1">Precio m\xE1ximo</label><input type="number"${ssrRenderAttr("value", searchPrecioMax.value)} placeholder="Precio max..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Nota</label><input type="text"${ssrRenderAttr("value", searchNota.value)} placeholder="Nota..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></div></div><div class="flex justify-end mt-4 gap-2 flex-wrap"><button class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"> Buscar </button><button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z"></path></svg> Exportar a Excel </button><button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> Exportar Ventas y Compras </button></div></div></div><div class="w-[95%] mx-auto px-4 py-4"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Productos</h2><button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Nuevo Producto </button></div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: productosColumns,
        items: productosData.value,
        actions: productosActions,
        "total-items": totalProductos.value,
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
        producto: selectedProducto.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        onSubmit: handleSubmit
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/productos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=productos-DqpmOofa.mjs.map
