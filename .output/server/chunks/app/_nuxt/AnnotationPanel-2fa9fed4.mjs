import { ref, watch, mergeProps, unref, useSSRContext, getCurrentScope, onScopeDispose, computed, getCurrentInstance } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';

function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
const noop = () => {
};
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
const defaultWindow = void 0;
function useEventListener(...args) {
  let target;
  let events;
  let listeners;
  let options;
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events))
    events = [events];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options2) => {
    el.addEventListener(event, listener, options2);
    return () => el.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      cleanups.push(
        ...events.flatMap((event) => {
          return listeners.map((listener) => register(el, event, listener, options2));
        })
      );
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
function onClickOutside(target, handler, options = {}) {
  const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
  if (!window2)
    return;
  let shouldListen = true;
  const shouldIgnore = (event) => {
    return ignore.some((target2) => {
      if (typeof target2 === "string") {
        return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
      } else {
        const el = unrefElement(target2);
        return el && (event.target === el || event.composedPath().includes(el));
      }
    });
  };
  const listener = (event) => {
    const el = unrefElement(target);
    if (!el || el === event.target || event.composedPath().includes(el))
      return;
    if (event.detail === 0)
      shouldListen = !shouldIgnore(event);
    if (!shouldListen) {
      shouldListen = true;
      return;
    }
    handler(event);
  };
  const cleanup = [
    useEventListener(window2, "click", listener, { passive: true, capture }),
    useEventListener(window2, "pointerdown", (e) => {
      const el = unrefElement(target);
      if (el)
        shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e);
    }, { passive: true }),
    detectIframe && useEventListener(window2, "blur", (event) => {
      setTimeout(() => {
        var _a;
        const el = unrefElement(target);
        if (((_a = window2.document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement)))
          handler(event);
      }, 0);
    })
  ].filter(Boolean);
  const stop = () => cleanup.forEach((fn) => fn());
  return stop;
}
function useMounted() {
  const isMounted = ref(false);
  if (getCurrentInstance())
    ;
  return isMounted;
}
function useSupported(callback) {
  const isMounted = useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
var __getOwnPropSymbols$h = Object.getOwnPropertySymbols;
var __hasOwnProp$h = Object.prototype.hasOwnProperty;
var __propIsEnum$h = Object.prototype.propertyIsEnumerable;
var __objRest$2 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$h.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$h)
    for (var prop of __getOwnPropSymbols$h(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$h.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function useResizeObserver(target, callback, options = {}) {
  const _a = options, { window: window2 = defaultWindow } = _a, observerOptions = __objRest$2(_a, ["window"]);
  let observer;
  const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const targets = computed(
    () => Array.isArray(target) ? target.map((el) => unrefElement(el)) : [unrefElement(target)]
  );
  const stopWatch = watch(
    targets,
    (els) => {
      cleanup();
      if (isSupported.value && window2) {
        observer = new ResizeObserver(callback);
        for (const _el of els)
          _el && observer.observe(_el, observerOptions);
      }
    },
    { immediate: true, flush: "post", deep: true }
  );
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
function useElementSize(target, initialSize = { width: 0, height: 0 }, options = {}) {
  const { window: window2 = defaultWindow, box = "content-box" } = options;
  const isSVG = computed(() => {
    var _a, _b;
    return (_b = (_a = unrefElement(target)) == null ? void 0 : _a.namespaceURI) == null ? void 0 : _b.includes("svg");
  });
  const width = ref(initialSize.width);
  const height = ref(initialSize.height);
  useResizeObserver(
    target,
    ([entry]) => {
      const boxSize = box === "border-box" ? entry.borderBoxSize : box === "content-box" ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
      if (window2 && isSVG.value) {
        const $elem = unrefElement(target);
        if ($elem) {
          const styles = window2.getComputedStyle($elem);
          width.value = Number.parseFloat(styles.width);
          height.value = Number.parseFloat(styles.height);
        }
      } else {
        if (boxSize) {
          const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
          width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
          height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
        } else {
          width.value = entry.contentRect.width;
          height.value = entry.contentRect.height;
        }
      }
    },
    options
  );
  watch(
    () => unrefElement(target),
    (ele) => {
      width.value = ele ? initialSize.width : 0;
      height.value = ele ? initialSize.height : 0;
    }
  );
  return {
    width,
    height
  };
}
const BuiltinExtractors = {
  page: (event) => [event.pageX, event.pageY],
  client: (event) => [event.clientX, event.clientY],
  screen: (event) => [event.screenX, event.screenY],
  movement: (event) => event instanceof Touch ? null : [event.movementX, event.movementY]
};
function useMouse(options = {}) {
  const {
    type = "page",
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    window: window2 = defaultWindow,
    target = window2,
    eventFilter
  } = options;
  const x = ref(initialValue.x);
  const y = ref(initialValue.y);
  const sourceType = ref(null);
  const extractor = typeof type === "function" ? type : BuiltinExtractors[type];
  const mouseHandler = (event) => {
    const result = extractor(event);
    if (result) {
      [x.value, y.value] = result;
      sourceType.value = "mouse";
    }
  };
  const touchHandler = (event) => {
    if (event.touches.length > 0) {
      const result = extractor(event.touches[0]);
      if (result) {
        [x.value, y.value] = result;
        sourceType.value = "touch";
      }
    }
  };
  const reset = () => {
    x.value = initialValue.x;
    y.value = initialValue.y;
  };
  const mouseHandlerWrapper = eventFilter ? (event) => eventFilter(() => mouseHandler(event), {}) : (event) => mouseHandler(event);
  const touchHandlerWrapper = eventFilter ? (event) => eventFilter(() => touchHandler(event), {}) : (event) => touchHandler(event);
  if (target) {
    const listenerOptions = { passive: true };
    useEventListener(target, ["mousemove", "dragover"], mouseHandlerWrapper, listenerOptions);
    if (touch && type !== "movement") {
      useEventListener(target, ["touchstart", "touchmove"], touchHandlerWrapper, listenerOptions);
      if (resetOnTouchEnds)
        useEventListener(target, "touchend", reset, listenerOptions);
    }
  }
  return {
    x,
    y,
    sourceType
  };
}
function useMousePressed(options = {}) {
  const {
    touch = true,
    drag = true,
    initialValue = false,
    window: window2 = defaultWindow
  } = options;
  const pressed = ref(initialValue);
  const sourceType = ref(null);
  if (!window2) {
    return {
      pressed,
      sourceType
    };
  }
  const onPressed = (srcType) => () => {
    pressed.value = true;
    sourceType.value = srcType;
  };
  const onReleased = () => {
    pressed.value = false;
    sourceType.value = null;
  };
  const target = computed(() => unrefElement(options.target) || window2);
  useEventListener(target, "mousedown", onPressed("mouse"), { passive: true });
  useEventListener(window2, "mouseleave", onReleased, { passive: true });
  useEventListener(window2, "mouseup", onReleased, { passive: true });
  if (drag) {
    useEventListener(target, "dragstart", onPressed("mouse"), { passive: true });
    useEventListener(window2, "drop", onReleased, { passive: true });
    useEventListener(window2, "dragend", onReleased, { passive: true });
  }
  if (touch) {
    useEventListener(target, "touchstart", onPressed("touch"), { passive: true });
    useEventListener(window2, "touchend", onReleased, { passive: true });
    useEventListener(window2, "touchcancel", onReleased, { passive: true });
  }
  return {
    pressed,
    sourceType
  };
}
function useWindowScroll({ window: window2 = defaultWindow } = {}) {
  if (!window2) {
    return {
      x: ref(0),
      y: ref(0)
    };
  }
  const x = ref(window2.scrollX);
  const y = ref(window2.scrollY);
  useEventListener(
    window2,
    "scroll",
    () => {
      x.value = window2.scrollX;
      y.value = window2.scrollY;
    },
    {
      capture: false,
      passive: true
    }
  );
  return { x, y };
}
const _sfc_main = {
  __name: "AnnotationPanel",
  __ssrInlineRender: true,
  setup(__props) {
    const container = ref(null);
    useElementSize(container);
    useMouse();
    useMousePressed();
    const history = ref([]);
    const color = ref("#fff281");
    const popups = ref({
      showColor: false,
      showSize: false,
      showWelcome: true,
      showSave: false,
      showOptions: false
    });
    const options = ref({
      restrictY: false,
      restrictX: false
    });
    const save = ref({
      name: "",
      saveItems: []
    });
    const size = ref(6);
    const colors = ref([
      "#d4f713",
      "#13f7ab",
      "#13f3f7",
      "#13c5f7",
      "#138cf7",
      "#1353f7",
      "#2d13f7",
      "#7513f7",
      "#a713f7",
      "#d413f7",
      "#f713e0",
      "#f71397",
      "#f7135b",
      "#f71313",
      "#f76213",
      "#f79413",
      "#fff281"
    ]);
    const sizes = ref([6, 12, 24, 48]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "draw" }, _attrs))} data-v-d6c42510>`);
      if (unref(popups).showWelcome) {
        _push(`<div class="welcome-bg" data-v-d6c42510><div class="welcome" data-v-d6c42510><h1 class="fade-up" data-v-d6c42510>Annotate the Library</h1><h2 class="fade-up" data-v-d6c42510> Create annotations using the draw toolbar </h2><a href="//twitter.com/lewitje" target="blank" title="Lewi Hussey on Twitter" class="fade-up" data-v-d6c42510>@emw_marginalia</a><span class="btn fade-up" title="Close" data-v-d6c42510> Click here to be begin </span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="app-wrapper" data-v-d6c42510><canvas id="canvas" data-v-d6c42510></canvas><div class="cursor" id="cursor" data-v-d6c42510></div><div class="controls" data-v-d6c42510><div class="btn-row" data-v-d6c42510><div class="history" title="history" data-v-d6c42510>${ssrInterpolate(unref(history).length)}</div></div><div class="btn-row" data-v-d6c42510><button type="button" class="${ssrRenderClass({ disabled: !unref(history).length })}" title="Undo" data-v-d6c42510><i class="ion ion-reply" data-v-d6c42510></i></button><button type="button" class="${ssrRenderClass({ disabled: !unref(history).length })}" title="Clear all" data-v-d6c42510><i class="ion ion-trash-a" data-v-d6c42510></i></button></div><div class="btn-row" data-v-d6c42510><button title="Brush options" data-v-d6c42510><i class="ion ion-android-create" data-v-d6c42510></i></button>`);
      if (unref(popups).showOptions) {
        _push(`<div class="popup" data-v-d6c42510><div class="popup-title" data-v-d6c42510> Options </div><button title="Restrict movement vertical" class="${ssrRenderClass({ active: unref(options).restrictY })}" data-v-d6c42510><i class="ion ion-arrow-right-c" data-v-d6c42510></i> Restrict vertical </button><button title="Restrict movement horizontal" class="${ssrRenderClass({ active: unref(options).restrictX })}" data-v-d6c42510><i class="ion ion-arrow-up-c" data-v-d6c42510></i> Restrict horizontal </button><button type="button" class="${ssrRenderClass({ disabled: !unref(history).length })}" title="Simplify paths" data-v-d6c42510><i class="ion ion-wand" data-v-d6c42510></i> Simplify paths </button><button type="button" class="${ssrRenderClass({ disabled: !unref(history).length })}" title="Go nutz" data-v-d6c42510><i class="ion ion-shuffle" data-v-d6c42510></i> Go nutz </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="btn-row" data-v-d6c42510><button title="Pick a brush size" class="${ssrRenderClass({ active: unref(popups).showSize })}" data-v-d6c42510><i class="ion ion-android-radio-button-on" data-v-d6c42510></i><span class="size-icon" data-v-d6c42510>${ssrInterpolate(unref(size))}</span></button>`);
      if (unref(popups).showSize) {
        _push(`<div class="popup" data-v-d6c42510><div class="popup-title" data-v-d6c42510> Brush size </div><!--[-->`);
        ssrRenderList(unref(sizes), (sizeItem) => {
          _push(`<label class="size-item" data-v-d6c42510><input type="radio" name="size"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(size), sizeItem)) ? " checked" : ""}${ssrRenderAttr("value", sizeItem)} data-v-d6c42510><span class="size" style="${ssrRenderStyle({ width: sizeItem + "px", height: sizeItem + "px" })}" data-v-d6c42510></span></label>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="btn-row" data-v-d6c42510><button title="Pick a color" class="${ssrRenderClass({ active: unref(popups).showColor })}" data-v-d6c42510><i class="ion ion-android-color-palette" data-v-d6c42510></i><span class="color-icon" style="${ssrRenderStyle({ backgroundColor: unref(color) })}" data-v-d6c42510></span></button>`);
      if (unref(popups).showColor) {
        _push(`<div class="popup" data-v-d6c42510><div class="popup-title" data-v-d6c42510> Brush color </div><!--[-->`);
        ssrRenderList(unref(colors), (colorItem) => {
          _push(`<label class="color-item" data-v-d6c42510><input type="radio" name="color"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(color), colorItem)) ? " checked" : ""}${ssrRenderAttr("value", colorItem)} data-v-d6c42510><span class="${ssrRenderClass("color color-" + colorItem)}" style="${ssrRenderStyle({ backgroundColor: colorItem })}" data-v-d6c42510></span></label>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="btn-row" data-v-d6c42510><button title="Save" data-v-d6c42510><i class="ion ion-android-cloud-outline" data-v-d6c42510></i></button>`);
      if (unref(popups).showSave) {
        _push(`<div class="popup" data-v-d6c42510><div class="popup-title" data-v-d6c42510> Save your design </div><div class="form" data-v-d6c42510><input type="text" placeholder="Save name"${ssrRenderAttr("value", unref(save).name)} data-v-d6c42510>`);
        if (unref(save).name.length < 3) {
          _push(`<div class="text-faded" data-v-d6c42510><i data-v-d6c42510> Min 3 characters </i></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="btn" data-v-d6c42510> Save as <span class="text-faded" data-v-d6c42510>${ssrInterpolate(unref(save).name)}</span></span></div>`);
        if (unref(save).saveItems.length) {
          _push(`<div class="saves" data-v-d6c42510><div class="popup-title" data-v-d6c42510> Load a save </div><!--[-->`);
          ssrRenderList(unref(save).saveItems, (item) => {
            _push(`<div class="save-item" data-v-d6c42510><h3 data-v-d6c42510>${ssrInterpolate(item.name)}</h3><span class="btn" data-v-d6c42510>load</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="btn-row" data-v-d6c42510><button title="Made by Lewi" data-v-d6c42510><i class="ion ion-heart" data-v-d6c42510></i></button></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AnnotationPanel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d6c42510"]]);

export { __nuxt_component_1 as _, onClickOutside as o, useWindowScroll as u };
//# sourceMappingURL=AnnotationPanel-2fa9fed4.mjs.map
