import { _ as __nuxt_component_0 } from './nuxt-link-f805a121.mjs';
import { useSSRContext, ref, mergeProps, withCtx, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
import { u as useLibraryStore } from './libraryStore-62e9feb9.mjs';
import 'ufo';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
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
import './useSupabaseClient-f8b29b79.mjs';

const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "library-menu-wrapper" }, _attrs))} data-v-e1bf5960><h2 class="menu-title" data-v-e1bf5960>Select a question to explore the libraries...</h2><div class="menu-page" data-v-e1bf5960><div data-v-e1bf5960><div class="index-list" data-v-e1bf5960><h3 data-v-e1bf5960>Agents</h3><ul class="library-query" data-v-e1bf5960>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/library/agent01",
    onClick: ($event) => _ctx.$emit("modalClicked")
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<li data-v-e1bf5960${_scopeId}>How many agents are in the collection?</li>`);
      } else {
        return [
          createVNode("li", null, "How many agents are in the collection?")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<li data-v-e1bf5960>What years did each agent make their marks?</li></ul></div><div class="index-list" data-v-e1bf5960><h3 data-v-e1bf5960>Books</h3><ul class="library-query" data-v-e1bf5960><li data-v-e1bf5960>What kinds of books did people read?</li><li data-v-e1bf5960>How many books did each agent own?</li><li data-v-e1bf5960>What years were the books published?</li></ul></div><div class="index-list" data-v-e1bf5960><h3 data-v-e1bf5960>Marks</h3><ul class="library-query" data-v-e1bf5960><li data-v-e1bf5960>What types of marks did each agent make?</li><li data-v-e1bf5960>How many marks did each agent make?</li></ul></div></div></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LibraryModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-e1bf5960"]]);
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const libraryStore = useLibraryStore();
    libraryStore.getAgents();
    libraryStore.getBooks();
    libraryStore.getMarks();
    ref(null);
    const navDropdownContent = ref(null);
    const hideModalClicked = () => {
      navDropdownContent.value.style.transitionDelay = ".1s";
      navDropdownContent.value.style.visibility = "hidden";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_LibraryModal = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "site-wrapper" }, _attrs))} data-v-13946fb1><header class="site-header" data-v-13946fb1>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="site-header-title-wrapper" data-v-13946fb1${_scopeId}><h1 class="site-header-title" data-v-13946fb1${_scopeId}>The Library of Libraries</h1><p class="site-header-subtitle" data-v-13946fb1${_scopeId}>Early Modern Women&#39;s Marginalia</p></div>`);
          } else {
            return [
              createVNode("div", { class: "site-header-title-wrapper" }, [
                createVNode("h1", { class: "site-header-title" }, "The Library of Libraries"),
                createVNode("p", { class: "site-header-subtitle" }, "Early Modern Women's Marginalia")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header><div class="main-navbar" data-v-13946fb1><div class="dropdown" data-v-13946fb1><h2 class="main-navbar-link dropbtn" data-v-13946fb1>Explore the Libraries</h2><div class="dropdown-content" data-v-13946fb1>`);
      _push(ssrRenderComponent(_component_LibraryModal, { onModalClicked: hideModalClicked }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/your-collection",
        activeClass: "nav-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="dropdown" data-v-13946fb1${_scopeId}><h2 class="main-navbar-link dropbtn" data-v-13946fb1${_scopeId}>View Your Collection</h2></div>`);
          } else {
            return [
              createVNode("div", { class: "dropdown" }, [
                createVNode("h2", { class: "main-navbar-link dropbtn" }, "View Your Collection")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shared-annotations",
        activeClass: "nav-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="dropdown" data-v-13946fb1${_scopeId}><h2 class="main-navbar-link dropbtn" data-v-13946fb1${_scopeId}>Find Annotations</h2></div>`);
          } else {
            return [
              createVNode("div", { class: "dropdown" }, [
                createVNode("h2", { class: "main-navbar-link dropbtn" }, "Find Annotations")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        activeClass: "nav-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="dropdown" data-v-13946fb1${_scopeId}><h2 class="main-navbar-link dropbtn" data-v-13946fb1${_scopeId}>Read About the Collection</h2></div>`);
          } else {
            return [
              createVNode("div", { class: "dropdown" }, [
                createVNode("h2", { class: "main-navbar-link dropbtn" }, "Read About the Collection")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/site-guide",
        activeClass: "nav-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="dropdown" data-v-13946fb1${_scopeId}><h2 class="main-navbar-link dropbtn" data-v-13946fb1${_scopeId}>Site Guide</h2></div>`);
          } else {
            return [
              createVNode("div", { class: "dropdown" }, [
                createVNode("h2", { class: "main-navbar-link dropbtn" }, "Site Guide")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="library-slot" data-v-13946fb1>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-13946fb1"]]);

export { _default as default };
//# sourceMappingURL=default-910d1a11.mjs.map
