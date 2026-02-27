import { ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = {
  __name: "SelectSearchAPI",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: [String, Number, null],
      default: null
    },
    endpoint: {
      type: String,
      required: true
    },
    method: {
      type: String,
      default: "POST"
    },
    searchKey: {
      type: String,
      required: true
    },
    labelKey: {
      type: String,
      required: true
    },
    valueKey: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: "Buscar..."
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // Nueva prop para especificar si los datos vienen directamente en un array
    directData: {
      type: Boolean,
      default: false
    },
    // Nueva prop para formato personalizado del label
    labelFormat: {
      type: String,
      default: null
    },
    // Prop para etiqueta inicial al cargar
    initialLabel: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue", "entidad-seleccionada", "producto-seleccionado"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    const searchText = ref("");
    const selectedValue = ref(null);
    const selectedOption = ref(null);
    const showDropdown = ref(false);
    const isLoading = ref(false);
    const highlightedIndex = ref(-1);
    ref(null);
    const filteredOptions = ref([]);
    const getOptionLabel = (option) => {
      if (props.labelFormat) {
        let formattedLabel = props.labelFormat;
        formattedLabel = formattedLabel.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
          const keys = key.split(".");
          let value = option;
          for (const k of keys) {
            value = value == null ? void 0 : value[k];
          }
          return value || "";
        });
        return formattedLabel;
      }
      return option[props.labelKey];
    };
    watch(() => props.modelValue, (newValue) => {
      if (newValue === null || newValue === "") {
        selectedValue.value = null;
        selectedOption.value = null;
        searchText.value = "";
      } else if (newValue && !selectedValue.value) {
        selectedValue.value = newValue;
      }
    }, { immediate: true });
    watch(() => props.initialLabel, (newLabel) => {
      if (newLabel && !searchText.value) {
        searchText.value = newLabel;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}><div class="relative"><input${ssrRenderAttr("value", searchText.value)} type="text"${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"><div class="absolute right-3 top-2.5">`);
      if (!isLoading.value) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`);
      } else {
        _push(`<svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
      }
      _push(`</div></div>`);
      if (showDropdown.value && (filteredOptions.value.length > 0 || isLoading.value)) {
        _push(`<div class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">`);
        if (selectedValue.value !== null && selectedValue.value !== "" && !isLoading.value) {
          _push(`<div class="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer border-b"> Limpiar selecci\xF3n </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(filteredOptions.value, (option, index) => {
          var _a;
          _push(`<div class="${ssrRenderClass([{ "bg-primary text-white": index === highlightedIndex.value }, "px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"])}">`);
          if (props.labelFormat) {
            _push(`<div>${(_a = getOptionLabel(option).replace(/\n/g, "<br>")) != null ? _a : ""}</div>`);
          } else {
            _push(`<div>${ssrInterpolate(getOptionLabel(option))}</div>`);
          }
          _push(`</div>`);
        });
        _push(`<!--]-->`);
        if (!isLoading.value && filteredOptions.value.length === 0 && searchText.value) {
          _push(`<div class="px-4 py-2 text-sm text-gray-500"> No se encontraron resultados </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SelectSearchAPI.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=SelectSearchAPI-C4OFsj20.mjs.map
