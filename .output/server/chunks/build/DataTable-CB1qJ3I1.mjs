import { reactive, watch, ref, computed, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderVNode, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc, b as useRuntimeConfig } from './server.mjs';

const _sfc_main = {
  __name: "DataTable",
  __ssrInlineRender: true,
  props: {
    // Array de objetos que definen las columnas
    columns: {
      type: Array,
      required: true
      // Ejemplo: [
      //   { key: 'id', label: 'ID' }, 
      //   { key: 'name', label: 'Nombre' },
      //   { 
      //     key: 'estado', 
      //     label: 'Estado',
      //     cellRenderer: (value, item) => `<span class="px-2 py-1 rounded bg-blue-100 text-blue-800">${value}</span>`
      //   }
      // ]
    },
    // Array de datos a mostrar en la tabla
    items: {
      type: Array,
      required: true
      // Ejemplo: [{ id: 1, name: 'Ejemplo' }]
    },
    // Array de acciones para cada fila (opcional)
    actions: {
      type: Array,
      default: () => []
      // Ejemplo: [{ name: 'Editar', handler: (item) => console.log(item) }]
    },
    // Número total de elementos (para paginación)
    totalItems: {
      type: Number,
      required: true
    },
    // Elementos por página
    itemsPerPage: {
      type: Number,
      default: 10
    },
    // Página actual
    currentPage: {
      type: Number,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    // Si true muestra una foto circular al inicio de la primera columna (por fila)
    isShowPhotos: {
      type: Boolean,
      default: false
    }
  },
  emits: ["page-change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const config = useRuntimeConfig();
    const loadingMap = reactive({});
    function isRemoteImage(src) {
      return typeof src === "string" && src.startsWith("http");
    }
    watch(() => props.items, (newItems) => {
      if (!Array.isArray(newItems)) return;
      newItems.forEach((item, idx) => {
        const src = getImageSrc(item);
        loadingMap[idx] = isRemoteImage(src);
      });
    }, { immediate: true, deep: true });
    function getImageSrc(item) {
      const foto = item && (item.foto || item.imagen || item.image) ? item.foto || item.imagen || item.image : null;
      if (!foto) return getPlaceholderDataUrl();
      if (typeof foto === "string" && (foto.startsWith("http") || foto.startsWith("data:"))) return foto;
      return `${config.public.backendHost}${foto}`;
    }
    function getPlaceholderDataUrl() {
      return "/image.png";
    }
    ref(props.itemsPerPage);
    const totalPages = computed(() => {
      return Math.ceil(props.totalItems / props.itemsPerPage);
    });
    const startIndex = computed(() => {
      return (props.currentPage - 1) * props.itemsPerPage;
    });
    const endIndex = computed(() => {
      const calculatedEnd = startIndex.value + props.itemsPerPage;
      return Math.min(calculatedEnd, props.totalItems);
    });
    const paginatedItems = computed(() => {
      return props.items;
    });
    function getNestedValue(obj, path) {
      var _a;
      if (!obj || !path) return "";
      return (_a = path.split(".").reduce((acc, part) => acc && acc[part], obj)) != null ? _a : "";
    }
    watch(() => props.items, (newItems) => {
    }, { deep: true });
    watch(() => props.currentPage, (newPage) => {
      console.log("P\xE1gina actualizada:", newPage);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-4957e8d3><div class="overflow-x-auto" data-v-4957e8d3><table class="min-w-full bg-white rounded-lg overflow-hidden" data-v-4957e8d3><thead class="bg-gray-50" data-v-4957e8d3><tr data-v-4957e8d3><!--[-->`);
      ssrRenderList(__props.columns, (column) => {
        _push(`<th class="${ssrRenderClass(["px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", column.class])}" data-v-4957e8d3>${ssrInterpolate(column.label)}</th>`);
      });
      _push(`<!--]-->`);
      if (__props.actions) {
        _push(`<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" data-v-4957e8d3> Acciones </th>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tr></thead><tbody class="divide-y divide-gray-200" data-v-4957e8d3>`);
      if (__props.isLoading) {
        _push(`<tr data-v-4957e8d3><td${ssrRenderAttr("colspan", __props.columns.length + (__props.actions ? 1 : 0))} class="px-6 py-4 text-center" data-v-4957e8d3><div class="flex justify-center items-center" data-v-4957e8d3><svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-4957e8d3><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-4957e8d3></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-4957e8d3></path></svg><span class="ml-2" data-v-4957e8d3>Cargando datos...</span></div></td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(paginatedItems.value, (item, index) => {
          _push(`<tr class="hover:bg-gray-50" tabindex="0" data-v-4957e8d3><!--[-->`);
          ssrRenderList(__props.columns, (column, colIndex) => {
            var _a, _b, _c;
            _push(`<td class="${ssrRenderClass([
              "px-6 py-4 text-sm text-gray-900",
              column.class || (colIndex === 0 ? "whitespace-normal max-w-xs break-words" : "whitespace-nowrap")
            ])}" data-v-4957e8d3>`);
            if (colIndex === 0) {
              _push(`<div class="relative pr-6" data-v-4957e8d3>`);
              if (getNestedValue(item, "nota")) {
                _push(`<div class="absolute right-0 top-1/2 transform -translate-y-1/2 z-50 pointer-events-none"${ssrRenderAttr("title", getNestedValue(item, "nota"))} data-v-4957e8d3><div class="bg-info text-neutral p-1 rounded-full shadow-lg flex items-center justify-center w-6 h-6" role="img" aria-label="Nota disponible" data-v-4957e8d3><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-4957e8d3><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6M7 7h10l2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" data-v-4957e8d3></path></svg></div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (props.isShowPhotos) {
                _push(`<div class="flex items-center" data-v-4957e8d3><div class="flex-shrink-0 mr-3 relative w-10 h-10" data-v-4957e8d3><img${ssrRenderAttr("src", getImageSrc(item))}${ssrRenderAttr("alt", getNestedValue(item, column.key) || "foto")} class="w-10 h-10 rounded-full object-cover border bg-white" data-v-4957e8d3>`);
                if (loadingMap[index]) {
                  _push(`<div class="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full" data-v-4957e8d3><svg class="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-4957e8d3><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-4957e8d3></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" data-v-4957e8d3></path></svg></div>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</div><div class="min-w-0" data-v-4957e8d3>`);
                if (column.cellRenderer) {
                  _push(`<div data-v-4957e8d3>${(_a = column.cellRenderer(getNestedValue(item, column.key), item)) != null ? _a : ""}</div>`);
                } else {
                  _push(`<span class="truncate block" data-v-4957e8d3>${ssrInterpolate(column.format ? column.format(getNestedValue(item, column.key)) : getNestedValue(item, column.key))}</span>`);
                }
                _push(`</div></div>`);
              } else {
                _push(`<div data-v-4957e8d3>`);
                if (column.cellRenderer) {
                  _push(`<div data-v-4957e8d3>${(_b = column.cellRenderer(getNestedValue(item, column.key), item)) != null ? _b : ""}</div>`);
                } else {
                  _push(`<span data-v-4957e8d3>${ssrInterpolate(column.format ? column.format(getNestedValue(item, column.key)) : getNestedValue(item, column.key))}</span>`);
                }
                _push(`</div>`);
              }
              _push(`</div>`);
            } else {
              _push(`<div data-v-4957e8d3>`);
              if (column.cellRenderer) {
                _push(`<div data-v-4957e8d3>${(_c = column.cellRenderer(getNestedValue(item, column.key), item)) != null ? _c : ""}</div>`);
              } else {
                _push(`<span data-v-4957e8d3>${ssrInterpolate(column.format ? column.format(getNestedValue(item, column.key)) : getNestedValue(item, column.key))}</span>`);
              }
              _push(`</div>`);
            }
            _push(`</td>`);
          });
          _push(`<!--]-->`);
          if (__props.actions) {
            _push(`<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" data-v-4957e8d3><div class="flex justify-end space-x-2" data-v-4957e8d3><!--[-->`);
            ssrRenderList(__props.actions, (action) => {
              _push(`<div data-v-4957e8d3>`);
              if (action.buttonClass) {
                _push(`<button class="${ssrRenderClass(action.buttonClass + " flex items-center gap-2")}"${ssrRenderAttr("title", action.name)} data-v-4957e8d3>`);
                if (action.icon) {
                  ssrRenderVNode(_push, createVNode(resolveDynamicComponent(action.icon), { class: "h-5 w-5" }, null), _parent);
                } else {
                  _push(`<!---->`);
                }
                if (!action.iconOnly) {
                  _push(`<span data-v-4957e8d3>${ssrInterpolate(action.name)}</span>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</button>`);
              } else {
                _push(`<button class="text-primary hover:brightness-90 flex items-center gap-1"${ssrRenderAttr("title", action.name)} data-v-4957e8d3>`);
                if (action.icon) {
                  ssrRenderVNode(_push, createVNode(resolveDynamicComponent(action.icon), { class: "h-5 w-5" }, null), _parent);
                } else {
                  _push(`<!---->`);
                }
                if (!action.iconOnly) {
                  _push(`<span data-v-4957e8d3>${ssrInterpolate(action.name)}</span>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</button>`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div></td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tr>`);
        });
        _push(`<!--]-->`);
      }
      if (!__props.isLoading && paginatedItems.value.length === 0) {
        _push(`<tr data-v-4957e8d3><td${ssrRenderAttr("colspan", __props.columns.length + (__props.actions ? 1 : 0))} class="px-6 py-4 text-center text-sm text-gray-500" data-v-4957e8d3> No hay datos disponibles </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div class="flex justify-between items-center mt-4" data-v-4957e8d3><div class="text-sm text-gray-700" data-v-4957e8d3> Mostrando ${ssrInterpolate(startIndex.value + 1)} - ${ssrInterpolate(endIndex.value)} de ${ssrInterpolate(__props.totalItems)} elementos </div><div class="flex gap-2" data-v-4957e8d3><button${ssrIncludeBooleanAttr(__props.currentPage === 1) ? " disabled" : ""} class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50" data-v-4957e8d3> Anterior </button><span class="px-3 py-1 text-gray-700" data-v-4957e8d3> P\xE1gina ${ssrInterpolate(__props.currentPage)} de ${ssrInterpolate(totalPages.value)}</span><button${ssrIncludeBooleanAttr(__props.currentPage >= totalPages.value) ? " disabled" : ""} class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50" data-v-4957e8d3> Siguiente </button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DataTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DataTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4957e8d3"]]);

export { DataTable as D };
//# sourceMappingURL=DataTable-CB1qJ3I1.mjs.map
