var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/isomorphic-ws/browser.js
var ws, browser_default;
var init_browser = __esm({
  "node_modules/isomorphic-ws/browser.js"() {
    "use strict";
    ws = null;
    if (typeof WebSocket !== "undefined") {
      ws = WebSocket;
    } else if (typeof MozWebSocket !== "undefined") {
      ws = MozWebSocket;
    } else if (typeof window !== "undefined") {
      ws = window.WebSocket || window.MozWebSocket;
    } else if (typeof window !== "undefined") {
      ws = window.WebSocket || window.MozWebSocket;
    } else if (typeof self !== "undefined") {
      ws = self.WebSocket || self.MozWebSocket;
    }
    browser_default = ws;
  }
});

// node_modules/loglevel/lib/loglevel.js
var require_loglevel = __commonJS({
  "node_modules/loglevel/lib/loglevel.js"(exports, module) {
    "use strict";
    init_browser();
    (function(root, definition) {
      "use strict";
      if (typeof define === "function" && define.amd) {
        define(definition);
      } else if (typeof module === "object" && module.exports) {
        module.exports = definition();
      } else {
        root.log = definition();
      }
    })(exports, function() {
      "use strict";
      var noop = function() {
      };
      var undefinedType = "undefined";
      var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
      var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
      ];
      var _loggersByName = {};
      var defaultLogger = null;
      function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === "function") {
          return method.bind(obj);
        } else {
          try {
            return Function.prototype.bind.call(method, obj);
          } catch (e) {
            return function() {
              return Function.prototype.apply.apply(method, [obj, arguments]);
            };
          }
        }
      }
      function traceForIE() {
        if (console.log) {
          if (console.log.apply) {
            console.log.apply(console, arguments);
          } else {
            Function.prototype.apply.apply(console.log, [console, arguments]);
          }
        }
        if (console.trace) console.trace();
      }
      function realMethod(methodName) {
        if (methodName === "debug") {
          methodName = "log";
        }
        if (typeof console === undefinedType) {
          return false;
        } else if (methodName === "trace" && isIE) {
          return traceForIE;
        } else if (console[methodName] !== void 0) {
          return bindMethod(console, methodName);
        } else if (console.log !== void 0) {
          return bindMethod(console, "log");
        } else {
          return noop;
        }
      }
      function replaceLoggingMethods() {
        var level = this.getLevel();
        for (var i = 0; i < logMethods.length; i++) {
          var methodName = logMethods[i];
          this[methodName] = i < level ? noop : this.methodFactory(methodName, level, this.name);
        }
        this.log = this.debug;
        if (typeof console === undefinedType && level < this.levels.SILENT) {
          return "No console available for logging";
        }
      }
      function enableLoggingWhenConsoleArrives(methodName) {
        return function() {
          if (typeof console !== undefinedType) {
            replaceLoggingMethods.call(this);
            this[methodName].apply(this, arguments);
          }
        };
      }
      function defaultMethodFactory(methodName, _level, _loggerName) {
        return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
      }
      function Logger(name, factory) {
        var self2 = this;
        var inheritedLevel;
        var defaultLevel;
        var userLevel;
        var storageKey = "loglevel";
        if (typeof name === "string") {
          storageKey += ":" + name;
        } else if (typeof name === "symbol") {
          storageKey = void 0;
        }
        function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || "silent").toUpperCase();
          if (typeof window === undefinedType || !storageKey) return;
          try {
            window.localStorage[storageKey] = levelName;
            return;
          } catch (ignore) {
          }
          try {
            window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {
          }
        }
        function getPersistedLevel() {
          var storedLevel;
          if (typeof window === undefinedType || !storageKey) return;
          try {
            storedLevel = window.localStorage[storageKey];
          } catch (ignore) {
          }
          if (typeof storedLevel === undefinedType) {
            try {
              var cookie = window.document.cookie;
              var cookieName = encodeURIComponent(storageKey);
              var location = cookie.indexOf(cookieName + "=");
              if (location !== -1) {
                storedLevel = /^([^;]+)/.exec(
                  cookie.slice(location + cookieName.length + 1)
                )[1];
              }
            } catch (ignore) {
            }
          }
          if (self2.levels[storedLevel] === void 0) {
            storedLevel = void 0;
          }
          return storedLevel;
        }
        function clearPersistedLevel() {
          if (typeof window === undefinedType || !storageKey) return;
          try {
            window.localStorage.removeItem(storageKey);
          } catch (ignore) {
          }
          try {
            window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch (ignore) {
          }
        }
        function normalizeLevel(input) {
          var level = input;
          if (typeof level === "string" && self2.levels[level.toUpperCase()] !== void 0) {
            level = self2.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self2.levels.SILENT) {
            return level;
          } else {
            throw new TypeError("log.setLevel() called with invalid level: " + input);
          }
        }
        self2.name = name;
        self2.levels = {
          "TRACE": 0,
          "DEBUG": 1,
          "INFO": 2,
          "WARN": 3,
          "ERROR": 4,
          "SILENT": 5
        };
        self2.methodFactory = factory || defaultMethodFactory;
        self2.getLevel = function() {
          if (userLevel != null) {
            return userLevel;
          } else if (defaultLevel != null) {
            return defaultLevel;
          } else {
            return inheritedLevel;
          }
        };
        self2.setLevel = function(level, persist) {
          userLevel = normalizeLevel(level);
          if (persist !== false) {
            persistLevelIfPossible(userLevel);
          }
          return replaceLoggingMethods.call(self2);
        };
        self2.setDefaultLevel = function(level) {
          defaultLevel = normalizeLevel(level);
          if (!getPersistedLevel()) {
            self2.setLevel(level, false);
          }
        };
        self2.resetLevel = function() {
          userLevel = null;
          clearPersistedLevel();
          replaceLoggingMethods.call(self2);
        };
        self2.enableAll = function(persist) {
          self2.setLevel(self2.levels.TRACE, persist);
        };
        self2.disableAll = function(persist) {
          self2.setLevel(self2.levels.SILENT, persist);
        };
        self2.rebuild = function() {
          if (defaultLogger !== self2) {
            inheritedLevel = normalizeLevel(defaultLogger.getLevel());
          }
          replaceLoggingMethods.call(self2);
          if (defaultLogger === self2) {
            for (var childName in _loggersByName) {
              _loggersByName[childName].rebuild();
            }
          }
        };
        inheritedLevel = normalizeLevel(
          defaultLogger ? defaultLogger.getLevel() : "WARN"
        );
        var initialLevel = getPersistedLevel();
        if (initialLevel != null) {
          userLevel = normalizeLevel(initialLevel);
        }
        replaceLoggingMethods.call(self2);
      }
      defaultLogger = new Logger();
      defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "symbol" && typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }
        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name,
            defaultLogger.methodFactory
          );
        }
        return logger;
      };
      var _log = typeof window !== undefinedType ? window.log : void 0;
      defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType && window.log === defaultLogger) {
          window.log = _log;
        }
        return defaultLogger;
      };
      defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
      };
      defaultLogger["default"] = defaultLogger;
      return defaultLogger;
    });
  }
});

// node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "node_modules/base64-js/index.js"(exports) {
    "use strict";
    init_browser();
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len5 = code.length; i < len5; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len5;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len6 = b64.length;
      if (len6 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len6;
      var placeHoldersLen = validLen === len6 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len6 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len6; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len6 = uint8.length;
      var extraBytes = len6 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len6 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len6 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len6 - 2] << 8) + uint8[len6 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports) {
    "use strict";
    init_browser();
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/buffer/index.js
var require_buffer = __commonJS({
  "node_modules/buffer/index.js"(exports) {
    "use strict";
    init_browser();
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer5;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer5.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer5.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer5.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer5.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer5.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer5.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length5) {
      if (length5 > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length5 + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length5);
      Object.setPrototypeOf(buf, Buffer5.prototype);
      return buf;
    }
    function Buffer5(arg, encodingOrOffset, length5) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length5);
    }
    Buffer5.poolSize = 8192;
    function from(value, encodingOrOffset, length5) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length5);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length5);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer5.from(valueOf, encodingOrOffset, length5);
      }
      const b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer5.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length5);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer5.from = function(value, encodingOrOffset, length5) {
      return from(value, encodingOrOffset, length5);
    };
    Object.setPrototypeOf(Buffer5.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer5, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer5.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer5.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer5.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer5.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length5 = byteLength(string, encoding) | 0;
      let buf = createBuffer(length5);
      const actual = buf.write(string, encoding);
      if (actual !== length5) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length5 = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length5);
      for (let i = 0; i < length5; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy5 = new Uint8Array(arrayView);
        return fromArrayBuffer(copy5.buffer, copy5.byteOffset, copy5.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length5) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length5 || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length5 === void 0) {
        buf = new Uint8Array(array);
      } else if (length5 === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length5);
      }
      Object.setPrototypeOf(buf, Buffer5.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer5.isBuffer(obj)) {
        const len5 = checked(obj.length) | 0;
        const buf = createBuffer(len5);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len5);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length5) {
      if (length5 >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length5 | 0;
    }
    function SlowBuffer(length5) {
      if (+length5 != length5) {
        length5 = 0;
      }
      return Buffer5.alloc(+length5);
    }
    Buffer5.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer5.prototype;
    };
    Buffer5.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer5.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer5.from(b, b.offset, b.byteLength);
      if (!Buffer5.isBuffer(a) || !Buffer5.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len5 = Math.min(x, y); i < len5; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer5.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer5.concat = function concat(list, length5) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer5.alloc(0);
      }
      let i;
      if (length5 === void 0) {
        length5 = 0;
        for (i = 0; i < list.length; ++i) {
          length5 += list[i].length;
        }
      }
      const buffer = Buffer5.allocUnsafe(length5);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer5.isBuffer(buf)) buf = Buffer5.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer5.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer5.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len5 = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len5 === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len5;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len5 * 2;
          case "hex":
            return len5 >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer5.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer5.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer5.prototype.swap16 = function swap16() {
      const len5 = this.length;
      if (len5 % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len5; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer5.prototype.swap32 = function swap32() {
      const len5 = this.length;
      if (len5 % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len5; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer5.prototype.swap64 = function swap64() {
      const len5 = this.length;
      if (len5 % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len5; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer5.prototype.toString = function toString() {
      const length5 = this.length;
      if (length5 === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length5);
      return slowToString.apply(this, arguments);
    };
    Buffer5.prototype.toLocaleString = Buffer5.prototype.toString;
    Buffer5.prototype.equals = function equals5(b) {
      if (!Buffer5.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer5.compare(this, b) === 0;
    };
    Buffer5.prototype.inspect = function inspect() {
      let str5 = "";
      const max3 = exports.INSPECT_MAX_BYTES;
      str5 = this.toString("hex", 0, max3).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max3) str5 += " ... ";
      return "<Buffer " + str5 + ">";
    };
    if (customInspectSymbol) {
      Buffer5.prototype[customInspectSymbol] = Buffer5.prototype.inspect;
    }
    Buffer5.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer5.from(target, target.offset, target.byteLength);
      }
      if (!Buffer5.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len5 = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len5; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer5.from(val, encoding);
      }
      if (Buffer5.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer5.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer5.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer5.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length5) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length5) {
        length5 = remaining;
      } else {
        length5 = Number(length5);
        if (length5 > remaining) {
          length5 = remaining;
        }
      }
      const strLen = string.length;
      if (length5 > strLen / 2) {
        length5 = strLen / 2;
      }
      let i;
      for (i = 0; i < length5; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length5) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length5);
    }
    function asciiWrite(buf, string, offset, length5) {
      return blitBuffer(asciiToBytes(string), buf, offset, length5);
    }
    function base64Write(buf, string, offset, length5) {
      return blitBuffer(base64ToBytes(string), buf, offset, length5);
    }
    function ucs2Write(buf, string, offset, length5) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length5);
    }
    Buffer5.prototype.write = function write(string, offset, length5, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length5 = this.length;
        offset = 0;
      } else if (length5 === void 0 && typeof offset === "string") {
        encoding = offset;
        length5 = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length5)) {
          length5 = length5 >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length5;
          length5 = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length5 === void 0 || length5 > remaining) length5 = remaining;
      if (string.length > 0 && (length5 < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length5);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length5);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length5);
          case "base64":
            return base64Write(this, string, offset, length5);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length5);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer5.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len5 = codePoints.length;
      if (len5 <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len5) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len5 = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len5) end = len5;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer5.prototype.slice = function slice(start, end) {
      const len5 = this.length;
      start = ~~start;
      end = end === void 0 ? len5 : ~~end;
      if (start < 0) {
        start += len5;
        if (start < 0) start = 0;
      } else if (start > len5) {
        start = len5;
      }
      if (end < 0) {
        end += len5;
        if (end < 0) end = 0;
      } else if (end > len5) {
        end = len5;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer5.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length5) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length5) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer5.prototype.readUintLE = Buffer5.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul5 = 1;
      let i = 0;
      while (++i < byteLength2 && (mul5 *= 256)) {
        val += this[offset + i] * mul5;
      }
      return val;
    };
    Buffer5.prototype.readUintBE = Buffer5.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul5 = 1;
      while (byteLength2 > 0 && (mul5 *= 256)) {
        val += this[offset + --byteLength2] * mul5;
      }
      return val;
    };
    Buffer5.prototype.readUint8 = Buffer5.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer5.prototype.readUint16LE = Buffer5.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer5.prototype.readUint16BE = Buffer5.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer5.prototype.readUint32LE = Buffer5.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer5.prototype.readUint32BE = Buffer5.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer5.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer5.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer5.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul5 = 1;
      let i = 0;
      while (++i < byteLength2 && (mul5 *= 256)) {
        val += this[offset + i] * mul5;
      }
      mul5 *= 128;
      if (val >= mul5) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer5.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul5 = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul5 *= 256)) {
        val += this[offset + --i] * mul5;
      }
      mul5 *= 128;
      if (val >= mul5) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer5.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer5.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer5.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer5.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer5.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer5.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer5.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer5.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer5.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer5.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer5.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max3, min3) {
      if (!Buffer5.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max3 || value < min3) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer5.prototype.writeUintLE = Buffer5.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul5 = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul5 *= 256)) {
        this[offset + i] = value / mul5 & 255;
      }
      return offset + byteLength2;
    };
    Buffer5.prototype.writeUintBE = Buffer5.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul5 = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul5 *= 256)) {
        this[offset + i] = value / mul5 & 255;
      }
      return offset + byteLength2;
    };
    Buffer5.prototype.writeUint8 = Buffer5.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer5.prototype.writeUint16LE = Buffer5.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer5.prototype.writeUint16BE = Buffer5.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer5.prototype.writeUint32LE = Buffer5.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer5.prototype.writeUint32BE = Buffer5.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min3, max3) {
      checkIntBI(value, min3, max3, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min3, max3) {
      checkIntBI(value, min3, max3, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer5.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer5.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer5.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul5 = 1;
      let sub3 = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul5 *= 256)) {
        if (value < 0 && sub3 === 0 && this[offset + i - 1] !== 0) {
          sub3 = 1;
        }
        this[offset + i] = (value / mul5 >> 0) - sub3 & 255;
      }
      return offset + byteLength2;
    };
    Buffer5.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul5 = 1;
      let sub3 = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul5 *= 256)) {
        if (value < 0 && sub3 === 0 && this[offset + i + 1] !== 0) {
          sub3 = 1;
        }
        this[offset + i] = (value / mul5 >> 0) - sub3 & 255;
      }
      return offset + byteLength2;
    };
    Buffer5.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer5.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer5.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer5.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer5.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer5.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer5.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max3, min3) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer5.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer5.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer5.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer5.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer5.prototype.copy = function copy5(target, targetStart, start, end) {
      if (!Buffer5.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len5 = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len5;
    };
    Buffer5.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer5.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer5.isBuffer(val) ? val : Buffer5.from(val, encoding);
        const len5 = bytes.length;
        if (len5 === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len5];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str5, range, input) {
        let msg = `The value of "${str5}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min3, max3, buf, offset, byteLength2) {
      if (value > max3 || value < min3) {
        const n = typeof min3 === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min3 === 0 || min3 === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min3}${n} and <= ${max3}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length5, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length5 < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length5}`,
        value
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str5) {
      str5 = str5.split("=")[0];
      str5 = str5.trim().replace(INVALID_BASE64_RE, "");
      if (str5.length < 2) return "";
      while (str5.length % 4 !== 0) {
        str5 = str5 + "=";
      }
      return str5;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length5 = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length5; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length5) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str5) {
      const byteArray = [];
      for (let i = 0; i < str5.length; ++i) {
        byteArray.push(str5.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str5, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str5.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str5.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str5) {
      return base64.toByteArray(base64clean(str5));
    }
    function blitBuffer(src, dst, offset, length5) {
      let i;
      for (i = 0; i < length5; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    }();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    init_browser();
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l2 = handlers.length, ee = new Array(l2); i < l2; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len5 = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len5) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len5 - 1); i < len5; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length5 = listeners.length, j;
        for (i = 0; i < length5; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len5) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len5 - 1); j < len5; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length5 = listeners.length; i < length5; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// src/index.ts
