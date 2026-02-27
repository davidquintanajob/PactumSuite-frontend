import { ref, mergeProps, h, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

const _sfc_main$1 = {
  __name: "TipoContratoModal",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    tipoContrato: {
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
      nombre: ""
    });
    const errorMsg = ref("");
    const isLoading = ref(false);
    const loadingBanner = ref(null);
    watch(() => props.tipoContrato, (newTipoContrato) => {
      if (newTipoContrato && Object.keys(newTipoContrato).length > 0) {
        formData.value = { nombre: newTipoContrato.nombre || "" };
      } else {
        formData.value = {
          nombre: ""
        };
      }
    }, { immediate: true });
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
        _push(`<div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-gray-800">${ssrInterpolate(__props.isViewing ? "Detalles de Tipo de Contrato" : __props.isEditing ? "Editar Tipo de Contrato" : "Nuevo Tipo de Contrato")}</h2><button class="text-gray-500 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label><input${ssrRenderAttr("value", formData.value.nombre)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el nombre del tipo de contrato"></div></div>`);
        if (!__props.isViewing) {
          _push(`<div class="flex justify-end space-x-4 mt-6"><button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}> Cancelar </button><button type="submit" class="px-4 py-2 text-neutral bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
          if (isLoading.value) {
            _push(`<span class="flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${ssrInterpolate(__props.isEditing ? "Guardando..." : "Creando...")}</span>`);
          } else {
            _push(`<span>${ssrInterpolate(__props.isEditing ? "Guardar Cambios" : "Crear Tipo de Contrato")}</span>`);
          }
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TipoContratoModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "tipos-contratos",
  __ssrInlineRender: true,
  setup(__props) {
    ref("");
    ref("");
    ref("");
    ref("");
    ref("");
    ref("");
    ref("");
    ref(false);
    const config = useRuntimeConfig();
    const entidadesColumns = [
      { key: "id_tipo_contrato", label: "ID" },
      { key: "nombre", label: "Nombre del Tipo Contrato" }
    ];
    const currentPage = ref(1);
    const totalItems = ref(0);
    const isLoading = ref(false);
    const itemsPorPage = ref(20);
    const itemsData = ref([]);
    const showModal = ref(false);
    const selectedTipoContrato = ref({});
    const isEditing = ref(false);
    const isViewing = ref(false);
    const errorBanner = ref(null);
    const showConfirmBanner = ref(false);
    const tipoContratoAEliminar = ref(null);
    const fetchItems = async (page = 1, limit = 20) => {
      try {
        isLoading.value = true;
        const token = localStorage.getItem("token");
        const response = await fetch(`${config.public.backendHost}/tipoContrato`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
        const data = await response.json();
        itemsData.value = data.data || [];
        totalItems.value = itemsData.value.length;
      } catch (error) {
        console.error("Error al cargar las entidades:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
      fetchItems(newPage, itemsPorPage.value);
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
    async function confirmDeleteTipoContrato() {
      showConfirmBanner.value = false;
      if (!tipoContratoAEliminar.value) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${config.public.backendHost}/tipoContrato/deleteContrato/${tipoContratoAEliminar.value.id_tipo_contrato}`, {
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
          title: "Tipo de Contrato eliminado",
          description: `El tipo de contrato fue eliminado correctamente`,
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
        tipoContratoAEliminar.value = null;
      }
    }
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
        handler: (item) => {
          selectedTipoContrato.value = { ...item };
          isEditing.value = true;
          isViewing.value = false;
          showModal.value = true;
        }
      },
      {
        name: "Eliminar",
        icon: deleteIcon,
        handler: (item) => {
          tipoContratoAEliminar.value = item;
          showConfirmBanner.value = true;
        }
      }
    ];
    entidadesActions[0].buttonClass = "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90";
    entidadesActions[1].buttonClass = "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90";
    const handleRowClick = (item) => {
      selectedTipoContrato.value = { ...item };
      isEditing.value = false;
      isViewing.value = true;
      showModal.value = true;
    };
    const handleTipoContratoSubmit = async (formData) => {
      try {
        const token = localStorage.getItem("token");
        const url = isEditing.value ? `${config.public.backendHost}/tipoContrato/UpdateContrato/${selectedTipoContrato.value.id_tipo_contrato}` : `${config.public.backendHost}/tipoContrato/CreateContrato`;
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
              title: `Tipo de Contrato Actualizado: ${response.status}`,
              description: `El tipo de contrato ${formData.nombre} se actualiz\xF3 con \xE9xito`,
              type: "success"
            };
            showModal.value = false;
          } else {
            errorBanner.value = {
              title: `Tipo de Contrato Creado: ${response.status}`,
              description: `El tipo de contrato ${formData.nombre} se cre\xF3 con \xE9xito`,
              type: "success"
            };
            showModal.value = false;
          }
          await fetchItems(currentPage.value, itemsPorPage.value);
        } else {
          console.error("Error al guardar el tipo de contrato");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))} data-v-386e9101>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Tipos de Contrato - Contract Manager",
        description: "Gestiona los diferentes tipos de contrato disponibles.",
        canonical: "/tipos-contratos"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none" data-v-386e9101>`);
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
        _push(`<div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto" data-v-386e9101>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          title: "\xBFEst\xE1s seguro que deseas eliminar este tipo de contrato?",
          description: "Esta acci\xF3n no se puede deshacer.",
          icon: deleteIcon,
          type: "warning",
          onConfirm: confirmDeleteTipoContrato,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="container mx-auto px-4 py-4 md:py-4 pt-8 md:pt-4" data-v-386e9101><div class="flex justify-between items-center mb-4" data-v-386e9101><h2 class="text-2xl font-bold mb-4" data-v-386e9101>Tipos de Contrato</h2><button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center" data-v-386e9101><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-386e9101><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-386e9101></path></svg> Nuevo Tipo de Contrato </button></div>`);
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
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: showModal.value,
        "onUpdate:modelValue": ($event) => showModal.value = $event,
        "tipo-contrato": selectedTipoContrato.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        onSubmit: handleTipoContratoSubmit
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tipos-contratos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const tiposContratos = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-386e9101"]]);

export { tiposContratos as default };
//# sourceMappingURL=tipos-contratos-1hUicOmq.mjs.map
