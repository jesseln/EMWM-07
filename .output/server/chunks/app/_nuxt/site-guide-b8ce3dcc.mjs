import { u as useViewStore, a as useYourShelfStore, b as useReferenceStore, _ as __nuxt_component_0$2, c as __nuxt_component_1, d as __nuxt_component_2 } from './MarkItem-7373e2ae.mjs';
import { unref, useSSRContext, ref, resolveComponent, resolveDirective, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, withDirectives } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrGetDirectiveProps, ssrRenderAttr } from 'vue/server-renderer';
import { s as storeToRefs } from '../server.mjs';
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
  __name: "ViewSelector",
  __ssrInlineRender: true,
  props: ["viewMode", "selectionList"],
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
      handleColour
    } = useViewStore();
    const yourShelfStore = useYourShelfStore();
    storeToRefs(yourShelfStore);
    useYourShelfStore();
    const referenceStore = useReferenceStore();
    const {
      categoryMap,
      invCategoryMap,
      colourMapFiltered,
      scales
    } = storeToRefs(referenceStore);
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VDropdown = resolveComponent("VDropdown");
      const _directive_close_popper = resolveDirective("close-popper");
      _push(ssrRenderComponent(_component_VDropdown, mergeProps({
        placement: "bottom",
        delay: { show: 50, hide: 200 }
      }, _attrs), {
        popper: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="item-menu"${_scopeId}><div class="item-menu-header-container"${_scopeId}><h2 class="item-menu-header"${_scopeId}>Item Type</h2><h2 class="item-menu-subheader"${_scopeId}></h2></div><ul${_scopeId}><!--[-->`);
            ssrRenderList(unref(categoryMap).keys(), (itemType) => {
              _push2(`<li${_scopeId}>`);
              _push2(ssrRenderComponent(_component_VDropdown, {
                placement: "right",
                delay: { show: 50, hide: 200 }
              }, {
                popper: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<ul${_scopeId2}><!--[-->`);
                    ssrRenderList(__props.selectionList.get(itemType), (category) => {
                      _push3(`<li${_scopeId2}><div class="item-menu"${_scopeId2}><div class="shelf-button-wrapper"${_scopeId2}><button class="shelf-button"${_scopeId2}><h4${_scopeId2}>${ssrInterpolate(category)}</h4></button></div></div></li>`);
                    });
                    _push3(`<!--]--></ul><button${ssrRenderAttrs(mergeProps({ class: "shelf-button close-button" }, ssrGetDirectiveProps(_ctx, _directive_close_popper)))}${_scopeId2}><svg xmlns="http://www.w3.org/2000/svg"${ssrRenderAttr("width", 12 * 1.1)}${ssrRenderAttr("height", 13 * 1.1)} viewBox="0 0 12 13" fill="none"${_scopeId2}><path class="shelf-button close-button" d="M8.31429 9.44434L6 7.13005L3.68571 9.44434L3 8.75862L5.31429 6.44434L3 4.13005L3.68571 3.44434L6 5.75862L8.31429 3.44434L9 4.13005L6.68571 6.44434L9 8.75862L8.31429 9.44434Z"${_scopeId2}></path></svg></button>`);
                  } else {
                    return [
                      createVNode("ul", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.selectionList.get(itemType), (category) => {
                          return openBlock(), createBlock("li", null, [
                            createVNode("div", { class: "item-menu" }, [
                              createVNode("div", { class: "shelf-button-wrapper" }, [
                                createVNode("button", {
                                  class: "shelf-button",
                                  onClick: ($event) => unref(handleViewSelection)(__props.viewMode, unref(invCategoryMap).get(itemType)[category], itemType)
                                }, [
                                  createVNode("h4", null, toDisplayString(category), 1)
                                ], 8, ["onClick"])
                              ])
                            ])
                          ]);
                        }), 256))
                      ]),
                      withDirectives((openBlock(), createBlock("button", { class: "shelf-button close-button" }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          width: 12 * 1.1,
                          height: 13 * 1.1,
                          viewBox: "0 0 12 13",
                          fill: "none"
                        }, [
                          createVNode("path", {
                            class: "shelf-button close-button",
                            d: "M8.31429 9.44434L6 7.13005L3.68571 9.44434L3 8.75862L5.31429 6.44434L3 4.13005L3.68571 3.44434L6 5.75862L8.31429 3.44434L9 4.13005L6.68571 6.44434L9 8.75862L8.31429 9.44434Z"
                          })
                        ]))
                      ])), [
                        [_directive_close_popper]
                      ])
                    ];
                  }
                }),
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="item-menu"${_scopeId2}><div class="shelf-button-wrapper"${_scopeId2}><button class="shelf-button"${_scopeId2}><h4${_scopeId2}>${ssrInterpolate(itemType)}</h4></button></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "item-menu" }, [
                        createVNode("div", { class: "shelf-button-wrapper" }, [
                          createVNode("button", { class: "shelf-button" }, [
                            createVNode("h4", null, toDisplayString(itemType), 1)
                          ])
                        ])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></div><button${ssrRenderAttrs(mergeProps({ class: "shelf-button close-button" }, ssrGetDirectiveProps(_ctx, _directive_close_popper)))}${_scopeId}><svg xmlns="http://www.w3.org/2000/svg"${ssrRenderAttr("width", 12 * 1.1)}${ssrRenderAttr("height", 13 * 1.1)} viewBox="0 0 12 13" fill="none"${_scopeId}><path class="shelf-button close-button" d="M8.31429 9.44434L6 7.13005L3.68571 9.44434L3 8.75862L5.31429 6.44434L3 4.13005L3.68571 3.44434L6 5.75862L8.31429 3.44434L9 4.13005L6.68571 6.44434L9 8.75862L8.31429 9.44434Z"${_scopeId}></path></svg></button></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "item-menu" }, [
                  createVNode("div", { class: "item-menu-header-container" }, [
                    createVNode("h2", { class: "item-menu-header" }, "Item Type"),
                    createVNode("h2", { class: "item-menu-subheader" })
                  ]),
                  createVNode("ul", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(categoryMap).keys(), (itemType) => {
                      return openBlock(), createBlock("li", null, [
                        createVNode(_component_VDropdown, {
                          placement: "right",
                          delay: { show: 50, hide: 200 }
                        }, {
                          popper: withCtx(() => [
                            createVNode("ul", null, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.selectionList.get(itemType), (category) => {
                                return openBlock(), createBlock("li", null, [
                                  createVNode("div", { class: "item-menu" }, [
                                    createVNode("div", { class: "shelf-button-wrapper" }, [
                                      createVNode("button", {
                                        class: "shelf-button",
                                        onClick: ($event) => unref(handleViewSelection)(__props.viewMode, unref(invCategoryMap).get(itemType)[category], itemType)
                                      }, [
                                        createVNode("h4", null, toDisplayString(category), 1)
                                      ], 8, ["onClick"])
                                    ])
                                  ])
                                ]);
                              }), 256))
                            ]),
                            withDirectives((openBlock(), createBlock("button", { class: "shelf-button close-button" }, [
                              (openBlock(), createBlock("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: 12 * 1.1,
                                height: 13 * 1.1,
                                viewBox: "0 0 12 13",
                                fill: "none"
                              }, [
                                createVNode("path", {
                                  class: "shelf-button close-button",
                                  d: "M8.31429 9.44434L6 7.13005L3.68571 9.44434L3 8.75862L5.31429 6.44434L3 4.13005L3.68571 3.44434L6 5.75862L8.31429 3.44434L9 4.13005L6.68571 6.44434L9 8.75862L8.31429 9.44434Z"
                                })
                              ]))
                            ])), [
                              [_directive_close_popper]
                            ])
                          ]),
                          default: withCtx(() => [
                            createVNode("div", { class: "item-menu" }, [
                              createVNode("div", { class: "shelf-button-wrapper" }, [
                                createVNode("button", { class: "shelf-button" }, [
                                  createVNode("h4", null, toDisplayString(itemType), 1)
                                ])
                              ])
                            ])
                          ]),
                          _: 2
                        }, 1024)
                      ]);
                    }), 256))
                  ])
                ]),
                withDirectives((openBlock(), createBlock("button", { class: "shelf-button close-button" }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: 12 * 1.1,
                    height: 13 * 1.1,
                    viewBox: "0 0 12 13",
                    fill: "none"
                  }, [
                    createVNode("path", {
                      class: "shelf-button close-button",
                      d: "M8.31429 9.44434L6 7.13005L3.68571 9.44434L3 8.75862L5.31429 6.44434L3 4.13005L3.68571 3.44434L6 5.75862L8.31429 3.44434L9 4.13005L6.68571 6.44434L9 8.75862L8.31429 9.44434Z"
                    })
                  ]))
                ])), [
                  [_directive_close_popper]
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="shelf-button-wrapper"${_scopeId}><button class="shelf-button"${_scopeId}><p${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.viewMode])}</p><p${_scopeId}>&gt;</p><p${_scopeId}>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.viewMode])[unref(libraryDisplay).view[__props.viewMode]])}</p></button></div>`);
          } else {
            return [
              createVNode("div", { class: "shelf-button-wrapper" }, [
                createVNode("button", { class: "shelf-button" }, [
                  createVNode("p", null, toDisplayString(unref(libraryDisplay).viewType[__props.viewMode]), 1),
                  createVNode("p", null, ">"),
                  createVNode("p", null, toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.viewMode])[unref(libraryDisplay).view[__props.viewMode]]), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ViewSelector.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0$1 = _sfc_main$2;
const _sfc_main$1 = {
  __name: "ViewDesigner",
  __ssrInlineRender: true,
  setup(__props) {
    useLibraryStore();
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
      colourMapFiltered,
      scales,
      viewEditItemBundle,
      viewColourItemBundle
    } = storeToRefs(referenceStore);
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ViewSelector = __nuxt_component_0$1;
      const _component_AgentItem = __nuxt_component_0$2;
      const _component_BookItem = __nuxt_component_1;
      const _component_MarkItem = __nuxt_component_2;
      _push(`<!--[--><div class="yourShelf-title-box"><h2 class="library-type-title">Design Your Library View</h2><p class="yourShelf-description">Select the options below to alter your view of the library.</p></div><div class="yourShelf-title-box"><h2 class="view-facet-title">Select Library Items to View</h2><p class="view-facet-description">View the library by Agents, Books or Marks by clicking below.</p></div><div class="library-display-button-wrapper"><div class="library-button-wrapper"><button class="shelf-button library-button">Agents</button></div><div class="library-button-wrapper"><button class="shelf-button library-button">Books</button></div><div class="library-button-wrapper"><button class="shelf-button library-button">Marks</button></div></div><div class="view-top-section-wrapper"><div class="view-wrapper"><div class="view-facet-title-box"><h2 class="view-facet-title">Item Height</h2><p class="view-facet-description">Select the category which changes the height of each item.</p>`);
      _push(ssrRenderComponent(_component_ViewSelector, {
        viewMode: "height",
        selectionList: unref(categoryMap)
      }, null, _parent));
      _push(`</div><div class="view-shelf-inner"><div class="view-section-wrapper"><div class="section-title-box" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}"><h3 class="view-section-category">Lowest Value </h3><h3 class="view-section-value">${ssrInterpolate(`"${unref(getIDP)(unref(viewHeightBounds)[0], "height")}"`)}</h3><div class="section-shelf-box"></div></div><!--[-->`);
      ssrRenderList(unref(viewHeightBounds), (item) => {
        _push(`<div class="section-inner" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}">`);
        if (unref(itemTypeCheck)(item) === "Agent") {
          _push(ssrRenderComponent(_component_AgentItem, {
            item,
            itemBundle: unref(viewEditItemBundle).Agent
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Book") {
          _push(ssrRenderComponent(_component_BookItem, {
            item,
            itemBundle: unref(viewEditItemBundle).Book
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Mark") {
          _push(ssrRenderComponent(_component_MarkItem, {
            item,
            itemBundle: unref(viewEditItemBundle).Mark
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--><div class="view-section-title-box-rhs" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}"><h3 class="view-section-category">Highest Value </h3><h3 class="view-section-value">${ssrInterpolate(`"${unref(getIDP)(unref(viewHeightBounds)[1], "height")}"`)}</h3><div class="section-shelf-box"></div></div></div></div></div><div class="view-wrapper"><div class="view-facet-title-box"><h2 class="view-facet-title">Item Shelves</h2><p class="view-facet-description">Select the category which divides the items into different shelves.</p>`);
      _push(ssrRenderComponent(_component_ViewSelector, {
        viewMode: "shelf",
        selectionList: unref(categoryMap)
      }, null, _parent));
      _push(`</div><div class="shelf-inner"><div class="view-section-wrapper"><!--[-->`);
      ssrRenderList(unref(viewHeightBounds), (item) => {
        _push(`<div class="section-inner" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}">`);
        if (unref(itemTypeCheck)(item) === "Agent") {
          _push(ssrRenderComponent(_component_AgentItem, {
            item,
            itemBundle: unref(viewEditItemBundle).Agent
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Book") {
          _push(ssrRenderComponent(_component_BookItem, {
            item,
            itemBundle: unref(viewEditItemBundle).Book
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Mark") {
          _push(ssrRenderComponent(_component_MarkItem, {
            item,
            itemBundle: unref(viewEditItemBundle).Mark
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div><div class="view-wrapper"><div class="view-facet-title-box"><h2 class="view-facet-title">Item Arrangement</h2><p class="view-facet-description">Select the category which orders the items on the shelf.</p>`);
      _push(ssrRenderComponent(_component_ViewSelector, {
        viewMode: "bookend",
        selectionList: unref(categoryMap)
      }, null, _parent));
      _push(`</div><div class="shelf-inner"><div class="view-section-wrapper"><!--[-->`);
      ssrRenderList(unref(viewHeightBounds), (item) => {
        _push(`<div class="section-inner" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}">`);
        if (unref(itemTypeCheck)(item) === "Agent") {
          _push(ssrRenderComponent(_component_AgentItem, {
            item,
            itemBundle: unref(viewEditItemBundle).Agent
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Book") {
          _push(ssrRenderComponent(_component_BookItem, {
            item,
            itemBundle: unref(viewEditItemBundle).Book
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Mark") {
          _push(ssrRenderComponent(_component_MarkItem, {
            item,
            itemBundle: unref(viewEditItemBundle).Mark
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div></div><div class="view-wrapper"><div class="view-facet-title-box"><h2 class="view-facet-title">Item Colour</h2><p class="view-facet-description">Select the category which sets the colours for each item.</p>`);
      _push(ssrRenderComponent(_component_ViewSelector, {
        viewMode: "colour",
        selectionList: unref(colourMapFiltered)
      }, null, _parent));
      _push(`</div><div class="shelf-inner"><div class="view-section-wrapper"><div class="section-title-box" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}"><h3 class="yourShelf-section-category">Unique Categories</h3><h3 class="yourShelf-section-value">${ssrInterpolate(unref(viewColourSet).size)}</h3><div class="section-shelf-box"></div></div><!--[-->`);
      ssrRenderList(unref(viewColourSet), (item) => {
        _push(`<div class="section-inner" style="${ssrRenderStyle({ height: unref(scales).maxShelfHeight + "px" })}">`);
        if (unref(itemTypeCheck)(item) === "Agent") {
          _push(ssrRenderComponent(_component_AgentItem, {
            item,
            itemBundle: unref(viewColourItemBundle).Agent
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Book") {
          _push(ssrRenderComponent(_component_BookItem, {
            item,
            itemBundle: unref(viewColourItemBundle).Book
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemTypeCheck)(item) === "Mark") {
          _push(ssrRenderComponent(_component_MarkItem, {
            item,
            itemBundle: unref(viewColourItemBundle).Mark
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ViewDesigner.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main$1;
const _sfc_main = {
  __name: "site-guide",
  __ssrInlineRender: true,
  setup(__props) {
    useLibraryStore();
    const viewStore = useViewStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ViewDesigner = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(viewStore).formattedLibrary.length) {
        _push(ssrRenderComponent(_component_ViewDesigner, null, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/site-guide.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=site-guide-b8ce3dcc.mjs.map
