import { ref, computed, watch, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderVNode, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

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
    }
  },
  emits: ["page-change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
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
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-bb510099><div class="overflow-x-auto" data-v-bb510099><table class="min-w-full bg-white rounded-lg overflow-hidden" data-v-bb510099><thead class="bg-gray-50" data-v-bb510099><tr data-v-bb510099><!--[-->`);
      ssrRenderList(__props.columns, (column) => {
        _push(`<th class="${ssrRenderClass(["px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", column.class])}" data-v-bb510099>${ssrInterpolate(column.label)}</th>`);
      });
      _push(`<!--]-->`);
      if (__props.actions) {
        _push(`<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" data-v-bb510099> Acciones </th>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tr></thead><tbody class="divide-y divide-gray-200" data-v-bb510099>`);
      if (__props.isLoading) {
        _push(`<tr data-v-bb510099><td${ssrRenderAttr("colspan", __props.columns.length + (__props.actions ? 1 : 0))} class="px-6 py-4 text-center" data-v-bb510099><div class="flex justify-center items-center" data-v-bb510099><svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-bb510099><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-bb510099></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-bb510099></path></svg><span class="ml-2" data-v-bb510099>Cargando datos...</span></div></td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(paginatedItems.value, (item, index) => {
          _push(`<tr class="hover:bg-gray-50" tabindex="0" data-v-bb510099><!--[-->`);
          ssrRenderList(__props.columns, (column, colIndex) => {
            var _a, _b;
            _push(`<td class="${ssrRenderClass([
              "px-6 py-4 text-sm text-gray-900",
              column.class || (colIndex === 0 ? "whitespace-normal max-w-xs break-words" : "whitespace-nowrap")
            ])}" data-v-bb510099>`);
            if (colIndex === 0) {
              _push(`<div class="relative pr-6" data-v-bb510099>`);
              if (getNestedValue(item, "nota")) {
                _push(`<div class="absolute right-0 top-1/2 transform -translate-y-1/2 z-50 pointer-events-none"${ssrRenderAttr("title", getNestedValue(item, "nota"))} data-v-bb510099><div class="bg-info text-neutral p-1 rounded-full shadow-lg flex items-center justify-center w-6 h-6" role="img" aria-label="Nota disponible" data-v-bb510099><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-bb510099><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6M7 7h10l2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" data-v-bb510099></path></svg></div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (column.cellRenderer) {
                _push(`<div data-v-bb510099>${(_a = column.cellRenderer(getNestedValue(item, column.key), item)) != null ? _a : ""}</div>`);
              } else {
                _push(`<span data-v-bb510099>${ssrInterpolate(column.format ? column.format(getNestedValue(item, column.key)) : getNestedValue(item, column.key))}</span>`);
              }
              _push(`</div>`);
            } else {
              _push(`<div data-v-bb510099>`);
              if (column.cellRenderer) {
                _push(`<div data-v-bb510099>${(_b = column.cellRenderer(getNestedValue(item, column.key), item)) != null ? _b : ""}</div>`);
              } else {
                _push(`<span data-v-bb510099>${ssrInterpolate(column.format ? column.format(getNestedValue(item, column.key)) : getNestedValue(item, column.key))}</span>`);
              }
              _push(`</div>`);
            }
            _push(`</td>`);
          });
          _push(`<!--]-->`);
          if (__props.actions) {
            _push(`<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" data-v-bb510099><div class="flex justify-end space-x-2" data-v-bb510099><!--[-->`);
            ssrRenderList(__props.actions, (action) => {
              _push(`<div data-v-bb510099>`);
              if (action.buttonClass) {
                _push(`<button class="${ssrRenderClass(action.buttonClass + " flex items-center gap-2")}"${ssrRenderAttr("title", action.name)} data-v-bb510099>`);
                if (action.icon) {
                  ssrRenderVNode(_push, createVNode(resolveDynamicComponent(action.icon), { class: "h-5 w-5" }, null), _parent);
                } else {
                  _push(`<!---->`);
                }
                if (!action.iconOnly) {
                  _push(`<span data-v-bb510099>${ssrInterpolate(action.name)}</span>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</button>`);
              } else {
                _push(`<button class="text-primary hover:brightness-90 flex items-center gap-1"${ssrRenderAttr("title", action.name)} data-v-bb510099>`);
                if (action.icon) {
                  ssrRenderVNode(_push, createVNode(resolveDynamicComponent(action.icon), { class: "h-5 w-5" }, null), _parent);
                } else {
                  _push(`<!---->`);
                }
                if (!action.iconOnly) {
                  _push(`<span data-v-bb510099>${ssrInterpolate(action.name)}</span>`);
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
        _push(`<tr data-v-bb510099><td${ssrRenderAttr("colspan", __props.columns.length + (__props.actions ? 1 : 0))} class="px-6 py-4 text-center text-sm text-gray-500" data-v-bb510099> No hay datos disponibles </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div class="flex justify-between items-center mt-4" data-v-bb510099><div class="text-sm text-gray-700" data-v-bb510099> Mostrando ${ssrInterpolate(startIndex.value + 1)} - ${ssrInterpolate(endIndex.value)} de ${ssrInterpolate(__props.totalItems)} elementos </div><div class="flex gap-2" data-v-bb510099><button${ssrIncludeBooleanAttr(__props.currentPage === 1) ? " disabled" : ""} class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50" data-v-bb510099> Anterior </button><span class="px-3 py-1 text-gray-700" data-v-bb510099> P\xE1gina ${ssrInterpolate(__props.currentPage)} de ${ssrInterpolate(totalPages.value)}</span><button${ssrIncludeBooleanAttr(__props.currentPage >= totalPages.value) ? " disabled" : ""} class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50" data-v-bb510099> Siguiente </button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DataTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DataTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bb510099"]]);

export { DataTable as D };
//# sourceMappingURL=DataTable-m2GVgsth.mjs.map
