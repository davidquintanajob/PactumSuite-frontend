import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { D as DataTable } from './DataTable-m2GVgsth.mjs';
import { N as Navbar } from './Navbar-BXeboE4m.mjs';
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
    const ofertasData = ref([]);
    const ofertasPage = ref(1);
    const isLoading = ref(false);
    const ofertasColumns = [
      { key: "id_oferta", label: "ID Oferta" },
      { key: "descripcion", label: "Descripci\xF3n" },
      { key: "fecha_inicio", label: "Fecha Inicio", format: (val) => val == null ? void 0 : val.substring(0, 10) },
      { key: "fecha_fin", label: "Fecha Fin", format: (val) => val == null ? void 0 : val.substring(0, 10) },
      { key: "id_contrato", label: "ID Contrato" }
    ];
    function handleOfertasPageChange(page) {
      ofertasPage.value = page;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral flex flex-col items-center py-12" }, _attrs))}>`);
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      _push(`<div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mt-8"><h2 class="text-2xl font-bold text-blue-700 mb-6 text-center">Mi Perfil</h2>`);
      if (user.value) {
        _push(`<div class="space-y-4"><div class="flex flex-col gap-2"><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">ID:</span><span class="text-gray-900">${ssrInterpolate(user.value.id_usuario)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Nombre:</span><span class="text-gray-900">${ssrInterpolate(user.value.nombre)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Usuario:</span><span class="text-gray-900">${ssrInterpolate(user.value.nombre_usuario)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Cargo:</span><span class="text-gray-900">${ssrInterpolate(user.value.cargo)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Rol:</span><span class="text-gray-900">${ssrInterpolate(user.value.rol)}</span></div><div class="flex justify-between items-center"><span class="font-semibold text-gray-700">Estado:</span><span class="${ssrRenderClass([user.value.activo ? "bg-success" : "bg-danger", "px-3 py-1 rounded-full text-neutral text-xs font-semibold"])}">${ssrInterpolate(user.value.activo ? "Activo" : "Inactivo")}</span></div></div></div>`);
      } else {
        _push(`<div class="text-center text-gray-500">Cargando datos...</div>`);
      }
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
//# sourceMappingURL=perfil-8RBXZ1sk.mjs.map
