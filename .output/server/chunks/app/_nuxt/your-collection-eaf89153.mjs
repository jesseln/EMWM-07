import { u as useViewStore, a as useYourShelfStore, b as useReferenceStore, _ as __nuxt_component_0$1, c as __nuxt_component_1$1, d as __nuxt_component_2 } from './MarkItem-7373e2ae.mjs';
import { ref, unref, useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { s as storeToRefs } from '../server.mjs';
import { _ as __nuxt_component_1 } from './AnnotationPanel-2fa9fed4.mjs';
import 'd3';
import './useSupabaseClient-f8b29b79.mjs';
import 'lodash-es';
import 'sass';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import 'destr';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import '@floating-ui/utils';
import 'cookie-es';
import 'ohash';
import '@supabase/supabase-js';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'ipx';
import 'http-graceful-shutdown';

const _sfc_main$1 = {
  __name: "YourShelf",
  __ssrInlineRender: true,
  setup(__props) {
    const viewStore = useViewStore();
    storeToRefs(viewStore);
    const {
      parseDatabase,
      handleViewSelection,
      getIDP,
      itemTypeCheck
    } = useViewStore();
    const yourShelfStore = useYourShelfStore();
    const { yourShelf } = storeToRefs(yourShelfStore);
    useYourShelfStore();
    const referenceStore = useReferenceStore();
    const {
      categoryMap,
      invCategoryMap,
      scales,
      yourShelfItemBundle
    } = storeToRefs(referenceStore);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AgentItem = __nuxt_component_0$1;
      const _component_BookItem = __nuxt_component_1$1;
      const _component_MarkItem = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "shelf yourShelf" }, _attrs))}><div class="yourShelf-title-box"><h2 class="library-type-title">Your Collection</h2><p class="yourShelf-description">Items can be added to your collection by selecting them in the library, and clicking Add to Collection.</p></div><div class="shelf-inner"><div class="section-wrapper"><div class="section-title-box" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}"><h3 class="yourShelf-section-category">Items in your collection</h3><h3 class="yourShelf-section-value">${ssrInterpolate(unref(yourShelf) ? unref(yourShelf).length : 0)}</h3><div class="section-shelf-box"></div></div><!--[-->`);
      ssrRenderList(unref(yourShelf), (item) => {
        _push(`<div class="section-inner" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}">`);
        if (unref(itemTypeCheck)(item) === "Agent") {
          _push(ssrRenderComponent(_component_AgentItem, {
            item,
            itemBundle: unref(yourShelfItemBundle).Agent
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Book") {
          _push(ssrRenderComponent(_component_BookItem, {
            item,
            itemBundle: unref(yourShelfItemBundle).Book
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Mark") {
          _push(ssrRenderComponent(_component_MarkItem, {
            item,
            itemBundle: unref(yourShelfItemBundle).Mark
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/YourShelf.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main$1;
const _sfc_main = {
  __name: "your-collection",
  __ssrInlineRender: true,
  setup(__props) {
    const showAnnotations = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_YourShelf = __nuxt_component_0;
      const _component_AnnotationPanel = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_YourShelf, null, null, _parent));
      _push(`<button class="${ssrRenderClass([{ "active": unref(showAnnotations) }, "annotation-button"])}"> \u{1F58A}\uFE0F </button>`);
      if (unref(showAnnotations)) {
        _push(ssrRenderComponent(_component_AnnotationPanel, null, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/your-collection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=your-collection-eaf89153.mjs.map
