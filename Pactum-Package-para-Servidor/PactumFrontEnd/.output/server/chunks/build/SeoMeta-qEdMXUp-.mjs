import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc, b as useRuntimeConfig } from './server.mjs';
import { u as useHead } from './v3-CVirIiRo.mjs';

const _sfc_main = {
  __name: "SeoMeta",
  __ssrInlineRender: true,
  props: {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    url: { type: String, default: "" },
    canonical: { type: String, default: "" },
    jsonld: { type: String, default: "" },
    twitterCard: { type: String, default: "summary_large_image" }
  },
  setup(__props) {
    const props = __props;
    const siteUrl = useRuntimeConfig().public.siteUrl || "http://localhost:3000";
    useHead({
      title: props.title || "Contract Manager",
      meta: [
        props.description ? { name: "description", content: props.description } : null,
        props.image ? { property: "og:image", content: props.image.startsWith("http") ? props.image : siteUrl + props.image } : null,
        props.url ? { property: "og:url", content: props.url } : null,
        props.title ? { property: "og:title", content: props.title } : null,
        props.description ? { property: "og:description", content: props.description } : null,
        props.twitterCard ? { name: "twitter:card", content: props.twitterCard } : null
      ].filter(Boolean),
      link: props.canonical ? [{ rel: "canonical", href: props.canonical }] : [],
      script: props.jsonld ? [{ type: "application/ld+json", children: props.jsonld }] : []
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: { "display": "none" },
        "aria-hidden": "true"
      }, _attrs))} data-v-ea52487c></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SeoMeta.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SeoMeta = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ea52487c"]]);

export { SeoMeta as S };
//# sourceMappingURL=SeoMeta-qEdMXUp-.mjs.map
