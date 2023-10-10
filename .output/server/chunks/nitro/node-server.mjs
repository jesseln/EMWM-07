globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, assertMethod, readBody, setCookie, lazyEventHandler, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import { createIPX, createIPXMiddleware } from 'ipx';
import gracefulShutdown from 'http-graceful-shutdown';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "supabase": {
      "url": "https://hmgugjmjfcvjtmrrafjm.supabase.co",
      "key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZ3Vnam1qZmN2anRtcnJhZmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg4MDA1NjIsImV4cCI6MjAwNDM3NjU2Mn0.ZOQDBSopUSD4qxE8EM9FqETN15cfdIubDw24OJ6fxPQ",
      "client": {
        "auth": {
          "detectSessionInUrl": true,
          "persistSession": true,
          "autoRefreshToken": true
        }
      },
      "redirect": false,
      "cookies": {
        "name": "sb",
        "lifetime": 28800,
        "domain": "",
        "path": "/",
        "sameSite": "lax"
      }
    }
  },
  "supabase": {
    "serviceKey": ""
  },
  "ipx": {
    "dir": "../public",
    "domains": [],
    "sharp": {},
    "alias": {}
  }
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config$1 = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config$1.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function trapUnhandledNodeErrors() {
  {
    process.on(
      "unhandledRejection",
      (err) => console.error("[nitro] [unhandledRejection] " + err)
    );
    process.on(
      "uncaughtException",
      (err) => console.error("[nitro]  [uncaughtException] " + err)
    );
  }
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(html);
});

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/css/nuxt-google-fonts.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"106fb-JjimsIlj+SrkokznEFjKTsm654w\"",
    "mtime": "2023-10-10T03:34:05.003Z",
    "size": 67323,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/img/12º.jpg": {
    "type": "image/jpeg",
    "etag": "\"164c5b-Wi5MKY13nrLabNesMzK9r3Hsr9c\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 1461339,
    "path": "../public/img/12º.jpg"
  },
  "/img/16º.jpg": {
    "type": "image/jpeg",
    "etag": "\"162752-IEXrfEGToOPv4y50z4WkWE7z5ik\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 1451858,
    "path": "../public/img/16º.jpg"
  },
  "/img/24º.jpg": {
    "type": "image/jpeg",
    "etag": "\"12400e-KvZReiSis4Io3WizrTh6t6M4/Zo\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 1196046,
    "path": "../public/img/24º.jpg"
  },
  "/img/2º.jpg": {
    "type": "image/jpeg",
    "etag": "\"f80c1-wSGVQ2+psddbFyTP0FzGmuwVBcA\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 1016001,
    "path": "../public/img/2º.jpg"
  },
  "/img/32º.jpg": {
    "type": "image/jpeg",
    "etag": "\"186308-waMYcBiywk0rSlAX+WgNC03djcM\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 1598216,
    "path": "../public/img/32º.jpg"
  },
  "/img/4º.jpg": {
    "type": "image/jpeg",
    "etag": "\"16dec0-Iq94PvaAS+lBCDTBcF/ccUToAIA\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 1498816,
    "path": "../public/img/4º.jpg"
  },
  "/img/64º.jpg": {
    "type": "image/jpeg",
    "etag": "\"152056-zsm57N45TXiwNJuuMM3on3sc4XY\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 1384534,
    "path": "../public/img/64º.jpg"
  },
  "/img/8º.jpg": {
    "type": "image/jpeg",
    "etag": "\"d5dcd-yTYZJx3+XQpbRJBWGRKB9XF3A0I\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 875981,
    "path": "../public/img/8º.jpg"
  },
  "/img/fol.jpg": {
    "type": "image/jpeg",
    "etag": "\"19fa35-f4fTZC2qCCZQkQzJdUQQd8ZmKYY\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 1702453,
    "path": "../public/img/fol.jpg"
  },
  "/img/not recorded.JPG": {
    "type": "image/jpeg",
    "etag": "\"105229-VnahFvmxcEjs33oRAb2mTSOwrdE\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 1069609,
    "path": "../public/img/not recorded.JPG"
  },
  "/img/star.JPG": {
    "type": "image/jpeg",
    "etag": "\"eb636-lIem3DhFZiLQZ/0Lv4EksgOY8Ks\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 964150,
    "path": "../public/img/star.JPG"
  },
  "/img/undefined.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b2c4a-IuccgKqi3KpLWVLFcKaOfBGHVz4\"",
    "mtime": "2023-10-05T21:09:44.000Z",
    "size": 4926538,
    "path": "../public/img/undefined.jpg"
  },
  "/_nuxt/about.55a39c06.js": {
    "type": "application/javascript",
    "etag": "\"e7-T/bgemSIlAKTJ4KOg71bFhymu+Q\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 231,
    "path": "../public/_nuxt/about.55a39c06.js"
  },
  "/_nuxt/AnnotationPanel.3a3eba58.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17d9-nNrHK494iDKShTjRALHbqU6YWnk\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 6105,
    "path": "../public/_nuxt/AnnotationPanel.3a3eba58.css"
  },
  "/_nuxt/AnnotationPanel.4dfb10f7.js": {
    "type": "application/javascript",
    "etag": "\"3100-CD4QjettA+0VeO8yUpy21/I18r4\"",
    "mtime": "2023-10-10T03:34:27.985Z",
    "size": 12544,
    "path": "../public/_nuxt/AnnotationPanel.4dfb10f7.js"
  },
  "/_nuxt/default.6a281bd9.js": {
    "type": "application/javascript",
    "etag": "\"cd8-YknXdXOLs1ESC4RWE5RFfP2onMc\"",
    "mtime": "2023-10-10T03:34:27.985Z",
    "size": 3288,
    "path": "../public/_nuxt/default.6a281bd9.js"
  },
  "/_nuxt/default.915a0963.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"576-1pDGcH2yESNNnqMkIW/IzYG4+BM\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 1398,
    "path": "../public/_nuxt/default.915a0963.css"
  },
  "/_nuxt/entry.de7ae5fc.js": {
    "type": "application/javascript",
    "etag": "\"4a209-kVyM2z4+mCYRD9ZnRVyC3m3CR9w\"",
    "mtime": "2023-10-10T03:34:27.985Z",
    "size": 303625,
    "path": "../public/_nuxt/entry.de7ae5fc.js"
  },
  "/_nuxt/error-404.9ac83013.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-8uruto57+quXaRo+BbZC91eDbZY\"",
    "mtime": "2023-10-10T03:34:27.972Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.9ac83013.css"
  },
  "/_nuxt/error-404.a52481c1.js": {
    "type": "application/javascript",
    "etag": "\"8d2-aBAd4b/xx1ADYRmqbt7k9lRpbTo\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 2258,
    "path": "../public/_nuxt/error-404.a52481c1.js"
  },
  "/_nuxt/error-500.18557133.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-mTJRUrkLpJcus90cqa8R5/eCBRk\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.18557133.css"
  },
  "/_nuxt/error-500.d944f162.js": {
    "type": "application/javascript",
    "etag": "\"756-IF0b+ZXHmIyOqtfMyKp84uS6gBE\"",
    "mtime": "2023-10-10T03:34:27.985Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.d944f162.js"
  },
  "/_nuxt/index.c6605d58.js": {
    "type": "application/javascript",
    "etag": "\"e4-oy05iZ1PhKUBwz97cBguQgeD86Q\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 228,
    "path": "../public/_nuxt/index.c6605d58.js"
  },
  "/_nuxt/library.bf12e60c.js": {
    "type": "application/javascript",
    "etag": "\"ec-31wAWaUto9ZPoKekLydkVMxEg9o\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 236,
    "path": "../public/_nuxt/library.bf12e60c.js"
  },
  "/_nuxt/libraryStore.8c5c4be6.js": {
    "type": "application/javascript",
    "etag": "\"8c5-GpVDM6cTYvYzvzITb8yLpD2wy58\"",
    "mtime": "2023-10-10T03:34:27.974Z",
    "size": 2245,
    "path": "../public/_nuxt/libraryStore.8c5c4be6.js"
  },
  "/_nuxt/MarkItem.9f1c29ac.js": {
    "type": "application/javascript",
    "etag": "\"2d95c9-70OXV7NXaG+FmxW4tFQRYbt/GXw\"",
    "mtime": "2023-10-10T03:34:27.987Z",
    "size": 2987465,
    "path": "../public/_nuxt/MarkItem.9f1c29ac.js"
  },
  "/_nuxt/MarkItem.ad73d1bb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1089-xV/LlxYqzOeFRkx4GcJCZcbpOEY\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 4233,
    "path": "../public/_nuxt/MarkItem.ad73d1bb.css"
  },
  "/_nuxt/Material_Symbols_Outlined-400-1.b70a3d67.woff2": {
    "type": "font/woff2",
    "etag": "\"3801c-wdrlMe6EirxWBj3ly17UbOjhypo\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 229404,
    "path": "../public/_nuxt/Material_Symbols_Outlined-400-1.b70a3d67.woff2"
  },
  "/_nuxt/nuxt-icon.4544dae2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"fe-23rdvH8wBVm0gSnUqmHDhubj+to\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 254,
    "path": "../public/_nuxt/nuxt-icon.4544dae2.css"
  },
  "/_nuxt/nuxt-icon.934ec062.js": {
    "type": "application/javascript",
    "etag": "\"308-q+hAYLJbqsW3HxitxwH5wTYE+Qs\"",
    "mtime": "2023-10-10T03:34:27.985Z",
    "size": 776,
    "path": "../public/_nuxt/nuxt-icon.934ec062.js"
  },
  "/_nuxt/nuxt-link.4e587147.js": {
    "type": "application/javascript",
    "etag": "\"10f2-kIiWgO/FDN6qQM0LljwX2yDh5OI\"",
    "mtime": "2023-10-10T03:34:27.985Z",
    "size": 4338,
    "path": "../public/_nuxt/nuxt-link.4e587147.js"
  },
  "/_nuxt/Raleway-100-2.2ab70013.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:27.958Z",
    "size": 26788,
    "path": "../public/_nuxt/Raleway-100-2.2ab70013.woff2"
  },
  "/_nuxt/Raleway-100-3.89f273f4.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 25828,
    "path": "../public/_nuxt/Raleway-100-3.89f273f4.woff2"
  },
  "/_nuxt/Raleway-100-4.3eb84c62.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:27.967Z",
    "size": 11176,
    "path": "../public/_nuxt/Raleway-100-4.3eb84c62.woff2"
  },
  "/_nuxt/Raleway-100-5.4db78ee9.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:27.970Z",
    "size": 30744,
    "path": "../public/_nuxt/Raleway-100-5.4db78ee9.woff2"
  },
  "/_nuxt/Raleway-100-6.8cbc049d.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 48208,
    "path": "../public/_nuxt/Raleway-100-6.8cbc049d.woff2"
  },
  "/_nuxt/Roboto-400-67.b7ef2cd1.woff2": {
    "type": "font/woff2",
    "etag": "\"3bf0-3SKkH6IexKSo0p/Tadm+6RnLmKw\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 15344,
    "path": "../public/_nuxt/Roboto-400-67.b7ef2cd1.woff2"
  },
  "/_nuxt/Roboto-400-68.495d38d4.woff2": {
    "type": "font/woff2",
    "etag": "\"259c-ESovxfT/m4XuOnBvqbjEf3mwWTM\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 9628,
    "path": "../public/_nuxt/Roboto-400-68.495d38d4.woff2"
  },
  "/_nuxt/Roboto-400-70.daf51ab5.woff2": {
    "type": "font/woff2",
    "etag": "\"1bc8-fPvEFcRbInSlmXJV++wPtTu+Mn0\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 7112,
    "path": "../public/_nuxt/Roboto-400-70.daf51ab5.woff2"
  },
  "/_nuxt/Roboto-400-71.77b24796.woff2": {
    "type": "font/woff2",
    "etag": "\"15b8-EJzUxUNb1mFDkbuHIsR8KHyWsuw\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 5560,
    "path": "../public/_nuxt/Roboto-400-71.77b24796.woff2"
  },
  "/_nuxt/Roboto-400-72.3c23eb02.woff2": {
    "type": "font/woff2",
    "etag": "\"2e60-t0NUh3DEbZBa4boGMQvAAcWH/o4\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 11872,
    "path": "../public/_nuxt/Roboto-400-72.3c23eb02.woff2"
  },
  "/_nuxt/Roboto-400-73.f6734f81.woff2": {
    "type": "font/woff2",
    "etag": "\"3d80-fKnFln87uL/+qyS2ObScHn0D+lI\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 15744,
    "path": "../public/_nuxt/Roboto-400-73.f6734f81.woff2"
  },
  "/_nuxt/shared-annotations.eadd1e71.js": {
    "type": "application/javascript",
    "etag": "\"e8-rCyaSSf5lgEnfvm0UwagWrCcwCg\"",
    "mtime": "2023-10-10T03:34:27.974Z",
    "size": 232,
    "path": "../public/_nuxt/shared-annotations.eadd1e71.js"
  },
  "/_nuxt/sidebarArrow.a515a71e.js": {
    "type": "application/javascript",
    "etag": "\"18c-sA54Jpr9rbcbUcsMyUILR+trrQA\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 396,
    "path": "../public/_nuxt/sidebarArrow.a515a71e.js"
  },
  "/_nuxt/site-guide.9601d5d7.js": {
    "type": "application/javascript",
    "etag": "\"21e9-RqMRYaJd02MuL/aVGz3yJVpPURg\"",
    "mtime": "2023-10-10T03:34:27.985Z",
    "size": 8681,
    "path": "../public/_nuxt/site-guide.9601d5d7.js"
  },
  "/_nuxt/Source_Sans_3-200-74.26eb7cb8.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 10444,
    "path": "../public/_nuxt/Source_Sans_3-200-74.26eb7cb8.woff2"
  },
  "/_nuxt/Source_Sans_3-200-75.abd07dc9.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 18080,
    "path": "../public/_nuxt/Source_Sans_3-200-75.abd07dc9.woff2"
  },
  "/_nuxt/Source_Sans_3-200-76.2ea7ad43.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 9056,
    "path": "../public/_nuxt/Source_Sans_3-200-76.2ea7ad43.woff2"
  },
  "/_nuxt/Source_Sans_3-200-77.c0769cf6.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 14288,
    "path": "../public/_nuxt/Source_Sans_3-200-77.c0769cf6.woff2"
  },
  "/_nuxt/Source_Sans_3-200-78.bd97384b.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 9896,
    "path": "../public/_nuxt/Source_Sans_3-200-78.bd97384b.woff2"
  },
  "/_nuxt/Source_Sans_3-200-79.7ee59837.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 49780,
    "path": "../public/_nuxt/Source_Sans_3-200-79.7ee59837.woff2"
  },
  "/_nuxt/Source_Sans_3-200-80.d01fec7e.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 28452,
    "path": "../public/_nuxt/Source_Sans_3-200-80.d01fec7e.woff2"
  },
  "/_nuxt/Source_Serif_4-200-151.f2665f66.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:27.968Z",
    "size": 17512,
    "path": "../public/_nuxt/Source_Serif_4-200-151.f2665f66.woff2"
  },
  "/_nuxt/Source_Serif_4-200-152.563b69dc.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:27.970Z",
    "size": 35284,
    "path": "../public/_nuxt/Source_Serif_4-200-152.563b69dc.woff2"
  },
  "/_nuxt/Source_Serif_4-200-153.046bd539.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:27.972Z",
    "size": 19424,
    "path": "../public/_nuxt/Source_Serif_4-200-153.046bd539.woff2"
  },
  "/_nuxt/Source_Serif_4-200-154.88ee5259.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 13264,
    "path": "../public/_nuxt/Source_Serif_4-200-154.88ee5259.woff2"
  },
  "/_nuxt/Source_Serif_4-200-155.07903aec.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 35144,
    "path": "../public/_nuxt/Source_Serif_4-200-155.07903aec.woff2"
  },
  "/_nuxt/Source_Serif_4-200-156.42c9a212.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 49308,
    "path": "../public/_nuxt/Source_Serif_4-200-156.42c9a212.woff2"
  },
  "/_nuxt/useSupabaseClient.97dbf750.js": {
    "type": "application/javascript",
    "etag": "\"123-4DkajSy6L14VUOGGFVoBE3gZ2aQ\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 291,
    "path": "../public/_nuxt/useSupabaseClient.97dbf750.js"
  },
  "/_nuxt/your-collection.928f91e8.js": {
    "type": "application/javascript",
    "etag": "\"7ba-uqOcD7vHM6AnJFp2ncDlUSHCZVc\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 1978,
    "path": "../public/_nuxt/your-collection.928f91e8.js"
  },
  "/_nuxt/_setQuery_.74135354.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b23-pqHg//KVXszoHBJwA9C9M+71gp4\"",
    "mtime": "2023-10-10T03:34:27.973Z",
    "size": 2851,
    "path": "../public/_nuxt/_setQuery_.74135354.css"
  },
  "/_nuxt/_setQuery_.a5bbf6ad.js": {
    "type": "application/javascript",
    "etag": "\"3389-XdE7/YLRzg/KVHGZ+zjvPnfo7H8\"",
    "mtime": "2023-10-10T03:34:27.985Z",
    "size": 13193,
    "path": "../public/_nuxt/_setQuery_.a5bbf6ad.js"
  },
  "/fonts/Material_Symbols_Outlined-400-1.woff2": {
    "type": "font/woff2",
    "etag": "\"3801c-wdrlMe6EirxWBj3ly17UbOjhypo\"",
    "mtime": "2023-10-10T03:34:04.573Z",
    "size": 229404,
    "path": "../public/fonts/Material_Symbols_Outlined-400-1.woff2"
  },
  "/fonts/Raleway-100-2.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.256Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-100-2.woff2"
  },
  "/fonts/Raleway-100-3.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.346Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-100-3.woff2"
  },
  "/fonts/Raleway-100-4.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.059Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-100-4.woff2"
  },
  "/fonts/Raleway-100-5.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.261Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-100-5.woff2"
  },
  "/fonts/Raleway-100-6.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.343Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-100-6.woff2"
  },
  "/fonts/Raleway-150-10.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.338Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-150-10.woff2"
  },
  "/fonts/Raleway-150-11.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.555Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-150-11.woff2"
  },
  "/fonts/Raleway-150-7.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.258Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-150-7.woff2"
  },
  "/fonts/Raleway-150-8.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.259Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-150-8.woff2"
  },
  "/fonts/Raleway-150-9.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.160Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-150-9.woff2"
  },
  "/fonts/Raleway-200-12.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.241Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-200-12.woff2"
  },
  "/fonts/Raleway-200-13.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.220Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-200-13.woff2"
  },
  "/fonts/Raleway-200-14.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.131Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-200-14.woff2"
  },
  "/fonts/Raleway-200-15.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.549Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-200-15.woff2"
  },
  "/fonts/Raleway-200-16.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.557Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-200-16.woff2"
  },
  "/fonts/Raleway-250-17.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.233Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-250-17.woff2"
  },
  "/fonts/Raleway-250-18.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.187Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-250-18.woff2"
  },
  "/fonts/Raleway-250-19.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.197Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-250-19.woff2"
  },
  "/fonts/Raleway-250-20.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.531Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-250-20.woff2"
  },
  "/fonts/Raleway-250-21.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.544Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-250-21.woff2"
  },
  "/fonts/Raleway-300-22.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.341Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-300-22.woff2"
  },
  "/fonts/Raleway-300-23.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.563Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-300-23.woff2"
  },
  "/fonts/Raleway-300-24.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.215Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-300-24.woff2"
  },
  "/fonts/Raleway-300-25.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.265Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-300-25.woff2"
  },
  "/fonts/Raleway-300-26.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.551Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-300-26.woff2"
  },
  "/fonts/Raleway-350-27.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.218Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-350-27.woff2"
  },
  "/fonts/Raleway-350-28.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.205Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-350-28.woff2"
  },
  "/fonts/Raleway-350-29.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.180Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-350-29.woff2"
  },
  "/fonts/Raleway-350-30.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.223Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-350-30.woff2"
  },
  "/fonts/Raleway-350-31.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.546Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-350-31.woff2"
  },
  "/fonts/Raleway-400-32.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.390Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-400-32.woff2"
  },
  "/fonts/Raleway-400-33.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.537Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-400-33.woff2"
  },
  "/fonts/Raleway-400-34.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.189Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-400-34.woff2"
  },
  "/fonts/Raleway-400-35.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.228Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-400-35.woff2"
  },
  "/fonts/Raleway-400-36.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.554Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-400-36.woff2"
  },
  "/fonts/Raleway-450-37.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.226Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-450-37.woff2"
  },
  "/fonts/Raleway-450-38.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.209Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-450-38.woff2"
  },
  "/fonts/Raleway-450-39.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.224Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-450-39.woff2"
  },
  "/fonts/Raleway-450-40.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.547Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-450-40.woff2"
  },
  "/fonts/Raleway-450-41.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.475Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-450-41.woff2"
  },
  "/fonts/Raleway-500-42.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.530Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-500-42.woff2"
  },
  "/fonts/Raleway-500-43.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.536Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-500-43.woff2"
  },
  "/fonts/Raleway-500-44.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.156Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-500-44.woff2"
  },
  "/fonts/Raleway-500-45.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.231Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-500-45.woff2"
  },
  "/fonts/Raleway-500-46.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.541Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-500-46.woff2"
  },
  "/fonts/Raleway-550-47.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.534Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-550-47.woff2"
  },
  "/fonts/Raleway-550-48.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.185Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-550-48.woff2"
  },
  "/fonts/Raleway-550-49.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.188Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-550-49.woff2"
  },
  "/fonts/Raleway-550-50.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.353Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-550-50.woff2"
  },
  "/fonts/Raleway-550-51.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.565Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-550-51.woff2"
  },
  "/fonts/Raleway-600-52.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.344Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-600-52.woff2"
  },
  "/fonts/Raleway-600-53.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.533Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-600-53.woff2"
  },
  "/fonts/Raleway-600-54.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.134Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-600-54.woff2"
  },
  "/fonts/Raleway-600-55.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.191Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-600-55.woff2"
  },
  "/fonts/Raleway-600-56.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.351Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-600-56.woff2"
  },
  "/fonts/Raleway-650-57.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.212Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-650-57.woff2"
  },
  "/fonts/Raleway-650-58.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.235Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-650-58.woff2"
  },
  "/fonts/Raleway-650-59.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.182Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-650-59.woff2"
  },
  "/fonts/Raleway-650-60.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.237Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-650-60.woff2"
  },
  "/fonts/Raleway-650-61.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.543Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-650-61.woff2"
  },
  "/fonts/Raleway-700-62.woff2": {
    "type": "font/woff2",
    "etag": "\"68a4-QO/mYPqyBnYwCoV89I32HDyRDBA\"",
    "mtime": "2023-10-10T03:34:04.340Z",
    "size": 26788,
    "path": "../public/fonts/Raleway-700-62.woff2"
  },
  "/fonts/Raleway-700-63.woff2": {
    "type": "font/woff2",
    "etag": "\"64e4-e6SLNInNitXo/Eg2x1WMcgFc0EI\"",
    "mtime": "2023-10-10T03:34:04.211Z",
    "size": 25828,
    "path": "../public/fonts/Raleway-700-63.woff2"
  },
  "/fonts/Raleway-700-64.woff2": {
    "type": "font/woff2",
    "etag": "\"2ba8-ssa1RzGYvkEppy1iXjJ8VaYSRAE\"",
    "mtime": "2023-10-10T03:34:04.195Z",
    "size": 11176,
    "path": "../public/fonts/Raleway-700-64.woff2"
  },
  "/fonts/Raleway-700-65.woff2": {
    "type": "font/woff2",
    "etag": "\"7818-aToM8hGxYHwunVpVJLIK55KSX5k\"",
    "mtime": "2023-10-10T03:34:04.538Z",
    "size": 30744,
    "path": "../public/fonts/Raleway-700-65.woff2"
  },
  "/fonts/Raleway-700-66.woff2": {
    "type": "font/woff2",
    "etag": "\"bc50-5xE4Ams4r8RD+2DaX/wiRMT16xE\"",
    "mtime": "2023-10-10T03:34:04.456Z",
    "size": 48208,
    "path": "../public/fonts/Raleway-700-66.woff2"
  },
  "/fonts/Roboto-400-67.woff2": {
    "type": "font/woff2",
    "etag": "\"3bf0-3SKkH6IexKSo0p/Tadm+6RnLmKw\"",
    "mtime": "2023-10-10T03:34:04.539Z",
    "size": 15344,
    "path": "../public/fonts/Roboto-400-67.woff2"
  },
  "/fonts/Roboto-400-68.woff2": {
    "type": "font/woff2",
    "etag": "\"259c-ESovxfT/m4XuOnBvqbjEf3mwWTM\"",
    "mtime": "2023-10-10T03:34:04.200Z",
    "size": 9628,
    "path": "../public/fonts/Roboto-400-68.woff2"
  },
  "/fonts/Roboto-400-69.woff2": {
    "type": "font/woff2",
    "etag": "\"5cc-TfOeql0acP87XSiKdL96Ro51g+8\"",
    "mtime": "2023-10-10T03:34:04.114Z",
    "size": 1484,
    "path": "../public/fonts/Roboto-400-69.woff2"
  },
  "/fonts/Roboto-400-70.woff2": {
    "type": "font/woff2",
    "etag": "\"1bc8-fPvEFcRbInSlmXJV++wPtTu+Mn0\"",
    "mtime": "2023-10-10T03:34:04.161Z",
    "size": 7112,
    "path": "../public/fonts/Roboto-400-70.woff2"
  },
  "/fonts/Roboto-400-71.woff2": {
    "type": "font/woff2",
    "etag": "\"15b8-EJzUxUNb1mFDkbuHIsR8KHyWsuw\"",
    "mtime": "2023-10-10T03:34:04.152Z",
    "size": 5560,
    "path": "../public/fonts/Roboto-400-71.woff2"
  },
  "/fonts/Roboto-400-72.woff2": {
    "type": "font/woff2",
    "etag": "\"2e60-t0NUh3DEbZBa4boGMQvAAcWH/o4\"",
    "mtime": "2023-10-10T03:34:04.133Z",
    "size": 11872,
    "path": "../public/fonts/Roboto-400-72.woff2"
  },
  "/fonts/Roboto-400-73.woff2": {
    "type": "font/woff2",
    "etag": "\"3d80-fKnFln87uL/+qyS2ObScHn0D+lI\"",
    "mtime": "2023-10-10T03:34:04.154Z",
    "size": 15744,
    "path": "../public/fonts/Roboto-400-73.woff2"
  },
  "/fonts/Source_Sans_3-200-74.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.213Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-200-74.woff2"
  },
  "/fonts/Source_Sans_3-200-75.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.345Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-200-75.woff2"
  },
  "/fonts/Source_Sans_3-200-76.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.172Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-200-76.woff2"
  },
  "/fonts/Source_Sans_3-200-77.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.170Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-200-77.woff2"
  },
  "/fonts/Source_Sans_3-200-78.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.166Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-200-78.woff2"
  },
  "/fonts/Source_Sans_3-200-79.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.349Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-200-79.woff2"
  },
  "/fonts/Source_Sans_3-200-80.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.458Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-200-80.woff2"
  },
  "/fonts/Source_Sans_3-250-81.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.128Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-250-81.woff2"
  },
  "/fonts/Source_Sans_3-250-82.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.193Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-250-82.woff2"
  },
  "/fonts/Source_Sans_3-250-83.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.173Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-250-83.woff2"
  },
  "/fonts/Source_Sans_3-250-84.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.141Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-250-84.woff2"
  },
  "/fonts/Source_Sans_3-250-85.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.150Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-250-85.woff2"
  },
  "/fonts/Source_Sans_3-250-86.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.532Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-250-86.woff2"
  },
  "/fonts/Source_Sans_3-250-87.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.548Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-250-87.woff2"
  },
  "/fonts/Source_Sans_3-300-88.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.168Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-300-88.woff2"
  },
  "/fonts/Source_Sans_3-300-89.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.266Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-300-89.woff2"
  },
  "/fonts/Source_Sans_3-300-90.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.147Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-300-90.woff2"
  },
  "/fonts/Source_Sans_3-300-91.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.254Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-300-91.woff2"
  },
  "/fonts/Source_Sans_3-300-92.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.165Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-300-92.woff2"
  },
  "/fonts/Source_Sans_3-300-93.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.574Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-300-93.woff2"
  },
  "/fonts/Source_Sans_3-300-94.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.244Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-300-94.woff2"
  },
  "/fonts/Source_Sans_3-350-100.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.559Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-350-100.woff2"
  },
  "/fonts/Source_Sans_3-350-101.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.580Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-350-101.woff2"
  },
  "/fonts/Source_Sans_3-350-95.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.171Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-350-95.woff2"
  },
  "/fonts/Source_Sans_3-350-96.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.250Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-350-96.woff2"
  },
  "/fonts/Source_Sans_3-350-97.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.239Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-350-97.woff2"
  },
  "/fonts/Source_Sans_3-350-98.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.207Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-350-98.woff2"
  },
  "/fonts/Source_Sans_3-350-99.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.144Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-350-99.woff2"
  },
  "/fonts/Source_Sans_3-400-102.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.615Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-400-102.woff2"
  },
  "/fonts/Source_Sans_3-400-103.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.588Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-400-103.woff2"
  },
  "/fonts/Source_Sans_3-400-104.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.769Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-400-104.woff2"
  },
  "/fonts/Source_Sans_3-400-105.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.583Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-400-105.woff2"
  },
  "/fonts/Source_Sans_3-400-106.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.608Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-400-106.woff2"
  },
  "/fonts/Source_Sans_3-400-107.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.862Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-400-107.woff2"
  },
  "/fonts/Source_Sans_3-400-108.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.795Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-400-108.woff2"
  },
  "/fonts/Source_Sans_3-450-109.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.763Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-450-109.woff2"
  },
  "/fonts/Source_Sans_3-450-110.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.606Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-450-110.woff2"
  },
  "/fonts/Source_Sans_3-450-111.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.630Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-450-111.woff2"
  },
  "/fonts/Source_Sans_3-450-112.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.820Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-450-112.woff2"
  },
  "/fonts/Source_Sans_3-450-113.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.602Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-450-113.woff2"
  },
  "/fonts/Source_Sans_3-450-114.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.600Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-450-114.woff2"
  },
  "/fonts/Source_Sans_3-450-115.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.642Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-450-115.woff2"
  },
  "/fonts/Source_Sans_3-500-116.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.638Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-500-116.woff2"
  },
  "/fonts/Source_Sans_3-500-117.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.592Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-500-117.woff2"
  },
  "/fonts/Source_Sans_3-500-118.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.577Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-500-118.woff2"
  },
  "/fonts/Source_Sans_3-500-119.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.585Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-500-119.woff2"
  },
  "/fonts/Source_Sans_3-500-120.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.784Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-500-120.woff2"
  },
  "/fonts/Source_Sans_3-500-121.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.629Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-500-121.woff2"
  },
  "/fonts/Source_Sans_3-500-122.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.610Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-500-122.woff2"
  },
  "/fonts/Source_Sans_3-550-123.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.775Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-550-123.woff2"
  },
  "/fonts/Source_Sans_3-550-124.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.789Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-550-124.woff2"
  },
  "/fonts/Source_Sans_3-550-125.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.761Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-550-125.woff2"
  },
  "/fonts/Source_Sans_3-550-126.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.764Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-550-126.woff2"
  },
  "/fonts/Source_Sans_3-550-127.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.646Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-550-127.woff2"
  },
  "/fonts/Source_Sans_3-550-128.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.596Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-550-128.woff2"
  },
  "/fonts/Source_Sans_3-550-129.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.604Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-550-129.woff2"
  },
  "/fonts/Source_Sans_3-600-130.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.624Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-600-130.woff2"
  },
  "/fonts/Source_Sans_3-600-131.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.783Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-600-131.woff2"
  },
  "/fonts/Source_Sans_3-600-132.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.634Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-600-132.woff2"
  },
  "/fonts/Source_Sans_3-600-133.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.802Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-600-133.woff2"
  },
  "/fonts/Source_Sans_3-600-134.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.619Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-600-134.woff2"
  },
  "/fonts/Source_Sans_3-600-135.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.916Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-600-135.woff2"
  },
  "/fonts/Source_Sans_3-600-136.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.893Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-600-136.woff2"
  },
  "/fonts/Source_Sans_3-650-137.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.632Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-650-137.woff2"
  },
  "/fonts/Source_Sans_3-650-138.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.787Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-650-138.woff2"
  },
  "/fonts/Source_Sans_3-650-139.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.648Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-650-139.woff2"
  },
  "/fonts/Source_Sans_3-650-140.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.621Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-650-140.woff2"
  },
  "/fonts/Source_Sans_3-650-141.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.623Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-650-141.woff2"
  },
  "/fonts/Source_Sans_3-650-142.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.987Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-650-142.woff2"
  },
  "/fonts/Source_Sans_3-650-143.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.613Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-650-143.woff2"
  },
  "/fonts/Source_Sans_3-700-144.woff2": {
    "type": "font/woff2",
    "etag": "\"28cc-lA7DU8JI7ZcvefCqn/J1aSFQ7N0\"",
    "mtime": "2023-10-10T03:34:04.636Z",
    "size": 10444,
    "path": "../public/fonts/Source_Sans_3-700-144.woff2"
  },
  "/fonts/Source_Sans_3-700-145.woff2": {
    "type": "font/woff2",
    "etag": "\"46a0-EnlnQmLxnf/qH+iFLyJC9CDbmw0\"",
    "mtime": "2023-10-10T03:34:04.644Z",
    "size": 18080,
    "path": "../public/fonts/Source_Sans_3-700-145.woff2"
  },
  "/fonts/Source_Sans_3-700-146.woff2": {
    "type": "font/woff2",
    "etag": "\"2360-Tg3nnyY1Zpwo6cuU4EbMFdcXg2Q\"",
    "mtime": "2023-10-10T03:34:04.640Z",
    "size": 9056,
    "path": "../public/fonts/Source_Sans_3-700-146.woff2"
  },
  "/fonts/Source_Sans_3-700-147.woff2": {
    "type": "font/woff2",
    "etag": "\"37d0-lyl77e6Rjh+HbKjw1Jbju8u/ZkU\"",
    "mtime": "2023-10-10T03:34:04.617Z",
    "size": 14288,
    "path": "../public/fonts/Source_Sans_3-700-147.woff2"
  },
  "/fonts/Source_Sans_3-700-148.woff2": {
    "type": "font/woff2",
    "etag": "\"26a8-Fb/qU3MMxfQdKHEsYOnrx6Tl2dk\"",
    "mtime": "2023-10-10T03:34:04.652Z",
    "size": 9896,
    "path": "../public/fonts/Source_Sans_3-700-148.woff2"
  },
  "/fonts/Source_Sans_3-700-149.woff2": {
    "type": "font/woff2",
    "etag": "\"c274-nOB3da9Ol2/RYJ18hxrnMUP7clc\"",
    "mtime": "2023-10-10T03:34:04.681Z",
    "size": 49780,
    "path": "../public/fonts/Source_Sans_3-700-149.woff2"
  },
  "/fonts/Source_Sans_3-700-150.woff2": {
    "type": "font/woff2",
    "etag": "\"6f24-6I/CuM+fzs1ZWl4MvHRpZjt0nBI\"",
    "mtime": "2023-10-10T03:34:04.670Z",
    "size": 28452,
    "path": "../public/fonts/Source_Sans_3-700-150.woff2"
  },
  "/fonts/Source_Serif_4-200-151.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.662Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-200-151.woff2"
  },
  "/fonts/Source_Serif_4-200-152.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.650Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-200-152.woff2"
  },
  "/fonts/Source_Serif_4-200-153.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.657Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-200-153.woff2"
  },
  "/fonts/Source_Serif_4-200-154.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.672Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-200-154.woff2"
  },
  "/fonts/Source_Serif_4-200-155.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.937Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-200-155.woff2"
  },
  "/fonts/Source_Serif_4-200-156.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.678Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-200-156.woff2"
  },
  "/fonts/Source_Serif_4-250-157.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.667Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-250-157.woff2"
  },
  "/fonts/Source_Serif_4-250-158.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.925Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-250-158.woff2"
  },
  "/fonts/Source_Serif_4-250-159.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.660Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-250-159.woff2"
  },
  "/fonts/Source_Serif_4-250-160.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.682Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-250-160.woff2"
  },
  "/fonts/Source_Serif_4-250-161.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.825Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-250-161.woff2"
  },
  "/fonts/Source_Serif_4-250-162.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.665Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-250-162.woff2"
  },
  "/fonts/Source_Serif_4-300-163.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.688Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-300-163.woff2"
  },
  "/fonts/Source_Serif_4-300-164.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.674Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-300-164.woff2"
  },
  "/fonts/Source_Serif_4-300-165.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.816Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-300-165.woff2"
  },
  "/fonts/Source_Serif_4-300-166.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.655Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-300-166.woff2"
  },
  "/fonts/Source_Serif_4-300-167.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.826Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-300-167.woff2"
  },
  "/fonts/Source_Serif_4-300-168.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.713Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-300-168.woff2"
  },
  "/fonts/Source_Serif_4-350-169.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.695Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-350-169.woff2"
  },
  "/fonts/Source_Serif_4-350-170.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.732Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-350-170.woff2"
  },
  "/fonts/Source_Serif_4-350-171.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.705Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-350-171.woff2"
  },
  "/fonts/Source_Serif_4-350-172.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.771Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-350-172.woff2"
  },
  "/fonts/Source_Serif_4-350-173.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.810Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-350-173.woff2"
  },
  "/fonts/Source_Serif_4-350-174.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.718Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-350-174.woff2"
  },
  "/fonts/Source_Serif_4-400-175.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.707Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-400-175.woff2"
  },
  "/fonts/Source_Serif_4-400-176.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.697Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-400-176.woff2"
  },
  "/fonts/Source_Serif_4-400-177.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.861Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-400-177.woff2"
  },
  "/fonts/Source_Serif_4-400-178.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.817Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-400-178.woff2"
  },
  "/fonts/Source_Serif_4-400-179.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.824Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-400-179.woff2"
  },
  "/fonts/Source_Serif_4-400-180.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.995Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-400-180.woff2"
  },
  "/fonts/Source_Serif_4-450-181.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.720Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-450-181.woff2"
  },
  "/fonts/Source_Serif_4-450-182.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.734Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-450-182.woff2"
  },
  "/fonts/Source_Serif_4-450-183.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.699Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-450-183.woff2"
  },
  "/fonts/Source_Serif_4-450-184.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.701Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-450-184.woff2"
  },
  "/fonts/Source_Serif_4-450-185.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.684Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-450-185.woff2"
  },
  "/fonts/Source_Serif_4-450-186.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.806Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-450-186.woff2"
  },
  "/fonts/Source_Serif_4-500-187.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.859Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-500-187.woff2"
  },
  "/fonts/Source_Serif_4-500-188.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.834Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-500-188.woff2"
  },
  "/fonts/Source_Serif_4-500-189.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.703Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-500-189.woff2"
  },
  "/fonts/Source_Serif_4-500-190.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.725Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-500-190.woff2"
  },
  "/fonts/Source_Serif_4-500-191.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.693Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-500-191.woff2"
  },
  "/fonts/Source_Serif_4-500-192.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.710Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-500-192.woff2"
  },
  "/fonts/Source_Serif_4-550-193.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.690Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-550-193.woff2"
  },
  "/fonts/Source_Serif_4-550-194.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.788Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-550-194.woff2"
  },
  "/fonts/Source_Serif_4-550-195.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.715Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-550-195.woff2"
  },
  "/fonts/Source_Serif_4-550-196.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.686Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-550-196.woff2"
  },
  "/fonts/Source_Serif_4-550-197.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.723Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-550-197.woff2"
  },
  "/fonts/Source_Serif_4-550-198.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.886Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-550-198.woff2"
  },
  "/fonts/Source_Serif_4-600-199.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.758Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-600-199.woff2"
  },
  "/fonts/Source_Serif_4-600-200.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.794Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-600-200.woff2"
  },
  "/fonts/Source_Serif_4-600-201.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.737Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-600-201.woff2"
  },
  "/fonts/Source_Serif_4-600-202.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.756Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-600-202.woff2"
  },
  "/fonts/Source_Serif_4-600-203.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.791Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-600-203.woff2"
  },
  "/fonts/Source_Serif_4-600-204.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.998Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-600-204.woff2"
  },
  "/fonts/Source_Serif_4-650-205.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.786Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-650-205.woff2"
  },
  "/fonts/Source_Serif_4-650-206.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.939Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-650-206.woff2"
  },
  "/fonts/Source_Serif_4-650-207.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.827Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-650-207.woff2"
  },
  "/fonts/Source_Serif_4-650-208.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.739Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-650-208.woff2"
  },
  "/fonts/Source_Serif_4-650-209.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.827Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-650-209.woff2"
  },
  "/fonts/Source_Serif_4-650-210.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.808Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-650-210.woff2"
  },
  "/fonts/Source_Serif_4-700-211.woff2": {
    "type": "font/woff2",
    "etag": "\"4468-8ll0l2xfdu9VSORaAtxue/EgXPU\"",
    "mtime": "2023-10-10T03:34:04.752Z",
    "size": 17512,
    "path": "../public/fonts/Source_Serif_4-700-211.woff2"
  },
  "/fonts/Source_Serif_4-700-212.woff2": {
    "type": "font/woff2",
    "etag": "\"89d4-FVWgISuHv1EKTsnt2jE5RCV/jc8\"",
    "mtime": "2023-10-10T03:34:04.793Z",
    "size": 35284,
    "path": "../public/fonts/Source_Serif_4-700-212.woff2"
  },
  "/fonts/Source_Serif_4-700-213.woff2": {
    "type": "font/woff2",
    "etag": "\"4be0-lj1flZmeHKdfe7gXG3WQBdCifs0\"",
    "mtime": "2023-10-10T03:34:04.749Z",
    "size": 19424,
    "path": "../public/fonts/Source_Serif_4-700-213.woff2"
  },
  "/fonts/Source_Serif_4-700-214.woff2": {
    "type": "font/woff2",
    "etag": "\"33d0-9TeLmLhyGBwIeAzmxvdW6XI0PmI\"",
    "mtime": "2023-10-10T03:34:04.814Z",
    "size": 13264,
    "path": "../public/fonts/Source_Serif_4-700-214.woff2"
  },
  "/fonts/Source_Serif_4-700-215.woff2": {
    "type": "font/woff2",
    "etag": "\"8948-4T3r6EkXT5sl7f5QbXur28jI2Jk\"",
    "mtime": "2023-10-10T03:34:04.741Z",
    "size": 35144,
    "path": "../public/fonts/Source_Serif_4-700-215.woff2"
  },
  "/fonts/Source_Serif_4-700-216.woff2": {
    "type": "font/woff2",
    "etag": "\"c09c-bYhOXBYkfMNdkbzyrr/spIPfxzc\"",
    "mtime": "2023-10-10T03:34:04.790Z",
    "size": 49308,
    "path": "../public/fonts/Source_Serif_4-700-216.woff2"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const config = useRuntimeConfig().public;
const _xwX6s6 = defineEventHandler(async (event) => {
  assertMethod(event, "POST");
  const body = await readBody(event);
  const cookieOptions = config.supabase.cookies;
  const { event: signEvent, session } = body;
  if (!event) {
    throw new Error("Auth event missing!");
  }
  if (signEvent === "SIGNED_IN" || signEvent === "TOKEN_REFRESHED") {
    if (!session) {
      throw new Error("Auth session missing!");
    }
    setCookie(
      event,
      `${cookieOptions.name}-access-token`,
      session.access_token,
      {
        domain: cookieOptions.domain,
        maxAge: cookieOptions.lifetime ?? 0,
        path: cookieOptions.path,
        sameSite: cookieOptions.sameSite
      }
    );
    setCookie(event, `${cookieOptions.name}-refresh-token`, session.refresh_token, {
      domain: cookieOptions.domain,
      maxAge: cookieOptions.lifetime ?? 0,
      path: cookieOptions.path,
      sameSite: cookieOptions.sameSite
    });
    if (session.provider_token) {
      setCookie(event, `${cookieOptions.name}-provider-token`, session.provider_token, {
        domain: cookieOptions.domain,
        maxAge: cookieOptions.lifetime ?? 0,
        path: cookieOptions.path,
        sameSite: cookieOptions.sameSite
      });
    }
    if (session.provider_refresh_token) {
      setCookie(event, `${cookieOptions.name}-provider-refresh-token`, session.provider_refresh_token, {
        domain: cookieOptions.domain,
        maxAge: cookieOptions.lifetime ?? 0,
        path: cookieOptions.path,
        sameSite: cookieOptions.sameSite
      });
    }
  }
  if (signEvent === "SIGNED_OUT") {
    setCookie(event, `${cookieOptions.name}-access-token`, "", {
      maxAge: -1,
      path: cookieOptions.path
    });
    setCookie(event, `${cookieOptions.name}-refresh-token`, "", {
      maxAge: -1,
      path: cookieOptions.path
    });
  }
  return "auth cookie set";
});

const _Bs2Wju = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx;
  const ipxOptions = {
    ...opts || {},
    // TODO: Switch to storage API when ipx supports it
    dir: fileURLToPath(new URL(opts.dir, globalThis._importMeta_.url))
  };
  const ipx = createIPX(ipxOptions);
  const middleware = createIPXMiddleware(ipx);
  return eventHandler(async (event) => {
    event.node.req.url = withLeadingSlash(event.context.params._);
    await middleware(event.node.req, event.node.res);
  });
});

const _lazy_OAFnEo = () => import('../handlers/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_OAFnEo, lazy: true, middleware: false, method: undefined },
  { route: '/api/_supabase/session', handler: _xwX6s6, lazy: false, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _Bs2Wju, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_OAFnEo, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT, 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  gracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((err) => {
          console.error(err);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const listener = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
