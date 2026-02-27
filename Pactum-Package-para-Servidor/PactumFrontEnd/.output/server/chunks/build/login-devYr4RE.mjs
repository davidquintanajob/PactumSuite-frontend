import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './logo-DkoFc4aV.mjs';
import { S as SeoMeta } from './SeoMeta-qEdMXUp-.mjs';
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
import './server.mjs';
import 'vue-router';
import './v3-CVirIiRo.mjs';

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const username = ref("");
    const password = ref("");
    const errorMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-1 flex-col justify-center px-6 py-12 bg-gradient-to-br via-secondary/40 from-accent/30 to-neutral" }, _attrs))}>`);
      _push(ssrRenderComponent(SeoMeta, {
        title: "Iniciar Sesi\xF3n - Contract Manager",
        description: "Accede a Contract Manager para gestionar contratos y entidades.",
        canonical: "/login"
      }, null, _parent));
      _push(`<div class="sm:mx-auto sm:w-full sm:max-w-sm"><img class="mx-auto h-24 w-24 rounded-full shadow mt-8"${ssrRenderAttr("src", _imports_0)} alt="Logo"><h2 class="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">Inicia sesi\xF3n en tu cuenta</h2></div><div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"><form class="space-y-6"><div><label for="username" class="block text-sm font-medium text-gray-900">Nombre de usuario</label><div class="mt-2"><input id="username" name="username" type="text" autocomplete="username" required${ssrRenderAttr("value", username.value)} class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm" placeholder="Usuario"></div></div><div><div class="flex items-center justify-between"><label for="password" class="block text-sm font-medium text-gray-900">Contrase\xF1a</label></div><div class="mt-2"><input id="password" name="password" type="password" autocomplete="current-password" required${ssrRenderAttr("value", password.value)} class="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm" placeholder="Contrase\xF1a"></div></div>`);
      if (errorMsg.value) {
        _push(`<div class="text-red-600 text-sm text-center">${ssrInterpolate(errorMsg.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div><button type="submit" class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-neutral shadow hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"> Ingresar </button></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-devYr4RE.mjs.map
