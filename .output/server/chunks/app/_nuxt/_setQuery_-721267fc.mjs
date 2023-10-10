import { u as useViewStore, a as useYourShelfStore, b as useReferenceStore, _ as __nuxt_component_0$1, c as __nuxt_component_1$2, d as __nuxt_component_2 } from './MarkItem-7373e2ae.mjs';
import { useSSRContext, computed, watchEffect, ref, unref, reactive, mergeProps } from 'vue';
import { u as useWindowScroll, o as onClickOutside, _ as __nuxt_component_1$1 } from './AnnotationPanel-2fa9fed4.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc, a as useRoute, s as storeToRefs } from '../server.mjs';
import { u as useLibraryStore } from './libraryStore-62e9feb9.mjs';
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

const _sfc_main$2 = {
  __name: "LibraryNav",
  __ssrInlineRender: true,
  setup(__props) {
    const viewStore = useViewStore();
    const {
      libraryData,
      libraryDisplay,
      formattedLibrary,
      itemHeight,
      itemColour,
      colourSet,
      viewHeightBounds,
      viewColourSet
    } = storeToRefs(viewStore);
    useViewStore();
    const referenceStore = useReferenceStore();
    const {
      categoryMap,
      viewMap,
      invCategoryMap,
      colourMapFiltered,
      scales
    } = storeToRefs(referenceStore);
    console.log("Array.from colourSet", viewStore.getColourSet);
    ref(referenceStore.categoryMap.get("NotSelected"));
    const agentCategories = ref(referenceStore.categoryMap.get("Agent"));
    const bookCategories = ref(referenceStore.categoryMap.get("Book"));
    const markCategories = ref(referenceStore.categoryMap.get("Mark"));
    const sectionCategories = ref({ NotSelected: {}, Agent: {}, Book: {}, Mark: {} });
    const sortCategories = ref({ NotSelected: {}, Agent: {}, Book: {}, Mark: {} });
    const heightCategories = ref({ NotSelected: {}, Agent: {}, Book: {}, Mark: {} });
    const colourCategories = ref({ NotSelected: {}, Agent: {}, Book: {}, Mark: {} });
    Object.entries(referenceStore.viewMap.get("NotSelected")).forEach((entry) => {
      const [key, val] = entry;
      val.useSection ? sectionCategories.value.NotSelected[key] = val : null;
      val.useOrder ? sortCategories.value.NotSelected[key] = val : null;
      val.useHeight ? heightCategories.value.NotSelected[key] = val : null;
      val.useColour ? colourCategories.value.NotSelected[key] = val : null;
    });
    Object.entries(referenceStore.viewMap.get("Agent")).forEach((entry) => {
      const [key, val] = entry;
      val.useSection ? sectionCategories.value.Agent[key] = val : null;
      val.useOrder ? sortCategories.value.Agent[key] = val : null;
      val.useHeight ? heightCategories.value.Agent[key] = val : null;
      val.useColour ? colourCategories.value.Agent[key] = val : null;
    });
    Object.entries(referenceStore.viewMap.get("Book")).forEach((entry) => {
      const [key, val] = entry;
      val.useSection ? sectionCategories.value.Book[key] = val : null;
      val.useOrder ? sortCategories.value.Book[key] = val : null;
      val.useHeight ? heightCategories.value.Book[key] = val : null;
      val.useColour ? colourCategories.value.Book[key] = val : null;
    });
    Object.entries(referenceStore.viewMap.get("Mark")).forEach((entry) => {
      const [key, val] = entry;
      val.useSection ? sectionCategories.value.Mark[key] = val : null;
      val.useOrder ? sortCategories.value.Mark[key] = val : null;
      val.useHeight ? heightCategories.value.Mark[key] = val : null;
      val.useColour ? colourCategories.value.Mark[key] = val : null;
    });
    const value = computed(() => {
      return {
        section: `${viewStore.libraryDisplay.viewType["shelf"]}:${[viewStore.libraryDisplay.view["shelf"]]}`,
        sort: `${viewStore.libraryDisplay.viewType["bookend"]}:${[viewStore.libraryDisplay.view["bookend"]]}`,
        height: `${viewStore.libraryDisplay.viewType["height"]}:${[viewStore.libraryDisplay.view["height"]]}`,
        colour: `${viewStore.libraryDisplay.viewType["colour"]}:${[viewStore.libraryDisplay.view["colour"]]}`
      };
    });
    const visible = reactive({
      section: false,
      sort: false,
      height: false,
      colour: false
    });
    const section = ref(false);
    const sort = ref(false);
    const height = ref(false);
    const colour = ref(false);
    onClickOutside(section, (event) => visible.section ? visible.section = !visible.section : null);
    onClickOutside(sort, (event) => visible.sort ? visible.sort = !visible.sort : null);
    onClickOutside(height, (event) => visible.height ? visible.height = !visible.height : null);
    onClickOutside(colour, (event) => visible.colour ? visible.colour = !visible.colour : null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "library-nav-container" }, _attrs))} data-v-da411839><div class="library-nav-wrapper" data-v-da411839><div class="library-nav-dropdown" data-v-da411839><div class="library-nav-title-block" data-v-da411839><h3 class="library-nav-view" data-v-da411839>Section</h3></div><div class="aselect" data-v-da411839><div class="selector" data-v-da411839><div class="label" data-v-da411839>`);
      if (unref(libraryDisplay).viewType["shelf"] !== "NotSelected") {
        _push(`<p data-v-da411839>${ssrInterpolate(unref(libraryDisplay).viewType["shelf"])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType["shelf"])[unref(libraryDisplay).view["shelf"]])} - ${ssrInterpolate(unref(libraryDisplay).view["shelfOrderMethod"] === "A" ? "A to Z" : "Low to High")}</p>`);
      } else {
        _push(`<p data-v-da411839>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType["shelf"])[unref(libraryDisplay).view["shelf"]])}</p>`);
      }
      _push(`</div><div class="${ssrRenderClass([{ expanded: unref(visible) }, "arrow"])}" data-v-da411839></div><div class="${ssrRenderClass([{ hidden: !unref(visible).section }, "categories"])}" data-v-da411839><ul class="scrollable" data-v-da411839><!--[-->`);
      ssrRenderList(unref(sectionCategories).NotSelected, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `NotSelected:${item.category}` === unref(value).section })}" data-v-da411839> Not Selected </li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(sectionCategories).Agent, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Agent:${item.category}` === unref(value).section })}" data-v-da411839> Agent | ${ssrInterpolate(unref(agentCategories)[item.category])} - ${ssrInterpolate(unref(sectionCategories).Agent[item.category]["sortMethod"] === "A" ? "A to Z" : "Low to High")}</li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(sectionCategories).Book, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Book:${item.category}` === unref(value).section })}" data-v-da411839> Book | ${ssrInterpolate(unref(bookCategories)[item.category])} - ${ssrInterpolate(unref(sectionCategories).Book[item.category]["sortMethod"] === "A" ? "A to Z" : "Low to High")}</li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(sectionCategories).Mark, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Mark:${item.category}` === unref(value).section })}" data-v-da411839> Mark | ${ssrInterpolate(unref(markCategories)[item.category])} - ${ssrInterpolate(unref(sectionCategories).Mark[item.category]["sortMethod"] === "A" ? "A to Z" : "Low to High")}</li>`);
      });
      _push(`<!--]--></ul></div></div></div></div><div class="library-nav-dropdown" data-v-da411839><div class="library-nav-title-block" data-v-da411839><h3 class="library-nav-view" data-v-da411839>Sort</h3></div><div class="aselect" data-v-da411839><div class="selector" data-v-da411839><div class="label" data-v-da411839>`);
      if (unref(libraryDisplay).viewType["bookend"] !== "NotSelected") {
        _push(`<p data-v-da411839>${ssrInterpolate(unref(libraryDisplay).viewType["bookend"])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType["bookend"])[unref(libraryDisplay).view["bookend"]])} - ${ssrInterpolate(unref(libraryDisplay).view["bookendOrderMethod"] === "A" ? "A to Z" : "Low to High")}</p>`);
      } else {
        _push(`<p data-v-da411839>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType["bookend"])[unref(libraryDisplay).view["bookend"]])}</p>`);
      }
      _push(`</div><div class="${ssrRenderClass([{ expanded: unref(visible) }, "arrow"])}" data-v-da411839></div><div class="${ssrRenderClass([{ hidden: !unref(visible).sort }, "categories"])}" data-v-da411839><ul class="scrollable" data-v-da411839><!--[-->`);
      ssrRenderList(unref(sortCategories).NotSelected, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `NotSelected:${item.category}` === unref(value).sort })}" data-v-da411839> Not Selected </li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(sortCategories).Agent, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Agent:${item.category}` === unref(value).sort })}" data-v-da411839> Agent | ${ssrInterpolate(unref(agentCategories)[item.category])} - ${ssrInterpolate(unref(sortCategories).Agent[item.category]["sortMethod"] === "A" ? "A to Z" : "Low to High")}</li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(sortCategories).Book, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Book:${item.category}` === unref(value).sort })}" data-v-da411839> Book | ${ssrInterpolate(unref(bookCategories)[item.category])} - ${ssrInterpolate(unref(sortCategories).Book[item.category]["sortMethod"] === "A" ? "A to Z" : "Low to High")}</li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(sortCategories).Mark, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Mark:${item.category}` === unref(value).sort })}" data-v-da411839> Mark | ${ssrInterpolate(unref(markCategories)[item.category])} - ${ssrInterpolate(unref(sortCategories).Mark[item.category]["sortMethod"] === "A" ? "A to Z" : "Low to High")}</li>`);
      });
      _push(`<!--]--></ul></div></div></div></div><div class="library-nav-dropdown" data-v-da411839><div class="library-nav-title-block" data-v-da411839><h3 class="library-nav-view" data-v-da411839>Proportions</h3></div><div class="aselect" data-v-da411839><div class="selector" data-v-da411839><div class="label" data-v-da411839>`);
      if (unref(libraryDisplay).viewType["height"] !== "NotSelected") {
        _push(`<p data-v-da411839>${ssrInterpolate(unref(libraryDisplay).viewType["height"])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType["height"])[unref(libraryDisplay).view["height"]])}</p>`);
      } else {
        _push(`<p data-v-da411839>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType["height"])[unref(libraryDisplay).view["height"]])}</p>`);
      }
      _push(`</div><div class="${ssrRenderClass([{ expanded: unref(visible) }, "arrow"])}" data-v-da411839></div><div class="${ssrRenderClass([{ hidden: !unref(visible).height }, "categories"])}" data-v-da411839><ul class="scrollable" data-v-da411839><!--[-->`);
      ssrRenderList(unref(heightCategories).NotSelected, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `NotSelected:${item.category}` === unref(value).height })}" data-v-da411839> Not Selected </li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(heightCategories).Agent, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Agent:${item.category}` === unref(value).height })}" data-v-da411839> Agent | ${ssrInterpolate(unref(agentCategories)[item.category])}</li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(heightCategories).Book, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Book:${item.category}` === unref(value).height })}" data-v-da411839> Book | ${ssrInterpolate(unref(bookCategories)[item.category])}</li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(heightCategories).Mark, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Mark:${item.category}` === unref(value).height })}" data-v-da411839> Mark | ${ssrInterpolate(unref(markCategories)[item.category])}</li>`);
      });
      _push(`<!--]--></ul></div></div></div></div><div class="library-nav-dropdown" data-v-da411839><div class="library-nav-title-block" data-v-da411839><h3 class="library-nav-view" data-v-da411839>Colour</h3></div><div class="aselect" data-v-da411839><div class="selector" data-v-da411839><div class="label" data-v-da411839>`);
      if (unref(libraryDisplay).viewType["colour"] !== "NotSelected") {
        _push(`<p data-v-da411839>${ssrInterpolate(unref(libraryDisplay).viewType["colour"])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType["colour"])[unref(libraryDisplay).view["colour"]])}</p>`);
      } else {
        _push(`<p data-v-da411839>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType["colour"])[unref(libraryDisplay).view["colour"]])}</p>`);
      }
      _push(`</div><div class="${ssrRenderClass([{ expanded: unref(visible) }, "arrow"])}" data-v-da411839></div><div class="${ssrRenderClass([{ hidden: !unref(visible).colour }, "categories"])}" data-v-da411839><ul class="scrollable" data-v-da411839><!--[-->`);
      ssrRenderList(unref(colourCategories).NotSelected, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `NotSelected:${item.category}` === unref(value).colour })}" data-v-da411839> Not Selected </li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(colourCategories).Agent, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Agent:${item.category}` === unref(value).colour })}" data-v-da411839> Agent | ${ssrInterpolate(unref(agentCategories)[item.category])}</li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(colourCategories).Book, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Book:${item.category}` === unref(value).colour })}" data-v-da411839> Book | ${ssrInterpolate(unref(bookCategories)[item.category])}</li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(unref(colourCategories).Mark, (item) => {
        _push(`<li class="${ssrRenderClass({ current: `Mark:${item.category}` === unref(value).colour })}" data-v-da411839> Mark | ${ssrInterpolate(unref(markCategories)[item.category])}</li>`);
      });
      _push(`<!--]--></ul></div></div></div></div></div><div class="library-nav-colour-wrapper" data-v-da411839><div class="library-nav-title-block" data-v-da411839><h3 class="library-nav-view-colour" data-v-da411839>Colour Categories</h3></div><!--[-->`);
      ssrRenderList(unref(colourSet), (item) => {
        _push(`<div data-v-da411839><div class="library-nav-colour-item" data-v-da411839><div class="library-nav-colour-category" style="${ssrRenderStyle({ background: unref(itemColour)(item) })}" data-v-da411839></div><h2 class="library-nav-colour-label" data-v-da411839>${ssrInterpolate(item)}</h2></div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LibraryNav.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-da411839"]]);
const _sfc_main$1 = {
  __name: "LibraryView",
  __ssrInlineRender: true,
  setup(__props) {
    const viewStore = useViewStore();
    const {
      libraryData,
      libraryDisplay,
      formattedLibrary,
      itemHeight,
      itemColour,
      viewHeightBounds,
      viewColourSet
    } = storeToRefs(viewStore);
    const {
      parseDatabase,
      handleViewSelection,
      getIDP,
      itemTypeCheck
    } = useViewStore();
    const yourShelfStore = useYourShelfStore();
    storeToRefs(yourShelfStore);
    useYourShelfStore();
    const referenceStore = useReferenceStore();
    const {
      categoryMap,
      invCategoryMap,
      scales,
      libraryItemBundle
    } = storeToRefs(referenceStore);
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AgentItem = __nuxt_component_0$1;
      const _component_BookItem = __nuxt_component_1$2;
      const _component_MarkItem = __nuxt_component_2;
      _push(`<!--[-->`);
      ssrRenderList(unref(formattedLibrary), (shelf) => {
        _push(`<div class="shelf"><div class="shelf-title-box"><h2 class="shelf-title">${ssrInterpolate(shelf[0])}</h2></div><div class="shelf-inner"><!--[-->`);
        ssrRenderList(shelf[1], (bookend) => {
          _push(`<div class="section-wrapper"><div class="section-title-box" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}"><h3 class="section-category">${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType.bookend)[unref(libraryDisplay).view.bookend])}</h3><h3 class="section-value">${ssrInterpolate(bookend[0])}</h3><div class="section-shelf-box"></div></div><!--[-->`);
          ssrRenderList(bookend[1], (item) => {
            _push(`<div class="section-inner" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}">`);
            if (unref(itemTypeCheck)(item) === "Agent") {
              _push(ssrRenderComponent(_component_AgentItem, {
                item,
                itemBundle: unref(libraryItemBundle).Agent
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            if (unref(itemTypeCheck)(item) === "Book") {
              _push(ssrRenderComponent(_component_BookItem, {
                item,
                itemBundle: unref(libraryItemBundle).Book
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            if (unref(itemTypeCheck)(item) === "Mark") {
              _push(ssrRenderComponent(_component_MarkItem, {
                item,
                itemBundle: unref(libraryItemBundle).Mark
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LibraryView.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = _sfc_main$1;
const _sfc_main = {
  __name: "[setQuery]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const libraryStore = useLibraryStore();
    const viewStore = useViewStore();
    const {
      libraryData,
      libraryDisplay,
      dataSize,
      formattedLibrary,
      itemHeight,
      itemColour,
      viewHeightBounds,
      viewColourSet
    } = storeToRefs(viewStore);
    const {
      parseDatabase,
      handleViewSelection,
      getIDP,
      itemTypeCheck
    } = useViewStore();
    const yourShelfStore = useYourShelfStore();
    storeToRefs(yourShelfStore);
    useYourShelfStore();
    const referenceStore = useReferenceStore();
    storeToRefs(referenceStore);
    const setQueryView = referenceStore.viewRouteQueries[route.params.setQuery];
    console.log("setQueryView", setQueryView);
    console.log("viewStore", viewStore.libraryDisplay);
    console.log("query check", setQueryView.view.itemType);
    Object.assign(viewStore.libraryDisplay.view, setQueryView.view);
    Object.assign(viewStore.libraryDisplay.viewType, setQueryView.viewType);
    Object.assign(viewStore.libraryDisplay.pageText, setQueryView.pageText);
    const dataCheck = computed(() => {
      return formattedLibrary.value.length !== void 0;
    });
    watchEffect(() => {
      parseDatabase(libraryStore[viewStore.libraryDisplay.view.itemType]);
    });
    const showAnnotations = ref(false);
    useWindowScroll();
    ref();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LibraryNav = __nuxt_component_0;
      const _component_LibraryView = __nuxt_component_1;
      const _component_AnnotationPanel = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-db0f0c60><div class="query-box" data-v-db0f0c60><h1 class="query-type" data-v-db0f0c60>${ssrInterpolate(unref(libraryDisplay).pageText.queryType)}</h1><h2 class="query-breadcrumb" data-v-db0f0c60>${ssrInterpolate(unref(libraryDisplay).pageText.queryBreadcrumb)}</h2><h2 class="query-breadcrumb" data-v-db0f0c60>Total Items: ${ssrInterpolate(unref(dataSize))}</h2></div><div class="shelf-separator-container" data-v-db0f0c60><div class="shelf-separator" data-v-db0f0c60></div></div><div class="nav-div" data-v-db0f0c60>`);
      _push(ssrRenderComponent(_component_LibraryNav, null, null, _parent));
      _push(`</div><div class="library-type-title-box" data-v-db0f0c60><h1 class="library-type-title" data-v-db0f0c60>${ssrInterpolate(unref(libraryDisplay).pageText.libraryTypeTitle)}</h1><p class="library-type-subtitle" data-v-db0f0c60>${ssrInterpolate(unref(libraryDisplay).pageText.libraryTypeSubtitle)}</p></div>`);
      if (unref(dataCheck)) {
        _push(`<div data-v-db0f0c60>`);
        _push(ssrRenderComponent(_component_LibraryView, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="${ssrRenderClass([{ "active": unref(showAnnotations) }, "annotation-button"])}" data-v-db0f0c60> \u{1F58A}\uFE0F </button>`);
      if (unref(showAnnotations)) {
        _push(ssrRenderComponent(_component_AnnotationPanel, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="to-top-button" data-v-db0f0c60>\u261D\uFE0F</button></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/library/[setQuery].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _setQuery_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-db0f0c60"]]);

export { _setQuery_ as default };
//# sourceMappingURL=_setQuery_-721267fc.mjs.map
