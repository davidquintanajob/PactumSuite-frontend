import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { D as DataTable } from './DataTable-CB1qJ3I1.mjs';
import { N as Navbar } from './Navbar-B8bjDViK.mjs';
import { _ as _sfc_main$1 } from './MessageBanner-UgGYw58j.mjs';
import './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "perfil",
  __ssrInlineRender: true,
  setup(__props) {
    const user = ref(null);
    const facturasData = ref([]);
    const facturasPage = ref(1);
    const ofertasData = ref([]);
    const ofertasPage = ref(1);
    const isLoading = ref(false);
    const isChangingPassword = ref(false);
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const errorBanner = ref(null);
    const facturasColumns = [
      { key: "num_consecutivo", label: "Num. Consecutivo" },
      {
        key: "fecha",
        label: "Fecha",
        cellRenderer: (value) => {
          if (!value) return "";
          const fechaFormateada = value.substring(0, 10);
          return `<span class="px-2 py-1 rounded text-sm">${fechaFormateada}</span>`;
        }
      },
      {
        key: "estado",
        label: "Estado",
        cellRenderer: (value) => {
          if (!value) return "";
          let bgColor = "";
          if (value === "Facturado") bgColor = "bg-green-100 text-green-800";
          else if (value === "No Facturado") bgColor = "bg-yellow-100 text-yellow-800";
          else if (value === "Cancelado") bgColor = "bg-red-100 text-red-800";
          return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor}">${value}</span>`;
        }
      },
      {
        key: "contrato.ClienteOProveedor",
        label: "Cliente o Proveedor",
        cellRenderer: (value) => {
          if (!value) return "";
          const bgColor = value === "Cliente" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800";
          return `<span class="px-2 py-1 rounded-full text-sm font-medium ${bgColor}">${value}</span>`;
        }
      },
      { key: "contrato.num_consecutivo", label: "Contrato" },
      { key: "contrato.tipoContrato.nombre", label: "Tipo Contrato" },
      {
        key: "importe",
        label: "Importe",
        cellRenderer: (value) => {
          if (value == null || value === "") return "";
          const num = parseFloat(value);
          if (isNaN(num)) return value;
          return `<span class="px-2 py-1 rounded text-sm">${num.toFixed(2)}</span>`;
        }
      }
    ];
    const ofertasColumns = [
      { key: "id_oferta", label: "ID Oferta" },
      { key: "descripcion", label: "Descripci\xF3n" },
      { key: "fecha_inicio", label: "Fecha Inicio", format: (val) => val == null ? void 0 : val.substring(0, 10) },
      { key: "fecha_fin", label: "Fecha Fin", format: (val) => val == null ? void 0 : val.substring(0, 10) },
      { key: "id_contrato", label: "ID Contrato" }
    ];
    function handleFacturasPageChange(page) {
      facturasPage.value = page;
    }
    function handleOfertasPageChange(page) {
      ofertasPage.value = page;
    }
    const canSubmitPassword = computed(() => {
      return newPassword.value.length > 0 && confirmPassword.value.length > 0 && newPassword.value === confirmPassword.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral flex flex-col items-center py-12" }, _attrs))}>`);
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      if (errorBanner.value) {
        _push(`<div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">`);
        _push(ssrRenderComponent(_sfc_main$1, {
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
      _push(`<div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mt-8"><div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold text-blue-700">Mi Perfil</h2><button class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"> Cerrar sesi\xF3n </button></div>`);
      if (user.value) {
        _push(`<div class="space-y-4"><div class="flex flex-col gap-2"><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Nombre:</span><span class="text-gray-900">${ssrInterpolate(user.value.nombre)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Usuario:</span><span class="text-gray-900">${ssrInterpolate(user.value.nombre_usuario)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Carnet de Identidad:</span><span class="text-gray-900">${ssrInterpolate(user.value.carnet_identidad)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Cargo:</span><span class="text-gray-900">${ssrInterpolate(user.value.cargo)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Rol:</span><span class="text-gray-900">${ssrInterpolate(user.value.rol)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Estado:</span><span class="${ssrRenderClass([user.value.activo ? "bg-success" : "bg-danger", "px-3 py-1 rounded-full text-neutral text-xs font-semibold"])}">${ssrInterpolate(user.value.activo ? "Activo" : "Inactivo")}</span></div></div><div class="mt-6 border-t pt-6"><h3 class="text-lg font-semibold text-blue-700 mb-4">Cambiar contrase\xF1a</h3><div class="space-y-3"><div><label class="block text-sm font-medium text-gray-700 mb-1">Contrase\xF1a actual</label><input type="password"${ssrRenderAttr("value", oldPassword.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ingresa tu contrase\xF1a actual"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Nueva contrase\xF1a</label><input type="password"${ssrRenderAttr("value", newPassword.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ingresa la nueva contrase\xF1a"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contrase\xF1a</label><input type="password"${ssrRenderAttr("value", confirmPassword.value)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Confirma la nueva contrase\xF1a"></div><div class="flex justify-end"><button${ssrIncludeBooleanAttr(isChangingPassword.value || !canSubmitPassword.value) ? " disabled" : ""} class="${ssrRenderClass(["px-6 py-2 rounded-lg transition-colors", !canSubmitPassword.value || isChangingPassword.value ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-primary text-neutral hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"])}">${ssrInterpolate(isChangingPassword.value ? "Cambiando..." : "Cambiar contrase\xF1a")}</button></div>`);
        if (newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value) {
          _push(`<p class="text-sm text-red-600">Las nuevas contrase\xF1as no coinciden.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<div class="text-center text-gray-500">Cargando datos...</div>`);
      }
      _push(`</div><div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mt-8"><h3 class="text-xl font-semibold text-blue-700 mb-4">Facturas del usuario</h3>`);
      _push(ssrRenderComponent(DataTable, {
        columns: facturasColumns,
        items: facturasData.value,
        "total-items": facturasData.value.length,
        "items-per-page": 10,
        "current-page": facturasPage.value,
        "is-loading": isLoading.value,
        "show-actions": false,
        onPageChange: handleFacturasPageChange
      }, null, _parent));
      _push(`</div><div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mt-8"><h3 class="text-xl font-semibold text-blue-700 mb-4">Ofertas del usuario</h3>`);
      _push(ssrRenderComponent(DataTable, {
        columns: ofertasColumns,
        items: ofertasData.value,
        "total-items": ofertasData.value.length,
        "items-per-page": 5,
        "current-page": ofertasPage.value,
        "is-loading": isLoading.value,
        "show-actions": false,
        onPageChange: handleOfertasPageChange
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/perfil.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=perfil-B5R-_aFj.mjs.map
