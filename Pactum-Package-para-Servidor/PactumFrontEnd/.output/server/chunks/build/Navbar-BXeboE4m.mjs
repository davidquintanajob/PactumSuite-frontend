import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { _ as _export_sfc } from './server.mjs';

const _imports_0 = publicAssetsURL("/usuario.png");
const _imports_1 = publicAssetsURL("/perfil.png");
const _imports_2 = publicAssetsURL("/cerrar-sesion.png");
const _sfc_main = {
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const navRoot = ref(null);
    const isNavCollapsed = ref(true);
    const isMenuOpen = ref(false);
    const isUserMenuOpen = ref(false);
    const isConnected = ref(false);
    const isChevronAnimating = ref(false);
    const options = [
      { label: "Entidades", src: "/edificios.png", link: "/entidades" },
      { label: "Contratos", src: "/contrato.png", link: "/contratos" },
      { label: "Trabajadores", src: "/lanza-libre.png", link: "/trabajadores" },
      { label: "Productos", src: "/Productos.png", link: "/productos" },
      { label: "Facturas", src: "/Facturas.png", link: "/facturas" },
      { label: "Servicios", src: "/Servicios.png", link: "/servicios" },
      { label: "Tipos de Contratos", src: "/firmar.png", link: "/tipos-contratos" },
      { label: "Ofertas", src: "/oferta-de-trabajo.png", link: "/ofertas" },
      { label: "Usuario", src: "/usuarios.png", link: "/usuarios" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative",
        ref_key: "navRoot",
        ref: navRoot
      }, _attrs))} data-v-dd1fe168><button class="hidden md:flex items-center fixed z-50 bg-accent text-white rounded-r-full h-16 pr-4 shadow-lg hover:bg-accent-dark transition-all duration-300 ease-in-out" style="${ssrRenderStyle({ left: isNavCollapsed.value ? "0px" : "255px", right: "auto", width: isNavCollapsed.value ? "auto" : "auto", top: "200px" })}" data-v-dd1fe168><div class="flex items-center justify-center w-8 h-16" data-v-dd1fe168><svg xmlns="http://www.w3.org/2000/svg" class="${ssrRenderClass(["h-5 w-5", isChevronAnimating.value ? "chevron-wobble" : ""])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-dd1fe168><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", isNavCollapsed.value ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7")} data-v-dd1fe168></path></svg></div></button><nav class="${ssrRenderClass([{ "md:transform md:-translate-x-full": isNavCollapsed.value }, "fixed top-0 left-0 w-full bg-gradient-to-r from-primary to-secondary shadow-lg z-40 md:w-64 md:h-screen md:bg-gradient-to-b transition-all duration-300 ease-in-out"])}" style="${ssrRenderStyle({ "--nav-width": "16rem" })}" data-v-dd1fe168><div class="container mx-auto flex justify-between items-center py-4 px-6 md:flex-col md:items-start md:justify-start md:py-6 md:h-full" data-v-dd1fe168><div class="hidden md:flex md:items-center relative" data-v-dd1fe168><h1 class="text-white text-3xl md:text-4xl font-sans font-bold tracking-tight mr-4 cursor-pointer select-none" data-v-dd1fe168> PACTUM </h1><div class="relative flex flex-col items-center justify-center" data-v-dd1fe168><a class="w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:bg-accent hover:border-accent transition flex items-center justify-center cursor-pointer" data-v-dd1fe168><img${ssrRenderAttr("src", _imports_0)} alt="Usuario" class="w-3/4 h-3/4 object-cover transition duration-300 hover:opacity-75 mix-blend-screen invert hover:invert(0)" data-v-dd1fe168></a>`);
      if (isConnected.value) {
        _push(`<span class="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs bg-success text-neutral shadow z-10" data-v-dd1fe168>Conectado</span>`);
      } else {
        _push(`<span class="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs bg-danger text-neutral shadow z-10" data-v-dd1fe168>Desconectado</span>`);
      }
      _push(`</div></div><h1 class="text-white text-3xl font-sans font-bold tracking-tight md:hidden" data-v-dd1fe168> SOLUTEL </h1><button class="md:hidden text-white focus:outline-none transition duration-300" data-v-dd1fe168>`);
      if (!isMenuOpen.value) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-dd1fe168><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-v-dd1fe168></path></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-dd1fe168><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-dd1fe168></path></svg>`);
      }
      _push(`</button><a class="w-12 h-12 rounded-full overflow-hidden border-2 border-white hover:bg-accent hover:border-accent transition ml-6 flex items-center justify-center cursor-pointer md:hidden" data-v-dd1fe168><div class="relative w-full h-full flex items-center justify-center" data-v-dd1fe168><img${ssrRenderAttr("src", _imports_0)} alt="Usuario" class="w-3/4 h-3/4 object-cover transition duration-300 hover:opacity-75 mix-blend-screen invert hover:invert(0)" data-v-dd1fe168>`);
      if (isConnected.value) {
        _push(`<span class="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs bg-green-500 text-white shadow z-10" data-v-dd1fe168>Conectado</span>`);
      } else {
        _push(`<span class="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs bg-red-500 text-white shadow z-10" data-v-dd1fe168>Desconectado</span>`);
      }
      _push(`</div></a><div class="hidden md:flex flex-col space-y-4 w-full md:mt-4" data-v-dd1fe168><!--[-->`);
      ssrRenderList(options, (option, index) => {
        _push(`<a href="#" class="text-white flex items-center px-4 py-3 rounded-lg border border-white transition group hover:bg-accent hover:text-black" data-v-dd1fe168><img${ssrRenderAttr("src", option.src)} alt="" class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" data-v-dd1fe168><span class="text-[15px]" data-v-dd1fe168>${ssrInterpolate(option.label)}</span></a>`);
      });
      _push(`<!--]--></div></div>`);
      if (isUserMenuOpen.value) {
        _push(`<div class="fixed inset-0 z-40" data-v-dd1fe168><div class="fixed top-0 right-0 w-64 h-screen bg-secondary p-4 space-y-2 transform transition-all duration-300 ease-in-out" style="${ssrRenderStyle({ transform: isUserMenuOpen.value ? "translateX(0)" : "translateX(100%)" })}" data-v-dd1fe168><a href="/perfil" class="group flex items-center text-white py-2 rounded-lg hover:bg-accent transition group-hover:text-black" data-v-dd1fe168><img${ssrRenderAttr("src", _imports_1)} alt="Perfil" class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" data-v-dd1fe168> Mi Perfil </a><hr class="border-white" data-v-dd1fe168><a href="/cerrar-sesion" class="group flex items-center text-white py-2 rounded-lg hover:bg-accent transition group-hover:text-black" data-v-dd1fe168><img${ssrRenderAttr("src", _imports_2)} alt="Cerrar Sesi\xF3n" class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" data-v-dd1fe168> Cerrar Sesi\xF3n </a></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isMenuOpen.value) {
        _push(`<div class="md:hidden fixed top-16 left-0 w-full bg-secondary p-4 space-y-2 transform transition-all duration-300 ease-in-out" data-v-dd1fe168><!--[-->`);
        ssrRenderList(options, (option, index) => {
          _push(`<a href="#" class="flex items-center block text-white text-center py-2 rounded-lg transition group hover:bg-accent" data-v-dd1fe168><img${ssrRenderAttr("src", option.src)} alt="" class="w-6 h-6 mr-2 invert group-hover:invert-0 transition-all duration-300" data-v-dd1fe168><span data-v-dd1fe168>${ssrInterpolate(option.label)}</span></a>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dd1fe168"]]);

export { Navbar as N };
//# sourceMappingURL=Navbar-BXeboE4m.mjs.map
