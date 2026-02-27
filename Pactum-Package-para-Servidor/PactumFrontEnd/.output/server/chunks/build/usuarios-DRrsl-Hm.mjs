import { ref, mergeProps, h, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "UsuarioModal",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    usuario: {
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
      nombre_usuario: "",
      cargo: "",
      rol: "",
      contrasenna: "",
      activo: true
    });
    const errorMsg = ref("");
    const isLoading = ref(false);
    const loadingBanner = ref(null);
    watch(() => props.usuario, (newUsuario) => {
      if (newUsuario && Object.keys(newUsuario).length > 0) {
        formData.value = { ...newUsuario };
        formData.value.contrasenna = "";
        if (typeof formData.value.carnet_identidad === "undefined") formData.value.carnet_identidad = "";
        if (typeof formData.value.activo === "undefined") formData.value.activo = true;
      } else {
        formData.value = {
          nombre: "",
          nombre_usuario: "",
          cargo: "",
          rol: "",
          carnet_identidad: "",
          contrasenna: "",
          activo: true
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
        _push(`<div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-gray-800">${ssrInterpolate(props.isViewing ? "Detalles de Usuario" : __props.isEditing ? "Editar Usuario" : "Nuevo Usuario")}</h2><button class="text-gray-500 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label><input${ssrRenderAttr("value", formData.value.nombre)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el nombre"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label><input${ssrRenderAttr("value", formData.value.nombre_usuario)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el nombre de usuario"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Cargo</label><input${ssrRenderAttr("value", formData.value.cargo)} type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el cargo"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Rol</label><select class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} required><option value=""${ssrIncludeBooleanAttr(Array.isArray(formData.value.rol) ? ssrLooseContain(formData.value.rol, "") : ssrLooseEqual(formData.value.rol, "")) ? " selected" : ""}>Seleccione un rol</option><option value="Administrador"${ssrIncludeBooleanAttr(Array.isArray(formData.value.rol) ? ssrLooseContain(formData.value.rol, "Administrador") : ssrLooseEqual(formData.value.rol, "Administrador")) ? " selected" : ""}>Administrador</option><option value="Comercial"${ssrIncludeBooleanAttr(Array.isArray(formData.value.rol) ? ssrLooseContain(formData.value.rol, "Comercial") : ssrLooseEqual(formData.value.rol, "Comercial")) ? " selected" : ""}>Comercial</option><option value="Invitado"${ssrIncludeBooleanAttr(Array.isArray(formData.value.rol) ? ssrLooseContain(formData.value.rol, "Invitado") : ssrLooseEqual(formData.value.rol, "Invitado")) ? " selected" : ""}>Invitado</option></select></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad</label><input${ssrRenderAttr("value", formData.value.carnet_identidad)} type="text" inputmode="numeric" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""} placeholder="Ingrese el carnet (11 d\xEDgitos)" maxlength="11" pattern="\\d{11}"></div>`);
        if (!props.isViewing) {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-1">Contrase\xF1a</label><input${ssrRenderAttr("value", formData.value.contrasenna)} type="password" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrIncludeBooleanAttr(props.isViewing) ? " readonly" : ""}${ssrIncludeBooleanAttr(props.isViewing || isLoading.value) ? " disabled" : ""}${ssrRenderAttr("placeholder", props.isEditing ? "Dejar vac\xEDo para mantener la contrase\xF1a actual" : "Ingrese la contrase\xF1a")} autocomplete="new-password"${ssrIncludeBooleanAttr(!props.isEditing) ? " required" : ""}></div>`);
        } else {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-1">Activo</label><button type="button" class="${ssrRenderClass([formData.value.activo ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700", "flex items-center px-3 py-2 rounded-lg border"])}" disabled>`);
          if (formData.value.activo) {
            _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`);
          } else {
            _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
          }
          _push(` ${ssrInterpolate(formData.value.activo ? "Activo" : "Inactivo")}</button></div>`);
        }
        if (props.isEditing && !props.isViewing) {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-1">Estado</label><button type="button" class="${ssrRenderClass([formData.value.activo ? "bg-green-100 border-green-400 text-green-700 hover:bg-green-200" : "bg-red-100 border-red-400 text-red-700 hover:bg-red-200", "flex items-center px-3 py-2 rounded-lg border transition-colors duration-200 hover:opacity-80"])}"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
          if (formData.value.activo) {
            _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`);
          } else {
            _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
          }
          _push(` ${ssrInterpolate(formData.value.activo ? "Activo" : "Inactivo")}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (!props.isViewing) {
          _push(`<div class="flex justify-end space-x-4 mt-6"><button type="button" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}> Cancelar </button><button type="submit" class="px-4 py-2 text-neutral bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""}>`);
          if (isLoading.value) {
            _push(`<span class="flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> ${ssrInterpolate(__props.isEditing ? "Guardando..." : "Creando...")}</span>`);
          } else {
            _push(`<span>${ssrInterpolate(__props.isEditing ? "Guardar Cambios" : "Crear Usuario")}</span>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UsuarioModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "usuarios",
  __ssrInlineRender: true,
  setup(__props) {
    const nombre = ref("");
    const nombre_usuario = ref("");
    const cargo = ref("");
    const carnet = ref("");
    const rol = ref("");
    const showFilters = ref(false);
    const config = useRuntimeConfig();
    const entidadesColumns = [
      { key: "id_usuario", label: "ID" },
      { key: "nombre", label: "Nombre de la Persona" },
      { key: "carnet_identidad", label: "Carnet Identidad" },
      { key: "nombre_usuario", label: "Nombre de Usuario" },
      { key: "cargo", label: "Cargo" },
      { key: "rol", label: "Rol" },
      {
        key: "activo",
        label: "Activo",
        cellRenderer: (value) => {
          if (value === true || value === 1 || value === "true" || value === "1") {
            return '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Activo</span>';
          } else {
            return '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactivo</span>';
          }
        }
      }
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
    const currentPage = ref(1);
    const totalItems = ref(0);
    const isLoading = ref(false);
    const itemsPorPage = ref(20);
    const itemsData = ref([]);
    const fetchItems = async (page = 1, limit = 20, nombre2 = "", nombre_usuario2 = "", cargo2 = "", rol2 = "", carnetFilter = "") => {
      try {
        isLoading.value = true;
        const token = localStorage.getItem("token");
        const bodyData = {
          nombre: nombre2,
          nombre_usuario: nombre_usuario2,
          cargo: cargo2,
          rol: rol2,
          carnet_identidad: carnetFilter
        };
        const response = await fetch(`${config.public.backendHost}/Usuario/filterUsers`, {
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
        itemsData.value = data || [];
        totalItems.value = itemsData.value.length;
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const handlePageChange = (newPage) => {
      currentPage.value = newPage;
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
        handler: (item) => {
          selectedUsuario.value = { ...item };
          isEditing.value = true;
          isViewing.value = false;
          showModal.value = true;
        }
      },
      {
        name: "Eliminar",
        icon: deleteIcon,
        handler: (item) => {
          usuarioAEliminar.value = item;
          showConfirmBanner.value = true;
        }
      }
    ];
    entidadesActions[0].buttonClass = "px-3 py-1 bg-accent text-neutral rounded-md hover:bg-accent/90";
    entidadesActions[1].buttonClass = "px-3 py-1 bg-danger text-neutral rounded-md hover:bg-danger/90";
    const handleRowClick = (item) => {
      selectedUsuario.value = item;
      isEditing.value = false;
      isViewing.value = true;
      showModal.value = true;
    };
    const errorBanner = ref(null);
    const showModal = ref(false);
    const selectedUsuario = ref({});
    const isEditing = ref(false);
    const isViewing = ref(false);
    const handleUsuarioSubmit = async (formData) => {
      try {
        const token = localStorage.getItem("token");
        const url = isEditing.value ? `${config.public.backendHost}/usuario/UpdateUsuario/${selectedUsuario.value.id_usuario}` : `${config.public.backendHost}/usuario/CreateUsuario`;
        console.log(formData);
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
          console.log(errorData);
          if (errorData.errors) {
            errorBanner.value = {
              title: `Errores de validaci\xF3n: ${response.status}`,
              description: errorData.errors,
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
              description: `El usuario ${formData.nombre} se actualiz\xF3 con \xE9xito`,
              type: "success"
            };
          } else {
            errorBanner.value = {
              title: `Entidad Creada: ${response.status}`,
              description: `El usuario ${formData.nombre} se creo con \xE9xito`,
              type: "success"
            };
          }
          await fetchItems(currentPage.value, itemsPorPage.value, nombre.value, nombre_usuario.value, cargo.value, rol.value, carnet.value);
        } else {
          console.error("Error al guardar Usuario");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const showConfirmBanner = ref(false);
    const usuarioAEliminar = ref(null);
    async function confirmDeleteUsuario() {
      showConfirmBanner.value = false;
      if (!usuarioAEliminar.value) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${config.public.backendHost}/Usuario/DeleteUsuario/${usuarioAEliminar.value.id_usuario}`, {
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
          return;
        }
        await fetchItems(currentPage.value, itemsPorPage.value, nombre.value, nombre_usuario.value, cargo.value, rol.value, carnet.value);
      } catch (error) {
      } finally {
        usuarioAEliminar.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))} data-v-8f5d3584>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Usuarios - Contract Manager",
        description: "Gestiona usuarios, roles y permisos en Contract Manager.",
        canonical: "/usuarios"
      }, null, _parent));
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none" data-v-8f5d3584>`);
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
        _push(`<div class="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-auto" data-v-8f5d3584>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          title: "\xBFEst\xE1s seguro que deseas eliminar este usuario?",
          description: "Esta acci\xF3n no se puede deshacer.",
          icon: deleteIcon,
          type: "warning",
          onConfirm: confirmDeleteUsuario,
          onClose: ($event) => showConfirmBanner.value = false
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-[95%] mx-auto px-4 py-4 md:py-4 mt-20 md:mt-0" data-v-8f5d3584><div class="bg-white rounded-lg shadow-md p-4" data-v-8f5d3584><div class="mb-4" data-v-8f5d3584><label class="block text-sm font-medium text-gray-700 mb-1" data-v-8f5d3584>Buscar por nombre</label><div class="relative" data-v-8f5d3584><input type="text"${ssrRenderAttr("value", nombre.value)} placeholder="Ingrese el nombre..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-8f5d3584><div class="absolute left-3 top-2.5" data-v-8f5d3584><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-8f5d3584><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-8f5d3584></path></svg></div></div></div><div class="md:hidden flex justify-between items-center mb-4" data-v-8f5d3584><button class="flex items-center text-blue-500 hover:text-blue-600" data-v-8f5d3584><span class="mr-2" data-v-8f5d3584>Filtros adicionales</span><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass([{ "rotate-180": showFilters.value }, "h-5 w-5 transform transition-transform"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-8f5d3584><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-8f5d3584></path></svg></button></div><div class="${ssrRenderClass([{ "hidden md:grid": !showFilters.value }, "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"])}" data-v-8f5d3584><div class="w-full" data-v-8f5d3584><label class="block text-sm font-medium text-gray-700 mb-1" data-v-8f5d3584>Buscar por nombre de usuario</label><div class="relative" data-v-8f5d3584><input type="text"${ssrRenderAttr("value", nombre_usuario.value)} placeholder="Ingrese nombre de usuario..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-8f5d3584><div class="absolute left-3 top-2.5" data-v-8f5d3584><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-8f5d3584><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-v-8f5d3584></path></svg></div></div></div><div class="w-full" data-v-8f5d3584><label class="block text-sm font-medium text-gray-700 mb-1" data-v-8f5d3584>Cargo</label><input type="text"${ssrRenderAttr("value", cargo.value)} placeholder="Ingrese cargo" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-8f5d3584></div><div class="w-full" data-v-8f5d3584><label class="block text-sm font-medium text-gray-700 mb-1" data-v-8f5d3584>Rol</label><select class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" data-v-8f5d3584><option value="" data-v-8f5d3584${ssrIncludeBooleanAttr(Array.isArray(rol.value) ? ssrLooseContain(rol.value, "") : ssrLooseEqual(rol.value, "")) ? " selected" : ""}>Todos los roles</option><option value="Administrador" data-v-8f5d3584${ssrIncludeBooleanAttr(Array.isArray(rol.value) ? ssrLooseContain(rol.value, "Administrador") : ssrLooseEqual(rol.value, "Administrador")) ? " selected" : ""}>Administrador</option><option value="Comercial" data-v-8f5d3584${ssrIncludeBooleanAttr(Array.isArray(rol.value) ? ssrLooseContain(rol.value, "Comercial") : ssrLooseEqual(rol.value, "Comercial")) ? " selected" : ""}>Comercial</option><option value="Invitado" data-v-8f5d3584${ssrIncludeBooleanAttr(Array.isArray(rol.value) ? ssrLooseContain(rol.value, "Invitado") : ssrLooseEqual(rol.value, "Invitado")) ? " selected" : ""}>Invitado</option></select></div><div class="w-full" data-v-8f5d3584><label class="block text-sm font-medium text-gray-700 mb-1" data-v-8f5d3584>Carnet de Identidad</label><input type="text"${ssrRenderAttr("value", carnet.value)} inputmode="numeric" placeholder="Solo d\xEDgitos (m\xE1x. 11)" class="w-full pl-3 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" maxlength="11" data-v-8f5d3584></div></div><div class="flex justify-end mt-4 gap-2" data-v-8f5d3584><button class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors" data-v-8f5d3584> Buscar </button><button class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors" data-v-8f5d3584> Exportar a Excel </button></div></div></div><div class="w-[95%] mx-auto px-4 py-4" data-v-8f5d3584><div class="flex justify-between items-center mb-4" data-v-8f5d3584><h2 class="text-2xl font-bold" data-v-8f5d3584>Usuarios</h2><button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center" data-v-8f5d3584><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-8f5d3584><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-8f5d3584></path></svg> Nuevo Usuario </button></div>`);
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
        usuario: selectedUsuario.value,
        "is-editing": isEditing.value,
        "is-viewing": isViewing.value,
        onSubmit: handleUsuarioSubmit
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/usuarios.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const usuarios = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8f5d3584"]]);

export { usuarios as default };
//# sourceMappingURL=usuarios-DRrsl-Hm.mjs.map
