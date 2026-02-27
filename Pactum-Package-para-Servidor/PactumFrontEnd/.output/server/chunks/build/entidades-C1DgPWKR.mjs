import { ref, mergeProps, h, watch, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { S as SeoMeta } from './SeoMeta-qEdMXUp-.mjs';
import { N as Navbar } from './Navbar-BXeboE4m.mjs';
import { D as DataTable } from './DataTable-m2GVgsth.mjs';
import { _ as _sfc_main$2 } from './MessageBanner-BfG2bL-b.mjs';
import { _ as _sfc_main$3 } from './ConfirmBanner-D2jJGKTl.mjs';
import { _ as _export_sfc, b as useRuntimeConfig, n as navigateTo } from './server.mjs';
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

const contratosPerPage = 10;
const _sfc_main$1 = {
  __name: "EntidadModal",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    entidad: {
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
    }
  },
  emits: ["update:modelValue", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formData = ref({
      nombre: "",
      direccion: "",
      telefono: "",
      email: "",
      cuenta_bancaria: "",
      tipo_entidad: "",
      codigo_reeup: "",
      codigo_nit: "",
      organismo: "",
      consecutivo: ""
    });
    const errorMsg = ref("");
    const isLoading = ref(false);
    const loadingBanner = ref(null);
    watch(() => props.entidad, (newEntidad) => {
      if (newEntidad && Object.keys(newEntidad).length > 0) {
        formData.value = { ...newEntidad };
      } else {
        formData.value = {
          nombre: "",
          direccion: "",
          telefono: "",
          email: "",
          cuenta_bancaria: "",
          tipo_entidad: "",
          codigo_reeup: "",
          codigo_nit: "",
          organismo: "",
          consecutivo: ""
        };
      }
    }, { immediate: true });
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
      {
        key: "ClienteOProveedor",
        label: "Cliente o Proveedor",
        cellRenderer: (value) => {
          if (!value) return "";
          const bgColor = value === "Cliente" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800";
          return `<span class="px-2 py-1 rounded text-sm font-medium ${bgColor}">${value}</span>`;
        }
      },
      { key: "tipoContratoNombre", label: "Tipo de Contrato" }
    ];
    const contratosData = computed(() => {
      if (!props.entidad || !Array.isArray(props.entidad.contratos)) return [];
      return props.entidad.contratos.map((c) => {
        var _a;
        return {
          num_consecutivo: c.num_consecutivo,
          fecha_inicio: c.fecha_inicio ? c.fecha_inicio.split("T")[0] : "",
          fecha_fin: c.fecha_fin ? c.fecha_fin.split("T")[0] : "",
          clasificacion: c.clasificacion || "",
          ClienteOProveedor: c.ClienteOProveedor || "",
          entidadNombre: props.entidad.nombre || "",
          tipoContratoNombre: ((_a = c.tipoContrato) == null ? void 0 : _a.nombre) || ""
        };
      });
    });
    const contratosTotal = computed(() => contratosData.value.length);
    const contratosPage = ref(1);
    const handleContratosPageChange = (newPage) => {
      contratosPage.value = newPage;
    };
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
        _push(`<div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-gray-800">${ssrInterpolate(props.isViewing ? "Detalles de Entidad" : __props.isEditing ? "Editar Entidad" : "Nueva Entidad")}</h2><button class="text-gray-500 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label><input${ssrRenderAttr("value", formData.value.nombre)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" required${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el nombre"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Direcci\xF3n</label><input${ssrRenderAttr("value", formData.value.direccion)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese la direcci\xF3n"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Tel\xE9fono</label><input${ssrRenderAttr("value", formData.value.telefono)} type="tel" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ej: +50312345678"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Email</label><input${ssrRenderAttr("value", formData.value.email)} type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="ejemplo@correo.com"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Cuenta Bancaria</label><input${ssrRenderAttr("value", formData.value.cuenta_bancaria)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} maxlength="19" placeholder="0000-0000-0000-0000"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Entidad</label><input${ssrRenderAttr("value", formData.value.tipo_entidad)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el tipo de entidad" required${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""}></div><div><label class="block text-sm font-medium text-gray-700 mb-1">C\xF3digo REEUP</label><input${ssrRenderAttr("value", formData.value.codigo_reeup)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el c\xF3digo REEUP"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">C\xF3digo NIT</label><input${ssrRenderAttr("value", formData.value.codigo_nit)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el c\xF3digo NIT"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Organismo</label><input${ssrRenderAttr("value", formData.value.organismo)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el organismo"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Consecutivo</label><input${ssrRenderAttr("value", formData.value.consecutivo)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el consecutivo"></div></div>`);
        if (!props.isViewing) {
          _push(`<div class="flex justify-end space-x-4 mt-6"><button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}> Cancelar </button><button type="submit" class="px-4 py-2 text-neutral bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
          if (isLoading.value) {
            _push(`<span class="flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${ssrInterpolate(__props.isEditing ? "Guardando..." : "Creando...")}</span>`);
          } else {
            _push(`<span>${ssrInterpolate(__props.isEditing ? "Guardar Cambios" : "Crear Entidad")}</span>`);
          }
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
        if (props.isViewing || __props.isEditing) {
          _push(`<div class="mt-8"><h3 class="text-lg font-semibold mb-2">Datos De Contratos</h3>`);
          _push(ssrRenderComponent(DataTable, {
            columns: contratosColumns,
            items: contratosData.value,
            "total-items": contratosTotal.value,
            "items-per-page": contratosPerPage,
            "current-page": contratosPage.value,
            "is-loading": false,
            onPageChange: handleContratosPageChange
          }, null, _parent));
          _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EntidadModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "entidades",
  __ssrInlineRender: true,
  setup(__props) {
    const nombre = ref("");
    const direccion = ref("");
    const telefono = ref("");
    const cuenta_bancaria = ref("");
    const tipo_entidad = ref("");
    const codigo_reo = ref("");
    const codigo_nit = ref("");
    const organismo = ref("");
    const consecutivo = ref("");
    const showFilters = ref(false);
    const showModal = ref(false);
    const selectedEntidad = ref({});
    const isEditing = ref(false);
    const isViewing = ref(false);
    const config = useRuntimeConfig();
    const entidadesColumns = [
      { key: "consecutivo", label: "Consecutivo" },
      { key: "nombre", label: "Nombre de la Entidad" },
      { key: "organismo", label: "Organismo" },
      { key: "cuenta_bancaria", label: "Cuenta Bancaria" },
      { key: "tipo_entidad", label: "Tipo de Entidad" },
      { key: "codigo_reo", label: "Reo" },
      { key: "codigo_nit", label: "Nit" }
    ];
    const currentPage = ref(1);
    const totalItems = ref(0);
    const isLoading = ref(false);
    const itemsPorPage = ref(20);
    const itemsData = ref([]);
    const fetchItems = async (page = 1, limit = 20, nombre2 = "", direccion2 = "", telefono2 = "", cuenta_bancaria2 = "", tipo_entidad2 = "", codigo_reo2 = "", codigo_nit2 = "", organismo2 = "", consecutivo2 = "") => {
      try {
        isLoading.value = true;
        const token = localStorage.getItem("token");
        const bodyData = {
          nombre: nombre2,
          direccion: direccion2,
          telefono: telefono2,
          cuenta_bancaria: cuenta_bancaria2,
          tipo_entidad: tipo_entidad2,
          codigo_reo: codigo_reo2,
          codigo_nit: codigo_nit2,
          organismo: organismo2,
          consecutivo: consecutivo2
        };
        const response = await fetch(`${config.public.backendHost}/entidad/filter/${page}/${limit}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
            "Accept": "application/json"
          },
          body: JSON.stringify(bodyData)
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
        const data = await response.json();
        itemsData.value = data.data;
        totalItems.value = data.pagination.total;
      } catch (error) {
        console.error("Error al cargar las entidades:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
      fetchItems(newPage, itemsPorPage.value, nombre.value, direccion.value, telefono.value, cuenta_bancaria.value, tipo_entidad.value, codigo_reo.value, codigo_nit.value, organismo.value, consecutivo.value);
    };
    const handleRowClick = (item) => {
      selectedEntidad.value = item;
      isEditing.value = false;
      isViewing.value = true;
      showModal.value = true;
    };
    const entidadesActions = [
      {
        name: "Editar",
        icon: {
          render() {
            return h("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              class: "h-5 w-5",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor"
            }, [
              h("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              })
            ]);
          }
        },
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90",
        handler: (item) => {
          selectedEntidad.value = item;
          isEditing.value = true;
          isViewing.value = false;
          showModal.value = true;
        }
      },
      {
        name: "Eliminar",
        icon: {
          render() {
            return h("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              class: "h-5 w-5",
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
        },
        buttonClass: "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90",
        handler: (item) => {
          entidadAEliminar.value = item;
          showConfirmBanner.value = true;
        }
      }
    ];
    const handleEntidadSubmit = async (formData) => {
      try {
        const token = localStorage.getItem("token");
        const url = isEditing.value ? `${config.public.backendHost}/entidad/UpdateEntidad/${selectedEntidad.value.id_entidad}` : `${config.public.backendHost}/entidad/CreateEntidad`;
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
              description: errorData.error,
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
              title: `Entidad Actualizada: ${response.status}`,
              description: `La entidad ${formData.nombre} se actualiz\xF3 con \xE9xito`,
              type: "success"
            };
          } else {
            errorBanner.value = {
              title: `Entidad Creada: ${response.status}`,
              description: `La entidad ${formData.nombre} se creo con \xE9xito`,
              type: "success"
            };
          }
          await fetchItems(currentPage.value, itemsPorPage.value);
        } else {
          console.error("Error al guardar la entidad");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const errorBanner = ref(null);
    const showConfirmBanner = ref(false);
    const entidadAEliminar = ref(null);
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
    async function confirmDeleteEntidad() {
      showConfirmBanner.value = false;
      if (!entidadAEliminar.value) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${config.public.backendHost}/entidad/DeleteEntidad/${entidadAEliminar.value.id_entidad}`, {
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
            description: errorData.error || JSON.stringify(errorData),
            type: "error"
          };
          return;
        }
        errorBanner.value = {
          title: "Entidad eliminada",
          description: `La entidad ${entidadAEliminar.value.nombre} fue eliminada correctamente`,
          type: "success"
        };
        await fetchItems(currentPage.value, itemsPorPage.value);
      } catch (error) {
        errorBanner.value = {
          title: "Error",
          description: error.message,
          type: "error"
        };
      } finally {
        entidadAEliminar.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))} data-v-c936b4b6>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Entidades - Contract Manager",
        description: "Gestiona proveedores, clientes y otras entidades.",
        canonical: "/entidades"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none" data-v-c936b4b6>`);
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
        _push(`<div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto" data-v-c936b4b6>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          title: "\xBFEst\xE1s seguro que deseas eliminar esta entidad?",
          description: "Esta acci\xF3n no se puede deshacer.",
          icon: deleteIcon,
          type: "warning",
          onConfirm: confirmDeleteEntidad,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0" data-v-c936b4b6><div class="bg-white rounded-lg shadow-md p-4" data-v-c936b4b6><div class="mb-4" data-v-c936b4b6><label class="block text-sm font-medium text-gray-700 mb-1" data-v-c936b4b6>Buscar por nombre</label><div class="relative" data-v-c936b4b6><input type="text"${ssrRenderAttr("value", nombre.value)} placeholder="Ingrese el nombre..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-c936b4b6><div class="absolute left-3 top-2.5" data-v-c936b4b6><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c936b4b6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-c936b4b6></path></svg></div></div></div><div class="md:hidden flex justify-between items-center mb-4" data-v-c936b4b6><button class="flex items-center text-primary hover:brightness-90" data-v-c936b4b6><span class="mr-2" data-v-c936b4b6>Filtros adicionales</span><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([{ "rotate-180": showFilters.value }, "h-5 w-5 transform transition-transform"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c936b4b6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-c936b4b6></path></svg></button></div><div class="${ssrRenderClass([{ "hidden md:grid": !showFilters.value }, "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"])}" data-v-c936b4b6><div class="w-full" data-v-c936b4b6><label class="block text-sm font-medium text-gray-700 mb-1" data-v-c936b4b6>Buscar por direcci\xF3n</label><div class="relative" data-v-c936b4b6><input type="text"${ssrRenderAttr("value", direccion.value)} placeholder="Ingrese la direcci\xF3n..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-c936b4b6><div class="absolute left-3 top-2.5" data-v-c936b4b6><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c936b4b6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-c936b4b6></path></svg></div></div></div><div class="w-full" data-v-c936b4b6><label class="block text-sm font-medium text-gray-700 mb-1" data-v-c936b4b6>Tel\xE9fono</label><input type="text"${ssrRenderAttr("value", telefono.value)} placeholder="Ingrese tel\xE9fono" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-c936b4b6></div><div class="w-full" data-v-c936b4b6><label class="block text-sm font-medium text-gray-700 mb-1" data-v-c936b4b6>Cuenta bancaria</label><input type="text"${ssrRenderAttr("value", cuenta_bancaria.value)} placeholder="Ingrese cuenta bancaria" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-c936b4b6></div><div class="w-full" data-v-c936b4b6><label class="block text-sm font-medium text-gray-700 mb-1" data-v-c936b4b6>Tipo de entidad</label><input type="text"${ssrRenderAttr("value", tipo_entidad.value)} placeholder="Ingrese tipo de entidad" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-c936b4b6></div><div class="w-full" data-v-c936b4b6><label class="block text-sm font-medium text-gray-700 mb-1" data-v-c936b4b6>C\xF3digo REEUP</label><input type="text"${ssrRenderAttr("value", codigo_reo.value)} placeholder="Ingrese c\xF3digo REEUP" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-c936b4b6></div><div class="w-full" data-v-c936b4b6><label class="block text-sm font-medium text-gray-700 mb-1" data-v-c936b4b6>Organismo</label><input type="text"${ssrRenderAttr("value", organismo.value)} placeholder="Ingrese organismo" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-c936b4b6></div><div class="w-full" data-v-c936b4b6><label class="block text-sm font-medium text-gray-700 mb-1" data-v-c936b4b6>Consecutivo</label><input type="text"${ssrRenderAttr("value", consecutivo.value)} placeholder="Ingrese consecutivo" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" data-v-c936b4b6></div></div><div class="flex justify-end mt-4 gap-2" data-v-c936b4b6><button class="px-6 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors" data-v-c936b4b6> Buscar </button><button class="px-6 py-2 bg-success text-neutral rounded-lg hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 transition-colors" data-v-c936b4b6> Exportar a Excel </button><button class="px-6 py-2 bg-info text-neutral rounded-lg hover:bg-info/90 focus:outline-none focus:ring-2 focus:ring-info focus:ring-offset-2 transition-colors" data-v-c936b4b6> Exportar a Excel con Contratos </button></div></div></div><div class="w-[95%] mx-auto px-4 py-4" data-v-c936b4b6><div class="flex justify-between items-center mb-4" data-v-c936b4b6><h2 class="text-2xl font-bold" data-v-c936b4b6>Entidades</h2><button class="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary flex items-center" data-v-c936b4b6><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c936b4b6><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-c936b4b6></path></svg> Nueva Entidad </button></div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: entidadesColumns,
        items: itemsData.value,
        actions: entidadesActions,
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
        entidad: selectedEntidad.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        onSubmit: handleEntidadSubmit
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/entidades.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const entidades = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c936b4b6"]]);

export { entidades as default };
//# sourceMappingURL=entidades-C1DgPWKR.mjs.map
