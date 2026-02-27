import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = {
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"].includes(value)
    }
  },
  emits: ["close"],
  setup(__props) {
    const sizeClasses = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      "2xl": "max-w-5xl",
      "3xl": "max-w-6xl",
      "4xl": "max-w-7xl",
      "5xl": "max-w-screen-2xl"
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" }, _attrs))}><div class="${ssrRenderClass([
          "bg-white rounded-lg shadow-lg w-full max-h-[90vh] overflow-hidden",
          sizeClasses[__props.size]
        ])}">`);
        if (_ctx.$slots.title) {
          _push(`<div class="flex justify-between items-center p-6 border-b border-gray-200"><div class="text-lg font-semibold text-gray-900">`);
          ssrRenderSlot(_ctx.$slots, "title", {}, null, _push, _parent);
          _push(`</div><button class="text-gray-400 hover:text-gray-600 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="overflow-y-auto max-h-[calc(90vh-140px)] p-6">`);
        ssrRenderSlot(_ctx.$slots, "content", {}, null, _push, _parent);
        _push(`</div>`);
        if (_ctx.$slots.footer) {
          _push(`<div class="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">`);
          ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
          _push(`</div>`);
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Modal-CafyytEG.mjs.map
