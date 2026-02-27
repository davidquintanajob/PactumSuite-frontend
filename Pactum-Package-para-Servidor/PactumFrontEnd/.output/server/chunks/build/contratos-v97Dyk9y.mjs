import { ref, mergeProps, h, watch, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { N as Navbar } from './Navbar-BXeboE4m.mjs';
import { S as SeoMeta } from './SeoMeta-qEdMXUp-.mjs';
import { D as DataTable } from './DataTable-m2GVgsth.mjs';
import { _ as _sfc_main$2 } from './MessageBanner-BfG2bL-b.mjs';
import { _ as _sfc_main$3 } from './ConfirmBanner-D2jJGKTl.mjs';
import { _ as _sfc_main$4 } from './SelectSearch-DDW7FYzz.mjs';
import { n as navigateTo, b as useRuntimeConfig } from './server.mjs';
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

const trabajadoresPerPage = 5;
const ofertasPerPage = 5;
const _sfc_main$1 = {
  __name: "ContratoModal",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    contrato: {
      type: Object,
      default: () => ({})
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    isViewing: {
      type: Boolean,
      default: false
    },
    entidades: {
      type: Array,
      default: () => []
    },
    tiposContrato: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formData = ref({
      id_entidad: "",
      id_tipo_contrato: "",
      fecha_inicio: "",
      fecha_fin: "",
      num_consecutivo: "",
      clasificacion: "",
      ClienteOProveedor: "",
      vigenciaFacturasDias: 30,
      nota: ""
    });
    const clienteOProveedorOptions = ref([
      { label: "Cliente", value: "Cliente" },
      { label: "Proveedor", value: "Proveedor" }
    ]);
    const errorMsg = ref("");
    const isLoading = ref(false);
    const loadingBanner = ref(null);
    async function fetchNextConsecutivo() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        const config = useRuntimeConfig();
        const res = await fetch(`${config.public.backendHost}/contrato/next-consecutivo/${currentYear}`, {
          method: "GET",
          headers: {
            "Authorization": token
          }
        });
        if (res.status === 401 || res.status === 403) {
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
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.siguiente_consecutivo) {
            formData.value.num_consecutivo = data.data.siguiente_consecutivo;
          }
        } else {
          console.error("Error al obtener el siguiente consecutivo");
        }
      } catch (err) {
        console.error("Error al obtener el siguiente consecutivo:", err);
      }
    }
    watch(() => props.modelValue, async (newValue) => {
      if (newValue && !props.isEditing && !props.isViewing) {
        await fetchNextConsecutivo();
      }
    });
    watch(() => props.contrato, (contrato) => {
      if (contrato && Object.keys(contrato).length > 0) {
        formData.value = {
          id_entidad: contrato.id_entidad || "",
          id_tipo_contrato: contrato.id_tipo_contrato || "",
          fecha_inicio: contrato.fecha_inicio ? contrato.fecha_inicio.substring(0, 10) : "",
          fecha_fin: contrato.fecha_fin ? contrato.fecha_fin.substring(0, 10) : "",
          num_consecutivo: contrato.num_consecutivo || "",
          clasificacion: contrato.clasificacion || "",
          ClienteOProveedor: contrato.ClienteOProveedor || "",
          vigenciaFacturasDias: contrato.vigenciaFacturasDias || 30,
          nota: contrato.nota || ""
        };
      } else {
        formData.value = {
          id_entidad: "",
          id_tipo_contrato: "",
          fecha_inicio: "",
          fecha_fin: "",
          num_consecutivo: "",
          clasificacion: "",
          ClienteOProveedor: "",
          vigenciaFacturasDias: 30,
          nota: ""
        };
      }
    }, { immediate: true });
    const trabajadoresColumns = [
      { key: "nombre", label: "Nombre" },
      { key: "cargo", label: "Cargo" },
      { key: "carnet_identidad", label: "Carnet de Identidad" },
      { key: "num_telefono", label: "Tel\xE9fono" }
    ];
    const trabajadoresPage = ref(1);
    const trabajadoresData = computed(() => {
      if (!props.contrato || !Array.isArray(props.contrato.trabajadoresAutorizados)) return [];
      return props.contrato.trabajadoresAutorizados;
    });
    const trabajadoresTotal = computed(() => trabajadoresData.value.length);
    const handleTrabajadoresPageChange = (newPage) => {
      trabajadoresPage.value = newPage;
    };
    const ofertasColumns = [
      { key: "id_oferta", label: "ID Oferta" },
      { key: "descripcion", label: "Descripci\xF3n" },
      { key: "fecha_inicio", label: "Fecha Inicio", format: (val) => val == null ? void 0 : val.substring(0, 10) },
      { key: "fecha_fin", label: "Fecha Fin", format: (val) => val == null ? void 0 : val.substring(0, 10) }
    ];
    const ofertasPage = ref(1);
    const ofertasData = computed(() => {
      if (!props.contrato || !Array.isArray(props.contrato.oferta)) return [];
      return props.contrato.oferta.map((o) => ({
        ...o,
        fecha_inicio: o.fecha_inicio ? o.fecha_inicio.substring(0, 10) : "",
        fecha_fin: o.fecha_fin ? o.fecha_fin.substring(0, 10) : ""
      }));
    });
    const ofertasTotal = computed(() => ofertasData.value.length);
    const handleOfertasPageChange = (newPage) => {
      ofertasPage.value = newPage;
    };
    const canEditConsecutivo = computed(() => {
      return formData.value.ClienteOProveedor && formData.value.ClienteOProveedor !== "Cliente";
    });
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
        _push(`<div class="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-gray-800">${ssrInterpolate(__props.isViewing ? "Detalles de Contrato" : __props.isEditing ? "Editar Contrato" : "Nuevo Contrato")}</h2><button class="text-gray-500 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Entidad</label>`);
        _push(ssrRenderComponent(_sfc_main$4, {
          modelValue: formData.value.id_entidad,
          "onUpdate:modelValue": ($event) => formData.value.id_entidad = $event,
          options: __props.entidades,
          labelKey: "nombre",
          valueKey: "id_entidad",
          disabled: __props.isViewing || isLoading.value,
          placeholder: "Selecciona una entidad"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>`);
        _push(ssrRenderComponent(_sfc_main$4, {
          modelValue: formData.value.id_tipo_contrato,
          "onUpdate:modelValue": ($event) => formData.value.id_tipo_contrato = $event,
          options: __props.tiposContrato,
          labelKey: "nombre",
          valueKey: "id_tipo_contrato",
          disabled: __props.isViewing || isLoading.value,
          placeholder: "Selecciona un tipo de contrato"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label><input${ssrRenderAttr("value", formData.value.fecha_inicio)} type="date"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label><input${ssrRenderAttr("value", formData.value.fecha_fin)} type="date"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required></div><div><label class="block text-sm font-medium text-gray-700 mb-1">N\xFAmero Consecutivo</label><input${ssrRenderAttr("value", formData.value.num_consecutivo)} type="text"${ssrIncludeBooleanAttr(__props.isViewing || !canEditConsecutivo.value) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="${ssrRenderClass([
          "w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
          { "opacity-50": !canEditConsecutivo.value }
        ])}" required></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Clasificaci\xF3n</label><input${ssrRenderAttr("value", formData.value.clasificacion)} type="text"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Cliente o Proveedor</label>`);
        _push(ssrRenderComponent(_sfc_main$4, {
          modelValue: formData.value.ClienteOProveedor,
          "onUpdate:modelValue": ($event) => formData.value.ClienteOProveedor = $event,
          options: clienteOProveedorOptions.value,
          labelKey: "label",
          valueKey: "value",
          disabled: __props.isViewing || isLoading.value,
          placeholder: "Selecciona..."
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Vigencia de pago/cobro facturas (d\xEDas)</label><input${ssrRenderAttr("value", formData.value.vigenciaFacturasDias)} type="number"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" required></div><div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nota</label><textarea${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" placeholder="Ingrese una nota opcional">${ssrInterpolate(formData.value.nota)}</textarea></div></div>`);
        if (!__props.isViewing) {
          _push(`<div class="flex justify-end space-x-4 mt-6"><button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}> Cancelar </button><button type="submit" class="px-4 py-2 text-neutral bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
          if (isLoading.value) {
            _push(`<span class="flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${ssrInterpolate(__props.isEditing ? "Guardando..." : "Creando...")}</span>`);
          } else {
            _push(`<span>${ssrInterpolate(__props.isEditing ? "Guardar Cambios" : "Crear Contrato")}</span>`);
          }
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
        if (__props.isViewing || __props.isEditing) {
          _push(`<div class="mt-8 space-y-8"><div><h3 class="text-lg font-semibold mb-2">Trabajadores Autorizados</h3>`);
          _push(ssrRenderComponent(DataTable, {
            columns: trabajadoresColumns,
            items: trabajadoresData.value,
            "total-items": trabajadoresTotal.value,
            "items-per-page": trabajadoresPerPage,
            "current-page": trabajadoresPage.value,
            "is-loading": false,
            onPageChange: handleTrabajadoresPageChange
          }, null, _parent));
          _push(`</div><div><h3 class="text-lg font-semibold mb-2">Ofertas</h3>`);
          _push(ssrRenderComponent(DataTable, {
            columns: ofertasColumns,
            items: ofertasData.value,
            "total-items": ofertasTotal.value,
            "items-per-page": ofertasPerPage,
            "current-page": ofertasPage.value,
            "is-loading": false,
            onPageChange: handleOfertasPageChange
          }, null, _parent));
          _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContratoModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "contratos",
  __ssrInlineRender: true,
  setup(__props) {
    const nombre_entidad = ref("");
    const id_tipo_contrato = ref("");
    const fecha_inicio = ref("");
    const fecha_fin = ref("");
    const num_consecutivo = ref("");
    const clienteOProveedor = ref("");
    ref(false);
    const clienteOProveedorOptions = ref([
      { label: "Todos", value: "" },
      { label: "Cliente", value: "Cliente" },
      { label: "Proveedor", value: "Proveedor" }
    ]);
    const tipoContratos = ref([]);
    const entidades = ref([]);
    const showModal = ref(false);
    const selectedContrato = ref({});
    const isEditing = ref(false);
    const isViewing = ref(false);
    const contratosColumns = [
      { key: "num_consecutivo", label: "Num. Consecutivo" },
      {
        key: "fecha_inicio",
        label: "Fecha Inicio",
        cellRenderer: (value) => {
          if (!value) return "";
          const fechaFormateada = value.substring(0, 10);
          return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
        }
      },
      {
        key: "fecha_fin",
        label: "Fecha Fin",
        cellRenderer: (value) => {
          if (!value) return "";
          const fechaFormateada = value.substring(0, 10);
          const fechaActual = /* @__PURE__ */ new Date();
          const fechaFin = new Date(value);
          const bgColor = fechaActual > fechaFin ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
          return `<span class="px-2 py-1 rounded text-sm font-medium ${bgColor}">${fechaFormateada}</span>`;
        }
      },
      { key: "clasificacion", label: "Clasificaci\xF3n", class: "w-1/2 whitespace-normal break-words" },
      {
        key: "ClienteOProveedor",
        label: "Cliente o Proveedor",
        cellRenderer: (value) => {
          if (!value) return "";
          const bgColor = value === "Cliente" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800";
          return `<span class="px-2 py-1 rounded text-sm font-medium ${bgColor}">${value}</span>`;
        }
      },
      { key: "entidad.nombre", label: "Entidad" },
      { key: "tipoContrato.nombre", label: "Tipo de Contrato" }
    ];
    const currentPage = ref(1);
    const totalItems = ref(0);
    const isLoading = ref(false);
    const itemsPorPage = ref(10);
    const itemsData = ref([]);
    const errorBanner2 = ref(null);
    const showConfirmBanner = ref(false);
    const contratoAEliminar = ref(null);
    const config = useRuntimeConfig();
    const contratosActions = [
      {
        name: "Editar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 7.5-7.5z" })
            ]);
          }
        },
        handler: (item) => abrirModalContrato(item, "editar"),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90"
      },
      {
        name: "Eliminar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z" }),
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M19 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2" })
            ]);
          }
        },
        handler: (item) => eliminarContrato(item),
        iconOnly: false,
        buttonClass: "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90"
      }
    ];
    function handlePageChange(page) {
      fetchContratos(page);
    }
    function handleRowClick(item) {
      abrirModalContrato(item, "ver");
    }
    async function fetchContratos(page = 1) {
      var _a, _b;
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const body = {
          nombre_entidad: nombre_entidad.value || void 0,
          id_tipo_contrato: id_tipo_contrato.value || void 0,
          fecha_inicio: fecha_inicio.value || void 0,
          fecha_fin: fecha_fin.value || void 0,
          num_consecutivo: num_consecutivo.value || void 0,
          ClienteOProveedor: clienteOProveedor.value || void 0
        };
        const res = await fetch(`${config.public.backendHost}/contrato/filter/${page}/${itemsPorPage.value}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify(body)
        });
        if (res.status === 401) {
          errorBanner2.value = {
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
          errorBanner2.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        const data = await res.json();
        itemsData.value = (data.data || []).map((c) => ({
          ...c,
          fecha_inicio: c.fecha_inicio ? c.fecha_inicio.substring(0, 10) : "",
          fecha_fin: c.fecha_fin ? c.fecha_fin.substring(0, 10) : ""
        }));
        totalItems.value = ((_a = data.pagination) == null ? void 0 : _a.total) || 0;
        currentPage.value = ((_b = data.pagination) == null ? void 0 : _b.currentPage) || 1;
      } catch (err) {
        errorBanner2.value = { title: "Error", description: "No se pudieron cargar los contratos", type: "error" };
      }
    }
    function abrirModalContrato(item, modo) {
      selectedContrato.value = item ? { ...item } : {};
      isEditing.value = modo === "editar";
      isViewing.value = modo === "ver";
      showModal.value = true;
    }
    function eliminarContrato(item) {
      contratoAEliminar.value = item;
      showConfirmBanner.value = true;
    }
    async function confirmDeleteContrato() {
      if (!contratoAEliminar.value) return;
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const res = await fetch(`${config.public.backendHost}/contrato/deleteContrato/${contratoAEliminar.value.id_contrato}`, {
          method: "DELETE",
          headers: {
            "Authorization": token
          }
        });
        if (res.status === 401) {
          errorBanner2.value = {
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
          errorBanner2.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        if (!res.ok) {
          let errorMsg = "No se pudo eliminar el contrato";
          try {
            const errorData = await res.json();
            if (errorData && errorData.message) {
              errorMsg = errorData.message;
            }
          } catch (e) {
          }
          throw new Error(errorMsg);
        }
        errorBanner2.value = { title: "\xC9xito", description: "Contrato eliminado correctamente", type: "success" };
        fetchContratos(currentPage.value);
      } catch (err) {
        errorBanner2.value = { title: "Error", description: err.message, type: "error" };
      } finally {
        showConfirmBanner.value = false;
        contratoAEliminar.value = null;
      }
    }
    const handleContratoSubmit = async (formData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigateTo("/");
        return;
      }
      try {
        const url = isEditing.value ? `${config.public.backendHost}/contrato/UpdateContrato/${selectedContrato.value.id_contrato}` : `${config.public.backendHost}/contrato/createContrato`;
        const response = await fetch(url, {
          method: isEditing.value ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
            "Accept": "application/json"
          },
          body: JSON.stringify(formData)
        });
        if (response.status === 401) {
          errorBanner2.value = {
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
          errorBanner2.value = {
            title: "Acceso Denegado",
            description: "No tienes permisos para realizar esta acci\xF3n o acceder a esta informaci\xF3n.",
            type: "error"
          };
          return;
        }
        if (response.status === 400 || response.status === 500) {
          const errorData = await response.json();
          if (errorData.error) {
            errorBanner2.value = {
              title: `Errores de validaci\xF3n: ${response.status}`,
              description: errorData.error,
              type: "error"
            };
          } else {
            errorBanner2.value = {
              title: `Error: ${response.status}`,
              description: JSON.stringify(errorData),
              type: "error"
            };
          }
          return;
        }
        if (response.ok) {
          if (isEditing.value) {
            errorBanner2.value = {
              title: `Contrato Actualizado: ${response.status}`,
              description: `El contrato se actualiz\xF3 con \xE9xito`,
              type: "success"
            };
          } else {
            errorBanner2.value = {
              title: `Contrato Creado: ${response.status}`,
              description: `El contrato se cre\xF3 con \xE9xito`,
              type: "success"
            };
          }
          showModal.value = false;
          await fetchContratos(currentPage.value);
        } else {
          console.error("Error al guardar el contrato");
        }
      } catch (error) {
        errorBanner2.value = {
          title: "Error",
          description: error.message,
          type: "error"
        };
      }
    };
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))}>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Contratos - Contract Manager",
        description: "Lista y gesti\xF3n de contratos en Contract Manager. Filtra, exporta y administra contratos.",
        canonical: "/contratos"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner2.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">`);
        _push(ssrRenderComponent(_sfc_main$2, {
          title: errorBanner2.value.title,
          description: errorBanner2.value.description,
          type: errorBanner2.value.type,
          onClose: ($event) => errorBanner2.value = null,
          class: "pointer-events-auto"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (showConfirmBanner.value) {
        _push(`<div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto">`);
        _push(ssrRenderComponent(_sfc_main$3, {
          title: "\xBFEst\xE1s seguro que deseas eliminar este contrato?",
          description: "Esta acci\xF3n no se puede deshacer.",
          icon: deleteIcon,
          type: "warning",
          onConfirm: confirmDeleteContrato,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0"><div class="bg-white rounded-lg shadow-md p-4"><div class="mb-4"><label class="block text-sm font-medium text-gray-700 mb-1">Buscar por entidad</label><div class="relative"><input type="text"${ssrRenderAttr("value", nombre_entidad.value)} placeholder="Ingrese el nombre de la entidad..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"><div class="absolute left-3 top-2.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div></div></div><div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4"><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Tipo de contrato</label>`);
      _push(ssrRenderComponent(_sfc_main$4, {
        modelValue: id_tipo_contrato.value,
        "onUpdate:modelValue": ($event) => id_tipo_contrato.value = $event,
        options: tipoContratos.value,
        labelKey: "nombre",
        valueKey: "id_tipo_contrato",
        placeholder: "Buscar tipo de contrato..."
      }, null, _parent));
      _push(`</div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label><input type="date"${ssrRenderAttr("value", fecha_inicio.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label><input type="date"${ssrRenderAttr("value", fecha_fin.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Num. consecutivo</label><input type="number"${ssrRenderAttr("value", num_consecutivo.value)} placeholder="N\xFAmero consecutivo" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div class="w-full"><label class="block text-sm font-medium text-gray-700 mb-1">Cliente o Proveedor</label>`);
      _push(ssrRenderComponent(_sfc_main$4, {
        modelValue: clienteOProveedor.value,
        "onUpdate:modelValue": ($event) => clienteOProveedor.value = $event,
        options: clienteOProveedorOptions.value,
        labelKey: "label",
        valueKey: "value",
        placeholder: "Seleccionar..."
      }, null, _parent));
      _push(`</div></div><div class="flex justify-end mt-4 gap-2 flex-wrap"><button class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"> Buscar </button><button class="px-6 py-2 bg-success text-neutral rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z"></path></svg> Exportar a Excel </button><button class="px-6 py-2 bg-success text-neutral rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z"></path></svg> Exportar a Excel con Facturas </button><button class="px-6 py-2 bg-success text-neutral rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z"></path></svg> Exportar a Excel con Ficha de Cliente </button></div></div></div><div class="w-[95%] mx-auto px-4 py-4"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Contratos</h2><button class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Nuevo Contrato </button></div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: contratosColumns,
        items: itemsData.value,
        actions: contratosActions,
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
        contrato: selectedContrato.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        entidades: entidades.value,
        "tipos-contrato": tipoContratos.value,
        onSubmit: handleContratoSubmit
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contratos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contratos-v97Dyk9y.mjs.map
