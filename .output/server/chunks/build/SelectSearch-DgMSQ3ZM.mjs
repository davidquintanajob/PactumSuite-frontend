import { ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = {
  __name: "SelectSearch",
  __ssrInlineRender: true,
  props: {
    options: { type: Array, required: true },
    labelKey: { type: [String, Function], required: true },
    valueKey: { type: String, required: true },
    modelValue: [String, Number],
    placeholder: { type: String, default: "Buscar..." },
    disabled: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const search = ref("");
    const open = ref(false);
    const activeIndex = ref(-1);
    const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
    ref(null);
    function getLabel(option) {
      if (typeof props.labelKey === "function") {
        return props.labelKey(option);
      } else if (typeof props.labelKey === "string") {
        return option[props.labelKey];
      }
      return "";
    }
    const filteredOptions = computed(() => {
      if (!search.value) return props.options;
      return props.options.filter(
        (opt) => String(getLabel(opt)).toLowerCase().includes(search.value.toLowerCase())
      );
    });
    const optionId = (idx) => `${dropdownId}-option-${idx}`;
    const activeDescendantId = computed(
      () => activeIndex.value >= 0 ? optionId(activeIndex.value) : void 0
    );
    watch(() => props.modelValue, (val) => {
      if (val !== void 0 && val !== null) {
        const selected = props.options.find((opt) => String(opt[props.valueKey]) === String(val));
        if (selected) {
          search.value = getLabel(selected);
        } else {
          search.value = "";
        }
      } else {
        search.value = "";
      }
    }, { immediate: true });
    watch(() => props.options, () => {
      if (props.modelValue !== void 0 && props.modelValue !== null) {
        const selected = props.options.find((opt) => String(opt[props.valueKey]) === String(props.modelValue));
        if (selected) {
          search.value = getLabel(selected);
        }
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full" }, _attrs))}><input type="text"${ssrRenderAttr("value", search.value)}${ssrRenderAttr("placeholder", __props.placeholder)} class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrRenderAttr("aria-expanded", open.value.toString())}${ssrRenderAttr("aria-controls", dropdownId)}${ssrRenderAttr("aria-activedescendant", activeDescendantId.value)}><ul${ssrRenderAttr("id", dropdownId)} class="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg" role="listbox" style="${ssrRenderStyle(open.value && filteredOptions.value.length > 0 ? null : { display: "none" })}"><!--[-->`);
      ssrRenderList(filteredOptions.value, (option, idx) => {
        _push(`<li${ssrRenderAttr("id", optionId(idx))} class="${ssrRenderClass(["px-4 py-2 cursor-pointer", idx === activeIndex.value ? "bg-accent/30" : "hover:bg-gray-100"])}" role="option"${ssrRenderAttr("aria-selected", String(__props.modelValue) === String(option[__props.valueKey]))}>${ssrInterpolate(getLabel(option))}</li>`);
      });
      _push(`<!--]--></ul></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SelectSearch.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=SelectSearch-DgMSQ3ZM.mjs.map