init_browser();

// src/Log.ts
init_browser();
var import_loglevel = __toESM(require_loglevel());
import_loglevel.default.setLevel("debug");
var log = import_loglevel.default;

// src/Types.ts
init_browser();
var AggregateType = /* @__PURE__ */ ((AggregateType2) => {
  AggregateType2[AggregateType2["NONE"] = 0] = "NONE";
  AggregateType2[AggregateType2["SUM"] = 1] = "SUM";
  return AggregateType2;
})(AggregateType || {});
var AggregateTypeNames = ["NONE", "SUM"];

// src/NetworkReader.ts
init_browser();

// src/Message.ts
init_browser();

// src/NetworkWriter.ts
init_browser();

// src/Compression.ts
init_browser();

// node_modules/gl-matrix/esm/index.js
init_browser();

// node_modules/gl-matrix/esm/common.js
init_browser();
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
var degree = Math.PI / 180;
if (!Math.hypot) Math.hypot = function() {
  var y = 0, i = arguments.length;
  while (i--) {
    y += arguments[i] * arguments[i];
  }
  return Math.sqrt(y);
};

// node_modules/gl-matrix/esm/mat3.js
init_browser();
function create() {
  var out = new ARRAY_TYPE(9);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}

// node_modules/gl-matrix/esm/mat4.js
init_browser();
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
function getRotation(out, mat) {
  var scaling = new ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }
  return out;
}

// node_modules/gl-matrix/esm/quat.js
var quat_exports = {};
__export(quat_exports, {
  add: () => add3,
  calculateW: () => calculateW,
  clone: () => clone3,
  conjugate: () => conjugate,
  copy: () => copy3,
  create: () => create4,
  dot: () => dot3,
  equals: () => equals3,
  exactEquals: () => exactEquals3,
  exp: () => exp,
  fromEuler: () => fromEuler,
  fromMat3: () => fromMat3,
  fromValues: () => fromValues3,
  getAngle: () => getAngle,
  getAxisAngle: () => getAxisAngle,
  identity: () => identity,
  invert: () => invert,
  len: () => len3,
  length: () => length3,
  lerp: () => lerp3,
  ln: () => ln,
  mul: () => mul3,
  multiply: () => multiply3,
  normalize: () => normalize3,
  pow: () => pow,
  random: () => random3,
  rotateX: () => rotateX2,
  rotateY: () => rotateY2,
  rotateZ: () => rotateZ2,
  rotationTo: () => rotationTo,
  scale: () => scale3,
  set: () => set3,
  setAxes: () => setAxes,
  setAxisAngle: () => setAxisAngle,
  slerp: () => slerp,
  sqlerp: () => sqlerp,
  sqrLen: () => sqrLen3,
  squaredLength: () => squaredLength3,
  str: () => str3
});
init_browser();

