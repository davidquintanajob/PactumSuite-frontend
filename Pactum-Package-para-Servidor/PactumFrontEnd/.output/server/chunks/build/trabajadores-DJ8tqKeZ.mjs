import { ref, mergeProps, h, watch, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { S as SeoMeta } from './SeoMeta-qEdMXUp-.mjs';
import { N as Navbar } from './Navbar-BXeboE4m.mjs';
import { D as DataTable } from './DataTable-m2GVgsth.mjs';
import { _ as _sfc_main$3 } from './MessageBanner-BfG2bL-b.mjs';
import { _ as _sfc_main$5 } from './SelectSearch-DDW7FYzz.mjs';
import { u as useRouter, b as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$4 } from './ConfirmBanner-D2jJGKTl.mjs';
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

const contratosPerPage = 5;
const _sfc_main$2 = {
  __name: "TrabajadorModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, required: true },
    trabajador: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
    isViewing: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formData = ref({
      nombre: "",
      cargo: "",
      carnet_identidad: "",
      num_telefono: "",
      firma: ""
    });
    const funcionOptions = ref([
      { label: "Concidia", value: "Concidia" },
      { label: "Firma", value: "Firma" },
      { label: "Concidia y Firma", value: "Concidia y Firma" }
    ]);
    const errorMsg = ref("");
    const isLoading = ref(false);
    const loadingBanner = ref(null);
    watch(() => props.trabajador, (trabajador) => {
      if (trabajador && Object.keys(trabajador).length > 0) {
        formData.value = {
          nombre: trabajador.nombre || "",
          cargo: trabajador.cargo || "",
          carnet_identidad: trabajador.carnet_identidad || "",
          num_telefono: trabajador.num_telefono || "",
          firma: trabajador.funcion || ""
        };
      } else {
        formData.value = {
          nombre: "",
          cargo: "",
          carnet_identidad: "",
          num_telefono: "",
          firma: ""
        };
      }
    }, { immediate: true });
    const contratosColumns = [
      { key: "id_contrato", label: "ID Contrato" },
      { key: "fecha_inicio", label: "Fecha de Inicio" },
      { key: "fecha_fin", label: "Fecha de Fin" },
      { key: "entidad_nombre", label: "Entidad" },
      { key: "tipo_contrato_nombre", label: "Tipo de Contrato" }
    ];
    const contratosData = computed(() => {
      if (!props.trabajador || !Array.isArray(props.trabajador.contratos)) return [];
      return props.trabajador.contratos.map((c) => {
        var _a, _b;
        return {
          id_contrato: c.id_contrato,
          fecha_inicio: c.fecha_inicio ? c.fecha_inicio.split("T")[0] : "",
          fecha_fin: c.fecha_fin ? c.fecha_fin.split("T")[0] : "",
          entidad_nombre: ((_a = c.entidad) == null ? void 0 : _a.nombre) || "",
          tipo_contrato_nombre: ((_b = c.tipoContrato) == null ? void 0 : _b.nombre) || ""
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
          _push(ssrRenderComponent(_sfc_main$3, {
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
        _push(`<div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-gray-800">${ssrInterpolate(__props.isViewing ? "Detalles de Trabajador" : __props.isEditing ? "Editar Trabajador" : "Nuevo Trabajador")}</h2><button class="text-gray-500 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label><input${ssrRenderAttr("value", formData.value.nombre)} type="text" required${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el nombre del trabajador"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Cargo</label><input${ssrRenderAttr("value", formData.value.cargo)} type="text"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el cargo"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad</label><input${ssrRenderAttr("value", formData.value.carnet_identidad)} type="text" required${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el carnet de identidad" maxlength="11"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Tel\xE9fono</label><input${ssrRenderAttr("value", formData.value.num_telefono)} type="text"${ssrIncludeBooleanAttr(__props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(__props.isViewing || isLoading.value) ? " disabled" : ""} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ingrese el n\xFAmero de tel\xE9fono"></div></div><div class="mt-4"><label class="block text-sm font-medium text-gray-700 mb-1">Funci\xF3n</label>`);
        _push(ssrRenderComponent(_sfc_main$5, {
          modelValue: formData.value.firma,
          "onUpdate:modelValue": ($event) => formData.value.firma = $event,
          options: funcionOptions.value,
          labelKey: "label",
          valueKey: "value",
          placeholder: "Seleccionar funci\xF3n...",
          readonly: __props.isViewing,
          disabled: __props.isViewing || isLoading.value,
          required: ""
        }, null, _parent));
        _push(`</div>`);
        if (!__props.isViewing) {
          _push(`<div class="flex justify-end space-x-4 mt-6"><button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}> Cancelar </button><button type="submit" class="px-4 py-2 text-neutral bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
          if (isLoading.value) {
            _push(`<span class="flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${ssrInterpolate(__props.isEditing ? "Guardando..." : "Creando...")}</span>`);
          } else {
            _push(`<span>${ssrInterpolate(__props.isEditing ? "Guardar Cambios" : "Crear Trabajador")}</span>`);
          }
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
        if (__props.isViewing || __props.isEditing) {
          _push(`<div class="mt-8"><h3 class="text-lg font-semibold mb-2">Contratos Asociados</h3>`);
          _push(ssrRenderComponent(DataTable, {
            columns: contratosColumns,
            items: contratosData.value,
            "total-items": contratosTotal.value,
            "items-per-page": contratosPerPage,
            "current-page": contratosPage.value,
            "is-loading": false,
            "show-actions": false,
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TrabajadorModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "TrabajadorAsociacionModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean, required: true },
    trabajador: { type: Object, default: () => ({}) },
    entidades: { type: Array, default: () => [] }
  },
  emits: ["update:modelValue", "save-associations"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const trabajador = computed(() => props.trabajador);
    const isLoading = ref(false);
    const isLoadingMore = ref(false);
    const contratosDisponibles = ref([]);
    const contratosAsociados = ref([]);
    const currentPage = ref(1);
    const hasNextPage = ref(true);
    ref(null);
    const filtros = ref({
      numConsecutivo: "",
      entidad: null,
      tipoContrato: null
    });
    const opcionesEntidades = computed(
      () => props.entidades.map((e) => ({ value: e.id_entidad, label: e.nombre }))
    );
    const opcionesTiposContrato = ref([]);
    const contratosOriginales = ref([]);
    const contratosAsociadosIds = ref([]);
    const contratosDisponiblesIds = ref([]);
    const formatDate = (dateString) => {
      if (!dateString) return "Sin fecha";
      return new Date(dateString).toLocaleDateString("es-ES");
    };
    const fetchContratos = async (page = 1, append = false) => {
      if (page === 1) {
        isLoading.value = true;
      } else {
        isLoadingMore.value = true;
      }
      try {
        const token = localStorage.getItem("token");
        const config = useRuntimeConfig();
        const body = {
          // Aquí puedes agregar filtros específicos si los necesitas
          // Por ejemplo: entidad: filtros.value.entidad,
          // tipoContrato: filtros.value.tipoContrato
        };
        const res = await fetch(`${config.public.backendHost}/contrato/filter/${page}/700`, {
          method: "POST",
          headers: {
            "Authorization": token,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
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
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          if (append) {
            const todosLosContratos = [...contratosOriginales.value, ...data.data];
            contratosOriginales.value = todosLosContratos;
          } else {
            contratosOriginales.value = data.data;
          }
          if (!append) {
            if (trabajador.value && trabajador.value.contratos) {
              contratosAsociadosIds.value = trabajador.value.contratos.map((c) => c.id_contrato);
            } else {
              contratosAsociadosIds.value = [];
            }
            contratosDisponiblesIds.value = contratosOriginales.value.map((c) => c.id_contrato).filter((id) => !contratosAsociadosIds.value.includes(id));
          } else {
            const nuevosIds = data.data.map((c) => c.id_contrato).filter((id) => !contratosAsociadosIds.value.includes(id));
            contratosDisponiblesIds.value.push(...nuevosIds.filter((id) => !contratosDisponiblesIds.value.includes(id)));
          }
          aplicarFiltrosLocales();
          if (data.pagination) {
            hasNextPage.value = data.pagination.hasNextPage;
            currentPage.value = data.pagination.currentPage;
          }
        } else {
          if (!append) {
            contratosDisponibles.value = [];
            contratosAsociados.value = [];
          }
        }
      } catch (error) {
        console.error("Error al cargar contratos:", error);
        if (!append) {
          contratosDisponibles.value = [];
          contratosAsociados.value = [];
        }
      } finally {
        isLoading.value = false;
        isLoadingMore.value = false;
      }
    };
    const errorBanner = ref(null);
    function aplicarFiltrosLocales() {
      let disponibles = contratosOriginales.value.filter((c) => contratosDisponiblesIds.value.includes(c.id_contrato));
      let asociados = contratosOriginales.value.filter((c) => contratosAsociadosIds.value.includes(c.id_contrato));
      if (filtros.value.numConsecutivo) {
        disponibles = disponibles.filter((c) => String(c.num_consecutivo).includes(String(filtros.value.numConsecutivo)));
        asociados = asociados.filter((c) => String(c.num_consecutivo).includes(String(filtros.value.numConsecutivo)));
      }
      if (filtros.value.entidad) {
        disponibles = disponibles.filter((c) => {
          var _a;
          return String((_a = c.entidad) == null ? void 0 : _a.id_entidad) === String(filtros.value.entidad);
        });
        asociados = asociados.filter((c) => {
          var _a;
          return String((_a = c.entidad) == null ? void 0 : _a.id_entidad) === String(filtros.value.entidad);
        });
      }
      if (filtros.value.tipoContrato) {
        disponibles = disponibles.filter((c) => {
          var _a;
          return String((_a = c.tipoContrato) == null ? void 0 : _a.id_tipo_contrato) === String(filtros.value.tipoContrato);
        });
        asociados = asociados.filter((c) => {
          var _a;
          return String((_a = c.tipoContrato) == null ? void 0 : _a.id_tipo_contrato) === String(filtros.value.tipoContrato);
        });
      }
      contratosDisponibles.value = disponibles;
      contratosAsociados.value = asociados;
    }
    watch(filtros, (nuevosFiltros) => {
      aplicarFiltrosLocales();
    }, { deep: true });
    watch(() => props.modelValue, async (val) => {
      if (val) {
        await fetchTiposContrato();
        resetearYRecargar();
      }
    });
    const fetchTiposContrato = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = useRuntimeConfig();
        const res = await fetch(`${config.public.backendHost}/tipoContrato`, {
          method: "GET",
          headers: {
            "Authorization": token,
            "Accept": "application/json"
          }
        });
        const data = await res.json();
        opcionesTiposContrato.value = Array.isArray(data.data) ? data.data.map((t) => ({ value: t.id_tipo_contrato, label: t.nombre })) : [];
      } catch (error) {
        opcionesTiposContrato.value = [];
      }
    };
    const resetearYRecargar = () => {
      currentPage.value = 1;
      hasNextPage.value = true;
      contratosDisponibles.value = [];
      contratosAsociados.value = [];
      contratosOriginales.value = [];
      contratosDisponiblesIds.value = [];
      contratosAsociadosIds.value = [];
      fetchContratos(1, false);
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.modelValue) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" }, _attrs))}><div class="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">`);
        if (errorBanner.value) {
          _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">`);
          _push(ssrRenderComponent(_sfc_main$3, {
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
        _push(`<div class="p-6 border-b border-gray-200"><div class="flex justify-between items-center mb-4"><div><h2 class="text-2xl font-bold text-gray-800">Asociar Trabajador a Contratos</h2>`);
        if (trabajador.value) {
          _push(`<p class="text-sm text-gray-600 mt-1"> Trabajador: <span class="font-medium">${ssrInterpolate(trabajador.value.nombre)}</span> - <span class="font-medium">${ssrInterpolate(trabajador.value.cargo)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="text-gray-500 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">N\xFAmero consecutivo</label><input${ssrRenderAttr("value", filtros.value.numConsecutivo)} type="number" min="0" class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar por n\xFAmero..."></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Entidad</label>`);
        _push(ssrRenderComponent(_sfc_main$5, {
          modelValue: filtros.value.entidad,
          "onUpdate:modelValue": ($event) => filtros.value.entidad = $event,
          options: opcionesEntidades.value,
          labelKey: "label",
          valueKey: "value",
          placeholder: "Seleccionar entidad...",
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>`);
        _push(ssrRenderComponent(_sfc_main$5, {
          modelValue: filtros.value.tipoContrato,
          "onUpdate:modelValue": ($event) => filtros.value.tipoContrato = $event,
          options: opcionesTiposContrato.value,
          labelKey: "label",
          valueKey: "value",
          placeholder: "Seleccionar tipo...",
          class: "w-full"
        }, null, _parent));
        _push(`</div></div></div><div class="flex-1 flex overflow-hidden"><div class="w-1/2 border-r border-gray-200 p-4 overflow-y-auto"><h3 class="text-lg font-semibold mb-4 text-primary">Contratos Existentes</h3>`);
        if (isLoading.value && contratosDisponibles.value.length === 0) {
          _push(`<div class="flex justify-center items-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>`);
        } else {
          _push(`<div class="space-y-2"><!--[-->`);
          ssrRenderList(contratosDisponibles.value, (contrato) => {
            var _a, _b;
            _push(`<div class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-accent/10 hover:border-accent/40 transition-colors"><div class="flex items-center justify-between"><div class="flex-1"><h4 class="font-bold text-gray-900">${ssrInterpolate(((_a = contrato.entidad) == null ? void 0 : _a.nombre) || "Sin entidad")}</h4><p class="text-sm text-gray-600">N\xB0 ${ssrInterpolate(contrato.num_consecutivo)}</p><p class="text-sm text-gray-600">${ssrInterpolate(((_b = contrato.tipoContrato) == null ? void 0 : _b.nombre) || "Sin tipo")}</p><p class="text-xs text-gray-500">${ssrInterpolate(formatDate(contrato.fecha_inicio))} - ${ssrInterpolate(formatDate(contrato.fecha_fin))}</p></div><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></div></div>`);
          });
          _push(`<!--]-->`);
          if (isLoadingMore.value) {
            _push(`<div class="flex justify-center items-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div><div class="w-1/2 p-4 overflow-y-auto"><h3 class="text-lg font-semibold mb-4 text-green-600">Contratos Asociados</h3><div class="space-y-2"><!--[-->`);
        ssrRenderList(contratosAsociados.value, (contrato) => {
          var _a, _b;
          _push(`<div class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-success/10 hover:border-success/40 transition-colors"><div class="flex items-center justify-between"><div class="flex-1"><h4 class="font-bold text-gray-900">${ssrInterpolate(((_a = contrato.entidad) == null ? void 0 : _a.nombre) || "Sin entidad")}</h4><p class="text-sm text-gray-600">N\xB0 ${ssrInterpolate(contrato.num_consecutivo)}</p><p class="text-sm text-gray-600">${ssrInterpolate(((_b = contrato.tipoContrato) == null ? void 0 : _b.nombre) || "Sin tipo")}</p><p class="text-xs text-gray-500">${ssrInterpolate(formatDate(contrato.fecha_inicio))} - ${ssrInterpolate(formatDate(contrato.fecha_fin))}</p></div><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></div></div>`);
        });
        _push(`<!--]--></div></div></div><div class="p-4 border-t border-gray-200 bg-gray-50"><div class="flex justify-between items-center"><div class="text-sm text-gray-600"><span class="font-medium">${ssrInterpolate(contratosDisponibles.value.length)}</span> contratos disponibles | <span class="font-medium">${ssrInterpolate(contratosAsociados.value.length)}</span> contratos asociados </div><div class="flex space-x-3"><button class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"> Cancelar </button><button class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"> Guardar Asociaciones </button></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TrabajadorAsociacionModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "trabajadores",
  __ssrInlineRender: true,
  setup(__props) {
    const { navigateTo: navigateTo2 } = useRouter();
    const searchNombre = ref("");
    const searchCargo = ref("");
    const searchCarnet = ref("");
    const searchEntidad = ref("");
    const searchFuncion = ref("");
    const funcionOptions = ref([
      { label: "Todos", value: "" },
      { label: "Concidia", value: "Concidia" },
      { label: "Firma", value: "Firma" },
      { label: "Concidia y Firma", value: "Concidia y Firma" }
    ]);
    const trabajadoresData = ref([]);
    const totalTrabajadores = ref(0);
    const itemsPorPage = ref(10);
    const currentPage = ref(1);
    const isLoading = ref(false);
    const showModal = ref(false);
    const showAsociacionModal = ref(false);
    const selectedTrabajador = ref(null);
    const entidades = ref([]);
    const isEditing = ref(false);
    const isViewing = ref(false);
    const errorBanner = ref(null);
    const showConfirmBanner = ref(false);
    const trabajadorAEliminar = ref(null);
    const trabajadoresColumns = [
      { key: "nombre", label: "Nombre" },
      { key: "cargo", label: "Cargo" },
      { key: "carnet_identidad", label: "Carnet" },
      { key: "funcion", label: "Funci\xF3n" },
      { key: "contratosAsociados", label: "Contratos Asociados" }
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
    const trabajadoresActions = [
      {
        name: "Editar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" })
            ]);
          }
        },
        handler: (trabajador) => {
          selectedTrabajador.value = trabajador;
          isEditing.value = true;
          isViewing.value = false;
          showModal.value = true;
        },
        buttonClass: "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90"
      },
      {
        name: "Asociar",
        icon: {
          render() {
            return h("svg", { xmlns: "http://www.w3.org/2000/svg", class: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, [
              h("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" })
            ]);
          }
        },
        handler: (trabajador) => {
          selectedTrabajador.value = trabajador;
          showAsociacionModal.value = true;
        },
        buttonClass: "px-3 py-1 bg-primary text-neutral rounded-md hover:bg-primary/90"
      },
      {
        name: "Eliminar",
        icon: deleteIcon,
        handler: (trabajador) => {
          trabajadorAEliminar.value = trabajador;
          showConfirmBanner.value = true;
        },
        buttonClass: "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90"
      }
    ];
    const fetchTrabajadores = async (page = currentPage.value, limit = itemsPorPage.value) => {
      var _a;
      isLoading.value = true;
      try {
        const token = localStorage.getItem("token");
        const config = useRuntimeConfig();
        const body = {
          nombre: searchNombre.value,
          cargo: searchCargo.value,
          carnet_identidad: searchCarnet.value,
          id_entidad: searchEntidad.value,
          funcion: searchFuncion.value
        };
        const res = await fetch(`${config.public.backendHost}/trabajadorAutorizado/filter/${page}/${limit}`, {
          method: "POST",
          headers: {
            "Authorization": token,
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        trabajadoresData.value = Array.isArray(data.data) ? data.data.map((t) => ({ ...t, contratosAsociados: Array.isArray(t.contratos) ? t.contratos.length : 0 })) : [];
        totalTrabajadores.value = ((_a = data.pagination) == null ? void 0 : _a.total) || 0;
      } catch (error) {
        trabajadoresData.value = [];
        totalTrabajadores.value = 0;
      } finally {
        isLoading.value = false;
      }
    };
    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchTrabajadores(page);
    };
    const handleRowClick = (item) => {
      selectedTrabajador.value = item;
      isEditing.value = false;
      isViewing.value = true;
      showModal.value = true;
    };
    const handleSubmit = async (trabajador) => {
      try {
        const token = localStorage.getItem("token");
        const config = useRuntimeConfig();
        const url = isEditing.value ? `${config.public.backendHost}/trabajadorAutorizado/UpdateTrabajadorAutorizado/${selectedTrabajador.value.id_trabajador_autorizado}` : `${config.public.backendHost}/trabajadorAutorizado/createTrabajadorAutorizado`;
        const response = await fetch(url, {
          method: isEditing.value ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
            "Accept": "application/json"
          },
          body: JSON.stringify(trabajador)
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
            navigateTo2("/");
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
              title: `Trabajador Actualizado: ${response.status}`,
              description: `El trabajador ${trabajador.nombre} se actualiz\xF3 con \xE9xito`,
              type: "success"
            };
          } else {
            errorBanner.value = {
              title: `Trabajador Creado: ${response.status}`,
              description: `El trabajador ${trabajador.nombre} se cre\xF3 con \xE9xito`,
              type: "success"
            };
          }
          await fetchTrabajadores(currentPage.value, itemsPorPage.value);
          showModal.value = false;
          selectedTrabajador.value = null;
          isEditing.value = false;
          isViewing.value = false;
        } else {
          console.error("Error al guardar el trabajador");
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
    const handleSaveAssociations = (data) => {
      console.log("Guardando asociaciones:", data);
      showAsociacionModal.value = false;
      fetchTrabajadores();
    };
    async function confirmDeleteTrabajador() {
      showConfirmBanner.value = false;
      if (!trabajadorAEliminar.value) return;
      try {
        const token = localStorage.getItem("token");
        const config = useRuntimeConfig();
        const response = await fetch(`${config.public.backendHost}/trabajadorAutorizado/DeleteTrabajadorAutorizado/${trabajadorAEliminar.value.id_trabajador_autorizado}`, {
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
            navigateTo2("/");
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
          title: "Trabajador eliminado",
          description: `El trabajador fue eliminado correctamente`,
          type: "success"
        };
        await fetchTrabajadores(currentPage.value, itemsPorPage.value);
      } catch (error) {
        errorBanner.value = {
          title: "Error",
          description: error.message,
          type: "error"
        };
      } finally {
        trabajadorAEliminar.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))}>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Trabajadores - Contract Manager",
        description: "Registra y gestiona trabajadores autorizados y sus contratos.",
        canonical: "/trabajadores"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">`);
        _push(ssrRenderComponent(_sfc_main$3, {
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
        _push(ssrRenderComponent(_sfc_main$4, {
          title: "\xBFEst\xE1s seguro que deseas eliminar este trabajador?",
          description: "Esta acci\xF3n no se puede deshacer.",
          type: "warning",
          onConfirm: confirmDeleteTrabajador,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0"><div class="bg-white rounded-lg shadow-md p-4"><div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 md:mb-2"><div><label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label><div class="relative"><input type="text"${ssrRenderAttr("value", searchNombre.value)} placeholder="Ingrese el nombre..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"><div class="absolute left-3 top-2.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div></div></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Buscar por cargo</label><input type="text"${ssrRenderAttr("value", searchCargo.value)} placeholder="Ingrese el cargo..." class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad</label><input type="text"${ssrRenderAttr("value", searchCarnet.value)} placeholder="Carnet de identidad..." maxlength="11" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Entidad</label>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        modelValue: searchEntidad.value,
        "onUpdate:modelValue": ($event) => searchEntidad.value = $event,
        options: entidades.value,
        labelKey: "nombre",
        valueKey: "id_entidad",
        placeholder: "Buscar entidad..."
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Funci\xF3n</label>`);
      _push(ssrRenderComponent(_sfc_main$5, {
        modelValue: searchFuncion.value,
        "onUpdate:modelValue": ($event) => searchFuncion.value = $event,
        options: funcionOptions.value,
        labelKey: "label",
        valueKey: "value",
        placeholder: "Seleccionar funci\xF3n..."
      }, null, _parent));
      _push(`</div></div><div class="flex justify-end mt-4 gap-2 flex-wrap"><button class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"> Buscar </button><button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z"></path></svg> Exportar a Excel </button><button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12h2v2H7v-2zM11 12h2v2h-2v-2zM15 12h2v2h-2v-2z"></path></svg> Exportar a Excel con Contratos </button></div></div></div><div class="w-[95%] mx-auto px-4 py-4"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Trabajadores Autorizados</h2><button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Nuevo Trabajador </button></div>`);
      _push(ssrRenderComponent(DataTable, {
        columns: trabajadoresColumns,
        items: trabajadoresData.value,
        actions: trabajadoresActions,
        "total-items": totalTrabajadores.value,
        "items-per-page": itemsPorPage.value,
        "current-page": currentPage.value,
        "is-loading": isLoading.value,
        onPageChange: handlePageChange,
        onRowClick: handleRowClick
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: showModal.value,
        "onUpdate:modelValue": ($event) => showModal.value = $event,
        trabajador: selectedTrabajador.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        onSubmit: handleSubmit
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: showAsociacionModal.value,
        "onUpdate:modelValue": ($event) => showAsociacionModal.value = $event,
        trabajador: selectedTrabajador.value,
        entidades: entidades.value,
        onSaveAssociations: handleSaveAssociations
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/trabajadores.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=trabajadores-DJ8tqKeZ.mjs.map