// node_modules/gl-matrix/esm/vec3.js
var vec3_exports = {};
__export(vec3_exports, {
  add: () => add,
  angle: () => angle,
  bezier: () => bezier,
  ceil: () => ceil,
  clone: () => clone,
  copy: () => copy,
  create: () => create2,
  cross: () => cross,
  dist: () => dist,
  distance: () => distance,
  div: () => div,
  divide: () => divide,
  dot: () => dot,
  equals: () => equals,
  exactEquals: () => exactEquals,
  floor: () => floor,
  forEach: () => forEach,
  fromValues: () => fromValues,
  hermite: () => hermite,
  inverse: () => inverse,
  len: () => len,
  length: () => length,
  lerp: () => lerp,
  max: () => max,
  min: () => min,
  mul: () => mul,
  multiply: () => multiply,
  negate: () => negate,
  normalize: () => normalize,
  random: () => random,
  rotateX: () => rotateX,
  rotateY: () => rotateY,
  rotateZ: () => rotateZ,
  round: () => round,
  scale: () => scale,
  scaleAndAdd: () => scaleAndAdd,
  set: () => set,
  sqrDist: () => sqrDist,
  sqrLen: () => sqrLen,
  squaredDistance: () => squaredDistance,
  squaredLength: () => squaredLength,
  str: () => str,
  sub: () => sub,
  subtract: () => subtract,
  transformMat3: () => transformMat3,
  transformMat4: () => transformMat4,
  transformQuat: () => transformQuat,
  zero: () => zero
});
init_browser();
function create2() {
  var out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
function fromValues(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function scaleAndAdd(out, a, b, scale5) {
  out[0] = a[0] + b[0] * scale5;
  out[1] = a[1] + b[1] * scale5;
  out[2] = a[2] + b[2] * scale5;
  return out;
}
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len5 = x * x + y * y + z * z;
  if (len5 > 0) {
    len5 = 1 / Math.sqrt(len5);
  }
  out[0] = a[0] * len5;
  out[1] = a[1] * len5;
  out[2] = a[2] * len5;
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2];
  var bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function random(out, scale5) {
  scale5 = scale5 || 1;
  var r = RANDOM() * 2 * Math.PI;
  var z = RANDOM() * 2 - 1;
  var zScale = Math.sqrt(1 - z * z) * scale5;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale5;
  return out;
}
function transformMat4(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function transformMat3(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
function transformQuat(out, a, q) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  var x = a[0], y = a[1], z = a[2];
  var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
  var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
function rotateX(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateY(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateZ(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2];
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function angle(a, b) {
  var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
function zero(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}
function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function equals(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2];
  var b0 = b[0], b1 = b[1], b2 = b[2];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
}
var sub = subtract;
var mul = multiply;
var div = divide;
var dist = distance;
var sqrDist = squaredDistance;
var len = length;
var sqrLen = squaredLength;
var forEach = function() {
  var vec = create2();
  return function(a, stride, offset, count, fn, arg) {
    var i, l2;
    if (!stride) {
      stride = 3;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l2 = Math.min(count * stride + offset, a.length);
    } else {
      l2 = a.length;
    }
    for (i = offset; i < l2; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();

// node_modules/gl-matrix/esm/vec4.js
var vec4_exports = {};
__export(vec4_exports, {
  add: () => add2,
  ceil: () => ceil2,
  clone: () => clone2,
  copy: () => copy2,
  create: () => create3,
  cross: () => cross2,
  dist: () => dist2,
  distance: () => distance2,
  div: () => div2,
  divide: () => divide2,
  dot: () => dot2,
  equals: () => equals2,
  exactEquals: () => exactEquals2,
  floor: () => floor2,
  forEach: () => forEach2,
  fromValues: () => fromValues2,
  inverse: () => inverse2,
  len: () => len2,
  length: () => length2,
  lerp: () => lerp2,
  max: () => max2,
  min: () => min2,
  mul: () => mul2,
  multiply: () => multiply2,
  negate: () => negate2,
  normalize: () => normalize2,
  random: () => random2,
  round: () => round2,
  scale: () => scale2,
  scaleAndAdd: () => scaleAndAdd2,
  set: () => set2,
  sqrDist: () => sqrDist2,
  sqrLen: () => sqrLen2,
  squaredDistance: () => squaredDistance2,
  squaredLength: () => squaredLength2,
  str: () => str2,
  sub: () => sub2,
  subtract: () => subtract2,
  transformMat4: () => transformMat42,
  transformQuat: () => transformQuat2,
  zero: () => zero2
});
init_browser();
function create3() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}
function clone2(a) {
  var out = new ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function fromValues2(x, y, z, w) {
  var out = new ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function copy2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function set2(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function add2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
function subtract2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
function multiply2(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}
function divide2(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}
function ceil2(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}
function floor2(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}
function min2(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}
function max2(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}
function round2(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}
function scale2(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
function scaleAndAdd2(out, a, b, scale5) {
  out[0] = a[0] + b[0] * scale5;
  out[1] = a[1] + b[1] * scale5;
  out[2] = a[2] + b[2] * scale5;
  out[3] = a[3] + b[3] * scale5;
  return out;
}
function distance2(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return Math.hypot(x, y, z, w);
}
function squaredDistance2(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
}
function length2(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.hypot(x, y, z, w);
}
function squaredLength2(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
function negate2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}
function inverse2(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  out[3] = 1 / a[3];
  return out;
}
function normalize2(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len5 = x * x + y * y + z * z + w * w;
  if (len5 > 0) {
    len5 = 1 / Math.sqrt(len5);
  }
  out[0] = x * len5;
  out[1] = y * len5;
  out[2] = z * len5;
  out[3] = w * len5;
  return out;
}
function dot2(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
function cross2(out, u, v, w) {
  var A = v[0] * w[1] - v[1] * w[0], B = v[0] * w[2] - v[2] * w[0], C = v[0] * w[3] - v[3] * w[0], D = v[1] * w[2] - v[2] * w[1], E = v[1] * w[3] - v[3] * w[1], F = v[2] * w[3] - v[3] * w[2];
  var G = u[0];
  var H = u[1];
  var I = u[2];
  var J = u[3];
  out[0] = H * F - I * E + J * D;
  out[1] = -(G * F) + I * C - J * B;
  out[2] = G * E - H * C + J * A;
  out[3] = -(G * D) + H * B - I * A;
  return out;
}
function lerp2(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
function random2(out, scale5) {
  scale5 = scale5 || 1;
  var v1, v2, v3, v4;
  var s1, s2;
  do {
    v1 = RANDOM() * 2 - 1;
    v2 = RANDOM() * 2 - 1;
    s1 = v1 * v1 + v2 * v2;
  } while (s1 >= 1);
  do {
    v3 = RANDOM() * 2 - 1;
    v4 = RANDOM() * 2 - 1;
    s2 = v3 * v3 + v4 * v4;
  } while (s2 >= 1);
  var d = Math.sqrt((1 - s1) / s2);
  out[0] = scale5 * v1;
  out[1] = scale5 * v2;
  out[2] = scale5 * v3 * d;
  out[3] = scale5 * v4 * d;
  return out;
}
function transformMat42(out, a, m) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
function transformQuat2(out, a, q) {
  var x = a[0], y = a[1], z = a[2];
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z;
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}
function zero2(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  return out;
}
function str2(a) {
  return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
function exactEquals2(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
function equals2(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
}
var sub2 = subtract2;
var mul2 = multiply2;
var div2 = divide2;
var dist2 = distance2;
var sqrDist2 = squaredDistance2;
var len2 = length2;
var sqrLen2 = squaredLength2;
var forEach2 = function() {
  var vec = create3();
  return function(a, stride, offset, count, fn, arg) {
    var i, l2;
    if (!stride) {
      stride = 4;
    }
    if (!offset) {
      offset = 0;
    }
    if (count) {
      l2 = Math.min(count * stride + offset, a.length);
    } else {
      l2 = a.length;
    }
    for (i = offset; i < l2; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }
    return a;
  };
}();

// node_modules/gl-matrix/esm/quat.js
function create4() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  out[3] = 1;
  return out;
}
function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
function getAxisAngle(out_axis, q) {
  var rad = Math.acos(q[3]) * 2;
  var s = Math.sin(rad / 2);
  if (s > EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}
function getAngle(a, b) {
  var dotproduct = dot3(a, b);
  return Math.acos(2 * dotproduct * dotproduct - 1);
}
function multiply3(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = b[0], by = b[1], bz = b[2], bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function rotateX2(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
function rotateY2(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var by = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
function rotateZ2(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bz = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
function calculateW(out, a) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
  return out;
}
function exp(out, a) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var et = Math.exp(w);
  var s = r > 0 ? et * Math.sin(r) / r : 0;
  out[0] = x * s;
  out[1] = y * s;
  out[2] = z * s;
  out[3] = et * Math.cos(r);
  return out;
}
function ln(out, a) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var t = r > 0 ? Math.atan2(r, w) / r : 0;
  out[0] = x * t;
  out[1] = y * t;
  out[2] = z * t;
  out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
  return out;
}
function pow(out, a, b) {
  ln(out, a);
  scale3(out, out, b);
  exp(out, out);
  return out;
}
function slerp(out, a, b, t) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = b[0], by = b[1], bz = b[2], bw = b[3];
  var omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > EPSILON) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
function random3(out) {
  var u1 = RANDOM();
  var u2 = RANDOM();
  var u3 = RANDOM();
  var sqrt1MinusU1 = Math.sqrt(1 - u1);
  var sqrtU1 = Math.sqrt(u1);
  out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2);
  out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2);
  out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3);
  out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3);
  return out;
}
function invert(out, a) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var dot5 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot5 ? 1 / dot5 : 0;
  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
function fromMat3(out, m) {
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
}
function fromEuler(out, x, y, z) {
  var halfToRad = 0.5 * Math.PI / 180;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;
  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);
  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}
function str3(a) {
  return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
var clone3 = clone2;
var fromValues3 = fromValues2;
var copy3 = copy2;
var set3 = set2;
var add3 = add2;
var mul3 = multiply3;
var scale3 = scale2;
var dot3 = dot2;
var lerp3 = lerp2;
var length3 = length2;
var len3 = length3;
var squaredLength3 = squaredLength2;
var sqrLen3 = squaredLength3;
var normalize3 = normalize2;
var exactEquals3 = exactEquals2;
var equals3 = equals2;
var rotationTo = function() {
  var tmpvec3 = create2();
  var xUnitVec3 = fromValues(1, 0, 0);
  var yUnitVec3 = fromValues(0, 1, 0);
  return function(out, a, b) {
    var dot5 = dot(a, b);
    if (dot5 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 1e-6) cross(tmpvec3, yUnitVec3, a);
      normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot5 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot5;
      return normalize3(out, out);
    }
  };
}();
var sqlerp = function() {
  var temp1 = create4();
  var temp2 = create4();
  return function(out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
}();
var setAxes = function() {
  var matr = create();
  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize3(out, fromMat3(out, matr));
  };
}();

// node_modules/gl-matrix/esm/quat2.js
var quat2_exports = {};
__export(quat2_exports, {
  add: () => add4,
  clone: () => clone4,
  conjugate: () => conjugate2,
  copy: () => copy4,
  create: () => create5,
  dot: () => dot4,
  equals: () => equals4,
  exactEquals: () => exactEquals4,
  fromMat4: () => fromMat4,
  fromRotation: () => fromRotation,
  fromRotationTranslation: () => fromRotationTranslation,
  fromRotationTranslationValues: () => fromRotationTranslationValues,
  fromTranslation: () => fromTranslation,
  fromValues: () => fromValues4,
  getDual: () => getDual,
  getReal: () => getReal,
  getTranslation: () => getTranslation2,
  identity: () => identity2,
  invert: () => invert2,
  len: () => len4,
  length: () => length4,
  lerp: () => lerp4,
  mul: () => mul4,
  multiply: () => multiply4,
  normalize: () => normalize4,
  rotateAroundAxis: () => rotateAroundAxis,
  rotateByQuatAppend: () => rotateByQuatAppend,
  rotateByQuatPrepend: () => rotateByQuatPrepend,
  rotateX: () => rotateX3,
  rotateY: () => rotateY3,
  rotateZ: () => rotateZ3,
  scale: () => scale4,
  set: () => set4,
  setDual: () => setDual,
  setReal: () => setReal,
  sqrLen: () => sqrLen4,
  squaredLength: () => squaredLength4,
  str: () => str4,
  translate: () => translate
});
init_browser();
function create5() {
  var dq = new ARRAY_TYPE(8);
  if (ARRAY_TYPE != Float32Array) {
    dq[0] = 0;
    dq[1] = 0;
    dq[2] = 0;
    dq[4] = 0;
    dq[5] = 0;
    dq[6] = 0;
    dq[7] = 0;
  }
  dq[3] = 1;
  return dq;
}
function clone4(a) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = a[0];
  dq[1] = a[1];
  dq[2] = a[2];
  dq[3] = a[3];
  dq[4] = a[4];
  dq[5] = a[5];
  dq[6] = a[6];
  dq[7] = a[7];
  return dq;
}
function fromValues4(x1, y1, z1, w1, x2, y2, z2, w2) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  dq[4] = x2;
  dq[5] = y2;
  dq[6] = z2;
  dq[7] = w2;
  return dq;
}
function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  var ax = x2 * 0.5, ay = y2 * 0.5, az = z2 * 0.5;
  dq[4] = ax * w1 + ay * z1 - az * y1;
  dq[5] = ay * w1 + az * x1 - ax * z1;
  dq[6] = az * w1 + ax * y1 - ay * x1;
  dq[7] = -ax * x1 - ay * y1 - az * z1;
  return dq;
}
function fromRotationTranslation(out, q, t) {
  var ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5, bx = q[0], by = q[1], bz = q[2], bw = q[3];
  out[0] = bx;
  out[1] = by;
  out[2] = bz;
  out[3] = bw;
  out[4] = ax * bw + ay * bz - az * by;
  out[5] = ay * bw + az * bx - ax * bz;
  out[6] = az * bw + ax * by - ay * bx;
  out[7] = -ax * bx - ay * by - az * bz;
  return out;
}
function fromTranslation(out, t) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = t[0] * 0.5;
  out[5] = t[1] * 0.5;
  out[6] = t[2] * 0.5;
  out[7] = 0;
  return out;
}
function fromRotation(out, q) {
  out[0] = q[0];
  out[1] = q[1];
  out[2] = q[2];
  out[3] = q[3];
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
function fromMat4(out, a) {
  var outer = create4();
  getRotation(outer, a);
  var t = new ARRAY_TYPE(3);
  getTranslation(t, a);
  fromRotationTranslation(out, outer, t);
  return out;
}
function copy4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  return out;
}
function identity2(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
function set4(out, x1, y1, z1, w1, x2, y2, z2, w2) {
  out[0] = x1;
  out[1] = y1;
  out[2] = z1;
  out[3] = w1;
  out[4] = x2;
  out[5] = y2;
  out[6] = z2;
  out[7] = w2;
  return out;
}
var getReal = copy3;
function getDual(out, a) {
  out[0] = a[4];
  out[1] = a[5];
  out[2] = a[6];
  out[3] = a[7];
  return out;
}
var setReal = copy3;
function setDual(out, q) {
  out[4] = q[0];
  out[5] = q[1];
  out[6] = q[2];
  out[7] = q[3];
  return out;
}
function getTranslation2(out, a) {
  var ax = a[4], ay = a[5], az = a[6], aw = a[7], bx = -a[0], by = -a[1], bz = -a[2], bw = a[3];
  out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
  out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
  out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  return out;
}
function translate(out, a, v) {
  var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3], bx1 = v[0] * 0.5, by1 = v[1] * 0.5, bz1 = v[2] * 0.5, ax2 = a[4], ay2 = a[5], az2 = a[6], aw2 = a[7];
  out[0] = ax1;
  out[1] = ay1;
  out[2] = az1;
  out[3] = aw1;
  out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
  out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
  out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
  out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
  return out;
}
function rotateX3(out, a, rad) {
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateX2(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
function rotateY3(out, a, rad) {
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateY2(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
function rotateZ3(out, a, rad) {
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateZ2(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
function rotateByQuatAppend(out, a, q) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3], ax = a[0], ay = a[1], az = a[2], aw = a[3];
  out[0] = ax * qw + aw * qx + ay * qz - az * qy;
  out[1] = ay * qw + aw * qy + az * qx - ax * qz;
  out[2] = az * qw + aw * qz + ax * qy - ay * qx;
  out[3] = aw * qw - ax * qx - ay * qy - az * qz;
  ax = a[4];
  ay = a[5];
  az = a[6];
  aw = a[7];
  out[4] = ax * qw + aw * qx + ay * qz - az * qy;
  out[5] = ay * qw + aw * qy + az * qx - ax * qz;
  out[6] = az * qw + aw * qz + ax * qy - ay * qx;
  out[7] = aw * qw - ax * qx - ay * qy - az * qz;
  return out;
}
function rotateByQuatPrepend(out, q, a) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3], bx = a[0], by = a[1], bz = a[2], bw = a[3];
  out[0] = qx * bw + qw * bx + qy * bz - qz * by;
  out[1] = qy * bw + qw * by + qz * bx - qx * bz;
  out[2] = qz * bw + qw * bz + qx * by - qy * bx;
  out[3] = qw * bw - qx * bx - qy * by - qz * bz;
  bx = a[4];
  by = a[5];
  bz = a[6];
  bw = a[7];
  out[4] = qx * bw + qw * bx + qy * bz - qz * by;
  out[5] = qy * bw + qw * by + qz * bx - qx * bz;
  out[6] = qz * bw + qw * bz + qx * by - qy * bx;
  out[7] = qw * bw - qx * bx - qy * by - qz * bz;
  return out;
}
function rotateAroundAxis(out, a, axis, rad) {
  if (Math.abs(rad) < EPSILON) {
    return copy4(out, a);
  }
  var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
  rad = rad * 0.5;
  var s = Math.sin(rad);
  var bx = s * axis[0] / axisLength;
  var by = s * axis[1] / axisLength;
  var bz = s * axis[2] / axisLength;
  var bw = Math.cos(rad);
  var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3];
  out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  var ax = a[4], ay = a[5], az = a[6], aw = a[7];
  out[4] = ax * bw + aw * bx + ay * bz - az * by;
  out[5] = ay * bw + aw * by + az * bx - ax * bz;
  out[6] = az * bw + aw * bz + ax * by - ay * bx;
  out[7] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function add4(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  return out;
}
function multiply4(out, a, b) {
  var ax0 = a[0], ay0 = a[1], az0 = a[2], aw0 = a[3], bx1 = b[4], by1 = b[5], bz1 = b[6], bw1 = b[7], ax1 = a[4], ay1 = a[5], az1 = a[6], aw1 = a[7], bx0 = b[0], by0 = b[1], bz0 = b[2], bw0 = b[3];
  out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
  out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
  out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
  out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
  out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
  out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
  out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
  out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
  return out;
}
var mul4 = multiply4;
function scale4(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  return out;
}
var dot4 = dot3;
function lerp4(out, a, b, t) {
  var mt = 1 - t;
  if (dot4(a, b) < 0) t = -t;
  out[0] = a[0] * mt + b[0] * t;
  out[1] = a[1] * mt + b[1] * t;
  out[2] = a[2] * mt + b[2] * t;
  out[3] = a[3] * mt + b[3] * t;
  out[4] = a[4] * mt + b[4] * t;
  out[5] = a[5] * mt + b[5] * t;
  out[6] = a[6] * mt + b[6] * t;
  out[7] = a[7] * mt + b[7] * t;
  return out;
}
function invert2(out, a) {
  var sqlen = squaredLength4(a);
  out[0] = -a[0] / sqlen;
  out[1] = -a[1] / sqlen;
  out[2] = -a[2] / sqlen;
  out[3] = a[3] / sqlen;
  out[4] = -a[4] / sqlen;
  out[5] = -a[5] / sqlen;
  out[6] = -a[6] / sqlen;
  out[7] = a[7] / sqlen;
  return out;
}
function conjugate2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  out[4] = -a[4];
  out[5] = -a[5];
  out[6] = -a[6];
  out[7] = a[7];
  return out;
}
var length4 = length3;
var len4 = length4;
var squaredLength4 = squaredLength3;
var sqrLen4 = squaredLength4;
function normalize4(out, a) {
  var magnitude = squaredLength4(a);
  if (magnitude > 0) {
    magnitude = Math.sqrt(magnitude);
    var a0 = a[0] / magnitude;
    var a1 = a[1] / magnitude;
    var a2 = a[2] / magnitude;
    var a3 = a[3] / magnitude;
    var b0 = a[4];
    var b1 = a[5];
    var b2 = a[6];
    var b3 = a[7];
    var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = (b0 - a0 * a_dot_b) / magnitude;
    out[5] = (b1 - a1 * a_dot_b) / magnitude;
    out[6] = (b2 - a2 * a_dot_b) / magnitude;
    out[7] = (b3 - a3 * a_dot_b) / magnitude;
  }
  return out;
}
function str4(a) {
  return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
}
function exactEquals4(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
}
function equals4(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7));
}

// src/Compression.ts
var Compression = class {
  static LargestAbsoluteComponentIndex(value) {
    const abs = vec4_exports.fromValues(Math.abs(value[0]), Math.abs(value[1]), Math.abs(value[2]), Math.abs(value[3]));
    let largestAbs = abs[0];
    let withoutLargest = vec3_exports.fromValues(value[1], value[2], value[3]);
    let largestIndex = 0;
    if (abs[1] > largestAbs) {
      largestIndex = 1;
      largestAbs = abs[1];
      withoutLargest = vec3_exports.fromValues(value[0], value[2], value[3]);
    }
    if (abs[2] > largestAbs) {
      largestIndex = 2;
      largestAbs = abs[2];
      withoutLargest = vec3_exports.fromValues(value[0], value[1], value[3]);
    }
    if (abs[3] > largestAbs) {
      largestIndex = 3;
      largestAbs = abs[3];
      withoutLargest = vec3_exports.fromValues(value[0], value[1], value[2]);
    }
    return { index: largestIndex, abs: largestAbs, without: withoutLargest };
  }
  static ScaleFloatToUShort(value, min3, max3, ushortMin, ushortMax) {
    return Math.round((value - min3) / (max3 - min3) * (ushortMax - ushortMin) + ushortMin);
  }
  static ScaleUShortToFloat(value, ushortMin, ushortMax, min3, max3) {
    return (value - ushortMin) / (ushortMax - ushortMin) * (max3 - min3) + min3;
  }
  // 1u<<32
  static isIdentity(q) {
    return q[0] == 0 && q[1] == 0 && q[2] == 0 && q[3] == 1;
  }
  static CompressQuaternion(q) {
    const largest = this.LargestAbsoluteComponentIndex(q);
    if (q[largest.index] < 0) {
      vec3_exports.negate(largest.without, largest.without);
    }
    const aScaled = this.ScaleFloatToUShort(largest.without[0], this.QuaternionMinRange, this.QuaternionMaxRange, 0, this.TenBitsMax);
    const bScaled = this.ScaleFloatToUShort(largest.without[1], this.QuaternionMinRange, this.QuaternionMaxRange, 0, this.TenBitsMax);
    const cScaled = this.ScaleFloatToUShort(largest.without[2], this.QuaternionMinRange, this.QuaternionMaxRange, 0, this.TenBitsMax);
    return (largest.index << 30 | aScaled << 20 | bScaled << 10 | cScaled) >>> 0;
  }
  static QuaternionNormalizeSafe(value) {
    const FLT_MIN_NORMAL = 1175494351e-47;
    const length5 = vec4_exports.dot(value, value);
    return length5 > FLT_MIN_NORMAL ? quat_exports.normalize(quat_exports.create(), value) : quat_exports.create();
  }
  static DecompressQuaternion(data) {
    const cScaled = data & this.TenBitsMax;
    const bScaled = data >>> 10 & this.TenBitsMax;
    const aScaled = data >>> 20 & this.TenBitsMax;
    const largestIndex = data >>> 30 & 3;
    const a = this.ScaleUShortToFloat(aScaled, 0, this.TenBitsMax, this.QuaternionMinRange, this.QuaternionMaxRange);
    const b = this.ScaleUShortToFloat(bScaled, 0, this.TenBitsMax, this.QuaternionMinRange, this.QuaternionMaxRange);
    const c = this.ScaleUShortToFloat(cScaled, 0, this.TenBitsMax, this.QuaternionMinRange, this.QuaternionMaxRange);
    const d = Math.sqrt(1 - a * a - b * b - c * c);
    let value;
    switch (largestIndex) {
      case 0:
        value = vec4_exports.fromValues(d, a, b, c);
        break;
      case 1:
        value = vec4_exports.fromValues(a, d, b, c);
        break;
      case 2:
        value = vec4_exports.fromValues(a, b, d, c);
        break;
      default:
        value = vec4_exports.fromValues(a, b, c, d);
        break;
    }
    return this.QuaternionNormalizeSafe(value);
  }
  static VarUIntSize(value) {
    if (value <= 240) return 1;
    if (value <= 2287) return 2;
    if (value <= 67823) return 3;
    if (value <= 16777215) return 4;
    if (value <= 4294967295) return 5;
    if (value <= 1099511627775) return 6;
    if (value < Number.MAX_SAFE_INTEGER) return 7;
    console.trace("Number too big:", value);
    throw "number too big :( : " + value;
  }
  static VarIntSize(value) {
    const zigzagged = this.encodeZigzag(value);
    return this.VarUIntSize(zigzagged);
  }
  static CompressVarUInt(writer, value) {
    if (isNaN(value)) {
      console.trace("CompressVarUInt NaN");
      value = 0;
    }
    if (value <= 240) {
      const a = value;
      writer.writeUint8(a >>> 0);
      return;
    }
    if (value <= 2287) {
      const a = (value - 240 >> 8) + 241;
      const b = value - 240 & 255;
      writer.writeUint16(b << 8 | a);
      return;
    }
    if (value <= 67823) {
      const a = 249;
      const b = value - 2288 >> 8;
      const c = value - 2288 & 255;
      writer.writeUint8(a);
      writer.writeUint16(c << 8 | b);
      return;
    }
    if (value <= 16777215) {
      const a = 250;
      const b = value << 8;
      writer.writeUint32((b | a) >>> 0);
      return;
    }
    if (value <= 4294967295) {
      const a = 251;
      const b = value;
      writer.writeUint8(a);
      writer.writeUint32(b);
      return;
    }
    if (value <= 1099511627775) {
      const a = 252;
      const b = value & 255;
      const c = value >> 8;
      writer.writeUint16(b << 8 | a);
      writer.writeUint32(c >>> 0);
      return;
    }
    if (value < Number.MAX_SAFE_INTEGER) {
      const a = 253;
      const b = value & 255;
      const c = value >> 8 & 255;
      const d = value >> 16;
      writer.writeUint8(a);
      writer.writeUint16(c << 8 | b);
      writer.writeUint32(d);
      return;
    }
    console.trace("Number too big:", value);
    throw "number too big: " + value;
  }
  static encodeZigzag(v) {
    const shift = v * 2;
    return v >= 0 ? shift : -shift - 1;
  }
  static decodeZigzag(v) {
    const shift = Math.floor(v / 2);
    return v % 2 === 0 ? shift : -shift - 1;
  }
  static CompressVarInt(writer, value) {
    const zigzagged = this.encodeZigzag(value);
    this.CompressVarUInt(writer, zigzagged);
  }
  static DecompressVarUInt(reader) {
    const a0 = reader.readUint8();
    if (a0 < 241) {
      return a0;
    }
    const a1 = reader.readUint8();
    if (a0 <= 248) {
      return 240 + (a0 - 241 << 8) + a1;
    }
    const a2 = reader.readUint8();
    if (a0 == 249) {
      return 2288 + (a1 << 8) + a2;
    }
    const a3 = reader.readUint8();
    if (a0 == 250) {
      return a1 + (a2 << 8) + (a3 << 16);
    }
    const a4 = reader.readUint8();
    if (a0 == 251) {
      return a1 + (a2 << 8) + (a3 << 16) + (a4 << 24);
    }
    const a5 = reader.readUint8();
    if (a0 == 252) {
      return a1 + (a2 << 8) + (a3 << 16) + (a4 << 24) + (a5 << 32);
    }
    const a6 = reader.readUint8();
    if (a0 == 253) {
      return a1 + (a2 << 8) + (a3 << 16) + (a4 << 24) + (a5 << 32) + (a6 << 40);
    }
    const a7 = reader.readUint8();
    if (a0 == 254) {
      return a1 + (a2 << 8) + (a3 << 16) + (a4 << 24) + (a5 << 32) + (a6 << 40) + (a7 << 48);
    }
    const a8 = reader.readUint8();
    if (a0 == 255) {
      return a1 + (a2 << 8) + (a3 << 16) + (a4 << 24) + (a5 << 32) + (a6 << 40) + (a7 << 48) + (a8 << 56);
    }
    throw new Error(`DecompressVarInt failure: ${a0}`);
  }
  static DecompressVarInt(reader) {
    const data = this.DecompressVarUInt(reader);
    return this.decodeZigzag(data);
  }
};
Compression.QuaternionMinRange = -0.707107;
Compression.QuaternionMaxRange = 0.707107;
Compression.TenBitsMax = 1023;
Compression.IDENTITY_QUATERNION_CONSTANT = 2147483648;

// src/NetworkWriter.ts
var import_buffer = __toESM(require_buffer());
var NetworkWriter = class _NetworkWriter {
  constructor(buffer) {
    this.buffer = buffer;
    this.offset = 0;
  }
  getSubBuffer() {
    return this.buffer.subarray(0, this.offset);
  }
  ensureCapacity(size) {
    var targetSize = this.offset + size;
    if (targetSize > this.buffer.length) {
      var newSize = Math.ceil(targetSize / 256) * 256;
      if (newSize > 64e3) {
        throw new Error("Maximum Buffer size exceeded");
      }
      var newBuffer = import_buffer.Buffer.alloc(newSize);
      this.buffer.copy(newBuffer, 0, 0, this.offset);
      this.buffer = newBuffer;
    }
  }
  getBytesWritten() {
    return this.offset;
  }
  writeUint8(value) {
    this.ensureCapacity(1);
    this.buffer.writeUInt8(value, this.offset);
    this.offset += 1;
  }
  writeUint16(value) {
    this.ensureCapacity(2);
    this.buffer.writeUInt16LE(value, this.offset);
    this.offset += 2;
  }
  writeUint32(value) {
    this.ensureCapacity(4);
    this.buffer.writeUInt32LE(value, this.offset);
    this.offset += 4;
  }
  writeInt8(value) {
    this.ensureCapacity(1);
    this.buffer.writeInt8(value, this.offset);
    this.offset += 1;
  }
  writeInt16(value) {
    this.ensureCapacity(2);
    this.buffer.writeInt16LE(value, this.offset);
    this.offset += 2;
  }
  writeInt32(value) {
    this.ensureCapacity(4);
    this.buffer.writeInt32LE(value, this.offset);
    this.offset += 4;
  }
  writeDouble(value) {
    this.ensureCapacity(8);
    this.buffer.writeDoubleLE(value, this.offset);
    this.offset += 8;
  }
  writeFloat(value) {
    this.ensureCapacity(4);
    this.buffer.writeFloatLE(value, this.offset);
    this.offset += 4;
  }
  writeString(value) {
    if (value == null) {
      this.ensureCapacity(2);
      this.writeUint16(0);
      return;
    }
    const length5 = import_buffer.Buffer.from(value, "utf8").length;
    this.ensureCapacity(2 + length5);
    this.writeUint16(length5);
    this.buffer.write(value, this.offset, length5, "utf8");
    this.offset += length5;
  }
  writeBuffer(value) {
    const length5 = value.length;
    this.ensureCapacity(length5);
    value.copy(this.buffer, this.offset, 0, length5);
    this.offset += length5;
  }
  writeObjectId(value) {
    this.writeUint32(value);
  }
  writeClientId(value) {
    this.writeUint16(value);
  }
  writeVarUInt(value) {
    Compression.CompressVarUInt(this, value);
  }
  writeVarInt(value) {
    if (isNaN(value)) {
      log.warn("Write varInt for NaN value; writing 0.");
      value = 0;
    }
    Compression.CompressVarInt(this, value);
  }
  writeQuaternionCompressed(value) {
    this.writeUint32(Compression.CompressQuaternion(value));
  }
  writeQuaternionCompressedHP(value) {
    this.writeVarInt(value[0]);
    this.writeVarInt(value[1]);
    this.writeVarInt(value[2]);
    this.writeVarInt(value[3]);
  }
  writeVector3Long(value) {
    this.writeVarInt(value[0]);
    this.writeVarInt(value[1]);
    this.writeVarInt(value[2]);
  }
  writeVarVector3Int(value) {
    this.writeVarInt(value[0]);
    this.writeVarInt(value[1]);
    this.writeVarInt(value[2]);
  }
  writeMessage(msg) {
    this.writeUint8(msg.cmd);
    switch (msg.cmd) {
      case 1 /* SetId */:
        this.writeUint16(msg.id);
        break;
      case 2 /* RequestIdSpace */:
        this.writeUint8(msg.value);
        break;
      case 3 /* AssignIdSpace */:
        this.writeUint32(msg.id);
        this.writeUint8(msg.value);
        break;
      case 4 /* Ready */:
        break;
      case 5 /* Ping */:
      case 6 /* Pong */:
        this.writeUint32(msg.id);
        break;
      case 7 /* Time */:
        this.writeDouble(msg.value);
        break;
      case 8 /* TypeInfo */:
        break;
      case 12 /* Delete */:
        this.writeObjectId(msg.id);
        break;
      case 13 /* Lock */:
        this.writeObjectId(msg.id);
        this.writeClientId(msg.value);
        break;
      case 14 /* Unlock */:
        this.writeObjectId(msg.id);
        break;
      case 15 /* SetProperty */:
        this.writeObjectId(msg.id);
        this.writeUint16(msg.property || 0);
        this.writeBuffer(msg.value);
        break;
      case 17 /* SetOwner */:
        this.writeObjectId(msg.id);
        this.writeClientId(msg.value);
        break;
      case 18 /* PeerMessage */:
        this.writeClientId(msg.id);
        this.writeString(msg.value);
        break;
      case 21 /* Register */:
        this.writeBuffer(msg.value);
        break;
      default:
        throw "Unknown command: " + msg.cmd;
    }
  }
  static calculateTransformUpdateMessageSize(objects) {
    var size = 1 + 2 + 8;
    for (let [id, obj] of objects) {
      for (var i = 0; i < obj.pos.length; i++) {
        let pos = obj.pos[i];
        let scale5 = obj.scale[i];
        let parent = obj.transformParentId[i];
        if (!isNaN(pos[0])) {
          size += Compression.VarUIntSize(id);
          size += Compression.VarUIntSize(i);
          size += 1;
          size += Compression.VarIntSize(pos[0]);
          size += Compression.VarIntSize(pos[1]);
          size += Compression.VarIntSize(pos[2]);
          size += 4;
          size += Compression.VarIntSize(scale5[0]);
          size += Compression.VarIntSize(scale5[1]);
          size += Compression.VarIntSize(scale5[2]);
          if (parent) size += Compression.VarUIntSize(parent);
        }
      }
    }
    return size;
  }
  writeTransformUpdateMessage(clientId, time, objects) {
    var changeMaskBase = 1 + 2 + 4 + 8;
    var writer = this;
    writer.writeUint8(20 /* TransformUpdate */);
    writer.writeClientId(clientId);
    writer.writeDouble(time);
    for (let [id, obj] of objects) {
      for (var i = 0; i < obj.pos.length; i++) {
        let pos = obj.pos[i];
        let rot = obj.rot[i];
        let scale5 = obj.scale[i];
        let changeMask = changeMaskBase;
        let parent = obj.transformParentId[i];
        if (parent) {
          changeMask += 16 + 32;
        }
        if (!isNaN(pos[0])) {
          writer.writeVarUInt(id);
          writer.writeVarUInt(i);
          writer.writeUint8(changeMask);
          writer.writeVarInt(pos[0]);
          writer.writeVarInt(pos[1]);
          writer.writeVarInt(pos[2]);
          writer.writeQuaternionCompressed(rot);
          writer.writeVarInt(scale5[0]);
          writer.writeVarInt(scale5[1]);
          writer.writeVarInt(scale5[2]);
          if (parent) {
            writer.writeVarUInt(parent);
          }
        }
      }
    }
  }
  static calculateStringSize(value) {
    return 2 + import_buffer.Buffer.from(value, "utf8").length;
  }
  static typeName_withAggregate(propertyInfo) {
    var typeName = propertyInfo.type;
    if (propertyInfo.aggregate != null && propertyInfo.aggregate != 0 /* NONE */) {
      typeName += "|" + AggregateTypeNames[propertyInfo.aggregate];
    }
    return typeName;
  }
  static calculateTypeInfoMessageSize(name, properties) {
    var size = 1 + this.calculateStringSize(name);
    for (var i = 0; i < properties.length; i++) {
      size += this.calculateStringSize(properties[i].name);
      size += this.calculateStringSize(_NetworkWriter.typeName_withAggregate(properties[i]));
    }
    return size;
  }
  writeTypeInfoMessage(name, properties) {
    this.writeUint8(8 /* TypeInfo */);
    this.writeString(name);
    for (var i = 0; i < properties.length; i++) {
      this.writeString(properties[i].name);
      this.writeString(_NetworkWriter.typeName_withAggregate(properties[i]));
    }
  }
  writeType(type, v) {
    switch (type) {
      case "Int32":
        this.writeInt32(v);
        return;
      case "Int16":
        this.writeInt16(v);
        return;
      case "Int8":
        this.writeInt8(v);
        return;
      case "UInt32":
        this.writeUint32(v);
        return;
      case "UInt16":
        this.writeUint16(v);
        return;
      case "UInt8":
        this.writeUint8(v);
        return;
      case "Single":
        this.writeFloat(v);
        return;
      case "Double":
        this.writeDouble(v);
        return;
      case "Boolean":
        this.writeUint8(v ? 1 : 0);
        return;
      case "Vector2":
        this.writeFloat(v.x);
        this.writeFloat(v.y);
        return;
      case "Vector3":
        this.writeFloat(v.x);
        this.writeFloat(v.y);
        this.writeFloat(v.z);
        return;
      case "String":
        this.writeString(v);
        return;
      case "Color":
        this.writeUint8(v.r);
        this.writeUint8(v.g);
        this.writeUint8(v.b);
        this.writeUint8(v.a);
        return;
      case "NetworkObject":
        this.writeObjectId(v);
        return;
      case "PeerStatusKVP":
        this.writeClientId(v.peer);
        this.writeUint8(v.status);
        return;
    }
    if (type.startsWith("List<")) {
      let subtype = type.substring(5, type.length - 1);
      let length5 = v.length;
      this.writeUint16(length5);
      for (let i = 0; i < length5; i++) {
        this.writeType(subtype, v[i]);
      }
      return;
    }
    if (type.startsWith("Range<")) {
      let subtype = type.substring(6, type.length - 1);
      let min3 = v.min;
      let max3 = v.max;
      this.writeType(subtype, min3);
      this.writeType(subtype, max3);
    }
    if (type.startsWith("enum/")) {
      this.writeUint8(v);
      return;
    }
    if (typeof v === "string") {
      this.writeString(v);
      return;
    }
    this.writeString(JSON.stringify(v));
  }
};

// src/Message.ts
var import_buffer2 = __toESM(require_buffer());
var Command = /* @__PURE__ */ ((Command2) => {
  Command2[Command2["SetId"] = 1] = "SetId";
  Command2[Command2["RequestIdSpace"] = 2] = "RequestIdSpace";
  Command2[Command2["AssignIdSpace"] = 3] = "AssignIdSpace";
  Command2[Command2["Ready"] = 4] = "Ready";
  Command2[Command2["Ping"] = 5] = "Ping";
  Command2[Command2["Pong"] = 6] = "Pong";
  Command2[Command2["Time"] = 7] = "Time";
  Command2[Command2["TypeInfo"] = 8] = "TypeInfo";
  Command2[Command2["Delete"] = 12] = "Delete";
  Command2[Command2["Lock"] = 13] = "Lock";
  Command2[Command2["Unlock"] = 14] = "Unlock";
  Command2[Command2["SetProperty"] = 15] = "SetProperty";
  Command2[Command2["SetOwner"] = 17] = "SetOwner";
  Command2[Command2["PeerMessage"] = 18] = "PeerMessage";
  Command2[Command2["TransformUpdate"] = 20] = "TransformUpdate";
  Command2[Command2["Register"] = 21] = "Register";
  Command2[Command2["BlobUpdate"] = 22] = "BlobUpdate";
  Command2[Command2["InvalidLegacyJsonMessage"] = 123] = "InvalidLegacyJsonMessage";
  Command2[Command2["LegacyJsonMessage"] = 254] = "LegacyJsonMessage";
  return Command2;
})(Command || {});
var Message2 = class _Message {
  static parse(msg) {
    try {
      let m = JSON.parse(msg);
      let cmd = parseInt(m.cmd);
      let id = parseInt(m.id);
      let value = m.value;
      let property = m.property;
      return new _Message(cmd, id, value, property);
    } catch (e) {
      console.error("Failed to parse message", msg.toString());
      return void 0;
    }
  }
  constructor(cmd, id, value, property, buffer) {
    this.cmd = cmd;
    this.id = id;
    this.value = value;
    this.property = property;
    this.buffer = buffer;
  }
  getBuffer() {
    var _a, _b;
    if (this.buffer) return this.buffer;
    var sz = 128;
    if (typeof this.value === "string") {
      sz += this.value.length;
    } else if (this.cmd == 15 /* SetProperty */ && ((_a = this.value) == null ? void 0 : _a.byteLength)) {
      sz += this.value.length;
    } else if (this.cmd == 21 /* Register */ && ((_b = this.value) == null ? void 0 : _b.byteLength)) {
      sz += this.value.byteLength;
    }
    this.buffer = import_buffer2.Buffer.allocUnsafe(sz);
    let writer = new NetworkWriter(this.buffer);
    writer.writeMessage(this);
    this.buffer = writer.getSubBuffer();
    return this.buffer;
  }
  toString() {
    if (this.cmd == 15 /* SetProperty */) {
      return "SetProperty #" + this.id + "." + this.property + " = " + this.value;
    }
    return Command[this.cmd] + "#" + this.id + " " + this.value;
  }
};

// src/DeltaCompression.ts
init_browser();
var DeltaCompression = class _DeltaCompression {
  // delta (usually small), then zigzag varint to support +- changes
  // parameter order: (last, current) makes most sense (Q3 does this too).
  static compress(writer, last, current) {
    Compression.CompressVarInt(writer, current - last);
  }
  static decompress(reader, last) {
    return last + Compression.DecompressVarInt(reader);
  }
  // delta (usually small), then zigzag varint to support +- changes
  static compressVector3(writer, last, current) {
    _DeltaCompression.compress(writer, last[0], current[0]);
    _DeltaCompression.compress(writer, last[1], current[1]);
    _DeltaCompression.compress(writer, last[2], current[2]);
  }
  static decompressVector3(reader, last) {
    return [
      _DeltaCompression.decompress(reader, last[0]),
      _DeltaCompression.decompress(reader, last[1]),
      _DeltaCompression.decompress(reader, last[2])
    ];
  }
  static compressQuaternion(writer, last, current) {
    _DeltaCompression.compress(writer, last[0], current[0]);
    _DeltaCompression.compress(writer, last[1], current[1]);
    _DeltaCompression.compress(writer, last[2], current[2]);
    _DeltaCompression.compress(writer, last[3], current[3]);
  }
  static decompressQuaternion(reader, last) {
    return [
      _DeltaCompression.decompress(reader, last[0]),
      _DeltaCompression.decompress(reader, last[1]),
      _DeltaCompression.decompress(reader, last[2]),
      _DeltaCompression.decompress(reader, last[3])
    ];
  }
};

// src/NetworkReader.ts
var NetworkReader = class {
  constructor(buffer, initialOffset = 0) {
    this.buffer = buffer;
    this.offset = initialOffset;
  }
  bytesRemaining() {
    return this.buffer.length - this.offset;
  }
  reset() {
    this.offset = 0;
  }
  getRestOfBuffer() {
    return this.buffer.subarray(this.offset);
  }
  readBuffer(size) {
    if (this.bytesRemaining() < size) {
      return null;
    }
    var r = this.buffer.subarray(this.offset, this.offset + size);
    this.offset += size;
    return r;
  }
  readUint8() {
    const value = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return value;
  }
  readUint16() {
    const value = this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return value;
  }
  readUint32() {
    const value = this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return value;
  }
  readInt8() {
    const value = this.buffer.readInt8(this.offset);
    this.offset += 1;
    return value;
  }
  readInt16() {
    const value = this.buffer.readInt16LE(this.offset);
    this.offset += 2;
    return value;
  }
  readInt32() {
    const value = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return value;
  }
  readDouble() {
    const value = this.buffer.readDoubleLE(this.offset);
    this.offset += 8;
    return value;
  }
  readFloat() {
    const value = this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }
  tryReadString() {
    if (this.bytesRemaining() < 2) {
      return null;
    }
    const length5 = this.readUint16();
    if (length5 > this.bytesRemaining()) {
      this.offset -= 2;
      return null;
    }
    const value = this.buffer.toString(
      "utf8",
      this.offset,
      this.offset + length5
    );
    this.offset += length5;
    return value;
  }
  tryReadRestAsString() {
    if (this.bytesRemaining() < 2) {
      return null;
    }
    const length5 = this.readUint16();
    if (length5 != this.bytesRemaining()) {
      this.offset -= 2;
      return null;
    }
    const value = this.buffer.toString(
      "utf8",
      this.offset,
      this.offset + length5
    );
    this.offset += length5;
    return value;
  }
  readString() {
    const length5 = this.readUint16();
    if (length5 == 0) return null;
    const value = this.buffer.toString(
      "utf8",
      this.offset,
      this.offset + length5
    );
    this.offset += length5;
    return value;
  }
  readObjectId() {
    return this.readUint32();
  }
  readClientId() {
    return this.readUint16();
  }
  readVarUInt() {
    return Compression.DecompressVarUInt(this);
  }
  readVector3() {
    return [this.readFloat(), this.readFloat(), this.readFloat()];
  }
  readVarVector3Int() {
    return [Compression.DecompressVarInt(this), Compression.DecompressVarInt(this), Compression.DecompressVarInt(this)];
  }
  readQuaternion() {
    return [
      this.readFloat(),
      this.readFloat(),
      this.readFloat(),
      this.readFloat()
    ];
  }
  readVector3Compressed(last) {
    return DeltaCompression.decompressVector3(this, last);
  }
  readQuaternionCompressed() {
    return Compression.DecompressQuaternion(this.readUint32());
  }
  readQuaternionCompressedHP(last) {
    return DeltaCompression.decompressQuaternion(this, last);
  }
  readMessage() {
    const cmd = this.readUint8();
    switch (cmd) {
      case 1 /* SetId */:
        return new Message2(
          cmd,
          this.readClientId(),
          void 0,
          void 0,
          this.buffer
        );
      case 2 /* RequestIdSpace */:
        return new Message2(
          cmd,
          this.readUint8(),
          void 0,
          void 0,
          this.buffer
        );
      case 3 /* AssignIdSpace */:
        return new Message2(
          cmd,
          this.readUint32(),
          this.readUint8(),
          void 0,
          this.buffer
        );
      case 4 /* Ready */:
        return new Message2(cmd, 0, void 0, void 0, this.buffer);
      case 5 /* Ping */:
        return new Message2(
          cmd,
          this.readObjectId(),
          void 0,
          void 0,
          this.buffer
        );
      case 6 /* Pong */:
        return new Message2(
          cmd,
          this.readObjectId(),
          void 0,
          void 0,
          this.buffer
        );
      case 7 /* Time */:
        return new Message2(cmd, 0, this.readDouble(), void 0, this.buffer);
      case 8 /* TypeInfo */:
        return this.readTypeInfoMessage();
      case 12 /* Delete */:
        return new Message2(
          cmd,
          this.readObjectId(),
          void 0,
          void 0,
          this.buffer
        );
      case 13 /* Lock */:
        return new Message2(
          cmd,
          this.readObjectId(),
          this.readClientId(),
          void 0,
          this.buffer
        );
      case 14 /* Unlock */:
        return new Message2(
          cmd,
          this.readObjectId(),
          void 0,
          void 0,
          this.buffer
        );
      case 15 /* SetProperty */:
        const id = this.readObjectId();
        const prop = this.readUint16();
        const binaryValue = this.getRestOfBuffer();
        return new Message2(cmd, id, binaryValue, prop, this.buffer);
      case 17 /* SetOwner */:
        return new Message2(
          cmd,
          this.readObjectId(),
          this.readClientId(),
          void 0,
          this.buffer
        );
      case 18 /* PeerMessage */: {
        return new Message2(
          cmd,
          this.readClientId(),
          this.readString(),
          void 0,
          this.buffer
        );
      }
      case 20 /* TransformUpdate */:
        return new Message2(
          cmd,
          0,
          this.getRestOfBuffer(),
          void 0,
          this.buffer
        );
      case 21 /* Register */:
        return new Message2(
          cmd,
          this.readObjectId(),
          this.getRestOfBuffer(),
          void 0,
          this.buffer
        );
      case 22 /* BlobUpdate */:
        return new Message2(
          cmd,
          this.readObjectId(),
          {
            blobIndex: this.readUint8(),
            updateSize: this.readUint32(),
            data: this.getRestOfBuffer()
          },
          void 0,
          this.buffer
        );
      case 254 /* LegacyJsonMessage */:
        let jsonText = this.readString();
        if (!jsonText) return void 0;
        let m = Message2.parse(jsonText);
        return m;
      default:
        log.error("Unknown binary message type: ", cmd);
    }
  }
  readTransformUpdate(find, notify) {
    const clientId = this.readClientId();
    const timestamp = this.readDouble();
    var n = 0;
    while (this.bytesRemaining() > 0) {
      const id = this.readVarUInt();
      const transformIndex = this.readVarUInt();
      const obj = find(id);
      const changeMask = this.readUint8();
      let posChanged = (changeMask & 1) !== 0;
      let rotChanged = (changeMask & 2) !== 0;
      let scaleChanged = (changeMask & 4) !== 0;
      let absolute = (changeMask & 8) !== 0;
      let teleport = (changeMask & 16) !== 0;
      let haveParent = (changeMask & 32) !== 0;
      let highPrecision = (changeMask & 64) !== 0;
      if (obj) {
        if (!obj.pos[transformIndex]) {
          obj.pos[transformIndex] = [Number.NaN, Number.NaN, Number.NaN];
          obj.rot[transformIndex] = [0, 0, 0, 1];
          obj.scale[transformIndex] = [1, 1, 1];
        }
        obj.highPrecision = highPrecision;
        if (posChanged) {
          let pos = obj.pos[transformIndex];
          if (absolute) {
            pos = [0, 0, 0];
          } else if (isNaN(pos[0])) {
            log.warn("Update for object with NaN pos: " + id);
            pos = [0, 0, 0];
          }
          obj.pos[transformIndex] = this.readVector3Compressed(pos);
        }
        if (rotChanged) {
          if (absolute) {
            obj.rot[transformIndex] = [0, 0, 0, 1];
          }
          if (highPrecision) {
            obj.rot[transformIndex] = this.readQuaternionCompressedHP([0, 0, 0, 0]);
          } else {
            obj.rot[transformIndex] = this.readQuaternionCompressed();
          }
        }
        if (scaleChanged) {
          if (absolute) {
            obj.scale[transformIndex] = [0, 0, 0];
          }
          obj.scale[transformIndex] = this.readVector3Compressed(obj.scale[transformIndex] || [1, 1, 1]);
        }
        if (haveParent) {
          let parentId = Compression.DecompressVarUInt(this);
          obj.transformParentId[transformIndex] = parentId;
        }
        obj.lastTransformUpdateTime = timestamp;
        if (notify) {
          notify(
            id,
            timestamp,
            transformIndex,
            posChanged ? obj.pos[transformIndex] : void 0,
            rotChanged ? obj.rot[transformIndex] : void 0,
            scaleChanged ? obj.scale[transformIndex] : void 0
          );
        }
      } else {
        log.warn("TransformUpdate for unknown object: " + id);
        if (posChanged) {
          this.readVector3Compressed([0, 0, 0]);
        }
        if (rotChanged) {
          if (highPrecision)
            this.readQuaternionCompressedHP([0, 0, 0, 0]);
          else
            this.readQuaternionCompressed();
        }
        if (scaleChanged) {
          this.readVector3Compressed([0, 0, 0]);
        }
        if (haveParent) {
          Compression.DecompressVarUInt(this);
        }
      }
      n++;
    }
    return timestamp;
  }
  readTypeInfoMessage() {
    var _a;
    const name = this.readString();
    var properties = [];
    while (this.bytesRemaining() > 0) {
      const name2 = this.readString();
      const type_aggregate = ((_a = this.readString()) == null ? void 0 : _a.split("|")) || ["unknown"];
      const type = type_aggregate[0];
      const agg = type_aggregate[1];
      var aggregate = 0 /* NONE */;
      switch (agg) {
        case "SUM":
          aggregate = 1 /* SUM */;
          break;
      }
      properties.push({ name: name2, type, aggregate });
    }
    return new Message2(
      8 /* TypeInfo */,
      0,
      { name, properties },
      void 0,
      this.buffer
    );
  }
  readType(type) {
    switch (type) {
      case "Int32":
        return this.readInt32();
      case "Int16":
        return this.readInt16();
      case "Int8":
        return this.readInt8();
      case "UInt32":
        return this.readUint32();
      case "UInt16":
        return this.readUint16();
      case "UInt8":
        return this.readUint8();
      case "Single":
        return this.readFloat();
      case "Double":
        return this.readDouble();
      case "Boolean":
        return !!this.readUint8();
      case "Vector2":
        return {
          x: this.readFloat(),
          y: this.readFloat()
        };
      case "Vector3":
        return {
          x: this.readFloat(),
          y: this.readFloat(),
          z: this.readFloat()
        };
      case "Color":
        return {
          r: this.readUint8(),
          g: this.readUint8(),
          b: this.readUint8(),
          a: this.readUint8()
        };
      //        return "#" + this.getRestOfBuffer().toString("hex");
      case "PeerStatusKVP":
        return {
          peer: this.readClientId(),
          status: this.readUint8()
        };
      case "NetworkObject":
        return this.readObjectId();
      case "String":
        return this.readString();
    }
    if (type.startsWith("List<")) {
      let subtype = type.substring(5, type.length - 1);
      let length5 = this.readUint16();
      let list = [];
      for (let i = 0; i < length5; i++) {
        let value = this.readType(subtype);
        list.push(value);
      }
      return list;
    }
    if (type.startsWith("Range<")) {
      let subtype = type.substring(6, type.length - 1);
      let min3 = this.readType(subtype);
      let max3 = this.readType(subtype);
      return { min: min3, max: max3 };
    }
    if (type.startsWith("enum/")) {
      let value = this.readUint8();
      return value;
    }
    var s = this.tryReadString();
    if (s) {
      try {
        var r = JSON.parse(s);
        log.trace("Reading unknown type " + type + " JSON: '" + s + "'");
        return r;
      } catch (e) {
        log.trace("Reading unknown type " + type + " string: '" + s + "'");
        return s;
      }
    }
    return this.getRestOfBuffer().toString();
  }
};

// src/SharedObject.ts
init_browser();
var PersistenceLevel = /* @__PURE__ */ ((PersistenceLevel2) => {
  PersistenceLevel2[PersistenceLevel2["Client"] = 0] = "Client";
  PersistenceLevel2[PersistenceLevel2["Scene"] = 1] = "Scene";
  PersistenceLevel2[PersistenceLevel2["Session"] = 2] = "Session";
  PersistenceLevel2[PersistenceLevel2["Persistent"] = 3] = "Persistent";
  return PersistenceLevel2;
})(PersistenceLevel || {});
var _Blob = class _Blob {
  constructor(id, blobIndex, size) {
    this.size = 0;
    this.size = size;
    this.buffer = Buffer.alloc(_Blob.HEADER_SIZE + size);
    this.buffer.fill(128);
    var writer = new NetworkWriter(this.buffer);
    writer.writeUint8(22 /* BlobUpdate */);
    writer.writeObjectId(id);
    writer.writeUint8(blobIndex);
    writer.writeUint32(size);
    writer.writeUint32(0);
    var offset = writer.getBytesWritten();
    if (offset > _Blob.HEADER_SIZE)
      throw new Error("Volume header overflow");
    this.data = this.buffer.subarray(offset, offset + size);
  }
  update(index, data) {
    if (index + data.length > this.data.length) {
      throw new Error("Blob index out of range " + (index + data.length) + " > " + this.data.length);
    }
    data.copy(this.data, index);
  }
};
_Blob.HEADER_SIZE = 32;
var Blob = _Blob;
var SharedObject = class {
  constructor(id, name, typeName) {
    this.linked = false;
    this.links = 0;
    this.properties = /* @__PURE__ */ new Map();
    this.persistence = 0 /* Client */;
    this.pos = [];
    this.scale = [];
    this.rot = [];
    this.highPrecision = false;
    this.transformParentId = [];
    this.lastTransformUpdateTime = 0;
    this.blob = [];
    this.id = id;
    this.name = name;
    this.typeName = typeName;
  }
};

// src/NetworkObject.ts
init_browser();
var NetworkObject = class extends SharedObject {
  constructor() {
    super(...arguments);
    this.owned = false;
    this.expand = true;
    this.children = {};
  }
  destroy() {
    var _a;
    if ((_a = this.parent) == null ? void 0 : _a.children) {
      delete this.parent.children[this.id];
    }
    for (let child of Object.values(this.children)) {
      child.parent = void 0;
    }
  }
  setProperty(index, key, value) {
    this.properties.set(index, value);
    this[key] = value;
  }
  setTransform(time, index, pos, rot, scale5) {
    if (pos) this.pos[index] = pos;
    if (rot) this.rot[index] = rot;
    if (scale5) this.scale[index] = scale5;
  }
  setParent(parent) {
    parent.addChild(this);
    this.parent = parent;
    if (parent.parent) {
      parent.expand = true;
    }
  }
  addChild(child) {
    this.children[child.id] = child;
  }
};

// src/NetworkConnection.ts
init_browser();
init_browser();
var import_buffer3 = __toESM(require_buffer());

// node_modules/eventemitter3/index.mjs
init_browser();
var import_index = __toESM(require_eventemitter3(), 1);
var eventemitter3_default = import_index.default;

// src/NetworkConnection.ts
var NetworkConnection = class extends import_index.default {
  constructor(webSocketPath) {
    super();
    this.connected = false;
    this.closing = false;
    this.lastError = void 0;
    this.myId = void 0;
    this.ready = false;
    this.time = -1;
    this.myIdSpace = -1;
    this.myIdSpaceMax = -1;
    this.localPeerId = -1;
    this.objects = /* @__PURE__ */ new Map();
    this.objectsByUid = /* @__PURE__ */ new Map();
    this.peers = {};
    this.types = {};
    this.typeIndex = {};
    this.immediatelyUnlinkObjects = true;
    this.objectFactories = /* @__PURE__ */ new Map();
    this.peerMessageHandlers = {};
    this.bufferedPeerMessages = {};
    this.objectAppearedHandlers = {};
    this.waitingForIdCallbacks = [];
    this.webSocketPath = webSocketPath;
  }
  registerObjectFactory(typeName, factory) {
    this.objectFactories.set(typeName, factory);
  }
  createObject(id, name, typeName, linked = false) {
    log.trace("Create object", id, name, typeName);
    if (this.objects.get(id)) {
      console.error("Object", id, "already exists");
      return;
    }
    let factory = this.objectFactories.get(typeName);
    let o;
    if (factory) {
      o = factory(id, name, typeName, this);
    } else {
      o = new NetworkObject(id, name, typeName);
    }
    this.objects.set(id, o);
    o.linked = linked;
    if (linked) {
      let split = name.split("/");
      if (split.length > 1) {
        let parentId = parseInt(split[0]);
        let parent = this.objects.get(parentId);
        if (parent) {
          o.setParent(parent);
        } else {
          console.warn("Parent", name, "/", split[0], "not found");
          this.WhenObjectAppears(parentId, (parent2) => {
            o.setParent(parent2);
          });
        }
      }
    }
    return o;
  }
  WhenObjectAppears(id, callback) {
    if (!this.objectAppearedHandlers[id]) this.objectAppearedHandlers[id] = [];
    this.objectAppearedHandlers[id].push(callback);
  }
  ObjectAppeared(id, obj) {
    if (this.objectAppearedHandlers[id]) {
      this.objectAppearedHandlers[id].forEach((callback) => callback(obj));
      delete this.objectAppearedHandlers[id];
    }
  }
  linkObject(id, type, typeName = void 0) {
    let o = this.objects.get(id);
    if (o) {
      log.trace("Link Object", id, "already exists");
      return o;
    }
    o = this.createObject(id, type || "_invalid", typeName || "_invalid", true);
    if (this.immediatelyUnlinkObjects) {
      this.send_deleteObject(id, false);
    }
    return o;
  }
  deleteObject(id) {
    let obj = this.objects.get(id);
    if (obj) {
      obj.destroy();
      this.objects.delete(id);
      this.emit("objectDeleted", id);
    }
  }
  lockObject(id, client) {
    let obj = this.objects.get(id);
    if (obj) {
      if (obj.lockedBy) {
        log.debug(
          "Client",
          client,
          "tried to lock object",
          id,
          "but it was locked by",
          obj.lockedBy
        );
        return;
      }
      obj.lockedBy = client;
    }
  }
  unlockObject(id, client) {
    let obj = this.objects.get(id);
    if (obj) {
      obj.lockedBy = void 0;
    }
  }
  setProperty(id, property, value) {
    let obj = this.objects.get(id);
    if (obj) {
      let v = value;
      let objtype = this.types[obj.typeName];
      if (v instanceof import_buffer3.Buffer) {
        let info = objtype && objtype[property] ? objtype[property] : void 0;
        if (info) {
          let reader = new NetworkReader(v);
          v = reader.readType(info.type);
          if (info.name == "parent") {
            let parent = this.objects.get(v);
            if (parent) {
              obj.setParent(parent);
            } else if (v == 0) {
              if (obj.parent) {
                console.warn("Should reset parent of object", id, " - NYI");
              }
            } else {
              console.error("Parent for", id, obj.name, ":", v, "not found");
            }
          }
          this.setObjectProperty(obj, property, info, v);
          this.emit("setProperty", { object: obj, propertyName: info.name, value: v });
        } else {
          v = v.toString("hex");
        }
      }
    } else {
      console.error("Object", id, "not found");
    }
  }
  handleTransformUpdate(msg) {
    const reader = new NetworkReader(msg.value);
    reader.readTransformUpdate(
      (id) => this.objects.get(id),
      (id, time, index, pos, rot, scale5) => {
        let obj = this.objects.get(id);
        if (obj) {
          obj.setTransform(time, index, pos, rot, scale5);
        }
      }
    );
  }
  handleRegister(msg) {
    const reader = new NetworkReader(msg.value);
    const name = reader.readString() || "";
    const typeName = reader.readString() || "";
    var flags = reader.readUint8();
    var persistence = flags & 15;
    var hasOwner = (flags & 128) != 0;
    var hasLockedBy = (flags & 64) != 0;
    var isLinked = (flags & 32) != 0;
    var owner = 0;
    if (hasOwner) owner = reader.readClientId();
    var lockedBy;
    if (hasLockedBy) lockedBy = reader.readClientId();
    var obj;
    if (isLinked) {
      log.trace("Link object with id", msg.id, typeName);
      obj = this.linkObject(msg.id, name, typeName);
    } else {
      log.trace("Registering object with id", msg.id, typeName);
      obj = this.createObject(msg.id, name, typeName);
    }
    if (obj) {
      log.trace("Registered object", obj.id, obj.name, obj.typeName);
    } else {
      log.error("Invalid object registration", msg.id, name, typeName);
      return;
    }
    if (hasLockedBy && lockedBy) this.lockObject(obj.id, lockedBy);
    var transformCount = reader.readVarUInt();
    if (transformCount > 0) {
      obj.lastTransformUpdateTime = reader.readDouble();
      for (var i = 0; i < transformCount; i++) {
        var index = reader.readVarUInt();
        var highPrecision = reader.readUint8() != 0;
        var pos = reader.readVector3Compressed([0, 0, 0]);
        var rot = highPrecision ? reader.readQuaternionCompressedHP([0, 0, 0, 0]) : reader.readQuaternionCompressed();
        var scale5 = reader.readVector3Compressed([0, 0, 0]);
        obj.highPrecision = highPrecision;
        obj.setTransform(0, index, pos, rot, scale5);
        obj.transformParentId[index] = reader.readVarUInt();
      }
    }
    let objtype = this.types[obj.typeName];
    if (!objtype) {
      log.warn("Register object with unknown type " + obj.typeName + ", ignoring...");
      return;
    }
    var properties = [];
    while (reader.bytesRemaining() > 0) {
      const index2 = reader.readVarUInt();
      let info = objtype && objtype[index2] ? objtype[index2] : void 0;
      if (info) {
        var v = reader.readType(info.type);
        this.setObjectProperty(obj, index2, info, v);
      } else {
        log.error("No type info for", obj.typeName, "property #" + index2);
        return;
      }
    }
    this.emit("objectCreated", obj);
    if (obj) {
      this.ObjectAppeared(obj.id, obj);
    }
    return obj;
  }
  setObjectProperty(obj, index, info, v) {
    if (info.name == "uid") {
      if (obj.uid) {
        this.objectsByUid.delete(obj.uid);
      }
      this.objectsByUid.set(v, obj);
      obj.setProperty(index, info.name, v);
      if (v != null) this.emit("fixtureAppeared", obj);
    } else {
      obj.setProperty(index, info.name, v);
    }
  }
  /*
    setObjectPropertyByName(obj:NetworkObject, propertyName:string, v:any) {
      var type = this.types[obj.typeName];
      if (!type) {
        log.warn("setObjectPropertyByName: object with unknown type "+obj.typeName+", ignoring...");
        return;
      }
  
      for (let i = 0; i < type.length; i++) {
        if (type[i].name == propertyName) {
          log.debug("setObjectPropertyByName: setting property", propertyName, "on object", obj.id, "with value", v, "prop index", i);
        XXX this.setObjectProperty(obj, i, type[i], v);
          return;
        }
      }
    }
  */
  handleTypeInfo(msg) {
    const name = msg.value.name;
    const properties = msg.value.properties;
    this.saveTypeRegistration(name, properties);
  }
  registerType(name, properties) {
    this.saveTypeRegistration(name, properties);
    var m = this.createTypeInfoMessage(name, properties);
    this.sendMessage(m);
  }
  saveTypeRegistration(name, properties) {
    let index = {};
    for (let i = 0; i < properties.length; i++) {
      index[properties[i].name] = i;
    }
    this.typeIndex[name] = index;
    this.types[name] = properties;
  }
  /*
  function setPersistence(id: number, value: PersistencLevel) {
    let obj = objects[id];
    if (obj) {
      obj.persistence = value;
    } else {
      console.error('Object', id, 'not found');
    }
  }
  */
  setOwner(id, value) {
    let obj = this.objects.get(id);
    if (obj) {
      obj.owner = value;
      obj.owned = value == this.myId;
    } else {
      console.error("Object", id, "not found");
    }
  }
  handle(msg, socket) {
    return __async(this, null, function* () {
      switch (msg.cmd) {
        case 1 /* SetId */:
          this.myId = msg.id;
          break;
        case 3 /* AssignIdSpace */:
          this.myIdSpace = msg.id;
          this.myIdSpaceMax = this.myIdSpace + msg.value;
          if (this.waitingForIdCallbacks.length) {
            var cbs = this.waitingForIdCallbacks;
            this.waitingForIdCallbacks = [];
            cbs.forEach((cb) => {
              this.getNextId(cb);
            });
          }
          break;
        case 4 /* Ready */:
          this.ready = true;
          this.emit("ready");
          break;
        case 21 /* Register */:
          this.handleRegister(msg);
          return;
        case 12 /* Delete */:
          this.deleteObject(msg.id);
          break;
        case 13 /* Lock */:
          this.lockObject(msg.id, parseInt(msg.value));
          break;
        case 14 /* Unlock */:
          this.unlockObject(msg.id, parseInt(msg.value));
          break;
        case 15 /* SetProperty */:
          if (msg.property !== void 0)
            this.setProperty(msg.id, msg.property, msg.value);
          else console.error("Property not set", msg);
          break;
        case 17 /* SetOwner */:
          this.setOwner(msg.id, msg.value);
          break;
        case 18 /* PeerMessage */:
          yield this.handlePeerMessage(msg.id, msg.value);
          break;
        case 5 /* Ping */:
          socket.send(JSON.stringify(new Message2(6 /* Pong */, msg.id)));
          break;
        case 6 /* Pong */:
          log.debug("PONG received, ignored.");
          break;
        case 7 /* Time */:
          this.time = msg.value;
          break;
        case 20 /* TransformUpdate */:
          this.handleTransformUpdate(msg);
          break;
        case 8 /* TypeInfo */:
          this.handleTypeInfo(msg);
          break;
        default:
          console.error("- Unknown command", msg.cmd);
          return;
      }
    });
  }
  connect() {
    this.socket = new browser_default(this.webSocketPath);
    this.socket.binaryType = "arraybuffer";
    this.socket.onopen = () => {
      this.connected = true;
      this.lastError = void 0;
      this.emit("connect");
    };
    this.socket.onmessage = (m) => __async(this, null, function* () {
      let data = m.data;
      let reader = new NetworkReader(import_buffer3.Buffer.from(data));
      try {
        let msg = reader.readMessage();
        if (!msg) {
          console.warn("Failed to parse binary message");
          return;
        }
        this.handle(msg, this.socket);
      } catch (err) {
        log.debug(
          "Failed to parse binary message (length " + data.byteLength + ")",
          err
        );
      }
    });
    this.socket.onclose = (e) => {
      log.debug("disconnected", e);
      this.connected = false;
      this.clear();
      this.emit("disconnect");
      if (this.closing) return;
      this.reconnect();
    };
    this.socket.onerror = (e) => {
      this.lastError = "Websocket Error";
    };
  }
  reconnect() {
    setTimeout(() => {
      this.connect();
    }, 1e3);
  }
  close() {
    this.closing = true;
    this.socket.close();
  }
  clear() {
    this.objects = /* @__PURE__ */ new Map();
  }
  sendAndHandle(msg) {
    this.handle(msg, this.socket);
    this.sendMessage(msg);
  }
  sendMessage(msg) {
    let m = msg.getBuffer();
    this.socket.send(m);
  }
  getNextId(cb) {
    if (!this.connected) {
      this.waitingForIdCallbacks.push(cb);
      return;
    }
    if (this.myIdSpace >= this.myIdSpaceMax) {
      console.log("ID space exhausted; requesting more IDs");
      let msg = new Message2(2 /* RequestIdSpace */, 0);
      this.sendMessage(msg);
      this.waitingForIdCallbacks.push(cb);
      return;
    }
    cb(this.myIdSpace++);
  }
  createRegisterMessage(obj, sendTransformsAndProperties = true) {
    const buf = import_buffer3.Buffer.alloc(1024);
    const writer = new NetworkWriter(buf);
    writer.writeObjectId(obj.id);
    writer.writeString(obj.name);
    writer.writeString(obj.typeName);
    var flags = obj.persistence & 15;
    if (obj.owner) flags |= 128;
    if (obj.lockedBy) flags |= 64;
    if (obj.linked) flags |= 32;
    log.trace("createRegisterMessage", obj.id, obj.name, obj.typeName, "persistence:", obj.persistence, "flags:", flags, "owner:", obj.owner);
    writer.writeUint8(flags);
    if (obj.owner) writer.writeClientId(obj.owner || 0);
    if (obj.lockedBy) writer.writeClientId(obj.lockedBy || 0);
    if (sendTransformsAndProperties) {
      var transformCount = obj.pos.length;
      writer.writeVarUInt(transformCount);
      if (transformCount > 0) {
        writer.writeDouble(obj.lastTransformUpdateTime);
      }
      for (var i = 0; i < obj.pos.length; i++) {
        writer.writeVarUInt(i);
        writer.writeVarUInt(obj.highPrecision ? 1 : 0);
        writer.writeVector3Long(obj.pos[i]);
        if (obj.highPrecision) {
          writer.writeQuaternionCompressed(obj.rot[i]);
        } else {
          writer.writeQuaternionCompressedHP(obj.rot[i]);
        }
        writer.writeVector3Long(obj.scale[i]);
      }
      let objtype = this.types[obj.typeName];
      for (let [key, value] of obj.properties) {
        let info = objtype && objtype[key] ? objtype[key] : void 0;
        if (info) {
          try {
            writer.writeVarUInt(key);
            writer.writeType(info.type, value);
          } catch (e) {
            log.error("Error writing property", obj.id, key, value, info, e);
          }
        } else {
          throw new Error("No type info for " + obj.typeName + " property #" + key);
        }
      }
    } else {
      writer.writeVarUInt(0);
    }
    return new Message2(21 /* Register */, obj.id, writer.getSubBuffer());
  }
  createSetPropertyMessage(typeName, id, property, value) {
    let typeIndex = this.typeIndex[typeName];
    if (!typeIndex) throw "Unknown type " + typeName;
    let propertyIndex = typeIndex[property];
    if (propertyIndex == void 0) throw "Unknown property " + property;
    let type = this.types[typeName][propertyIndex];
    let writer = new NetworkWriter(import_buffer3.Buffer.alloc(128));
    writer.writeType(type.type, value);
    let msg = new Message2(
      15 /* SetProperty */,
      id,
      writer.getSubBuffer(),
      propertyIndex
    );
    return msg;
  }
  sendTakeOwnershipMesssage(obj) {
    let msg = new Message2(17 /* SetOwner */, obj.id, this.myId);
    this.sendMessage(msg);
  }
  sendSetProperty(obj, propertyName, value) {
    let msg = this.createSetPropertyMessage(obj.typeName, obj.id, propertyName, value);
    this.sendMessage(msg);
  }
  createTypeInfoMessage(name, properties) {
    var size = NetworkWriter.calculateTypeInfoMessageSize(name, properties);
    var buf = import_buffer3.Buffer.alloc(size);
    var writer = new NetworkWriter(buf);
    writer.writeTypeInfoMessage(name, properties);
    let msg = new Message2(8 /* TypeInfo */, 0, null, void 0, buf);
    return msg;
  }
  send_deleteObject(id, deleteLocally = true) {
    let msg = new Message2(12 /* Delete */, id);
    this.sendMessage(msg);
    if (deleteLocally) this.deleteObject(id);
  }
  sendPeerMessage(id, message) {
    let msg = new Message2(18 /* PeerMessage */, id, JSON.stringify(message));
    this.sendMessage(msg);
  }
  registerPeerMessageHandler(id, handler) {
    if (this.peerMessageHandlers[id]) {
      throw "Already registered handler for peer " + id;
    }
    this.peerMessageHandlers[id] = handler;
    if (this.bufferedPeerMessages[id]) {
      let messages = this.bufferedPeerMessages[id];
      delete this.bufferedPeerMessages[id];
      messages.forEach((message) => {
        handler(message);
      });
    }
  }
  unregisterPeerMessageHandler(id) {
    delete this.peerMessageHandlers[id];
  }
  handlePeerMessage(id, m) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d;
      let message = JSON.parse(m);
      if ((_a = message.description) == null ? void 0 : _a.type)
        log.debug("Peer message from " + id, (_b = message.description) == null ? void 0 : _b.type, message);
      if (this.peerMessageHandlers[id])
        yield this.peerMessageHandlers[id](message);
      else {
        if ((_c = message.description) == null ? void 0 : _c.type)
          log.debug("buffering message for " + id, (_d = message.description) == null ? void 0 : _d.type);
        if (!this.bufferedPeerMessages[id]) this.bufferedPeerMessages[id] = [];
        this.bufferedPeerMessages[id].push(message);
      }
    });
  }
};

// src/clients/ControlClient.ts
init_browser();

// src/clients/NetworkNavigationInvitePose.ts
init_browser();
var _NetworkNavigationInvitePose = class _NetworkNavigationInvitePose extends NetworkObject {
  constructor(id, name, typeName) {
    super(id, name, typeName);
    this.id = id;
  }
  setProperty(index, key, value) {
    super.setProperty(index, key, value);
    this[key] = value;
  }
  static create(id, transform) {
    var obj = new _NetworkNavigationInvitePose(id, "NetworkNavigationInvitePose", "NetworkNavigationInvitePose");
    obj.setProperty(0, "inviteTransform", transform);
    obj.setProperty(1, "invitorName", "Test");
    obj.setProperty(2, "creationTime", (/* @__PURE__ */ new Date()).toString());
    return obj;
  }
};
_NetworkNavigationInvitePose.TypeInfo = [
  {
    name: "inviteTransform",
    type: "SimpleTransform"
  },
  {
    name: "invitorName",
    type: "String"
  },
  {
    name: "creationTime",
    type: "String"
  },
  {
    name: "navigationGroup",
    type: "String"
  },
  {
    name: "inviteType",
    type: "enum/InviteType"
  },
  {
    name: "acceptanceType",
    type: "enum/AcceptanceType"
  },
  {
    name: "enableVisualization",
    type: "Boolean"
  }
];
var NetworkNavigationInvitePose = _NetworkNavigationInvitePose;

// src/clients/POIChangeRequest.ts
init_browser();
var _POIChangeRequest = class _POIChangeRequest extends NetworkObject {
  constructor(id, name, typeName, _connection) {
    super(id, name, typeName);
    this.id = id;
    this.connection = _connection;
    if (name == "POIController" && id != 0) _POIChangeRequest.POIController = this;
  }
  setProperty(index, key, value) {
    super.setProperty(index, key, value);
    this[key] = value;
  }
  setPropertyByName(propertyName, value) {
    this.connection.sendTakeOwnershipMesssage(this);
    this.connection.sendSetProperty(this, propertyName, value);
  }
  static create(id, name, connection) {
    var obj = new _POIChangeRequest(id, name, "POIChangeRequest", connection);
    return obj;
  }
};
_POIChangeRequest.TypeInfo = [
  {
    "name": "targetPoiTitle",
    "type": "String",
    "aggregate": 0
  },
  {
    "name": "visibility",
    "type": "String",
    "aggregate": 0
  },
  {
    "name": "lastDBUpdateTimestamp",
    "type": "Double",
    "aggregate": 0
  }
];
var POIChangeRequest = _POIChangeRequest;

// src/clients/WebView.ts
init_browser();
var _WebView = class _WebView extends NetworkObject {
  constructor(id, name, typeName) {
    super(id, name, typeName);
    this.id = id;
    log.debug("+++ CREATE WebView", id);
    _WebView.allWebViews.push(this);
  }
  setProperty(index, key, value) {
    super.setProperty(index, key, value);
    this[key] = value;
  }
  static create(id, url, positioningMode = 0, width = 300, height = 200, transform = void 0, role = void 0) {
    var obj = new _WebView(id, "WebView", "WebView");
    obj.setProperty(0, "url", url);
    obj.setProperty(2, "showHeader", false);
    obj.setProperty(3, "positioningMode", positioningMode);
    obj.setProperty(6, "width", width);
    obj.setProperty(8, "height", height);
    if (transform != null) obj.setProperty(4, "initialTransform", transform);
    if (role != null) obj.setProperty(5, "roleFilter", role);
    return obj;
  }
  destroy() {
    log.debug("+++ DESTROY WebView", this.id);
    var self2 = this;
    _WebView.allWebViews = _WebView.allWebViews.filter((v) => v == self2);
    super.destroy();
  }
};
_WebView.allWebViews = [];
_WebView.TypeInfo = [
  {
    "name": "url",
    "type": "String",
    "aggregate": 0
  },
  {
    "name": "siblingIndex",
    "type": "Int32",
    "aggregate": 0
  },
  {
    "name": "showHeader",
    "type": "Boolean",
    "aggregate": 0
  },
  {
    "name": "positioningMode",
    "type": "enum/PositioningMode",
    "aggregate": 0
  },
  {
    "name": "initialTransform",
    "type": "SimpleTransform",
    "aggregate": 0
  },
  {
    "name": "roleFilter",
    "type": "String",
    "aggregate": 0
  },
  {
    "name": "width",
    "type": "Single",
    "aggregate": 0
  },
  {
    "name": "title",
    "type": "String",
    "aggregate": 0
  },
  {
    "name": "height",
    "type": "Single",
    "aggregate": 0
  },
  {
    "name": "uid",
    "type": "String",
    "aggregate": 0
  }
];
var WebView = _WebView;

// src/clients/ControlClient.ts
var ControlClient = class {
  constructor(webSocketPath) {
    this.eventEmitter = new eventemitter3_default();
    this.eventEmitter = new eventemitter3_default();
    this.connection = new NetworkConnection(webSocketPath);
    this.connection.immediatelyUnlinkObjects = false;
    this.connection.registerObjectFactory(
      "POIChangeRequest",
      (id, name, typeName, connection) => {
        return new POIChangeRequest(id, name, typeName, connection);
      }
    );
    this.connection.registerObjectFactory(
      "WebView",
      (id, name, typeName, connection) => {
        return new WebView(id, name, typeName);
      }
    );
    this.connection.on("connect", () => {
      log.info("Connected");
      this.connection.registerType("NetworkNavigationInvitePose", NetworkNavigationInvitePose.TypeInfo);
      this.connection.registerType("POIChangeRequest", POIChangeRequest.TypeInfo);
      this.connection.registerType("WebView", WebView.TypeInfo);
    });
    this.connection.on("disconnect", () => {
      log.info("Disconnected");
    });
    this.connection.on("update", (e) => {
      log.info("position update: " + e);
    });
    this.connection.connect();
  }
  on(eventName, listener) {
    this.eventEmitter.on(eventName, listener);
    return this;
  }
  close() {
    this.connection.close();
  }
  createPOIController() {
    this.connection.getNextId((id) => {
      id = 0;
      var o = POIChangeRequest.create(id, "POIController", this.connection);
      o.linked = true;
      var m = this.connection.createRegisterMessage(o);
      this.connection.sendMessage(m);
    });
  }
  createInvite(transform) {
    this.connection.getNextId((id) => {
      var o = NetworkNavigationInvitePose.create(id, transform);
      var m = this.connection.createRegisterMessage(o);
      this.connection.sendMessage(m);
    });
  }
  createWebView(url, positioningMode = 0, width = 300, height = 200, transform = void 0, role = void 0) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.getNextId((id) => {
          var o = WebView.create(id, url, positioningMode, width, height, transform, role);
          o.persistence = 1 /* Scene */;
          var m = this.connection.createRegisterMessage(o);
          this.connection.sendMessage(m);
          resolve(o);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  deleteAllWebViews() {
    for (var webView of WebView.allWebViews) {
      this.deleteObject(webView);
      webView.destroy();
    }
  }
  deleteObject(o) {
    this.connection.send_deleteObject(o.id, true);
  }
  setTargetPoi(title) {
    POIChangeRequest.POIController.setPropertyByName("targetPoiTitle", title);
  }
  reloadPois() {
    POIChangeRequest.POIController.setPropertyByName("lastDBUpdateTimestamp", this.connection.time);
  }
  setVisibility(visibility) {
    POIChangeRequest.POIController.setPropertyByName("visibility", visibility);
  }
  /*
  createPoiChangeRequest() : Promise<POIChangeRequest> {
    return new Promise((resolve, reject) => {
      try {
        this.connection.getNextId((id)=>{
          var o = POIChangeRequest.create(id, this.connection);
          var m = this.connection.createRegisterMessage(o);
          this.connection.sendMessage(m);
          resolve(o);  // Resolve with the created object
        });
      } catch (error) {
        reject(error);  // Handle any potential error
      }
    });
  }        
  */
};

// src/clients/HeadPositionClient.ts
init_browser();

// src/clients/Avatar.ts
init_browser();
var Avatar = class extends NetworkObject {
  constructor(id, name, typeName, eventEmitter) {
    super(id, name, typeName);
    this.color = "#000000";
    this.userName = "";
    this.head = void 0;
    this.space = void 0;
    this.platform = void 0;
    this.combinedPos = new Float32Array(3);
    this.combinedRot = new Float32Array(4);
    this.id = id;
    this.eventEmitter = eventEmitter;
    log.debug("Avatar created");
  }
  setProperty(index, key, value) {
    super.setProperty(index, key, value);
    this[key] = value;
  }
  addChild(child) {
    var _a, _b, _c;
    super.addChild(child);
    let childName = child.name.split("/").pop();
    log.trace("Avatar child added: " + childName);
    if (childName == null ? void 0 : childName.startsWith("Platform")) {
      console.log("Platform child added.");
      this.platform = child;
      (_a = this.platform.eventEmitter) == null ? void 0 : _a.on("update", (_h) => {
        this.updateTransform();
      });
    }
    if (childName == null ? void 0 : childName.startsWith("Head")) {
      console.log("Head child added.");
      this.head = child;
      (_b = this.head.eventEmitter) == null ? void 0 : _b.on("update", (_h) => {
        this.updateTransform();
      });
    }
    if (childName == null ? void 0 : childName.startsWith("TrackingSpaceOffset")) {
      console.log("TrackingSpaceOffset child added.");
      this.space = child;
      (_c = this.space.eventEmitter) == null ? void 0 : _c.on("update", (_h) => {
      });
    }
  }
  updateTransform() {
    if (this.head == null || this.platform == null) return;
    if (this.head.pos.length < 1 || this.platform.pos.length < 1) return;
    var platformPos = this.platform.pos[0];
    var platformRot = this.platform.rot[0];
    var headPos = this.head.pos[0];
    var headRot = this.head.rot[0];
    const platformTransform = quat2_exports.create();
    quat2_exports.fromRotationTranslation(platformTransform, platformRot, platformPos);
    const headTransform = quat2_exports.create();
    quat2_exports.fromRotationTranslation(headTransform, headRot, headPos);
    var combinedTransform1;
    if (this.space != null && this.space.pos.length > 0) {
      var spacePos = this.space.pos[0];
      var spaceRot = this.space.rot[0];
      const spaceTransform = quat2_exports.create();
      quat2_exports.fromRotationTranslation(spaceTransform, spaceRot, spacePos);
      combinedTransform1 = quat2_exports.create();
      quat2_exports.multiply(combinedTransform1, platformTransform, spaceTransform);
    } else {
      combinedTransform1 = platformTransform;
    }
    const combinedTransform = quat2_exports.create();
    quat2_exports.multiply(combinedTransform, combinedTransform1, headTransform);
    quat2_exports.getTranslation(this.combinedPos, combinedTransform);
    quat_exports.copy(this.combinedRot, combinedTransform);
    this.eventEmitter.emit("updateAvatar", this);
  }
};
Avatar.TypeInfo = [
  {
    "name": "color",
    "type": "Color"
  },
  {
    "name": "transparency",
    "type": "Single"
  },
  {
    "name": "layerMask",
    "type": "Int32"
  },
  {
    "name": "userName",
    "type": "String"
  },
  {
    "name": "assetPath",
    "type": "String"
  },
  {
    "name": "handTrackingState",
    "type": "Int32"
  }
];

// src/clients/NetworkTransformObject.ts
init_browser();
var NetworkTransformObject = class extends NetworkObject {
  constructor(id, name, typeName) {
    super(id, name, typeName);
    this.id = id;
    this.eventEmitter = new eventemitter3_default();
  }
  setTransform(time, index, pos, rot, scale5) {
    super.setTransform(time, index, pos, rot, scale5);
    this.eventEmitter.emit("update", this);
  }
};
NetworkTransformObject.TypeInfo = [];

// src/clients/HeadPositionClient.ts
var HeadPositionClient = class {
  constructor(webSocketPath) {
    this.eventEmitter = new eventemitter3_default();
    this.eventEmitter = new eventemitter3_default();
    this.connection = new NetworkConnection(webSocketPath);
    this.connection.on("connect", () => {
      this.connection.registerType("Avatar", Avatar.TypeInfo);
      this.connection.registerObjectFactory(
        "Avatar",
        (id, name, typeName, _connection) => {
          return new Avatar(id, name, typeName, this.eventEmitter);
        }
      );
      this.connection.registerType("NetworkLocalTransformObject", NetworkTransformObject.TypeInfo);
      this.connection.registerObjectFactory(
        "NetworkLocalTransformObject",
        (id, name, typeName, _connection) => {
          return new NetworkTransformObject(id, name, typeName);
        }
      );
    });
    this.connection.connect();
  }
  on(eventName, listener) {
    this.eventEmitter.on(eventName, listener);
    return this;
  }
  close() {
    this.connection.close();
  }
};
export {
  AggregateType,
  AggregateTypeNames,
  Blob,
  Command,
  ControlClient,
  HeadPositionClient,
  Message2 as Message,
  NetworkConnection,
  NetworkObject,
  NetworkReader,
  NetworkWriter,
  PersistenceLevel,
  SharedObject,
  log
};
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
