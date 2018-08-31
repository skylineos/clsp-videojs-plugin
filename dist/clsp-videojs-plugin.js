/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./dist/Router.min.js":
/*!****************************!*\
  !*** ./dist/Router.min.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, n) {
  if ("object" == ( false ? undefined : _typeof(exports)) && "object" == ( false ? undefined : _typeof(module))) module.exports = n();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (n),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else { var o, t; }
}(window, function () {
  return function (e) {
    var n = {};function t(o) {
      if (n[o]) return n[o].exports;var r = n[o] = { i: o, l: !1, exports: {} };return e[o].call(r.exports, r, r.exports, t), r.l = !0, r.exports;
    }return t.m = e, t.c = n, t.d = function (e, n, o) {
      t.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: o });
    }, t.r = function (e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
    }, t.t = function (e, n) {
      if (1 & n && (e = t(e)), 8 & n) return e;if (4 & n && "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && e && e.__esModule) return e;var o = Object.create(null);if (t.r(o), Object.defineProperty(o, "default", { enumerable: !0, value: e }), 2 & n && "string" != typeof e) for (var r in e) {
        t.d(o, r, function (n) {
          return e[n];
        }.bind(null, r));
      }return o;
    }, t.n = function (e) {
      var n = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };return t.d(n, "a", n), n;
    }, t.o = function (e, n) {
      return Object.prototype.hasOwnProperty.call(e, n);
    }, t.p = "", t(t.s = 0);
  }([function (e, n, t) {
    e.exports = t(1);
  }, function (e, n, t) {
    "use strict";
    t.r(n), n.default = function () {
      return { clspRouter: function clspRouter() {
          var e = window.parent.videojs.getPlugin("clsp").conduits.getById(window.MqttClientId).iov;function n(n) {
            n.clientId = e.id, window.parent.postMessage(n, "*");
          }function t(e) {
            var t = e.data;try {
              if ("subscribe" === t.method) window.MQTTClient.subscribe(t.topic);else if ("unsubscribe" === t.method) window.MQTTClient.unsubscribe(t.topic);else if ("publish" === t.method) {
                var o = null;try {
                  o = JSON.stringify(t.data);
                } catch (e) {
                  return void console.error("json stringify error: " + t.data);
                }var r = new window.parent.Paho.Message(o);r.destinationName = t.topic, window.MQTTClient.send(r);
              }
            } catch (e) {
              n({ event: "fail", reason: "network failure" });try {
                window.MQTTClient.disconnect();
              } catch (e) {
                console.error(e);
              }
            }
          }function o() {
            window.addEventListener ? window.addEventListener("message", t, !1) : window.attachEvent && window.attachEvent("onmessage", t), n({ event: "ready" }), -1 !== a && (clearInterval(a), a = -1);
          }function r(e) {
            n({ event: "fail", reason: "Error code " + parseInt(e.errorCode) + ": " + e.errorMessage });
          }function i() {
            var t = { timeout: 120, onSuccess: o, onFailure: r },
                i = new window.parent.Paho.Message(JSON.stringify({ clientId: e.id }));i.destinationName = "iov/clientDisconnect", t.willMessage = i, !0 === e.config.useSSL && (t.useSSL = !0);try {
              window.MQTTClient.connect(t);
            } catch (e) {
              console.error("connect failed", e), n({ event: "fail", reason: "connect failed" });
            }
          }try {
            window.window.MQTTClient = new window.parent.Paho.Client(e.config.wsbroker, e.config.wsport, e.id);var a = -1;window.MQTTClient.onConnectionLost = function (e) {
              n({ event: "fail", reason: "connection lost error code " + parseInt(e.errorCode) }), -1 === a && (a = setInterval(function () {
                return i();
              }, 2e3));
            }, window.MQTTClient.onMessageArrived = function (e) {
              try {
                !function (e) {
                  var t = "";try {
                    t = e.payloadString;
                  } catch (e) {}n({ event: "data", destinationName: e.destinationName, payloadString: t, payloadBytes: e.payloadBytes || null });
                }(e);
              } catch (e) {
                e && console.error(e);
              }
            }, i();
          } catch (e) {
            console.error("IFRAME error"), console.error(e);
          }
        }, onunload: function onunload() {
          void 0 !== window.MQTTClient && window.MQTTClient.disconnect();
        } };
    };
  }]);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/debug/src/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
  // is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
  // is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
  // double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === (typeof console === 'undefined' ? 'undefined' : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch (e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch (e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node-libs-browser/node_modules/process/browser.js */ "./node_modules/node-libs-browser/node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/debug/src/debug.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/debug.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0,
      i;

  for (i in namespace) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy() {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

/***/ }),

/***/ "./node_modules/global/document.js":
/*!*****************************************!*\
  !*** ./node_modules/global/document.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
var minDoc = __webpack_require__(/*! min-document */ 1);

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var _Symbol = root.Symbol;

module.exports = _Symbol;

/***/ }),

/***/ "./node_modules/lodash/_apply.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/_apply.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

/***/ }),

/***/ "./node_modules/lodash/_arrayLikeKeys.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayLikeKeys.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ "./node_modules/lodash/_baseTimes.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "./node_modules/lodash/isBuffer.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "./node_modules/lodash/isTypedArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
    if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

module.exports = baseGetTag;

/***/ }),

/***/ "./node_modules/lodash/_baseIsArguments.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

/***/ }),

/***/ "./node_modules/lodash/_baseIsNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "./node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

/***/ }),

/***/ "./node_modules/lodash/_baseIsTypedArray.js":
/*!**************************************************!*\
  !*** ./node_modules/lodash/_baseIsTypedArray.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

/***/ }),

/***/ "./node_modules/lodash/_baseKeysIn.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseKeysIn.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ "./node_modules/lodash/_isPrototype.js"),
    nativeKeysIn = __webpack_require__(/*! ./_nativeKeysIn */ "./node_modules/lodash/_nativeKeysIn.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

/***/ }),

/***/ "./node_modules/lodash/_baseRest.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseRest.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js"),
    overRest = __webpack_require__(/*! ./_overRest */ "./node_modules/lodash/_overRest.js"),
    setToString = __webpack_require__(/*! ./_setToString */ "./node_modules/lodash/_setToString.js");

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;

/***/ }),

/***/ "./node_modules/lodash/_baseSetToString.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseSetToString.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(/*! ./constant */ "./node_modules/lodash/constant.js"),
    defineProperty = __webpack_require__(/*! ./_defineProperty */ "./node_modules/lodash/_defineProperty.js"),
    identity = __webpack_require__(/*! ./identity */ "./node_modules/lodash/identity.js");

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function (func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;

/***/ }),

/***/ "./node_modules/lodash/_baseTimes.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseTimes.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

/***/ }),

/***/ "./node_modules/lodash/_baseUnary.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseUnary.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

module.exports = baseUnary;

/***/ }),

/***/ "./node_modules/lodash/_coreJsData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

/***/ }),

/***/ "./node_modules/lodash/_defineProperty.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_defineProperty.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

var defineProperty = function () {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

module.exports = defineProperty;

/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/lodash/_getNative.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "./node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "./node_modules/lodash/_getValue.js");

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

/***/ }),

/***/ "./node_modules/lodash/_getValue.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

/***/ }),

/***/ "./node_modules/lodash/_isIndex.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_isIndex.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

/***/ }),

/***/ "./node_modules/lodash/_isIterateeCall.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_isIterateeCall.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "./node_modules/lodash/_isIndex.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index === 'undefined' ? 'undefined' : _typeof(index);
  if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

/***/ }),

/***/ "./node_modules/lodash/_isMasked.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "./node_modules/lodash/_coreJsData.js");

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

module.exports = isMasked;

/***/ }),

/***/ "./node_modules/lodash/_isPrototype.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_isPrototype.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

module.exports = isPrototype;

/***/ }),

/***/ "./node_modules/lodash/_nativeKeysIn.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeKeysIn.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

/***/ }),

/***/ "./node_modules/lodash/_nodeUtil.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_nodeUtil.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `exports`. */
var freeExports = ( false ? undefined : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && ( false ? undefined : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

module.exports = nodeUtil;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

/***/ }),

/***/ "./node_modules/lodash/_overRest.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_overRest.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(/*! ./_apply */ "./node_modules/lodash/_apply.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

/***/ }),

/***/ "./node_modules/lodash/_setToString.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setToString.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(/*! ./_baseSetToString */ "./node_modules/lodash/_baseSetToString.js"),
    shortOut = __webpack_require__(/*! ./_shortOut */ "./node_modules/lodash/_shortOut.js");

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;

/***/ }),

/***/ "./node_modules/lodash/_shortOut.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_shortOut.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function () {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;

/***/ }),

/***/ "./node_modules/lodash/_toSource.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

/***/ }),

/***/ "./node_modules/lodash/constant.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/constant.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function () {
    return value;
  };
}

module.exports = constant;

/***/ }),

/***/ "./node_modules/lodash/defaults.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/defaults.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(/*! ./_baseRest */ "./node_modules/lodash/_baseRest.js"),
    eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js"),
    isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ "./node_modules/lodash/_isIterateeCall.js"),
    keysIn = __webpack_require__(/*! ./keysIn */ "./node_modules/lodash/keysIn.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function (object, sources) {
  object = Object(object);

  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
        object[key] = source[key];
      }
    }
  }

  return object;
});

module.exports = defaults;

/***/ }),

/***/ "./node_modules/lodash/eq.js":
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

module.exports = eq;

/***/ }),

/***/ "./node_modules/lodash/identity.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/identity.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

/***/ }),

/***/ "./node_modules/lodash/isArguments.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "./node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
    return arguments;
}()) ? baseIsArguments : function (value) {
    return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

/***/ }),

/***/ "./node_modules/lodash/isArray.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

/***/ }),

/***/ "./node_modules/lodash/isArrayLike.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArrayLike.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isLength = __webpack_require__(/*! ./isLength */ "./node_modules/lodash/isLength.js");

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

/***/ }),

/***/ "./node_modules/lodash/isBuffer.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isBuffer.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js"),
    stubFalse = __webpack_require__(/*! ./stubFalse */ "./node_modules/lodash/stubFalse.js");

/** Detect free variable `exports`. */
var freeExports = ( false ? undefined : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && ( false ? undefined : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/lodash/isFunction.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
    if (!isObject(value)) {
        return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

/***/ }),

/***/ "./node_modules/lodash/isLength.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isLength.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

module.exports = isObjectLike;

/***/ }),

/***/ "./node_modules/lodash/isTypedArray.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isTypedArray.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ "./node_modules/lodash/_baseIsTypedArray.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "./node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "./node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

/***/ }),

/***/ "./node_modules/lodash/keysIn.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/keysIn.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "./node_modules/lodash/_arrayLikeKeys.js"),
    baseKeysIn = __webpack_require__(/*! ./_baseKeysIn */ "./node_modules/lodash/_baseKeysIn.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "./node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

/***/ }),

/***/ "./node_modules/lodash/noop.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/noop.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;

/***/ }),

/***/ "./node_modules/lodash/stubFalse.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/stubFalse.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

/***/ }),

/***/ "./node_modules/node-libs-browser/node_modules/process/browser.js":
/*!************************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/process/browser.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),

/***/ "./node_modules/paho-client/src/paho-mqtt.js":
/*!***************************************************!*\
  !*** ./node_modules/paho-client/src/paho-mqtt.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*******************************************************************************
 * Copyright (c) 2013 IBM Corp.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 *
 * The Eclipse Public License is available at
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 * Contributors:
 *    Andrew Banks - initial API and implementation and initial documentation
 *******************************************************************************/

// Only expose a single object name in the global namespace.
// Everything must go through this module. Global Paho module
// only has a single public function, client, which returns
// a Paho client object given connection details.

/**
 * Send and receive messages using web browsers.
 * <p>
 * This programming interface lets a JavaScript client application use the MQTT V3.1 or
 * V3.1.1 protocol to connect to an MQTT-supporting messaging server.
 *
 * The function supported includes:
 * <ol>
 * <li>Connecting to and disconnecting from a server. The server is identified by its host name and port number.
 * <li>Specifying options that relate to the communications link with the server,
 * for example the frequency of keep-alive heartbeats, and whether SSL/TLS is required.
 * <li>Subscribing to and receiving messages from MQTT Topics.
 * <li>Publishing messages to MQTT Topics.
 * </ol>
 * <p>
 * The API consists of two main objects:
 * <dl>
 * <dt><b>{@link Paho.Client}</b></dt>
 * <dd>This contains methods that provide the functionality of the API,
 * including provision of callbacks that notify the application when a message
 * arrives from or is delivered to the messaging server,
 * or when the status of its connection to the messaging server changes.</dd>
 * <dt><b>{@link Paho.Message}</b></dt>
 * <dd>This encapsulates the payload of the message along with various attributes
 * associated with its delivery, in particular the destination to which it has
 * been (or is about to be) sent.</dd>
 * </dl>
 * <p>
 * The programming interface validates parameters passed to it, and will throw
 * an Error containing an error message intended for developer use, if it detects
 * an error with any parameter.
 * <p>
 * Example:
 *
 * <code><pre>
var client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({onSuccess:onConnect});

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("/World");
  var message = new Paho.MQTT.Message("Hello");
  message.destinationName = "/World";
  client.send(message);
};
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0)
	console.log("onConnectionLost:"+responseObject.errorMessage);
};
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
  client.disconnect();
};
 * </pre></code>
 * @namespace Paho
 */

/* jshint shadow:true */
(function ExportLibrary(root, factory) {
	if (( false ? undefined : _typeof(exports)) === "object" && ( false ? undefined : _typeof(module)) === "object") {
		module.exports = factory();
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
})(this, function LibraryFactory() {

	var PahoMQTT = function (global) {

		// Private variables below, these are only visible inside the function closure
		// which is used to define the module.
		var version = "@VERSION@-@BUILDLEVEL@";

		/**
   * @private
   */
		var localStorage = global.localStorage || function () {
			var data = {};

			return {
				setItem: function setItem(key, item) {
					data[key] = item;
				},
				getItem: function getItem(key) {
					return data[key];
				},
				removeItem: function removeItem(key) {
					delete data[key];
				}
			};
		}();

		/**
  * Unique message type identifiers, with associated
  * associated integer values.
  * @private
  */
		var MESSAGE_TYPE = {
			CONNECT: 1,
			CONNACK: 2,
			PUBLISH: 3,
			PUBACK: 4,
			PUBREC: 5,
			PUBREL: 6,
			PUBCOMP: 7,
			SUBSCRIBE: 8,
			SUBACK: 9,
			UNSUBSCRIBE: 10,
			UNSUBACK: 11,
			PINGREQ: 12,
			PINGRESP: 13,
			DISCONNECT: 14
		};

		// Collection of utility methods used to simplify module code
		// and promote the DRY pattern.

		/**
  * Validate an object's parameter names to ensure they
  * match a list of expected variables name for this option
  * type. Used to ensure option object passed into the API don't
  * contain erroneous parameters.
  * @param {Object} obj - User options object
  * @param {Object} keys - valid keys and types that may exist in obj.
  * @throws {Error} Invalid option parameter found.
  * @private
  */
		var validate = function validate(obj, keys) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (keys.hasOwnProperty(key)) {
						if (_typeof(obj[key]) !== keys[key]) throw new Error(format(ERROR.INVALID_TYPE, [_typeof(obj[key]), key]));
					} else {
						var errorStr = "Unknown property, " + key + ". Valid properties are:";
						for (var validKey in keys) {
							if (keys.hasOwnProperty(validKey)) errorStr = errorStr + " " + validKey;
						}throw new Error(errorStr);
					}
				}
			}
		};

		/**
  * Return a new function which runs the user function bound
  * to a fixed scope.
  * @param {function} User function
  * @param {object} Function scope
  * @return {function} User function bound to another scope
  * @private
  */
		var scope = function scope(f, _scope) {
			return function () {
				return f.apply(_scope, arguments);
			};
		};

		/**
  * Unique message type identifiers, with associated
  * associated integer values.
  * @private
  */
		var ERROR = {
			OK: { code: 0, text: "AMQJSC0000I OK." },
			CONNECT_TIMEOUT: { code: 1, text: "AMQJSC0001E Connect timed out." },
			SUBSCRIBE_TIMEOUT: { code: 2, text: "AMQJS0002E Subscribe timed out." },
			UNSUBSCRIBE_TIMEOUT: { code: 3, text: "AMQJS0003E Unsubscribe timed out." },
			PING_TIMEOUT: { code: 4, text: "AMQJS0004E Ping timed out." },
			INTERNAL_ERROR: { code: 5, text: "AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}" },
			CONNACK_RETURNCODE: { code: 6, text: "AMQJS0006E Bad Connack return code:{0} {1}." },
			SOCKET_ERROR: { code: 7, text: "AMQJS0007E Socket error:{0}." },
			SOCKET_CLOSE: { code: 8, text: "AMQJS0008I Socket closed." },
			MALFORMED_UTF: { code: 9, text: "AMQJS0009E Malformed UTF data:{0} {1} {2}." },
			UNSUPPORTED: { code: 10, text: "AMQJS0010E {0} is not supported by this browser." },
			INVALID_STATE: { code: 11, text: "AMQJS0011E Invalid state {0}." },
			INVALID_TYPE: { code: 12, text: "AMQJS0012E Invalid type {0} for {1}." },
			INVALID_ARGUMENT: { code: 13, text: "AMQJS0013E Invalid argument {0} for {1}." },
			UNSUPPORTED_OPERATION: { code: 14, text: "AMQJS0014E Unsupported operation." },
			INVALID_STORED_DATA: { code: 15, text: "AMQJS0015E Invalid data in local storage key={0} value={1}." },
			INVALID_MQTT_MESSAGE_TYPE: { code: 16, text: "AMQJS0016E Invalid MQTT message type {0}." },
			MALFORMED_UNICODE: { code: 17, text: "AMQJS0017E Malformed Unicode string:{0} {1}." },
			BUFFER_FULL: { code: 18, text: "AMQJS0018E Message buffer is full, maximum buffer size: {0}." }
		};

		/** CONNACK RC Meaning. */
		var CONNACK_RC = {
			0: "Connection Accepted",
			1: "Connection Refused: unacceptable protocol version",
			2: "Connection Refused: identifier rejected",
			3: "Connection Refused: server unavailable",
			4: "Connection Refused: bad user name or password",
			5: "Connection Refused: not authorized"
		};

		/**
   * Format an error message text.
   * @private
   * @param {error} ERROR value above.
   * @param {substitutions} [array] substituted into the text.
   * @return the text with the substitutions made.
   */
		var format = function format(error, substitutions) {
			var text = error.text;
			if (substitutions) {
				var field, start;
				for (var i = 0; i < substitutions.length; i++) {
					field = "{" + i + "}";
					start = text.indexOf(field);
					if (start > 0) {
						var part1 = text.substring(0, start);
						var part2 = text.substring(start + field.length);
						text = part1 + substitutions[i] + part2;
					}
				}
			}
			return text;
		};

		//MQTT protocol and version          6    M    Q    I    s    d    p    3
		var MqttProtoIdentifierv3 = [0x00, 0x06, 0x4d, 0x51, 0x49, 0x73, 0x64, 0x70, 0x03];
		//MQTT proto/version for 311         4    M    Q    T    T    4
		var MqttProtoIdentifierv4 = [0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, 0x04];

		/**
  * Construct an MQTT wire protocol message.
  * @param type MQTT packet type.
  * @param options optional wire message attributes.
  *
  * Optional properties
  *
  * messageIdentifier: message ID in the range [0..65535]
  * payloadMessage:	Application Message - PUBLISH only
  * connectStrings:	array of 0 or more Strings to be put into the CONNECT payload
  * topics:			array of strings (SUBSCRIBE, UNSUBSCRIBE)
  * requestQoS:		array of QoS values [0..2]
  *
  * "Flag" properties
  * cleanSession:	true if present / false if absent (CONNECT)
  * willMessage:  	true if present / false if absent (CONNECT)
  * isRetained:		true if present / false if absent (CONNECT)
  * userName:		true if present / false if absent (CONNECT)
  * password:		true if present / false if absent (CONNECT)
  * keepAliveInterval:	integer [0..65535]  (CONNECT)
  *
  * @private
  * @ignore
  */
		var WireMessage = function WireMessage(type, options) {
			this.type = type;
			for (var name in options) {
				if (options.hasOwnProperty(name)) {
					this[name] = options[name];
				}
			}
		};

		WireMessage.prototype.encode = function () {
			// Compute the first byte of the fixed header
			var first = (this.type & 0x0f) << 4;

			/*
   * Now calculate the length of the variable header + payload by adding up the lengths
   * of all the component parts
   */

			var remLength = 0;
			var topicStrLength = [];
			var destinationNameLength = 0;
			var willMessagePayloadBytes;

			// if the message contains a messageIdentifier then we need two bytes for that
			if (this.messageIdentifier !== undefined) remLength += 2;

			switch (this.type) {
				// If this a Connect then we need to include 12 bytes for its header
				case MESSAGE_TYPE.CONNECT:
					switch (this.mqttVersion) {
						case 3:
							remLength += MqttProtoIdentifierv3.length + 3;
							break;
						case 4:
							remLength += MqttProtoIdentifierv4.length + 3;
							break;
					}

					remLength += UTF8Length(this.clientId) + 2;
					if (this.willMessage !== undefined) {
						remLength += UTF8Length(this.willMessage.destinationName) + 2;
						// Will message is always a string, sent as UTF-8 characters with a preceding length.
						willMessagePayloadBytes = this.willMessage.payloadBytes;
						if (!(willMessagePayloadBytes instanceof Uint8Array)) willMessagePayloadBytes = new Uint8Array(payloadBytes);
						remLength += willMessagePayloadBytes.byteLength + 2;
					}
					if (this.userName !== undefined) remLength += UTF8Length(this.userName) + 2;
					if (this.password !== undefined) remLength += UTF8Length(this.password) + 2;
					break;

				// Subscribe, Unsubscribe can both contain topic strings
				case MESSAGE_TYPE.SUBSCRIBE:
					first |= 0x02; // Qos = 1;
					for (var i = 0; i < this.topics.length; i++) {
						topicStrLength[i] = UTF8Length(this.topics[i]);
						remLength += topicStrLength[i] + 2;
					}
					remLength += this.requestedQos.length; // 1 byte for each topic's Qos
					// QoS on Subscribe only
					break;

				case MESSAGE_TYPE.UNSUBSCRIBE:
					first |= 0x02; // Qos = 1;
					for (var i = 0; i < this.topics.length; i++) {
						topicStrLength[i] = UTF8Length(this.topics[i]);
						remLength += topicStrLength[i] + 2;
					}
					break;

				case MESSAGE_TYPE.PUBREL:
					first |= 0x02; // Qos = 1;
					break;

				case MESSAGE_TYPE.PUBLISH:
					if (this.payloadMessage.duplicate) first |= 0x08;
					first = first |= this.payloadMessage.qos << 1;
					if (this.payloadMessage.retained) first |= 0x01;
					destinationNameLength = UTF8Length(this.payloadMessage.destinationName);
					remLength += destinationNameLength + 2;
					var payloadBytes = this.payloadMessage.payloadBytes;
					remLength += payloadBytes.byteLength;
					if (payloadBytes instanceof ArrayBuffer) payloadBytes = new Uint8Array(payloadBytes);else if (!(payloadBytes instanceof Uint8Array)) payloadBytes = new Uint8Array(payloadBytes.buffer);
					break;

				case MESSAGE_TYPE.DISCONNECT:
					break;

				default:
					break;
			}

			// Now we can allocate a buffer for the message

			var mbi = encodeMBI(remLength); // Convert the length to MQTT MBI format
			var pos = mbi.length + 1; // Offset of start of variable header
			var buffer = new ArrayBuffer(remLength + pos);
			var byteStream = new Uint8Array(buffer); // view it as a sequence of bytes

			//Write the fixed header into the buffer
			byteStream[0] = first;
			byteStream.set(mbi, 1);

			// If this is a PUBLISH then the variable header starts with a topic
			if (this.type == MESSAGE_TYPE.PUBLISH) pos = writeString(this.payloadMessage.destinationName, destinationNameLength, byteStream, pos);
			// If this is a CONNECT then the variable header contains the protocol name/version, flags and keepalive time

			else if (this.type == MESSAGE_TYPE.CONNECT) {
					switch (this.mqttVersion) {
						case 3:
							byteStream.set(MqttProtoIdentifierv3, pos);
							pos += MqttProtoIdentifierv3.length;
							break;
						case 4:
							byteStream.set(MqttProtoIdentifierv4, pos);
							pos += MqttProtoIdentifierv4.length;
							break;
					}
					var connectFlags = 0;
					if (this.cleanSession) connectFlags = 0x02;
					if (this.willMessage !== undefined) {
						connectFlags |= 0x04;
						connectFlags |= this.willMessage.qos << 3;
						if (this.willMessage.retained) {
							connectFlags |= 0x20;
						}
					}
					if (this.userName !== undefined) connectFlags |= 0x80;
					if (this.password !== undefined) connectFlags |= 0x40;
					byteStream[pos++] = connectFlags;
					pos = writeUint16(this.keepAliveInterval, byteStream, pos);
				}

			// Output the messageIdentifier - if there is one
			if (this.messageIdentifier !== undefined) pos = writeUint16(this.messageIdentifier, byteStream, pos);

			switch (this.type) {
				case MESSAGE_TYPE.CONNECT:
					pos = writeString(this.clientId, UTF8Length(this.clientId), byteStream, pos);
					if (this.willMessage !== undefined) {
						pos = writeString(this.willMessage.destinationName, UTF8Length(this.willMessage.destinationName), byteStream, pos);
						pos = writeUint16(willMessagePayloadBytes.byteLength, byteStream, pos);
						byteStream.set(willMessagePayloadBytes, pos);
						pos += willMessagePayloadBytes.byteLength;
					}
					if (this.userName !== undefined) pos = writeString(this.userName, UTF8Length(this.userName), byteStream, pos);
					if (this.password !== undefined) pos = writeString(this.password, UTF8Length(this.password), byteStream, pos);
					break;

				case MESSAGE_TYPE.PUBLISH:
					// PUBLISH has a text or binary payload, if text do not add a 2 byte length field, just the UTF characters.
					byteStream.set(payloadBytes, pos);

					break;

				//    	    case MESSAGE_TYPE.PUBREC:
				//    	    case MESSAGE_TYPE.PUBREL:
				//    	    case MESSAGE_TYPE.PUBCOMP:
				//    	    	break;

				case MESSAGE_TYPE.SUBSCRIBE:
					// SUBSCRIBE has a list of topic strings and request QoS
					for (var i = 0; i < this.topics.length; i++) {
						pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
						byteStream[pos++] = this.requestedQos[i];
					}
					break;

				case MESSAGE_TYPE.UNSUBSCRIBE:
					// UNSUBSCRIBE has a list of topic strings
					for (var i = 0; i < this.topics.length; i++) {
						pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
					}break;

				default:
				// Do nothing.
			}

			return buffer;
		};

		function decodeMessage(input, pos) {
			var startingPos = pos;
			var first = input[pos];
			var type = first >> 4;
			var messageInfo = first &= 0x0f;
			pos += 1;

			// Decode the remaining length (MBI format)

			var digit;
			var remLength = 0;
			var multiplier = 1;
			do {
				if (pos == input.length) {
					return [null, startingPos];
				}
				digit = input[pos++];
				remLength += (digit & 0x7F) * multiplier;
				multiplier *= 128;
			} while ((digit & 0x80) !== 0);

			var endPos = pos + remLength;
			if (endPos > input.length) {
				return [null, startingPos];
			}

			var wireMessage = new WireMessage(type);
			switch (type) {
				case MESSAGE_TYPE.CONNACK:
					var connectAcknowledgeFlags = input[pos++];
					if (connectAcknowledgeFlags & 0x01) wireMessage.sessionPresent = true;
					wireMessage.returnCode = input[pos++];
					break;

				case MESSAGE_TYPE.PUBLISH:
					var qos = messageInfo >> 1 & 0x03;

					var len = readUint16(input, pos);
					pos += 2;
					var topicName = parseUTF8(input, pos, len);
					pos += len;
					// If QoS 1 or 2 there will be a messageIdentifier
					if (qos > 0) {
						wireMessage.messageIdentifier = readUint16(input, pos);
						pos += 2;
					}

					var message = new Message(input.subarray(pos, endPos));
					if ((messageInfo & 0x01) == 0x01) message.retained = true;
					if ((messageInfo & 0x08) == 0x08) message.duplicate = true;
					message.qos = qos;
					message.destinationName = topicName;
					wireMessage.payloadMessage = message;
					break;

				case MESSAGE_TYPE.PUBACK:
				case MESSAGE_TYPE.PUBREC:
				case MESSAGE_TYPE.PUBREL:
				case MESSAGE_TYPE.PUBCOMP:
				case MESSAGE_TYPE.UNSUBACK:
					wireMessage.messageIdentifier = readUint16(input, pos);
					break;

				case MESSAGE_TYPE.SUBACK:
					wireMessage.messageIdentifier = readUint16(input, pos);
					pos += 2;
					wireMessage.returnCode = input.subarray(pos, endPos);
					break;

				default:
					break;
			}

			return [wireMessage, endPos];
		}

		function writeUint16(input, buffer, offset) {
			buffer[offset++] = input >> 8; //MSB
			buffer[offset++] = input % 256; //LSB
			return offset;
		}

		function writeString(input, utf8Length, buffer, offset) {
			offset = writeUint16(utf8Length, buffer, offset);
			stringToUTF8(input, buffer, offset);
			return offset + utf8Length;
		}

		function readUint16(buffer, offset) {
			return 256 * buffer[offset] + buffer[offset + 1];
		}

		/**
  * Encodes an MQTT Multi-Byte Integer
  * @private
  */
		function encodeMBI(number) {
			var output = new Array(1);
			var numBytes = 0;

			do {
				var digit = number % 128;
				number = number >> 7;
				if (number > 0) {
					digit |= 0x80;
				}
				output[numBytes++] = digit;
			} while (number > 0 && numBytes < 4);

			return output;
		}

		/**
  * Takes a String and calculates its length in bytes when encoded in UTF8.
  * @private
  */
		function UTF8Length(input) {
			var output = 0;
			for (var i = 0; i < input.length; i++) {
				var charCode = input.charCodeAt(i);
				if (charCode > 0x7FF) {
					// Surrogate pair means its a 4 byte character
					if (0xD800 <= charCode && charCode <= 0xDBFF) {
						i++;
						output++;
					}
					output += 3;
				} else if (charCode > 0x7F) output += 2;else output++;
			}
			return output;
		}

		/**
  * Takes a String and writes it into an array as UTF8 encoded bytes.
  * @private
  */
		function stringToUTF8(input, output, start) {
			var pos = start;
			for (var i = 0; i < input.length; i++) {
				var charCode = input.charCodeAt(i);

				// Check for a surrogate pair.
				if (0xD800 <= charCode && charCode <= 0xDBFF) {
					var lowCharCode = input.charCodeAt(++i);
					if (isNaN(lowCharCode)) {
						throw new Error(format(ERROR.MALFORMED_UNICODE, [charCode, lowCharCode]));
					}
					charCode = (charCode - 0xD800 << 10) + (lowCharCode - 0xDC00) + 0x10000;
				}

				if (charCode <= 0x7F) {
					output[pos++] = charCode;
				} else if (charCode <= 0x7FF) {
					output[pos++] = charCode >> 6 & 0x1F | 0xC0;
					output[pos++] = charCode & 0x3F | 0x80;
				} else if (charCode <= 0xFFFF) {
					output[pos++] = charCode >> 12 & 0x0F | 0xE0;
					output[pos++] = charCode >> 6 & 0x3F | 0x80;
					output[pos++] = charCode & 0x3F | 0x80;
				} else {
					output[pos++] = charCode >> 18 & 0x07 | 0xF0;
					output[pos++] = charCode >> 12 & 0x3F | 0x80;
					output[pos++] = charCode >> 6 & 0x3F | 0x80;
					output[pos++] = charCode & 0x3F | 0x80;
				}
			}
			return output;
		}

		function parseUTF8(input, offset, length) {
			var output = "";
			var utf16;
			var pos = offset;

			while (pos < offset + length) {
				var byte1 = input[pos++];
				if (byte1 < 128) utf16 = byte1;else {
					var byte2 = input[pos++] - 128;
					if (byte2 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), ""]));
					if (byte1 < 0xE0) // 2 byte character
						utf16 = 64 * (byte1 - 0xC0) + byte2;else {
						var byte3 = input[pos++] - 128;
						if (byte3 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16)]));
						if (byte1 < 0xF0) // 3 byte character
							utf16 = 4096 * (byte1 - 0xE0) + 64 * byte2 + byte3;else {
							var byte4 = input[pos++] - 128;
							if (byte4 < 0) throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
							if (byte1 < 0xF8) // 4 byte character
								utf16 = 262144 * (byte1 - 0xF0) + 4096 * byte2 + 64 * byte3 + byte4;else // longer encodings are not supported
								throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
						}
					}
				}

				if (utf16 > 0xFFFF) // 4 byte character - express as a surrogate pair
					{
						utf16 -= 0x10000;
						output += String.fromCharCode(0xD800 + (utf16 >> 10)); // lead character
						utf16 = 0xDC00 + (utf16 & 0x3FF); // trail character
					}
				output += String.fromCharCode(utf16);
			}
			return output;
		}

		/**
  * Repeat keepalive requests, monitor responses.
  * @ignore
  */
		var Pinger = function Pinger(client, keepAliveInterval) {
			this._client = client;
			this._keepAliveInterval = keepAliveInterval * 1000;
			this.isReset = false;

			var pingReq = new WireMessage(MESSAGE_TYPE.PINGREQ).encode();

			var doTimeout = function doTimeout(pinger) {
				return function () {
					return doPing.apply(pinger);
				};
			};

			/** @ignore */
			var doPing = function doPing() {
				if (!this.isReset) {
					this._client._trace("Pinger.doPing", "Timed out");
					this._client._disconnected(ERROR.PING_TIMEOUT.code, format(ERROR.PING_TIMEOUT));
				} else {
					this.isReset = false;
					this._client._trace("Pinger.doPing", "send PINGREQ");
					this._client.socket.send(pingReq);
					this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
				}
			};

			this.reset = function () {
				this.isReset = true;
				clearTimeout(this.timeout);
				if (this._keepAliveInterval > 0) this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
			};

			this.cancel = function () {
				clearTimeout(this.timeout);
			};
		};

		/**
  * Monitor request completion.
  * @ignore
  */
		var Timeout = function Timeout(client, timeoutSeconds, action, args) {
			if (!timeoutSeconds) timeoutSeconds = 30;

			var doTimeout = function doTimeout(action, client, args) {
				return function () {
					return action.apply(client, args);
				};
			};
			this.timeout = setTimeout(doTimeout(action, client, args), timeoutSeconds * 1000);

			this.cancel = function () {
				clearTimeout(this.timeout);
			};
		};

		/**
   * Internal implementation of the Websockets MQTT V3.1 client.
   *
   * @name Paho.ClientImpl @constructor
   * @param {String} host the DNS nameof the webSocket host.
   * @param {Number} port the port number for that host.
   * @param {String} clientId the MQ client identifier.
   */
		var ClientImpl = function ClientImpl(uri, host, port, path, clientId) {
			// Check dependencies are satisfied in this browser.
			if (!("WebSocket" in global && global.WebSocket !== null)) {
				throw new Error(format(ERROR.UNSUPPORTED, ["WebSocket"]));
			}
			if (!("ArrayBuffer" in global && global.ArrayBuffer !== null)) {
				throw new Error(format(ERROR.UNSUPPORTED, ["ArrayBuffer"]));
			}
			this._trace("Paho.Client", uri, host, port, path, clientId);

			this.host = host;
			this.port = port;
			this.path = path;
			this.uri = uri;
			this.clientId = clientId;
			this._wsuri = null;

			// Local storagekeys are qualified with the following string.
			// The conditional inclusion of path in the key is for backward
			// compatibility to when the path was not configurable and assumed to
			// be /mqtt
			this._localKey = host + ":" + port + (path != "/mqtt" ? ":" + path : "") + ":" + clientId + ":";

			// Create private instance-only message queue
			// Internal queue of messages to be sent, in sending order.
			this._msg_queue = [];
			this._buffered_msg_queue = [];

			// Messages we have sent and are expecting a response for, indexed by their respective message ids.
			this._sentMessages = {};

			// Messages we have received and acknowleged and are expecting a confirm message for
			// indexed by their respective message ids.
			this._receivedMessages = {};

			// Internal list of callbacks to be executed when messages
			// have been successfully sent over web socket, e.g. disconnect
			// when it doesn't have to wait for ACK, just message is dispatched.
			this._notify_msg_sent = {};

			// Unique identifier for SEND messages, incrementing
			// counter as messages are sent.
			this._message_identifier = 1;

			// Used to determine the transmission sequence of stored sent messages.
			this._sequence = 0;

			// Load the local state, if any, from the saved version, only restore state relevant to this client.
			for (var key in localStorage) {
				if (key.indexOf("Sent:" + this._localKey) === 0 || key.indexOf("Received:" + this._localKey) === 0) this.restore(key);
			}
		};

		// Messaging Client public instance members.
		ClientImpl.prototype.host = null;
		ClientImpl.prototype.port = null;
		ClientImpl.prototype.path = null;
		ClientImpl.prototype.uri = null;
		ClientImpl.prototype.clientId = null;

		// Messaging Client private instance members.
		ClientImpl.prototype.socket = null;
		/* true once we have received an acknowledgement to a CONNECT packet. */
		ClientImpl.prototype.connected = false;
		/* The largest message identifier allowed, may not be larger than 2**16 but
   * if set smaller reduces the maximum number of outbound messages allowed.
   */
		ClientImpl.prototype.maxMessageIdentifier = 65536;
		ClientImpl.prototype.connectOptions = null;
		ClientImpl.prototype.hostIndex = null;
		ClientImpl.prototype.onConnected = null;
		ClientImpl.prototype.onConnectionLost = null;
		ClientImpl.prototype.onMessageDelivered = null;
		ClientImpl.prototype.onMessageArrived = null;
		ClientImpl.prototype.traceFunction = null;
		ClientImpl.prototype._msg_queue = null;
		ClientImpl.prototype._buffered_msg_queue = null;
		ClientImpl.prototype._connectTimeout = null;
		/* The sendPinger monitors how long we allow before we send data to prove to the server that we are alive. */
		ClientImpl.prototype.sendPinger = null;
		/* The receivePinger monitors how long we allow before we require evidence that the server is alive. */
		ClientImpl.prototype.receivePinger = null;
		ClientImpl.prototype._reconnectInterval = 1; // Reconnect Delay, starts at 1 second
		ClientImpl.prototype._reconnecting = false;
		ClientImpl.prototype._reconnectTimeout = null;
		ClientImpl.prototype.disconnectedPublishing = false;
		ClientImpl.prototype.disconnectedBufferSize = 5000;

		ClientImpl.prototype.receiveBuffer = null;

		ClientImpl.prototype._traceBuffer = null;
		ClientImpl.prototype._MAX_TRACE_ENTRIES = 100;

		ClientImpl.prototype.connect = function (connectOptions) {
			var connectOptionsMasked = this._traceMask(connectOptions, "password");
			this._trace("Client.connect", connectOptionsMasked, this.socket, this.connected);

			if (this.connected) throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));
			if (this.socket) throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));

			if (this._reconnecting) {
				// connect() function is called while reconnect is in progress.
				// Terminate the auto reconnect process to use new connect options.
				this._reconnectTimeout.cancel();
				this._reconnectTimeout = null;
				this._reconnecting = false;
			}

			this.connectOptions = connectOptions;
			this._reconnectInterval = 1;
			this._reconnecting = false;
			if (connectOptions.uris) {
				this.hostIndex = 0;
				this._doConnect(connectOptions.uris[0]);
			} else {
				this._doConnect(this.uri);
			}
		};

		ClientImpl.prototype.subscribe = function (filter, subscribeOptions) {
			this._trace("Client.subscribe", filter, subscribeOptions);

			if (!this.connected) throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));

			var wireMessage = new WireMessage(MESSAGE_TYPE.SUBSCRIBE);
			wireMessage.topics = filter.constructor === Array ? filter : [filter];
			if (subscribeOptions.qos === undefined) subscribeOptions.qos = 0;
			wireMessage.requestedQos = [];
			for (var i = 0; i < wireMessage.topics.length; i++) {
				wireMessage.requestedQos[i] = subscribeOptions.qos;
			}if (subscribeOptions.onSuccess) {
				wireMessage.onSuccess = function (grantedQos) {
					subscribeOptions.onSuccess({ invocationContext: subscribeOptions.invocationContext, grantedQos: grantedQos });
				};
			}

			if (subscribeOptions.onFailure) {
				wireMessage.onFailure = function (errorCode) {
					subscribeOptions.onFailure({ invocationContext: subscribeOptions.invocationContext, errorCode: errorCode, errorMessage: format(errorCode) });
				};
			}

			if (subscribeOptions.timeout) {
				wireMessage.timeOut = new Timeout(this, subscribeOptions.timeout, subscribeOptions.onFailure, [{ invocationContext: subscribeOptions.invocationContext,
					errorCode: ERROR.SUBSCRIBE_TIMEOUT.code,
					errorMessage: format(ERROR.SUBSCRIBE_TIMEOUT) }]);
			}

			// All subscriptions return a SUBACK.
			this._requires_ack(wireMessage);
			this._schedule_message(wireMessage);
		};

		/** @ignore */
		ClientImpl.prototype.unsubscribe = function (filter, unsubscribeOptions) {
			this._trace("Client.unsubscribe", filter, unsubscribeOptions);

			if (!this.connected) throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));

			var wireMessage = new WireMessage(MESSAGE_TYPE.UNSUBSCRIBE);
			wireMessage.topics = filter.constructor === Array ? filter : [filter];

			if (unsubscribeOptions.onSuccess) {
				wireMessage.callback = function () {
					unsubscribeOptions.onSuccess({ invocationContext: unsubscribeOptions.invocationContext });
				};
			}
			if (unsubscribeOptions.timeout) {
				wireMessage.timeOut = new Timeout(this, unsubscribeOptions.timeout, unsubscribeOptions.onFailure, [{ invocationContext: unsubscribeOptions.invocationContext,
					errorCode: ERROR.UNSUBSCRIBE_TIMEOUT.code,
					errorMessage: format(ERROR.UNSUBSCRIBE_TIMEOUT) }]);
			}

			// All unsubscribes return a SUBACK.
			this._requires_ack(wireMessage);
			this._schedule_message(wireMessage);
		};

		ClientImpl.prototype.send = function (message) {
			this._trace("Client.send", message);

			var wireMessage = new WireMessage(MESSAGE_TYPE.PUBLISH);
			wireMessage.payloadMessage = message;

			if (this.connected) {
				// Mark qos 1 & 2 message as "ACK required"
				// For qos 0 message, invoke onMessageDelivered callback if there is one.
				// Then schedule the message.
				if (message.qos > 0) {
					this._requires_ack(wireMessage);
				} else if (this.onMessageDelivered) {
					this._notify_msg_sent[wireMessage] = this.onMessageDelivered(wireMessage.payloadMessage);
				}
				this._schedule_message(wireMessage);
			} else {
				// Currently disconnected, will not schedule this message
				// Check if reconnecting is in progress and disconnected publish is enabled.
				if (this._reconnecting && this.disconnectedPublishing) {
					// Check the limit which include the "required ACK" messages
					var messageCount = Object.keys(this._sentMessages).length + this._buffered_msg_queue.length;
					if (messageCount > this.disconnectedBufferSize) {
						throw new Error(format(ERROR.BUFFER_FULL, [this.disconnectedBufferSize]));
					} else {
						if (message.qos > 0) {
							// Mark this message as "ACK required"
							this._requires_ack(wireMessage);
						} else {
							wireMessage.sequence = ++this._sequence;
							// Add messages in fifo order to array, by adding to start
							this._buffered_msg_queue.unshift(wireMessage);
						}
					}
				} else {
					throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));
				}
			}
		};

		ClientImpl.prototype.disconnect = function () {
			this._trace("Client.disconnect");

			if (this._reconnecting) {
				// disconnect() function is called while reconnect is in progress.
				// Terminate the auto reconnect process.
				this._reconnectTimeout.cancel();
				this._reconnectTimeout = null;
				this._reconnecting = false;
			}

			if (!this.socket) throw new Error(format(ERROR.INVALID_STATE, ["not connecting or connected"]));

			var wireMessage = new WireMessage(MESSAGE_TYPE.DISCONNECT);

			// Run the disconnected call back as soon as the message has been sent,
			// in case of a failure later on in the disconnect processing.
			// as a consequence, the _disconected call back may be run several times.
			this._notify_msg_sent[wireMessage] = scope(this._disconnected, this);

			this._schedule_message(wireMessage);
		};

		ClientImpl.prototype.getTraceLog = function () {
			if (this._traceBuffer !== null) {
				this._trace("Client.getTraceLog", new Date());
				this._trace("Client.getTraceLog in flight messages", this._sentMessages.length);
				for (var key in this._sentMessages) {
					this._trace("_sentMessages ", key, this._sentMessages[key]);
				}for (var key in this._receivedMessages) {
					this._trace("_receivedMessages ", key, this._receivedMessages[key]);
				}return this._traceBuffer;
			}
		};

		ClientImpl.prototype.startTrace = function () {
			if (this._traceBuffer === null) {
				this._traceBuffer = [];
			}
			this._trace("Client.startTrace", new Date(), version);
		};

		ClientImpl.prototype.stopTrace = function () {
			delete this._traceBuffer;
		};

		ClientImpl.prototype._doConnect = function (wsurl) {
			// When the socket is open, this client will send the CONNECT WireMessage using the saved parameters.
			if (this.connectOptions.useSSL) {
				var uriParts = wsurl.split(":");
				uriParts[0] = "wss";
				wsurl = uriParts.join(":");
			}
			this._wsuri = wsurl;
			this.connected = false;

			if (this.connectOptions.mqttVersion < 4) {
				this.socket = new WebSocket(wsurl, ["mqttv3.1"]);
			} else {
				this.socket = new WebSocket(wsurl, ["mqtt"]);
			}
			this.socket.binaryType = "arraybuffer";
			this.socket.onopen = scope(this._on_socket_open, this);
			this.socket.onmessage = scope(this._on_socket_message, this);
			this.socket.onerror = scope(this._on_socket_error, this);
			this.socket.onclose = scope(this._on_socket_close, this);

			this.sendPinger = new Pinger(this, this.connectOptions.keepAliveInterval);
			this.receivePinger = new Pinger(this, this.connectOptions.keepAliveInterval);
			if (this._connectTimeout) {
				this._connectTimeout.cancel();
				this._connectTimeout = null;
			}
			this._connectTimeout = new Timeout(this, this.connectOptions.timeout, this._disconnected, [ERROR.CONNECT_TIMEOUT.code, format(ERROR.CONNECT_TIMEOUT)]);
		};

		// Schedule a new message to be sent over the WebSockets
		// connection. CONNECT messages cause WebSocket connection
		// to be started. All other messages are queued internally
		// until this has happened. When WS connection starts, process
		// all outstanding messages.
		ClientImpl.prototype._schedule_message = function (message) {
			// Add messages in fifo order to array, by adding to start
			this._msg_queue.unshift(message);
			// Process outstanding messages in the queue if we have an  open socket, and have received CONNACK.
			if (this.connected) {
				this._process_queue();
			}
		};

		ClientImpl.prototype.store = function (prefix, wireMessage) {
			var storedMessage = { type: wireMessage.type, messageIdentifier: wireMessage.messageIdentifier, version: 1 };

			switch (wireMessage.type) {
				case MESSAGE_TYPE.PUBLISH:
					if (wireMessage.pubRecReceived) storedMessage.pubRecReceived = true;

					// Convert the payload to a hex string.
					storedMessage.payloadMessage = {};
					var hex = "";
					var messageBytes = wireMessage.payloadMessage.payloadBytes;
					for (var i = 0; i < messageBytes.length; i++) {
						if (messageBytes[i] <= 0xF) hex = hex + "0" + messageBytes[i].toString(16);else hex = hex + messageBytes[i].toString(16);
					}
					storedMessage.payloadMessage.payloadHex = hex;

					storedMessage.payloadMessage.qos = wireMessage.payloadMessage.qos;
					storedMessage.payloadMessage.destinationName = wireMessage.payloadMessage.destinationName;
					if (wireMessage.payloadMessage.duplicate) storedMessage.payloadMessage.duplicate = true;
					if (wireMessage.payloadMessage.retained) storedMessage.payloadMessage.retained = true;

					// Add a sequence number to sent messages.
					if (prefix.indexOf("Sent:") === 0) {
						if (wireMessage.sequence === undefined) wireMessage.sequence = ++this._sequence;
						storedMessage.sequence = wireMessage.sequence;
					}
					break;

				default:
					throw Error(format(ERROR.INVALID_STORED_DATA, [prefix + this._localKey + wireMessage.messageIdentifier, storedMessage]));
			}
			localStorage.setItem(prefix + this._localKey + wireMessage.messageIdentifier, JSON.stringify(storedMessage));
		};

		ClientImpl.prototype.restore = function (key) {
			var value = localStorage.getItem(key);
			var storedMessage = JSON.parse(value);

			var wireMessage = new WireMessage(storedMessage.type, storedMessage);

			switch (storedMessage.type) {
				case MESSAGE_TYPE.PUBLISH:
					// Replace the payload message with a Message object.
					var hex = storedMessage.payloadMessage.payloadHex;
					var buffer = new ArrayBuffer(hex.length / 2);
					var byteStream = new Uint8Array(buffer);
					var i = 0;
					while (hex.length >= 2) {
						var x = parseInt(hex.substring(0, 2), 16);
						hex = hex.substring(2, hex.length);
						byteStream[i++] = x;
					}
					var payloadMessage = new Message(byteStream);

					payloadMessage.qos = storedMessage.payloadMessage.qos;
					payloadMessage.destinationName = storedMessage.payloadMessage.destinationName;
					if (storedMessage.payloadMessage.duplicate) payloadMessage.duplicate = true;
					if (storedMessage.payloadMessage.retained) payloadMessage.retained = true;
					wireMessage.payloadMessage = payloadMessage;

					break;

				default:
					throw Error(format(ERROR.INVALID_STORED_DATA, [key, value]));
			}

			if (key.indexOf("Sent:" + this._localKey) === 0) {
				wireMessage.payloadMessage.duplicate = true;
				this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
			} else if (key.indexOf("Received:" + this._localKey) === 0) {
				this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
			}
		};

		ClientImpl.prototype._process_queue = function () {
			var message = null;

			// Send all queued messages down socket connection
			while (message = this._msg_queue.pop()) {
				this._socket_send(message);
				// Notify listeners that message was successfully sent
				if (this._notify_msg_sent[message]) {
					this._notify_msg_sent[message]();
					delete this._notify_msg_sent[message];
				}
			}
		};

		/**
  * Expect an ACK response for this message. Add message to the set of in progress
  * messages and set an unused identifier in this message.
  * @ignore
  */
		ClientImpl.prototype._requires_ack = function (wireMessage) {
			var messageCount = Object.keys(this._sentMessages).length;
			if (messageCount > this.maxMessageIdentifier) throw Error("Too many messages:" + messageCount);

			while (this._sentMessages[this._message_identifier] !== undefined) {
				this._message_identifier++;
			}
			wireMessage.messageIdentifier = this._message_identifier;
			this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
			if (wireMessage.type === MESSAGE_TYPE.PUBLISH) {
				this.store("Sent:", wireMessage);
			}
			if (this._message_identifier === this.maxMessageIdentifier) {
				this._message_identifier = 1;
			}
		};

		/**
  * Called when the underlying websocket has been opened.
  * @ignore
  */
		ClientImpl.prototype._on_socket_open = function () {
			// Create the CONNECT message object.
			var wireMessage = new WireMessage(MESSAGE_TYPE.CONNECT, this.connectOptions);
			wireMessage.clientId = this.clientId;
			this._socket_send(wireMessage);
		};

		/**
  * Called when the underlying websocket has received a complete packet.
  * @ignore
  */
		ClientImpl.prototype._on_socket_message = function (event) {
			this._trace("Client._on_socket_message", event.data);
			var messages = this._deframeMessages(event.data);
			for (var i = 0; i < messages.length; i += 1) {
				this._handleMessage(messages[i]);
			}
		};

		ClientImpl.prototype._deframeMessages = function (data) {
			var byteArray = new Uint8Array(data);
			var messages = [];
			if (this.receiveBuffer) {
				var newData = new Uint8Array(this.receiveBuffer.length + byteArray.length);
				newData.set(this.receiveBuffer);
				newData.set(byteArray, this.receiveBuffer.length);
				byteArray = newData;
				delete this.receiveBuffer;
			}
			try {
				var offset = 0;
				while (offset < byteArray.length) {
					var result = decodeMessage(byteArray, offset);
					var wireMessage = result[0];
					offset = result[1];
					if (wireMessage !== null) {
						messages.push(wireMessage);
					} else {
						break;
					}
				}
				if (offset < byteArray.length) {
					this.receiveBuffer = byteArray.subarray(offset);
				}
			} catch (error) {
				var errorStack = error.hasOwnProperty("stack") == "undefined" ? error.stack.toString() : "No Error Stack Available";
				this._disconnected(ERROR.INTERNAL_ERROR.code, format(ERROR.INTERNAL_ERROR, [error.message, errorStack]));
				return;
			}
			return messages;
		};

		ClientImpl.prototype._handleMessage = function (wireMessage) {

			this._trace("Client._handleMessage", wireMessage);

			try {
				switch (wireMessage.type) {
					case MESSAGE_TYPE.CONNACK:
						this._connectTimeout.cancel();
						if (this._reconnectTimeout) this._reconnectTimeout.cancel();

						// If we have started using clean session then clear up the local state.
						if (this.connectOptions.cleanSession) {
							for (var key in this._sentMessages) {
								var sentMessage = this._sentMessages[key];
								localStorage.removeItem("Sent:" + this._localKey + sentMessage.messageIdentifier);
							}
							this._sentMessages = {};

							for (var key in this._receivedMessages) {
								var receivedMessage = this._receivedMessages[key];
								localStorage.removeItem("Received:" + this._localKey + receivedMessage.messageIdentifier);
							}
							this._receivedMessages = {};
						}
						// Client connected and ready for business.
						if (wireMessage.returnCode === 0) {

							this.connected = true;
							// Jump to the end of the list of uris and stop looking for a good host.

							if (this.connectOptions.uris) this.hostIndex = this.connectOptions.uris.length;
						} else {
							this._disconnected(ERROR.CONNACK_RETURNCODE.code, format(ERROR.CONNACK_RETURNCODE, [wireMessage.returnCode, CONNACK_RC[wireMessage.returnCode]]));
							break;
						}

						// Resend messages.
						var sequencedMessages = [];
						for (var msgId in this._sentMessages) {
							if (this._sentMessages.hasOwnProperty(msgId)) sequencedMessages.push(this._sentMessages[msgId]);
						}

						// Also schedule qos 0 buffered messages if any
						if (this._buffered_msg_queue.length > 0) {
							var msg = null;
							while (msg = this._buffered_msg_queue.pop()) {
								sequencedMessages.push(msg);
								if (this.onMessageDelivered) this._notify_msg_sent[msg] = this.onMessageDelivered(msg.payloadMessage);
							}
						}

						// Sort sentMessages into the original sent order.
						var sequencedMessages = sequencedMessages.sort(function (a, b) {
							return a.sequence - b.sequence;
						});
						for (var i = 0, len = sequencedMessages.length; i < len; i++) {
							var sentMessage = sequencedMessages[i];
							if (sentMessage.type == MESSAGE_TYPE.PUBLISH && sentMessage.pubRecReceived) {
								var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, { messageIdentifier: sentMessage.messageIdentifier });
								this._schedule_message(pubRelMessage);
							} else {
								this._schedule_message(sentMessage);
							}
						}

						// Execute the connectOptions.onSuccess callback if there is one.
						// Will also now return if this connection was the result of an automatic
						// reconnect and which URI was successfully connected to.
						if (this.connectOptions.onSuccess) {
							this.connectOptions.onSuccess({ invocationContext: this.connectOptions.invocationContext });
						}

						var reconnected = false;
						if (this._reconnecting) {
							reconnected = true;
							this._reconnectInterval = 1;
							this._reconnecting = false;
						}

						// Execute the onConnected callback if there is one.
						this._connected(reconnected, this._wsuri);

						// Process all queued messages now that the connection is established.
						this._process_queue();
						break;

					case MESSAGE_TYPE.PUBLISH:
						this._receivePublish(wireMessage);
						break;

					case MESSAGE_TYPE.PUBACK:
						var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
						// If this is a re flow of a PUBACK after we have restarted receivedMessage will not exist.
						if (sentMessage) {
							delete this._sentMessages[wireMessage.messageIdentifier];
							localStorage.removeItem("Sent:" + this._localKey + wireMessage.messageIdentifier);
							if (this.onMessageDelivered) this.onMessageDelivered(sentMessage.payloadMessage);
						}
						break;

					case MESSAGE_TYPE.PUBREC:
						var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
						// If this is a re flow of a PUBREC after we have restarted receivedMessage will not exist.
						if (sentMessage) {
							sentMessage.pubRecReceived = true;
							var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, { messageIdentifier: wireMessage.messageIdentifier });
							this.store("Sent:", sentMessage);
							this._schedule_message(pubRelMessage);
						}
						break;

					case MESSAGE_TYPE.PUBREL:
						var receivedMessage = this._receivedMessages[wireMessage.messageIdentifier];
						localStorage.removeItem("Received:" + this._localKey + wireMessage.messageIdentifier);
						// If this is a re flow of a PUBREL after we have restarted receivedMessage will not exist.
						if (receivedMessage) {
							this._receiveMessage(receivedMessage);
							delete this._receivedMessages[wireMessage.messageIdentifier];
						}
						// Always flow PubComp, we may have previously flowed PubComp but the server lost it and restarted.
						var pubCompMessage = new WireMessage(MESSAGE_TYPE.PUBCOMP, { messageIdentifier: wireMessage.messageIdentifier });
						this._schedule_message(pubCompMessage);

						break;

					case MESSAGE_TYPE.PUBCOMP:
						var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
						delete this._sentMessages[wireMessage.messageIdentifier];
						localStorage.removeItem("Sent:" + this._localKey + wireMessage.messageIdentifier);
						if (this.onMessageDelivered) this.onMessageDelivered(sentMessage.payloadMessage);
						break;

					case MESSAGE_TYPE.SUBACK:
						var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
						if (sentMessage) {
							if (sentMessage.timeOut) sentMessage.timeOut.cancel();
							// This will need to be fixed when we add multiple topic support
							if (wireMessage.returnCode[0] === 0x80) {
								if (sentMessage.onFailure) {
									sentMessage.onFailure(wireMessage.returnCode);
								}
							} else if (sentMessage.onSuccess) {
								sentMessage.onSuccess(wireMessage.returnCode);
							}
							delete this._sentMessages[wireMessage.messageIdentifier];
						}
						break;

					case MESSAGE_TYPE.UNSUBACK:
						var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
						if (sentMessage) {
							if (sentMessage.timeOut) sentMessage.timeOut.cancel();
							if (sentMessage.callback) {
								sentMessage.callback();
							}
							delete this._sentMessages[wireMessage.messageIdentifier];
						}

						break;

					case MESSAGE_TYPE.PINGRESP:
						/* The sendPinger or receivePinger may have sent a ping, the receivePinger has already been reset. */
						this.sendPinger.reset();
						break;

					case MESSAGE_TYPE.DISCONNECT:
						// Clients do not expect to receive disconnect packets.
						this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code, format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
						break;

					default:
						this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code, format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
				}
			} catch (error) {
				var errorStack = error.hasOwnProperty("stack") == "undefined" ? error.stack.toString() : "No Error Stack Available";
				this._disconnected(ERROR.INTERNAL_ERROR.code, format(ERROR.INTERNAL_ERROR, [error.message, errorStack]));
				return;
			}
		};

		/** @ignore */
		ClientImpl.prototype._on_socket_error = function (error) {
			if (!this._reconnecting) {
				this._disconnected(ERROR.SOCKET_ERROR.code, format(ERROR.SOCKET_ERROR, [error.data]));
			}
		};

		/** @ignore */
		ClientImpl.prototype._on_socket_close = function () {
			if (!this._reconnecting) {
				this._disconnected(ERROR.SOCKET_CLOSE.code, format(ERROR.SOCKET_CLOSE));
			}
		};

		/** @ignore */
		ClientImpl.prototype._socket_send = function (wireMessage) {

			if (wireMessage.type == 1) {
				var wireMessageMasked = this._traceMask(wireMessage, "password");
				this._trace("Client._socket_send", wireMessageMasked);
			} else this._trace("Client._socket_send", wireMessage);

			this.socket.send(wireMessage.encode());
			/* We have proved to the server we are alive. */
			this.sendPinger.reset();
		};

		/** @ignore */
		ClientImpl.prototype._receivePublish = function (wireMessage) {
			switch (wireMessage.payloadMessage.qos) {
				case "undefined":
				case 0:
					this._receiveMessage(wireMessage);
					break;

				case 1:
					var pubAckMessage = new WireMessage(MESSAGE_TYPE.PUBACK, { messageIdentifier: wireMessage.messageIdentifier });
					this._schedule_message(pubAckMessage);
					this._receiveMessage(wireMessage);
					break;

				case 2:
					this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
					this.store("Received:", wireMessage);
					var pubRecMessage = new WireMessage(MESSAGE_TYPE.PUBREC, { messageIdentifier: wireMessage.messageIdentifier });
					this._schedule_message(pubRecMessage);

					break;

				default:
					throw Error("Invaild qos=" + wireMessage.payloadMessage.qos);
			}
		};

		/** @ignore */
		ClientImpl.prototype._receiveMessage = function (wireMessage) {
			if (this.onMessageArrived) {
				this.onMessageArrived(wireMessage.payloadMessage);
			}
		};

		/**
  * Client has connected.
  * @param {reconnect} [boolean] indicate if this was a result of reconnect operation.
  * @param {uri} [string] fully qualified WebSocket URI of the server.
  */
		ClientImpl.prototype._connected = function (reconnect, uri) {
			// Execute the onConnected callback if there is one.
			if (this.onConnected) this.onConnected(reconnect, uri);
		};

		/**
  * Attempts to reconnect the client to the server.
   * For each reconnect attempt, will double the reconnect interval
   * up to 128 seconds.
  */
		ClientImpl.prototype._reconnect = function () {
			this._trace("Client._reconnect");
			if (!this.connected) {
				this._reconnecting = true;
				this.sendPinger.cancel();
				this.receivePinger.cancel();
				if (this._reconnectInterval < 128) this._reconnectInterval = this._reconnectInterval * 2;
				if (this.connectOptions.uris) {
					this.hostIndex = 0;
					this._doConnect(this.connectOptions.uris[0]);
				} else {
					this._doConnect(this.uri);
				}
			}
		};

		/**
  * Client has disconnected either at its own request or because the server
  * or network disconnected it. Remove all non-durable state.
  * @param {errorCode} [number] the error number.
  * @param {errorText} [string] the error text.
  * @ignore
  */
		ClientImpl.prototype._disconnected = function (errorCode, errorText) {
			this._trace("Client._disconnected", errorCode, errorText);

			if (errorCode !== undefined && this._reconnecting) {
				//Continue automatic reconnect process
				this._reconnectTimeout = new Timeout(this, this._reconnectInterval, this._reconnect);
				return;
			}

			this.sendPinger.cancel();
			this.receivePinger.cancel();
			if (this._connectTimeout) {
				this._connectTimeout.cancel();
				this._connectTimeout = null;
			}

			// Clear message buffers.
			this._msg_queue = [];
			this._buffered_msg_queue = [];
			this._notify_msg_sent = {};

			if (this.socket) {
				// Cancel all socket callbacks so that they cannot be driven again by this socket.
				this.socket.onopen = null;
				this.socket.onmessage = null;
				this.socket.onerror = null;
				this.socket.onclose = null;
				if (this.socket.readyState === 1) this.socket.close();
				delete this.socket;
			}

			if (this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length - 1) {
				// Try the next host.
				this.hostIndex++;
				this._doConnect(this.connectOptions.uris[this.hostIndex]);
			} else {

				if (errorCode === undefined) {
					errorCode = ERROR.OK.code;
					errorText = format(ERROR.OK);
				}

				// Run any application callbacks last as they may attempt to reconnect and hence create a new socket.
				if (this.connected) {
					this.connected = false;
					// Execute the connectionLostCallback if there is one, and we were connected.
					if (this.onConnectionLost) {
						this.onConnectionLost({ errorCode: errorCode, errorMessage: errorText, reconnect: this.connectOptions.reconnect, uri: this._wsuri });
					}
					if (errorCode !== ERROR.OK.code && this.connectOptions.reconnect) {
						// Start automatic reconnect process for the very first time since last successful connect.
						this._reconnectInterval = 1;
						this._reconnect();
						return;
					}
				} else {
					// Otherwise we never had a connection, so indicate that the connect has failed.
					if (this.connectOptions.mqttVersion === 4 && this.connectOptions.mqttVersionExplicit === false) {
						this._trace("Failed to connect V4, dropping back to V3");
						this.connectOptions.mqttVersion = 3;
						if (this.connectOptions.uris) {
							this.hostIndex = 0;
							this._doConnect(this.connectOptions.uris[0]);
						} else {
							this._doConnect(this.uri);
						}
					} else if (this.connectOptions.onFailure) {
						this.connectOptions.onFailure({ invocationContext: this.connectOptions.invocationContext, errorCode: errorCode, errorMessage: errorText });
					}
				}
			}
		};

		/** @ignore */
		ClientImpl.prototype._trace = function () {
			// Pass trace message back to client's callback function
			if (this.traceFunction) {
				var args = Array.prototype.slice.call(arguments);
				for (var i in args) {
					if (typeof args[i] !== "undefined") args.splice(i, 1, JSON.stringify(args[i]));
				}
				var record = args.join("");
				this.traceFunction({ severity: "Debug", message: record });
			}

			//buffer style trace
			if (this._traceBuffer !== null) {
				for (var i = 0, max = arguments.length; i < max; i++) {
					if (this._traceBuffer.length == this._MAX_TRACE_ENTRIES) {
						this._traceBuffer.shift();
					}
					if (i === 0) this._traceBuffer.push(arguments[i]);else if (typeof arguments[i] === "undefined") this._traceBuffer.push(arguments[i]);else this._traceBuffer.push("  " + JSON.stringify(arguments[i]));
				}
			}
		};

		/** @ignore */
		ClientImpl.prototype._traceMask = function (traceObject, masked) {
			var traceObjectMasked = {};
			for (var attr in traceObject) {
				if (traceObject.hasOwnProperty(attr)) {
					if (attr == masked) traceObjectMasked[attr] = "******";else traceObjectMasked[attr] = traceObject[attr];
				}
			}
			return traceObjectMasked;
		};

		// ------------------------------------------------------------------------
		// Public Programming interface.
		// ------------------------------------------------------------------------

		/**
  * The JavaScript application communicates to the server using a {@link Paho.Client} object.
  * <p>
  * Most applications will create just one Client object and then call its connect() method,
  * however applications can create more than one Client object if they wish.
  * In this case the combination of host, port and clientId attributes must be different for each Client object.
  * <p>
  * The send, subscribe and unsubscribe methods are implemented as asynchronous JavaScript methods
  * (even though the underlying protocol exchange might be synchronous in nature).
  * This means they signal their completion by calling back to the application,
  * via Success or Failure callback functions provided by the application on the method in question.
  * Such callbacks are called at most once per method invocation and do not persist beyond the lifetime
  * of the script that made the invocation.
  * <p>
  * In contrast there are some callback functions, most notably <i>onMessageArrived</i>,
  * that are defined on the {@link Paho.Client} object.
  * These may get called multiple times, and aren't directly related to specific method invocations made by the client.
  *
  * @name Paho.Client
  *
  * @constructor
  *
  * @param {string} host - the address of the messaging server, as a fully qualified WebSocket URI, as a DNS name or dotted decimal IP address.
  * @param {number} port - the port number to connect to - only required if host is not a URI
  * @param {string} path - the path on the host to connect to - only used if host is not a URI. Default: '/mqtt'.
  * @param {string} clientId - the Messaging client identifier, between 1 and 23 characters in length.
  *
  * @property {string} host - <i>read only</i> the server's DNS hostname or dotted decimal IP address.
  * @property {number} port - <i>read only</i> the server's port.
  * @property {string} path - <i>read only</i> the server's path.
  * @property {string} clientId - <i>read only</i> used when connecting to the server.
  * @property {function} onConnectionLost - called when a connection has been lost.
  *                            after a connect() method has succeeded.
  *                            Establish the call back used when a connection has been lost. The connection may be
  *                            lost because the client initiates a disconnect or because the server or network
  *                            cause the client to be disconnected. The disconnect call back may be called without
  *                            the connectionComplete call back being invoked if, for example the client fails to
  *                            connect.
  *                            A single response object parameter is passed to the onConnectionLost callback containing the following fields:
  *                            <ol>
  *                            <li>errorCode
  *                            <li>errorMessage
  *                            </ol>
  * @property {function} onMessageDelivered - called when a message has been delivered.
  *                            All processing that this Client will ever do has been completed. So, for example,
  *                            in the case of a Qos=2 message sent by this client, the PubComp flow has been received from the server
  *                            and the message has been removed from persistent storage before this callback is invoked.
  *                            Parameters passed to the onMessageDelivered callback are:
  *                            <ol>
  *                            <li>{@link Paho.Message} that was delivered.
  *                            </ol>
  * @property {function} onMessageArrived - called when a message has arrived in this Paho.client.
  *                            Parameters passed to the onMessageArrived callback are:
  *                            <ol>
  *                            <li>{@link Paho.Message} that has arrived.
  *                            </ol>
  * @property {function} onConnected - called when a connection is successfully made to the server.
  *                                  after a connect() method.
  *                                  Parameters passed to the onConnected callback are:
  *                                  <ol>
  *                                  <li>reconnect (boolean) - If true, the connection was the result of a reconnect.</li>
  *                                  <li>URI (string) - The URI used to connect to the server.</li>
  *                                  </ol>
  * @property {boolean} disconnectedPublishing - if set, will enable disconnected publishing in
  *                                            in the event that the connection to the server is lost.
  * @property {number} disconnectedBufferSize - Used to set the maximum number of messages that the disconnected
  *                                             buffer will hold before rejecting new messages. Default size: 5000 messages
  * @property {function} trace - called whenever trace is called. TODO
  */
		var Client = function Client(host, port, path, clientId) {

			var uri;

			if (typeof host !== "string") throw new Error(format(ERROR.INVALID_TYPE, [typeof host === "undefined" ? "undefined" : _typeof(host), "host"]));

			if (arguments.length == 2) {
				// host: must be full ws:// uri
				// port: clientId
				clientId = port;
				uri = host;
				var match = uri.match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);
				if (match) {
					host = match[4] || match[2];
					port = parseInt(match[7]);
					path = match[8];
				} else {
					throw new Error(format(ERROR.INVALID_ARGUMENT, [host, "host"]));
				}
			} else {
				if (arguments.length == 3) {
					clientId = path;
					path = "/mqtt";
				}
				if (typeof port !== "number" || port < 0) throw new Error(format(ERROR.INVALID_TYPE, [typeof port === "undefined" ? "undefined" : _typeof(port), "port"]));
				if (typeof path !== "string") throw new Error(format(ERROR.INVALID_TYPE, [typeof path === "undefined" ? "undefined" : _typeof(path), "path"]));

				var ipv6AddSBracket = host.indexOf(":") !== -1 && host.slice(0, 1) !== "[" && host.slice(-1) !== "]";
				uri = "ws://" + (ipv6AddSBracket ? "[" + host + "]" : host) + ":" + port + path;
			}

			var clientIdLength = 0;
			for (var i = 0; i < clientId.length; i++) {
				var charCode = clientId.charCodeAt(i);
				if (0xD800 <= charCode && charCode <= 0xDBFF) {
					i++; // Surrogate pair.
				}
				clientIdLength++;
			}
			if (typeof clientId !== "string" || clientIdLength > 65535) throw new Error(format(ERROR.INVALID_ARGUMENT, [clientId, "clientId"]));

			var client = new ClientImpl(uri, host, port, path, clientId);

			//Public Properties
			Object.defineProperties(this, {
				"host": {
					get: function get() {
						return host;
					},
					set: function set() {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					}
				},
				"port": {
					get: function get() {
						return port;
					},
					set: function set() {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					}
				},
				"path": {
					get: function get() {
						return path;
					},
					set: function set() {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					}
				},
				"uri": {
					get: function get() {
						return uri;
					},
					set: function set() {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					}
				},
				"clientId": {
					get: function get() {
						return client.clientId;
					},
					set: function set() {
						throw new Error(format(ERROR.UNSUPPORTED_OPERATION));
					}
				},
				"onConnected": {
					get: function get() {
						return client.onConnected;
					},
					set: function set(newOnConnected) {
						if (typeof newOnConnected === "function") client.onConnected = newOnConnected;else throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnConnected === "undefined" ? "undefined" : _typeof(newOnConnected), "onConnected"]));
					}
				},
				"disconnectedPublishing": {
					get: function get() {
						return client.disconnectedPublishing;
					},
					set: function set(newDisconnectedPublishing) {
						client.disconnectedPublishing = newDisconnectedPublishing;
					}
				},
				"disconnectedBufferSize": {
					get: function get() {
						return client.disconnectedBufferSize;
					},
					set: function set(newDisconnectedBufferSize) {
						client.disconnectedBufferSize = newDisconnectedBufferSize;
					}
				},
				"onConnectionLost": {
					get: function get() {
						return client.onConnectionLost;
					},
					set: function set(newOnConnectionLost) {
						if (typeof newOnConnectionLost === "function") client.onConnectionLost = newOnConnectionLost;else throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnConnectionLost === "undefined" ? "undefined" : _typeof(newOnConnectionLost), "onConnectionLost"]));
					}
				},
				"onMessageDelivered": {
					get: function get() {
						return client.onMessageDelivered;
					},
					set: function set(newOnMessageDelivered) {
						if (typeof newOnMessageDelivered === "function") client.onMessageDelivered = newOnMessageDelivered;else throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageDelivered === "undefined" ? "undefined" : _typeof(newOnMessageDelivered), "onMessageDelivered"]));
					}
				},
				"onMessageArrived": {
					get: function get() {
						return client.onMessageArrived;
					},
					set: function set(newOnMessageArrived) {
						if (typeof newOnMessageArrived === "function") client.onMessageArrived = newOnMessageArrived;else throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageArrived === "undefined" ? "undefined" : _typeof(newOnMessageArrived), "onMessageArrived"]));
					}
				},
				"trace": {
					get: function get() {
						return client.traceFunction;
					},
					set: function set(trace) {
						if (typeof trace === "function") {
							client.traceFunction = trace;
						} else {
							throw new Error(format(ERROR.INVALID_TYPE, [typeof trace === "undefined" ? "undefined" : _typeof(trace), "onTrace"]));
						}
					}
				}
			});

			/**
   * Connect this Messaging client to its server.
   *
   * @name Paho.Client#connect
   * @function
   * @param {object} connectOptions - Attributes used with the connection.
   * @param {number} connectOptions.timeout - If the connect has not succeeded within this
   *                    number of seconds, it is deemed to have failed.
   *                    The default is 30 seconds.
   * @param {string} connectOptions.userName - Authentication username for this connection.
   * @param {string} connectOptions.password - Authentication password for this connection.
   * @param {Paho.Message} connectOptions.willMessage - sent by the server when the client
   *                    disconnects abnormally.
   * @param {number} connectOptions.keepAliveInterval - the server disconnects this client if
   *                    there is no activity for this number of seconds.
   *                    The default value of 60 seconds is assumed if not set.
   * @param {boolean} connectOptions.cleanSession - if true(default) the client and server
   *                    persistent state is deleted on successful connect.
   * @param {boolean} connectOptions.useSSL - if present and true, use an SSL Websocket connection.
   * @param {object} connectOptions.invocationContext - passed to the onSuccess callback or onFailure callback.
   * @param {function} connectOptions.onSuccess - called when the connect acknowledgement
   *                    has been received from the server.
   * A single response object parameter is passed to the onSuccess callback containing the following fields:
   * <ol>
   * <li>invocationContext as passed in to the onSuccess method in the connectOptions.
   * </ol>
   * @param {function} connectOptions.onFailure - called when the connect request has failed or timed out.
   * A single response object parameter is passed to the onFailure callback containing the following fields:
   * <ol>
   * <li>invocationContext as passed in to the onFailure method in the connectOptions.
   * <li>errorCode a number indicating the nature of the error.
   * <li>errorMessage text describing the error.
   * </ol>
   * @param {array} connectOptions.hosts - If present this contains either a set of hostnames or fully qualified
   * WebSocket URIs (ws://iot.eclipse.org:80/ws), that are tried in order in place
   * of the host and port paramater on the construtor. The hosts are tried one at at time in order until
   * one of then succeeds.
   * @param {array} connectOptions.ports - If present the set of ports matching the hosts. If hosts contains URIs, this property
   * is not used.
   * @param {boolean} connectOptions.reconnect - Sets whether the client will automatically attempt to reconnect
   * to the server if the connection is lost.
   *<ul>
   *<li>If set to false, the client will not attempt to automatically reconnect to the server in the event that the
   * connection is lost.</li>
   *<li>If set to true, in the event that the connection is lost, the client will attempt to reconnect to the server.
   * It will initially wait 1 second before it attempts to reconnect, for every failed reconnect attempt, the delay
   * will double until it is at 2 minutes at which point the delay will stay at 2 minutes.</li>
   *</ul>
   * @param {number} connectOptions.mqttVersion - The version of MQTT to use to connect to the MQTT Broker.
   *<ul>
   *<li>3 - MQTT V3.1</li>
   *<li>4 - MQTT V3.1.1</li>
   *</ul>
   * @param {boolean} connectOptions.mqttVersionExplicit - If set to true, will force the connection to use the
   * selected MQTT Version or will fail to connect.
   * @param {array} connectOptions.uris - If present, should contain a list of fully qualified WebSocket uris
   * (e.g. ws://iot.eclipse.org:80/ws), that are tried in order in place of the host and port parameter of the construtor.
   * The uris are tried one at a time in order until one of them succeeds. Do not use this in conjunction with hosts as
   * the hosts array will be converted to uris and will overwrite this property.
   * @throws {InvalidState} If the client is not in disconnected state. The client must have received connectionLost
   * or disconnected before calling connect for a second or subsequent time.
   */
			this.connect = function (connectOptions) {
				connectOptions = connectOptions || {};
				validate(connectOptions, { timeout: "number",
					userName: "string",
					password: "string",
					willMessage: "object",
					keepAliveInterval: "number",
					cleanSession: "boolean",
					useSSL: "boolean",
					invocationContext: "object",
					onSuccess: "function",
					onFailure: "function",
					hosts: "object",
					ports: "object",
					reconnect: "boolean",
					mqttVersion: "number",
					mqttVersionExplicit: "boolean",
					uris: "object" });

				// If no keep alive interval is set, assume 60 seconds.
				if (connectOptions.keepAliveInterval === undefined) connectOptions.keepAliveInterval = 60;

				if (connectOptions.mqttVersion > 4 || connectOptions.mqttVersion < 3) {
					throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.mqttVersion, "connectOptions.mqttVersion"]));
				}

				if (connectOptions.mqttVersion === undefined) {
					connectOptions.mqttVersionExplicit = false;
					connectOptions.mqttVersion = 4;
				} else {
					connectOptions.mqttVersionExplicit = true;
				}

				//Check that if password is set, so is username
				if (connectOptions.password !== undefined && connectOptions.userName === undefined) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.password, "connectOptions.password"]));

				if (connectOptions.willMessage) {
					if (!(connectOptions.willMessage instanceof Message)) throw new Error(format(ERROR.INVALID_TYPE, [connectOptions.willMessage, "connectOptions.willMessage"]));
					// The will message must have a payload that can be represented as a string.
					// Cause the willMessage to throw an exception if this is not the case.
					connectOptions.willMessage.stringPayload = null;

					if (typeof connectOptions.willMessage.destinationName === "undefined") throw new Error(format(ERROR.INVALID_TYPE, [_typeof(connectOptions.willMessage.destinationName), "connectOptions.willMessage.destinationName"]));
				}
				if (typeof connectOptions.cleanSession === "undefined") connectOptions.cleanSession = true;
				if (connectOptions.hosts) {

					if (!(connectOptions.hosts instanceof Array)) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));
					if (connectOptions.hosts.length < 1) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));

					var usingURIs = false;
					for (var i = 0; i < connectOptions.hosts.length; i++) {
						if (typeof connectOptions.hosts[i] !== "string") throw new Error(format(ERROR.INVALID_TYPE, [_typeof(connectOptions.hosts[i]), "connectOptions.hosts[" + i + "]"]));
						if (/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(connectOptions.hosts[i])) {
							if (i === 0) {
								usingURIs = true;
							} else if (!usingURIs) {
								throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts[" + i + "]"]));
							}
						} else if (usingURIs) {
							throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts[" + i + "]"]));
						}
					}

					if (!usingURIs) {
						if (!connectOptions.ports) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
						if (!(connectOptions.ports instanceof Array)) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
						if (connectOptions.hosts.length !== connectOptions.ports.length) throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));

						connectOptions.uris = [];

						for (var i = 0; i < connectOptions.hosts.length; i++) {
							if (typeof connectOptions.ports[i] !== "number" || connectOptions.ports[i] < 0) throw new Error(format(ERROR.INVALID_TYPE, [_typeof(connectOptions.ports[i]), "connectOptions.ports[" + i + "]"]));
							var host = connectOptions.hosts[i];
							var port = connectOptions.ports[i];

							var ipv6 = host.indexOf(":") !== -1;
							uri = "ws://" + (ipv6 ? "[" + host + "]" : host) + ":" + port + path;
							connectOptions.uris.push(uri);
						}
					} else {
						connectOptions.uris = connectOptions.hosts;
					}
				}

				client.connect(connectOptions);
			};

			/**
   * Subscribe for messages, request receipt of a copy of messages sent to the destinations described by the filter.
   *
   * @name Paho.Client#subscribe
   * @function
   * @param {string} filter describing the destinations to receive messages from.
   * <br>
   * @param {object} subscribeOptions - used to control the subscription
   *
   * @param {number} subscribeOptions.qos - the maximum qos of any publications sent
   *                                  as a result of making this subscription.
   * @param {object} subscribeOptions.invocationContext - passed to the onSuccess callback
   *                                  or onFailure callback.
   * @param {function} subscribeOptions.onSuccess - called when the subscribe acknowledgement
   *                                  has been received from the server.
   *                                  A single response object parameter is passed to the onSuccess callback containing the following fields:
   *                                  <ol>
   *                                  <li>invocationContext if set in the subscribeOptions.
   *                                  </ol>
   * @param {function} subscribeOptions.onFailure - called when the subscribe request has failed or timed out.
   *                                  A single response object parameter is passed to the onFailure callback containing the following fields:
   *                                  <ol>
   *                                  <li>invocationContext - if set in the subscribeOptions.
   *                                  <li>errorCode - a number indicating the nature of the error.
   *                                  <li>errorMessage - text describing the error.
   *                                  </ol>
   * @param {number} subscribeOptions.timeout - which, if present, determines the number of
   *                                  seconds after which the onFailure calback is called.
   *                                  The presence of a timeout does not prevent the onSuccess
   *                                  callback from being called when the subscribe completes.
   * @throws {InvalidState} if the client is not in connected state.
   */
			this.subscribe = function (filter, subscribeOptions) {
				if (typeof filter !== "string" && filter.constructor !== Array) throw new Error("Invalid argument:" + filter);
				subscribeOptions = subscribeOptions || {};
				validate(subscribeOptions, { qos: "number",
					invocationContext: "object",
					onSuccess: "function",
					onFailure: "function",
					timeout: "number"
				});
				if (subscribeOptions.timeout && !subscribeOptions.onFailure) throw new Error("subscribeOptions.timeout specified with no onFailure callback.");
				if (typeof subscribeOptions.qos !== "undefined" && !(subscribeOptions.qos === 0 || subscribeOptions.qos === 1 || subscribeOptions.qos === 2)) throw new Error(format(ERROR.INVALID_ARGUMENT, [subscribeOptions.qos, "subscribeOptions.qos"]));
				client.subscribe(filter, subscribeOptions);
			};

			/**
    * Unsubscribe for messages, stop receiving messages sent to destinations described by the filter.
    *
    * @name Paho.Client#unsubscribe
    * @function
    * @param {string} filter - describing the destinations to receive messages from.
    * @param {object} unsubscribeOptions - used to control the subscription
    * @param {object} unsubscribeOptions.invocationContext - passed to the onSuccess callback
   									  or onFailure callback.
    * @param {function} unsubscribeOptions.onSuccess - called when the unsubscribe acknowledgement has been received from the server.
    *                                    A single response object parameter is passed to the
    *                                    onSuccess callback containing the following fields:
    *                                    <ol>
    *                                    <li>invocationContext - if set in the unsubscribeOptions.
    *                                    </ol>
    * @param {function} unsubscribeOptions.onFailure called when the unsubscribe request has failed or timed out.
    *                                    A single response object parameter is passed to the onFailure callback containing the following fields:
    *                                    <ol>
    *                                    <li>invocationContext - if set in the unsubscribeOptions.
    *                                    <li>errorCode - a number indicating the nature of the error.
    *                                    <li>errorMessage - text describing the error.
    *                                    </ol>
    * @param {number} unsubscribeOptions.timeout - which, if present, determines the number of seconds
    *                                    after which the onFailure callback is called. The presence of
    *                                    a timeout does not prevent the onSuccess callback from being
    *                                    called when the unsubscribe completes
    * @throws {InvalidState} if the client is not in connected state.
    */
			this.unsubscribe = function (filter, unsubscribeOptions) {
				if (typeof filter !== "string" && filter.constructor !== Array) throw new Error("Invalid argument:" + filter);
				unsubscribeOptions = unsubscribeOptions || {};
				validate(unsubscribeOptions, { invocationContext: "object",
					onSuccess: "function",
					onFailure: "function",
					timeout: "number"
				});
				if (unsubscribeOptions.timeout && !unsubscribeOptions.onFailure) throw new Error("unsubscribeOptions.timeout specified with no onFailure callback.");
				client.unsubscribe(filter, unsubscribeOptions);
			};

			/**
   * Send a message to the consumers of the destination in the Message.
   *
   * @name Paho.Client#send
   * @function
   * @param {string|Paho.Message} topic - <b>mandatory</b> The name of the destination to which the message is to be sent.
   * 					   - If it is the only parameter, used as Paho.Message object.
   * @param {String|ArrayBuffer} payload - The message data to be sent.
   * @param {number} qos The Quality of Service used to deliver the message.
   * 		<dl>
   * 			<dt>0 Best effort (default).
   *     			<dt>1 At least once.
   *     			<dt>2 Exactly once.
   * 		</dl>
   * @param {Boolean} retained If true, the message is to be retained by the server and delivered
   *                     to both current and future subscriptions.
   *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
   *                     A received message has the retained boolean set to true if the message was published
   *                     with the retained boolean set to true
   *                     and the subscrption was made after the message has been published.
   * @throws {InvalidState} if the client is not connected.
   */
			this.send = function (topic, payload, qos, retained) {
				var message;

				if (arguments.length === 0) {
					throw new Error("Invalid argument." + "length");
				} else if (arguments.length == 1) {

					if (!(topic instanceof Message) && typeof topic !== "string") throw new Error("Invalid argument:" + (typeof topic === "undefined" ? "undefined" : _typeof(topic)));

					message = topic;
					if (typeof message.destinationName === "undefined") throw new Error(format(ERROR.INVALID_ARGUMENT, [message.destinationName, "Message.destinationName"]));
					client.send(message);
				} else {
					//parameter checking in Message object
					message = new Message(payload);
					message.destinationName = topic;
					if (arguments.length >= 3) message.qos = qos;
					if (arguments.length >= 4) message.retained = retained;
					client.send(message);
				}
			};

			/**
   * Publish a message to the consumers of the destination in the Message.
   * Synonym for Paho.Mqtt.Client#send
   *
   * @name Paho.Client#publish
   * @function
   * @param {string|Paho.Message} topic - <b>mandatory</b> The name of the topic to which the message is to be published.
   * 					   - If it is the only parameter, used as Paho.Message object.
   * @param {String|ArrayBuffer} payload - The message data to be published.
   * @param {number} qos The Quality of Service used to deliver the message.
   * 		<dl>
   * 			<dt>0 Best effort (default).
   *     			<dt>1 At least once.
   *     			<dt>2 Exactly once.
   * 		</dl>
   * @param {Boolean} retained If true, the message is to be retained by the server and delivered
   *                     to both current and future subscriptions.
   *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
   *                     A received message has the retained boolean set to true if the message was published
   *                     with the retained boolean set to true
   *                     and the subscrption was made after the message has been published.
   * @throws {InvalidState} if the client is not connected.
   */
			this.publish = function (topic, payload, qos, retained) {
				var message;

				if (arguments.length === 0) {
					throw new Error("Invalid argument." + "length");
				} else if (arguments.length == 1) {

					if (!(topic instanceof Message) && typeof topic !== "string") throw new Error("Invalid argument:" + (typeof topic === "undefined" ? "undefined" : _typeof(topic)));

					message = topic;
					if (typeof message.destinationName === "undefined") throw new Error(format(ERROR.INVALID_ARGUMENT, [message.destinationName, "Message.destinationName"]));
					client.send(message);
				} else {
					//parameter checking in Message object
					message = new Message(payload);
					message.destinationName = topic;
					if (arguments.length >= 3) message.qos = qos;
					if (arguments.length >= 4) message.retained = retained;
					client.send(message);
				}
			};

			/**
   * Normal disconnect of this Messaging client from its server.
   *
   * @name Paho.Client#disconnect
   * @function
   * @throws {InvalidState} if the client is already disconnected.
   */
			this.disconnect = function () {
				client.disconnect();
			};

			/**
   * Get the contents of the trace log.
   *
   * @name Paho.Client#getTraceLog
   * @function
   * @return {Object[]} tracebuffer containing the time ordered trace records.
   */
			this.getTraceLog = function () {
				return client.getTraceLog();
			};

			/**
   * Start tracing.
   *
   * @name Paho.Client#startTrace
   * @function
   */
			this.startTrace = function () {
				client.startTrace();
			};

			/**
   * Stop tracing.
   *
   * @name Paho.Client#stopTrace
   * @function
   */
			this.stopTrace = function () {
				client.stopTrace();
			};

			this.isConnected = function () {
				return client.connected;
			};
		};

		/**
  * An application message, sent or received.
  * <p>
  * All attributes may be null, which implies the default values.
  *
  * @name Paho.Message
  * @constructor
  * @param {String|ArrayBuffer} payload The message data to be sent.
  * <p>
  * @property {string} payloadString <i>read only</i> The payload as a string if the payload consists of valid UTF-8 characters.
  * @property {ArrayBuffer} payloadBytes <i>read only</i> The payload as an ArrayBuffer.
  * <p>
  * @property {string} destinationName <b>mandatory</b> The name of the destination to which the message is to be sent
  *                    (for messages about to be sent) or the name of the destination from which the message has been received.
  *                    (for messages received by the onMessage function).
  * <p>
  * @property {number} qos The Quality of Service used to deliver the message.
  * <dl>
  *     <dt>0 Best effort (default).
  *     <dt>1 At least once.
  *     <dt>2 Exactly once.
  * </dl>
  * <p>
  * @property {Boolean} retained If true, the message is to be retained by the server and delivered
  *                     to both current and future subscriptions.
  *                     If false the server only delivers the message to current subscribers, this is the default for new Messages.
  *                     A received message has the retained boolean set to true if the message was published
  *                     with the retained boolean set to true
  *                     and the subscrption was made after the message has been published.
  * <p>
  * @property {Boolean} duplicate <i>read only</i> If true, this message might be a duplicate of one which has already been received.
  *                     This is only set on messages received from the server.
  *
  */
		var Message = function Message(newPayload) {
			var payload;
			if (typeof newPayload === "string" || newPayload instanceof ArrayBuffer || ArrayBuffer.isView(newPayload) && !(newPayload instanceof DataView)) {
				payload = newPayload;
			} else {
				throw format(ERROR.INVALID_ARGUMENT, [newPayload, "newPayload"]);
			}

			var destinationName;
			var qos = 0;
			var retained = false;
			var duplicate = false;

			Object.defineProperties(this, {
				"payloadString": {
					enumerable: true,
					get: function get() {
						if (typeof payload === "string") return payload;else return parseUTF8(payload, 0, payload.length);
					}
				},
				"payloadBytes": {
					enumerable: true,
					get: function get() {
						if (typeof payload === "string") {
							var buffer = new ArrayBuffer(UTF8Length(payload));
							var byteStream = new Uint8Array(buffer);
							stringToUTF8(payload, byteStream, 0);

							return byteStream;
						} else {
							return payload;
						}
					}
				},
				"destinationName": {
					enumerable: true,
					get: function get() {
						return destinationName;
					},
					set: function set(newDestinationName) {
						if (typeof newDestinationName === "string") destinationName = newDestinationName;else throw new Error(format(ERROR.INVALID_ARGUMENT, [newDestinationName, "newDestinationName"]));
					}
				},
				"qos": {
					enumerable: true,
					get: function get() {
						return qos;
					},
					set: function set(newQos) {
						if (newQos === 0 || newQos === 1 || newQos === 2) qos = newQos;else throw new Error("Invalid argument:" + newQos);
					}
				},
				"retained": {
					enumerable: true,
					get: function get() {
						return retained;
					},
					set: function set(newRetained) {
						if (typeof newRetained === "boolean") retained = newRetained;else throw new Error(format(ERROR.INVALID_ARGUMENT, [newRetained, "newRetained"]));
					}
				},
				"topic": {
					enumerable: true,
					get: function get() {
						return destinationName;
					},
					set: function set(newTopic) {
						destinationName = newTopic;
					}
				},
				"duplicate": {
					enumerable: true,
					get: function get() {
						return duplicate;
					},
					set: function set(newDuplicate) {
						duplicate = newDuplicate;
					}
				}
			});
		};

		// Module contents.
		return {
			Client: Client,
			Message: Message
		};
		// eslint-disable-next-line no-nested-ternary
	}(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	return PahoMQTT;
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/srcdoc-polyfill/srcdoc-polyfill.js":
/*!*********************************************************!*\
  !*** ./node_modules/srcdoc-polyfill/srcdoc-polyfill.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
	// `root` does not resolve to the global window object in a Browserified
	// bundle, so a direct reference to that object is used instead.
	var _srcDoc = window.srcDoc;

	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (exports) {
			factory(exports, _srcDoc);
			root.srcDoc = exports;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
})(this, function (exports, _srcDoc) {
	var idx, iframes;
	var isCompliant = !!("srcdoc" in document.createElement("iframe"));
	var sandboxMsg = "Polyfill may not function in the presence of the " + "`sandbox` attribute. Consider using the `force` option.";
	var sandboxAllow = /\ballow-same-origin\b/;
	/**
  * Determine if the operation may be blocked by the `sandbox` attribute in
  * some environments, and optionally issue a warning or remove the
  * attribute.
  */
	var validate = function validate(iframe, options) {
		var sandbox = iframe.getAttribute("sandbox");
		if (typeof sandbox === "string" && !sandboxAllow.test(sandbox)) {
			if (options && options.force) {
				iframe.removeAttribute("sandbox");
			} else if (!options || options.force !== false) {
				logError(sandboxMsg);
				iframe.setAttribute("data-srcdoc-polyfill", sandboxMsg);
			}
		}
	};
	var implementations = {
		compliant: function compliant(iframe, content, options) {

			if (content) {
				validate(iframe, options);
				iframe.setAttribute("srcdoc", content);
			}
		},
		legacy: function legacy(iframe, content, options) {

			var jsUrl;

			if (!iframe || !iframe.getAttribute) {
				return;
			}

			if (!content) {
				content = iframe.getAttribute("srcdoc");
			} else {
				iframe.setAttribute("srcdoc", content);
			}

			if (content) {
				validate(iframe, options);

				// The value returned by a script-targeted URL will be used as
				// the iFrame's content. Create such a URL which returns the
				// iFrame element's `srcdoc` attribute.
				jsUrl = "javascript: window.frameElement.getAttribute('srcdoc');";

				// Explicitly set the iFrame's window.location for
				// compatability with IE9, which does not react to changes in
				// the `src` attribute when it is a `javascript:` URL, for
				// some reason
				if (iframe.contentWindow) {
					iframe.contentWindow.location = jsUrl;
				}

				iframe.setAttribute("src", jsUrl);
			}
		}
	};
	var srcDoc = exports;
	var logError;

	if (window.console && window.console.error) {
		logError = function logError(msg) {
			window.console.error("[srcdoc-polyfill] " + msg);
		};
	} else {
		logError = function logError() {};
	}

	// Assume the best
	srcDoc.set = implementations.compliant;
	srcDoc.noConflict = function () {
		window.srcDoc = _srcDoc;
		return srcDoc;
	};

	// If the browser supports srcdoc, no shimming is necessary
	if (isCompliant) {
		return;
	}

	srcDoc.set = implementations.legacy;

	// Automatically shim any iframes already present in the document
	iframes = document.getElementsByTagName("iframe");
	idx = iframes.length;

	while (idx--) {
		srcDoc.set(iframes[idx]);
	}
});

/***/ }),

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
}

module.exports = bytesToUuid;

/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof options == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

/***/ }),

/***/ "./node_modules/videojs-errors/dist/videojs-errors.es.js":
/*!***************************************************************!*\
  !*** ./node_modules/videojs-errors/dist/videojs-errors.es.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var global_document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! global/document */ "./node_modules/global/document.js");
/* harmony import */ var global_document__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(global_document__WEBPACK_IMPORTED_MODULE_1__);
/*! @name videojs-errors @version 4.1.3 @license Apache-2.0 */



var version = "4.1.3";

var FlashObj = video_js__WEBPACK_IMPORTED_MODULE_0___default.a.getComponent('Flash');
var defaultDismiss = !video_js__WEBPACK_IMPORTED_MODULE_0___default.a.browser.IS_IPHONE;

// Video.js 5/6 cross-compatibility.
var registerPlugin = video_js__WEBPACK_IMPORTED_MODULE_0___default.a.registerPlugin || video_js__WEBPACK_IMPORTED_MODULE_0___default.a.plugin;

// Default options for the plugin.
var defaults = {
  header: '',
  code: '',
  message: '',
  timeout: 45 * 1000,
  dismiss: defaultDismiss,
  progressDisabled: false,
  errors: {
    '1': {
      type: 'MEDIA_ERR_ABORTED',
      headline: 'The video download was cancelled'
    },
    '2': {
      type: 'MEDIA_ERR_NETWORK',
      headline: 'The video connection was lost, please confirm you are ' + 'connected to the internet'
    },
    '3': {
      type: 'MEDIA_ERR_DECODE',
      headline: 'The video is bad or in a format that cannot be played on your browser'
    },
    '4': {
      type: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
      headline: 'This video is either unavailable or not supported in this browser'
    },
    '5': {
      type: 'MEDIA_ERR_ENCRYPTED',
      headline: 'The video you are trying to watch is encrypted and we do not know how ' + 'to decrypt it'
    },
    'unknown': {
      type: 'MEDIA_ERR_UNKNOWN',
      headline: 'An unanticipated problem was encountered, check back soon and try again'
    },
    '-1': {
      type: 'PLAYER_ERR_NO_SRC',
      headline: 'No video has been loaded'
    },
    '-2': {
      type: 'PLAYER_ERR_TIMEOUT',
      headline: 'Could not download the video'
    },
    'PLAYER_ERR_DOMAIN_RESTRICTED': {
      headline: 'This video is restricted from playing on your current domain'
    },
    'PLAYER_ERR_IP_RESTRICTED': {
      headline: 'This video is restricted at your current IP address'
    },
    'PLAYER_ERR_GEO_RESTRICTED': {
      headline: 'This video is restricted from playing in your current geographic region'
    },
    'FLASHLS_ERR_CROSS_DOMAIN': {
      headline: 'The video could not be loaded: crossdomain access denied.'
    }
  }
};

var initPlugin = function initPlugin(player, options) {
  var monitor = void 0;
  var waiting = void 0;
  var isStalling = void 0;
  var listeners = [];

  var updateErrors = function updateErrors(updates) {
    options.errors = video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mergeOptions(options.errors, updates);

    // Create `code`s from errors which don't have them (based on their keys).
    Object.keys(options.errors).forEach(function (k) {
      var err = options.errors[k];

      if (!err.type) {
        err.type = k;
      }
    });
  };

  // Make sure we flesh out initially-provided errors.
  updateErrors();

  // clears the previous monitor timeout and sets up a new one
  var resetMonitor = function resetMonitor() {
    // at this point the player has recovered
    player.clearTimeout(waiting);
    if (isStalling) {
      isStalling = false;
      player.removeClass('vjs-waiting');
    }

    // start the loading spinner if player has stalled
    waiting = player.setTimeout(function () {
      // player already has an error
      // or is not playing under normal conditions
      if (player.error() || player.paused() || player.ended()) {
        return;
      }

      isStalling = true;
      player.addClass('vjs-waiting');
    }, 1000);

    player.clearTimeout(monitor);
    monitor = player.setTimeout(function () {
      // player already has an error
      // or is not playing under normal conditions
      if (player.error() || player.paused() || player.ended()) {
        return;
      }

      player.error({
        code: -2,
        type: 'PLAYER_ERR_TIMEOUT'
      });
    }, options.timeout);

    // clear out any existing player timeout
    // playback has recovered
    if (player.error() && player.error().code === -2) {
      player.error(null);
    }
  };

  // clear any previously registered listeners
  var cleanup = function cleanup() {
    var listener = void 0;

    while (listeners.length) {
      listener = listeners.shift();
      player.off(listener[0], listener[1]);
    }
    player.clearTimeout(monitor);
    player.clearTimeout(waiting);
  };

  // creates and tracks a player listener if the player looks alive
  var healthcheck = function healthcheck(type, fn) {
    var check = function check() {
      // if there's an error do not reset the monitor and
      // clear the error unless time is progressing
      if (!player.error()) {
        // error if using Flash and its API is unavailable
        var tech = player.$('.vjs-tech');

        if (tech && tech.type === 'application/x-shockwave-flash' && !tech.vjs_getProperty) {
          player.error({
            code: -2,
            type: 'PLAYER_ERR_TIMEOUT'
          });
          return;
        }

        // playback isn't expected if the player is paused
        if (player.paused()) {
          return resetMonitor();
        }
        // playback isn't expected once the video has ended
        if (player.ended()) {
          return resetMonitor();
        }
      }

      fn.call(this);
    };

    player.on(type, check);
    listeners.push([type, check]);
  };

  var onPlayStartMonitor = function onPlayStartMonitor() {
    var lastTime = 0;

    cleanup();

    // if no playback is detected for long enough, trigger a timeout error
    resetMonitor();
    healthcheck(['timeupdate', 'adtimeupdate'], function () {
      var currentTime = player.currentTime();

      // playback is operating normally or has recovered
      if (currentTime !== lastTime) {
        lastTime = currentTime;
        resetMonitor();
      }
    });

    if (!options.progressDisabled) {
      healthcheck('progress', resetMonitor);
    }
  };

  var onPlayNoSource = function onPlayNoSource() {
    if (!player.currentSrc()) {
      player.error({
        code: -1,
        type: 'PLAYER_ERR_NO_SRC'
      });
    }
  };

  var onErrorHandler = function onErrorHandler() {
    var details = '';
    var error = player.error();
    var content = global_document__WEBPACK_IMPORTED_MODULE_1___default.a.createElement('div');
    var dialogContent = '';

    // In the rare case when `error()` does not return an error object,
    // defensively escape the handler function.
    if (!error) {
      return;
    }

    error = video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mergeOptions(error, options.errors[error.code || error.type || 0]);

    if (error.message) {
      details = '<div class="vjs-errors-details">' + player.localize('Technical details') + '\n        : <div class="vjs-errors-message">' + player.localize(error.message) + '</div>\n        </div>';
    }

    if (error.code === 4 && FlashObj && !FlashObj.isSupported()) {
      var flashMessage = player.localize('If you are using an older browser please try upgrading or installing Flash.');

      details += '<span class="vjs-errors-flashmessage">' + flashMessage + '</span>';
    }

    var display = player.getChild('errorDisplay');

    content.className = 'vjs-errors-dialog';
    content.id = 'vjs-errors-dialog';
    dialogContent = '<div class="vjs-errors-content-container">\n      <h2 class="vjs-errors-headline">' + this.localize(error.headline) + '</h2>\n        <div><b>' + this.localize('Error Code') + '</b>: ' + (error.type || error.code) + '</div>\n        ' + details + '\n      </div>';

    var closeable = display.closeable(!('dismiss' in error) || error.dismiss);

    // We should get a close button
    if (closeable) {
      dialogContent += '<div class="vjs-errors-ok-button-container">\n          <button class="vjs-errors-ok-button">' + this.localize('OK') + '</button>\n        </div>';
      content.innerHTML = dialogContent;
      display.fillWith(content);
      // Get the close button inside the error display
      display.contentEl().firstChild.appendChild(display.getChild('closeButton').el());

      var okButton = display.el().querySelector('.vjs-errors-ok-button');

      player.on(okButton, 'click', function () {
        display.close();
      });
    } else {
      content.innerHTML = dialogContent;
      display.fillWith(content);
    }

    if (player.currentWidth() <= 600 || player.currentHeight() <= 250) {
      display.addClass('vjs-xs');
    }

    display.one('modalclose', function () {
      return player.error(null);
    });
  };

  var onDisposeHandler = function onDisposeHandler() {
    cleanup();

    player.removeClass('vjs-errors');
    player.off('play', onPlayStartMonitor);
    player.off('play', onPlayNoSource);
    player.off('dispose', onDisposeHandler);
    player.off(['aderror', 'error'], onErrorHandler);
  };

  var reInitPlugin = function reInitPlugin(newOptions) {
    onDisposeHandler();
    initPlugin(player, video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mergeOptions(defaults, newOptions));
  };

  reInitPlugin.extend = function (errors) {
    return updateErrors(errors);
  };
  reInitPlugin.getAll = function () {
    return video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mergeOptions(options.errors);
  };

  // Get / set timeout value. Restart monitor if changed.
  reInitPlugin.timeout = function (timeout) {
    if (typeof timeout === 'undefined') {
      return options.timeout;
    }
    if (timeout !== options.timeout) {
      options.timeout = timeout;
      if (!player.paused()) {
        onPlayStartMonitor();
      }
    }
  };

  reInitPlugin.disableProgress = function (disabled) {
    options.progressDisabled = disabled;
    onPlayStartMonitor();
  };

  player.on('play', onPlayStartMonitor);
  player.on('play', onPlayNoSource);
  player.on('dispose', onDisposeHandler);
  player.on(['aderror', 'error'], onErrorHandler);

  player.ready(function () {
    player.addClass('vjs-errors');
  });

  // if the plugin is re-initialised during playback, start the timeout handler.
  if (!player.paused()) {
    onPlayStartMonitor();
  }

  // Include the version number.
  reInitPlugin.VERSION = version;

  player.errors = reInitPlugin;
};

var errors = function errors(options) {
  initPlugin(this, video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mergeOptions(defaults, options));
};

['extend', 'getAll', 'disableProgress'].forEach(function (k) {
  errors[k] = function () {
    video_js__WEBPACK_IMPORTED_MODULE_0___default.a.log.warn('The errors.' + k + '() method is not available until the plugin has been initialized!');
  };
});

// Include the version number.
errors.VERSION = version;

// Register the plugin with video.js.
registerPlugin('errors', errors);

/* harmony default export */ __webpack_exports__["default"] = (errors);

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, main, generator-videojs-plugin, scripts, keywords, author, license, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = {"name":"clsp-videojs-plugin","version":"0.14.0-3","description":"Uses clsp (iot) as a video distribution system, video is is received via the clsp client then rendered using the media source extensions. ","main":"dist/clsp-videojs-plugin.js","generator-videojs-plugin":{"version":"5.0.0"},"scripts":{"build":"./scripts/build.sh","serve":"./scripts/serve.sh","lint":"eslint ./ --cache --quiet --ext .js","lint-fix":"eslint ./ --cache --quiet --ext .js --fix","version":"./scripts/version.sh","postversion":"git push && git push --tags"},"keywords":["videojs","videojs-plugin"],"author":"https://www.skylinenet.net","license":"Apache-2.0","dependencies":{"debug":"^3.1.0","lodash":"^4.17.10","moment":"^2.22.2","paho-client":"git+https://github.com/eclipse/paho.mqtt.javascript.git#v1.1.0","videojs-errors":"^4.1.1"},"devDependencies":{"babel-core":"^6.26.3","babel-eslint":"^8.2.5","babel-loader":"^7.1.5","babel-plugin-transform-class-properties":"^6.24.1","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-polyfill":"^6.26.0","babel-preset-env":"^1.7.0","css-loader":"^0.28.11","eslint":"^5.0.1","extract-text-webpack-plugin":"^4.0.0-beta.0","jquery":"^3.3.1","node-sass":"^4.9.1","pre-commit":"^1.2.2","sass-loader":"^7.0.3","srcdoc-polyfill":"^1.0.0","standard":"^11.0.1","style-loader":"^0.21.0","uglifyjs-webpack-plugin":"^1.2.7","url-loader":"^1.0.1","video.js":"6.7.1","webpack":"^4.15.1","webpack-serve":"^2.0.2","write-file-webpack-plugin":"^4.3.2"}};

/***/ }),

/***/ "./src/js/clsp-videojs-plugin.js":
/*!***************************************!*\
  !*** ./src/js/clsp-videojs-plugin.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _plugin_MseOverMqttPlugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ~/plugin/MseOverMqttPlugin */ "./src/js/plugin/MseOverMqttPlugin.js");
/**
 * This file is the target of the distributable js file.  It registers the
 * CLSP plugin with videojs for you.
 *
 * If you would like to use the videojs plugin without having it registered
 * for you, you can include the `MseOverMqttPlugin` file directly (ES6 only).
 */



var clspPlugin = Object(_plugin_MseOverMqttPlugin__WEBPACK_IMPORTED_MODULE_0__["default"])();

clspPlugin.register();

/* harmony default export */ __webpack_exports__["default"] = (clspPlugin);

/***/ }),

/***/ "./src/js/iov/Conduit.js":
/*!*******************************!*\
  !*** ./src/js/iov/Conduit.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_dist_Router_min__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ~root/dist/Router.min */ "./dist/Router.min.js");
/* harmony import */ var _root_dist_Router_min__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_root_dist_Router_min__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a single video. This is basically an in browser micro service which
 * uses cross document communication to route data to and from the iframe.
 */

// We want the minified file to minimize the size of each iframe

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Conduit = function () {
  _createClass(Conduit, null, [{
    key: 'factory',
    value: function factory(iov) {
      return new Conduit(iov);
    }
  }]);

  function Conduit(iov) {
    _classCallCheck(this, Conduit);

    this.iov = iov;
    this.clientId = iov.config.clientId;
    this.dispatch = {};

    this.iframe = this.generateIframe();

    this.attachIframe();

    this.destroyed = false;
  }

  _createClass(Conduit, [{
    key: 'generateIframe',
    value: function generateIframe() {
      var iframe = document.createElement('iframe');

      var markup = '\n      <html>\n        <head>\n          <script type="text/javascript">\n            window.MqttClientId = "' + this.clientId + '";\n            window.iframeCode = ' + _root_dist_Router_min__WEBPACK_IMPORTED_MODULE_0___default.a.toString() + '();\n          </script>\n        </head>\n        <body onload="window.iframeCode.clspRouter();" onunload="window.iframeCode.onunload();">\n          <div id="message"></div>\n        </body>\n      </html>\n    ';

      iframe.srcdoc = markup;

      iframe.width = 0;
      iframe.height = 0;
      iframe.setAttribute('style', 'display:none;');
      iframe.setAttribute('id', this.clientId);

      return iframe;
    }
  }, {
    key: 'attachIframe',
    value: function attachIframe() {
      var _this = this;

      // attach hidden iframe to player
      // document.body.appendChild(iframe);
      if (this.iov.config.videoElementParent !== null) {
        this.iov.config.videoElementParent.appendChild(this.iframe);
      } else if (this.iov.videoElement.parentNode !== null) {
        this.iov.videoElement.parentNode.appendChild(this.iframe);
        this.iov.config.videoElementParent = this.iov.videoElement.parentNode;
      } else {
        var interval = setInterval(function () {
          if (_this.iov.videoElement.parentNode !== null) {
            _this.iov.videoElement.parentNode.appendChild(_this.iframe);
            _this.iov.config.videoElementParent = _this.iov.videoElement.parentNode;
            clearInterval(interval);
          }
        }, 1000);
      }
    }

    // primitive function that routes message to iframe

  }, {
    key: 'command',
    value: function command(message) {
      var _this2 = this;

      if (this.iframe.contentWindow !== null) {
        this.iframe.contentWindow.postMessage(message, '*');
        return;
      }

      var interval = setInterval(function () {
        if (_this2.iframe.contentWindow !== null) {
          _this2.iframe.contentWindow.postMessage(message, '*');
          clearInterval(interval);
        }
      }, 1000);
    }

    /* message from mqttRouter routeInbound go handler which associates this
      client with the clientId. It then calls self.inboundHandler handler to
      process the message from the iframe.
    */

  }, {
    key: 'inboundHandler',
    value: function inboundHandler(message) {
      var handler = this.dispatch[message.destinationName];

      if (typeof handler !== 'undefined') {
        try {
          handler(message);
        } catch (e) {
          console.error(e);
        }
      } else {
        console.error('No handler for ' + message.destinationName);
      }
    }
  }, {
    key: 'subscribe',
    value: function subscribe(topic, callback) {
      this.dispatch[topic] = callback;

      this.command({
        method: 'subscribe',
        topic: topic
      });
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(topic) {
      if (topic in this.dispatch) {
        delete this.dispatch[topic];
      }

      this.command({
        method: 'unsubscribe',
        topic: topic
      });
    }
  }, {
    key: 'publish',
    value: function publish(topic, data) {
      this.command({
        method: 'publish',
        topic: topic,
        data: data
      });
    }
  }, {
    key: 'transaction',
    value: function transaction(topic, callback, data) {
      var _this3 = this;

      data.resp_topic = this.clientId + '/response/' + parseInt(Math.random() * 1000000);

      this.subscribe(data.resp_topic, function (mqtt_resp) {
        // call user specified callback to handle response from remote process
        var resp = JSON.parse(mqtt_resp.payloadString);
        // call user specified callback to handle response
        callback(resp);
        // cleanup.
        _this3.unsubscribe(data.resp_topic);
      });

      // start transaction
      // MQTTClient.send(mqtt_msg);
      this.publish(topic, data);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.destroyed = true;

      this.iov.destroy();

      this.iov = null;
      this.clientId = null;
      this.dispatch = null;
      this.iframe = null;
    }
  }]);

  return Conduit;
}();

/* harmony default export */ __webpack_exports__["default"] = (Conduit);

/***/ }),

/***/ "./src/js/iov/IOV.js":
/*!***************************!*\
  !*** ./src/js/iov/IOV.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/defaults */ "./node_modules/lodash/defaults.js");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! srcdoc-polyfill */ "./node_modules/srcdoc-polyfill/srcdoc-polyfill.js");
/* harmony import */ var srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Player */ "./src/js/iov/Player.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





// Needed for crossbrowser iframe support




var DEBUG_PREFIX = 'skyline:clsp:iov';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

//  @todo - should this be the videojs component?  it seems like the
// mqttHandler does nothing, and that this could replace it

var IOV = function () {
  _createClass(IOV, null, [{
    key: 'generateConfigFromUrl',
    value: function generateConfigFromUrl(url) {
      if (!url) {
        throw new Error('No source was given to be parsed!');
      }

      // We use an anchor tag here beacuse, when an href is added to
      // an anchor dom Element, the parsing is done for you by the
      // browser.
      var parser = document.createElement('a');

      var useSSL = void 0;
      var default_port = void 0;

      // Chrome is the only browser that allows non-http protocols in
      // the anchor tag's href, so change them all to http here so we
      // get the benefits of the anchor tag's parsing
      if (url.substring(0, 5).toLowerCase() === 'clsps') {
        useSSL = true;
        parser.href = url.replace('clsps', 'https');
        default_port = 443;
      } else if (url.substring(0, 4).toLowerCase() === 'clsp') {
        useSSL = false;
        parser.href = url.replace('clsp', 'http');
        default_port = 9001;
      } else {
        throw new Error('The given source is not a clsp url, and therefore cannot be parsed.');
      }

      var paths = parser.pathname.split('/');
      var streamName = paths[paths.length - 1];

      var hostname = parser.hostname;
      var port = parser.port;

      if (port.length === 0) {
        port = default_port;
      }

      // @ is a special address meaning the server that loaded the web page.
      if (hostname === '@') {
        hostname = window.location.hostname;
      }

      return {
        // url,
        wsbroker: hostname,
        wsport: parseInt(port),
        streamName: streamName,
        useSSL: useSSL
      };
    }
  }, {
    key: 'factory',
    value: function factory(mqttConduitCollection, player) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      return new IOV(mqttConduitCollection, player, config, options);
    }
  }, {
    key: 'fromUrl',
    value: function fromUrl(url, mqttConduitCollection, player) {
      var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      return IOV.factory(mqttConduitCollection, player, _extends({}, config, IOV.generateConfigFromUrl(url)), options);
    }
  }]);

  function IOV(mqttConduitCollection, player, config, options) {
    var _this = this;

    _classCallCheck(this, IOV);

    this.onChangeSource = function (event, data) {
      return _this.changeSource(data.url);
    };

    this.id = uuid_v4__WEBPACK_IMPORTED_MODULE_1___default()();

    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':' + this.id + ':main');
    this.debug('constructor');

    this.destroyed = false;
    this.onReadyAlreadyCalled = false;
    this.playerInstance = player;
    this.videoElement = this.playerInstance.el();

    this.options = lodash_defaults__WEBPACK_IMPORTED_MODULE_2___default()({}, options, {
      changeSourceMaxWait: 9750,
      statsInterval: 30000,
      enableMetrics: true
    });

    this.config = {
      clientId: this.id,
      wsbroker: config.wsbroker,
      wsport: config.wsport,
      useSSL: config.useSSL,
      streamName: config.streamName,
      videoElementParent: config.videoElementParent || null
    };

    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.config.clientId
    };

    // @todo - this needs to be a global service or something
    this.mqttConduitCollection = mqttConduitCollection;
  }

  _createClass(IOV, [{
    key: 'initialize',
    value: function initialize() {
      this.conduit = this.mqttConduitCollection.addFromIov(this);
      this.player = _Player__WEBPACK_IMPORTED_MODULE_4__["default"].factory(this, this.playerInstance);

      return this;
    }
  }, {
    key: 'clone',
    value: function clone(config, options) {
      this.debug('clone');

      var cloneConfig = _extends({}, config, {
        videoElementParent: this.config.videoElementParent
      });

      return IOV.factory(this.mqttConduitCollection, this.playerInstance, cloneConfig, options);
    }
  }, {
    key: 'changeSource',
    value: function changeSource(url) {
      this.debug('changeSource on player "' + this.id + '""');

      if (!url) {
        throw new Error('Unable to change source because there is no url!');
      }

      var iovUpdated = false;

      var clone = this.clone(IOV.generateConfigFromUrl(url), this.options);

      clone.initialize();

      clone.player.videoElement.style.display = 'none';

      // When the tab is not in focus, chrome doesn't handle things the same
      // way as when the tab is in focus, and it seems that the result of that
      // is that the "firstFrameShown" event never fires.  Having the IOV be
      // updated on a delay in case the "firstFrameShown" takes too long will
      // ensure that the old IOVs are destroyed, ensuring that unnecessary
      // socket connections, etc. are not being used, as this can cause the
      // browser to crash.
      // Note that if there is a better way to do this, it would likely reduce
      // the number of try/catch blocks and null checks in the IOVPlayer and
      // MSEWrapper, but I don't think that is likely to happen until the MSE
      // is standardized, and even then, we may be subject to non-intuitive
      // behavior based on tab switching, etc.
      setTimeout(function () {
        if (!iovUpdated) {
          clone.playerInstance.tech(true).mqtt.updateIOV(clone);
          clone.player.videoElement.style.display = 'initial';
        }
      }, clone.options.changeSourceMaxWait);

      // Under normal circumstances, meaning when the tab is in focus, we want
      // to respond by switching the IOV when the new IOV Player has something
      // to display
      // clone.player.on('firstFrameShown', () => {
      //   if (!iovUpdated) {
      //     clone.playerInstance.tech(true).mqtt.updateIOV(clone);
      //   }
      // });
    }
  }, {
    key: 'onReady',
    value: function onReady(event) {
      var _this2 = this;

      this.debug('onReady');

      // @todo - why is this necessary?
      if (this.videoElement.parentNode !== null) {
        this.config.videoElementParentId = this.videoElement.parentNode.id;
      }

      var videoTag = this.playerInstance.children()[0];

      // this.playerInstance.on('play', () => {
      //   console.log('playing....', this.player.id)
      // });

      // @todo - there must be a better way to determine autoplay...
      if (videoTag.getAttribute('autoplay') !== null) {
        // playButton.trigger('click');
        this.playerInstance.trigger('play', videoTag);
      }

      if (this.onReadyAlreadyCalled) {
        console.error('tried to use this player more than once...');
        return;
      }

      this.onReadyAlreadyCalled = true;

      this.player.on('firstFrameShown', function () {
        _this2.playerInstance.loadingSpinner.hide();

        videoTag.style.display = 'none';
      });

      this.player.on('videoReceived', function () {
        // reset the timeout monitor from videojs-errors
        _this2.playerInstance.trigger('timeupdate');
      });

      this.player.on('videoInfoReceived', function () {
        // reset the timeout monitor from videojs-errors
        _this2.playerInstance.trigger('timeupdate');
      });

      this.playerInstance.on('changesrc', this.onChangeSource);

      this.player.play(this.videoElement.firstChild.id, this.config.streamName);

      this.videoElement.addEventListener('mse-error-event', function (e) {
        _this2.player.restart();
      }, false);

      // the mse service will stop streaming to us if we don't send
      // a message to iov/stats within 1 minute.
      this._statsTimer = setInterval(function () {
        _this2.statsMsg.inkbps = _this2.statsMsg.byteCount * 8 / _this2.options.statsInterval;
        _this2.statsMsg.byteCount = 0;

        // @todo - can we disable this?
        _this2.conduit.publish('iov/stats', _this2.statsMsg);

        _this2.debug('iov status', _this2.statsMsg);
      }, this.options.statsInterval);
    }
  }, {
    key: 'onFail',
    value: function onFail(event) {
      this.debug('onFail');

      this.debug('network error', event.data.reason);
      this.playerInstance.trigger('network-error', event.data.reason);
    }
  }, {
    key: 'onData',
    value: function onData(event) {
      this.debug('onData');

      this.conduit.inboundHandler(event.data);
    }
  }, {
    key: 'onMessage',
    value: function onMessage(event) {
      var eventType = event.data.event;

      this.debug('onMessage', eventType);

      switch (eventType) {
        case 'ready':
          {
            this.onReady(event);
            break;
          }
        case 'fail':
          {
            this.onFail(event);
            break;
          }
        case 'data':
          {
            this.onData(event);
            break;
          }
        default:
          {
            console.error('No match for event: ' + eventType);
          }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.debug('destroy');

      if (this.destroyed) {
        return;
      }

      this.destroyed = true;

      clearInterval(this._statsTimer);

      this.conduit.unsubscribe('iov/video/' + this.player.guid + '/live');

      this.playerInstance.off('changesrc', this.onChangeSource);

      this.player.destroy();

      this.playerInstance = null;
      this.player = null;

      this.mqttConduitCollection.remove(this.id);

      var iframe = document.getElementById(this.config.clientId);
      iframe.parentNode.removeChild(iframe);
      iframe.srcdoc = '';
    }
  }]);

  return IOV;
}();

/* harmony default export */ __webpack_exports__["default"] = (IOV);
;

/***/ }),

/***/ "./src/js/iov/Player.js":
/*!******************************!*\
  !*** ./src/js/iov/Player.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/defaults */ "./node_modules/lodash/defaults.js");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_ListenerBaseClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ~/utils/ListenerBaseClass */ "./src/js/utils/ListenerBaseClass.js");
/* harmony import */ var _mse_MediaSourceWrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ~/mse/MediaSourceWrapper */ "./src/js/mse/MediaSourceWrapper.js");
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }







/**
 * Responsible for receiving stream input and routing it to the media source
 * buffer for rendering on the video tag. There is some 'light' reworking of
 * the binary data that is required.
 *
 * @todo - this class should have no knowledge of videojs or its player, since
 * it is supposed to be capable of playing video by itself.  The plugin that
 * uses this player should have all of the videojs logic, and none should
 * exist here.
 *
 * var player = IOVPlayer.factory(iov);
 * player.play( video_element_id, stream_name );
*/

var IOVPlayer = function (_ListenerBaseClass) {
  _inherits(IOVPlayer, _ListenerBaseClass);

  _createClass(IOVPlayer, null, [{
    key: 'factory',
    value: function factory(iov, playerInstance) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return new IOVPlayer(iov, playerInstance, options);
    }
  }]);

  function IOVPlayer(iov, playerInstance, options) {
    _classCallCheck(this, IOVPlayer);

    var _this = _possibleConstructorReturn(this, (IOVPlayer.__proto__ || Object.getPrototypeOf(IOVPlayer)).call(this, IOVPlayer.DEBUG_NAME));

    _this.debug('constructor');

    _this._id = uuid_v4__WEBPACK_IMPORTED_MODULE_0___default()();
    _this.iov = iov;
    _this.playerInstance = playerInstance;
    _this.eid = _this.playerInstance.el().firstChild.id;
    _this.id = _this.eid.replace('_html5_api', '');

    _this.initializeVideoElement();

    _this.options = lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default()({}, options, {
      segmentIntervalSampleSize: 5,
      driftCorrectionConstant: 2,
      enableMetrics: true
    });

    _this.state = 'initializing';
    _this.firstFrameShown = false;

    // Used for determining the size of the internal buffer hidden from the MSE
    // api by recording the size and time of each chunk of video upon buffer append
    // and recording the time when the updateend event is called.
    _this.LogSourceBuffer = false;
    _this.LogSourceBufferTopic = null;

    _this.latestSegmentReceived = null;
    _this.segmentIntervalAverage = null;
    _this.segmentInterval = null;
    _this.segmentIntervals = [];

    _this.mediaSourceWrapper = null;
    _this.moovBox = null;
    _this.guid = null;
    _this.mimeCodec = null;
    return _this;
  }

  _createClass(IOVPlayer, [{
    key: '_onError',
    value: function _onError(type, message, error) {
      console.error(message);
      console.error(error);
    }
  }, {
    key: 'initializeVideoElement',
    value: function initializeVideoElement() {
      var _this2 = this;

      this.videoJsVideoElement = document.getElementById(this.eid);

      if (!this.videoJsVideoElement) {
        throw new Error('Unable to find an element in the DOM with id "' + this.eid + '".');
      }

      var videoId = 'clsp-video-' + this._id;

      // when videojs initializes the video element (or something like that),
      // it creates events and listeners on that element that it uses, however
      // these events interfere with our ability to play clsp streams.  Cloning
      // the element like this and reinserting it is a blunt instrument to remove
      // all of the videojs events so that we are in control of the player.
      // this.videoElement = this.videoJsVideoElement.cloneNode();
      this.videoElement = this.videoJsVideoElement.cloneNode();
      this.videoElement.setAttribute('id', videoId);
      this.videoElement.classList.add('clsp-video');

      this.videoElementParent = this.videoJsVideoElement.parentNode;

      this.on('firstFrameShown', function () {
        // @todo - this may be overkill given the IOV changeSourceMaxWait...
        // When the video is ready to be displayed, swap out the video player if
        // the source has changed.  This is what allows tours to switch to the next
        if (_this2.videoElementParent !== null) {
          try {
            _this2.videoElementParent.insertBefore(_this2.videoElement, _this2.videoJsVideoElement);

            var videos = _this2.videoElementParent.getElementsByTagName('video');

            for (var i = 0; i < videos.length; i++) {
              var video = videos[i];
              var id = video.getAttribute('id');

              if (id !== _this2.eid && id !== videoId) {
                // video.pause();
                // video.removeAttribute('src');
                // video.load();
                // video.style.display = 'none';
                _this2.videoElementParent.removeChild(video);
                video.remove();
                video = null;
                videos = null;
                break;
              }
            }

            // this.videoElementParent.replaceChild(this.videoElement, this.videoJsVideoElement);
            // is there still a reference to this element?
            // this.videoJsVideoElement = null;
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  }, {
    key: 'reinitializeMseWrapper',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this3 = this;

        var message;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.mediaSourceWrapper) {
                  this.mediaSourceWrapper.destroy();
                }

                this.mediaSourceWrapper = _mse_MediaSourceWrapper__WEBPACK_IMPORTED_MODULE_3__["default"].factory(this.videoElement);

                _context4.prev = 2;

                this.mediaSourceWrapper.registerMimeCodec(this.mimeCodec);
                _context4.next = 13;
                break;

              case 6:
                _context4.prev = 6;
                _context4.t0 = _context4['catch'](2);

                this.state = 'unsupported-mime-codec';

                message = 'Unsupported mime codec: ' + this.mimeCodec;


                this.videoPlayer.errors.extend({
                  PLAYER_ERR_IOV: {
                    headline: 'Error Playing Stream',
                    message: message
                  }
                });

                this.videoPlayer.error({ code: 'PLAYER_ERR_IOV' });

                throw new Error(message);

              case 13:

                this.mediaSourceWrapper.on('metric', function (_ref2) {
                  var type = _ref2.type,
                      value = _ref2.value;

                  _this3.trigger('metric', { type: type, value: value });
                });

                this.mediaSourceWrapper.on('sourceOpen', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _this3.debug('on mediaSource sourceopen');

                          _context3.next = 3;
                          return _this3.mediaSourceWrapper.initializeSourceBuffer();

                        case 3:

                          _this3.mediaSourceWrapper.sourceBuffer.on('metric', function (_ref4) {
                            var type = _ref4.type,
                                value = _ref4.value;

                            _this3.trigger('metric', { type: type, value: value });
                          });

                          _this3.mediaSourceWrapper.sourceBuffer.on('appendStart', function (moof) {
                            _this3.silly('On Append Start...');

                            if (_this3.LogSourceBuffer === true && _this3.LogSourceBufferTopic !== null) {
                              _this3.debug('Recording ' + parseInt(moof.length) + ' bytes of data.');

                              var mqtt_msg = new window.Paho.MQTT.Message(moof);
                              mqtt_msg.destinationName = _this3.LogSourceBufferTopic;
                              window.MQTTClient.send(mqtt_msg);
                            }

                            _this3.iov.statsMsg.byteCount += moof.length;
                          });

                          _this3.mediaSourceWrapper.sourceBuffer.on('appendFinish', function (info) {
                            _this3.silly('On Append Finish...');

                            if (!_this3.firstFrameShown) {
                              _this3.firstFrameShown = true;
                              _this3.trigger('firstFrameShown');
                            }

                            _this3.drift = info.bufferTimeEnd - _this3.videoElement.currentTime;

                            _this3.metric('iovPlayer.sourceBuffer.bufferTimeEnd', info.bufferTimeEnd);
                            _this3.metric('iovPlayer.video.currentTime', _this3.videoElement.currentTime);
                            _this3.metric('iovPlayer.video.drift', _this3.drift);

                            if (_this3.drift > _this3.segmentIntervalAverage / 1000 + _this3.options.driftCorrectionConstant) {
                              _this3.metric('iovPlayer.video.driftCorrection', 1);
                              _this3.videoElement.currentTime = info.bufferTimeEnd;
                            }

                            if (_this3.videoElement.paused === true) {
                              _this3.debug('Video is paused!');

                              try {
                                var promise = _this3.videoElement.play();

                                if (typeof promise !== 'undefined') {
                                  promise.catch(function (error) {
                                    _this3._onError('videojs.play.promise', 'Error while trying to play videojs player', error);
                                  });
                                }
                              } catch (error) {
                                _this3._onError('videojs.play.notPromise', 'Error while trying to play videojs player', error);
                              }
                            }
                          });

                          _this3.mediaSourceWrapper.sourceBuffer.on('appendError', function () {
                            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error) {
                              return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      // internal error, this has been observed to happen the tab
                                      // in the browser where this video player lives is hidden
                                      // then reselected. 'ex' is undefined the error is bug
                                      // within the MSE C++ implementation in the browser.
                                      _this3._onError('sourceBuffer.append', 'Error while appending to sourceBuffer', error);
                                      // this.videoPlayer.error({ code: 3 });
                                      _context.next = 3;
                                      return _this3.reinitializeMseWrapper();

                                    case 3:
                                    case 'end':
                                      return _context.stop();
                                  }
                                }
                              }, _callee, _this3);
                            }));

                            return function (_x2) {
                              return _ref5.apply(this, arguments);
                            };
                          }());

                          _this3.mediaSourceWrapper.sourceBuffer.on('removeFinish', function (info) {
                            _this3.debug('onRemoveFinish');
                          });

                          _this3.mediaSourceWrapper.sourceBuffer.on('removeError', function (error) {
                            if (error.constructor.name === 'DOMException') {
                              // @todo - every time the mediaSourceWrapper is destroyed, there is a
                              // sourceBuffer error.  No need to log that, but you should fix it
                              return;
                            }

                            // observed this fail during a memry snapshot in chrome
                            // otherwise no observed failure, so ignore exception.
                            _this3._onError('sourceBuffer.remove', 'Error while removing segments from sourceBuffer', error);
                          });

                          _this3.mediaSourceWrapper.sourceBuffer.on('streamFrozen', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _this3.debug('stream appears to be frozen - reinitializing...');

                                    _context2.next = 3;
                                    return _this3.reinitializeMseWrapper();

                                  case 3:
                                  case 'end':
                                    return _context2.stop();
                                }
                              }
                            }, _callee2, _this3);
                          })));

                          _this3.mediaSourceWrapper.sourceBuffer.on('error', function (error) {
                            _this3._onError('mediaSource.sourceBuffer.generic', 'mediaSource sourceBuffer error', error);
                          });

                          _this3.trigger('videoInfoReceived');
                          _this3.mediaSourceWrapper.sourceBuffer.appendMoov(_this3.moovBox);

                        case 13:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this3);
                })));

                this.mediaSourceWrapper.on('sourceEnded', function () {
                  _this3.debug('on mediaSource sourceended');

                  // @todo - do we need to clear the buffer manually?
                  _this3.stop();
                });

                this.mediaSourceWrapper.on('error', function (error) {
                  _this3._onError('mediaSource.generic', 'mediaSource error', error);
                });

                _context4.next = 19;
                return this.mediaSourceWrapper.initializeMediaSource();

              case 19:
                if (!(!this.mediaSourceWrapper.mediaSource || !this.videoElement)) {
                  _context4.next = 21;
                  break;
                }

                throw new Error('The video element or mediaSource is not ready!');

              case 21:

                this.mediaSourceWrapper.reinitializeVideoElementSrc();

              case 22:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[2, 6]]);
      }));

      function reinitializeMseWrapper() {
        return _ref.apply(this, arguments);
      }

      return reinitializeMseWrapper;
    }()
  }, {
    key: 'resyncStream',
    value: function resyncStream() {
      var _this4 = this;

      // subscribe to a sync topic that will be called if the stream that is feeding
      // the mse service dies and has to be restarted that this player should restart the stream
      this.debug('Trying to resync stream...');

      this.iov.conduit.subscribe('iov/video/' + this.guid + '/resync', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _this4.debug('sync received re-initialize media source buffer');
                _context5.next = 3;
                return _this4.reinitializeMseWrapper();

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this4);
      })));
    }
  }, {
    key: 'restart',
    value: function restart() {
      this.debug('restart');

      this.stop();
      this.play();
    }
  }, {
    key: 'play',
    value: function play(streamName) {
      var _this5 = this;

      this.debug('play');

      this.iov.conduit.transaction('iov/video/' + window.btoa(this.iov.config.streamName) + '/request', function () {
        return _this5.onIovPlayTransaction.apply(_this5, arguments);
      }, {
        clientId: this.iov.config.clientId,
        resp_topic: this.iov.config.clientId + '\'/response/\'' + parseInt(Math.random() * 1000000)
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.debug('stop');

      this.moovBox = null;

      if (this.guid !== undefined) {
        this.iov.conduit.unsubscribe('iov/video/' + this.guid + '/live');
      }

      this.iov.conduit.publish('iov/video/' + this.guid + '/stop', { clientId: this.iov.config.clientId });
    }
  }, {
    key: 'getSegmentIntervalMetrics',
    value: function getSegmentIntervalMetrics() {
      var previousSegmentReceived = this.latestSegmentReceived;
      this.latestSegmentReceived = Date.now();

      if (previousSegmentReceived) {
        this.segmentInterval = this.latestSegmentReceived - previousSegmentReceived;
      }

      if (this.segmentInterval) {
        if (this.segmentIntervals.length >= this.options.segmentIntervalSampleSize) {
          this.segmentIntervals.shift();
        }

        this.segmentIntervals.push(this.segmentInterval);

        var segmentIntervalSum = 0;

        for (var i = 0; i < this.segmentIntervals.length; i++) {
          segmentIntervalSum += this.segmentIntervals[i];
        }

        this.segmentIntervalAverage = segmentIntervalSum / this.segmentIntervals.length;

        this.metric('iovPlayer.video.segmentInterval', this.segmentInterval);
        this.metric('iovPlayer.video.segmentIntervalAverage', this.segmentIntervalAverage);
      }
    }

    /**
     * Before we can set up a listener for the moofs, we must first set up a few
     * initialization listeners, one for the stream request, and one for the moov.
     *
     * This method is what is executed when we first request a stream.  This should only
     * ever be executed once per stream.  Once this is executed, it unregisters
     * itself as a listener, and registers an init-segment listener, which also
     * only runs once, then unregisters itself.  The init-segment payload is the
     * moov.  Once we receive the moov, we can start listening for moofs.  The
     * listener for moofs runs indefinitely, until it is commanded to stop.
     *
     * @param {Object}
     *   The payload returned by the server.  This object contains the following properties:
     *   mimeCodec - the mime type for the stream
     *   guid - the unique id for this iov conduit connection
     */

  }, {
    key: 'onIovPlayTransaction',
    value: function onIovPlayTransaction(_ref8) {
      var _this6 = this;

      var mimeCodec = _ref8.mimeCodec,
          guid = _ref8.guid;

      this.debug('onIovPlayTransaction');

      var initSegmentTopic = this.iov.config.clientId + '/init-segment/' + parseInt(Math.random() * 1000000);

      this.state = 'waiting-for-first-moov';

      this.iov.conduit.subscribe(initSegmentTopic, function () {
        var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_ref9) {
          var payloadBytes = _ref9.payloadBytes;
          var moov, newTopic;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _this6.debug('onIovPlayTransaction ' + initSegmentTopic + ' listener fired');
                  _this6.debug('received moov of type "' + (typeof payloadBytes === 'undefined' ? 'undefined' : _typeof(payloadBytes)) + '" from server');

                  moov = payloadBytes;


                  _this6.state = 'waiting-for-first-moof';

                  _this6.iov.conduit.unsubscribe(initSegmentTopic);

                  newTopic = 'iov/video/' + guid + '/live';

                  // subscribe to the live video topic.

                  _this6.iov.conduit.subscribe(newTopic, function (mqtt_msg) {
                    _this6.trigger('videoReceived');
                    _this6.getSegmentIntervalMetrics();

                    // if (!this.mediaSourceWrapper || !this.mediaSourceWrapper.sourceBuffer) {
                    //   //
                    //   return this.reinitializeMseWrapper();
                    // }

                    _this6.mediaSourceWrapper.sourceBuffer.append(mqtt_msg.payloadBytes);
                  });

                  _this6.guid = guid;
                  _this6.moovBox = moov;
                  _this6.mimeCodec = mimeCodec;

                  // this.trigger('firstChunk');

                  _context6.next = 12;
                  return _this6.reinitializeMseWrapper();

                case 12:

                  _this6.resyncStream();

                case 13:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, _this6);
        }));

        return function (_x3) {
          return _ref10.apply(this, arguments);
        };
      }());

      this.iov.conduit.publish('iov/video/' + guid + '/play', {
        initSegmentTopic: initSegmentTopic,
        clientId: this.iov.config.clientId
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      _get(IOVPlayer.prototype.__proto__ || Object.getPrototypeOf(IOVPlayer.prototype), 'destroy', this).call(this);

      this.destroyed = true;

      this.stop();

      // Note you will need to destroy the iov yourself.  The child should
      // probably not destroy the parent
      this.iov = null;

      this.state = null;
      this.firstFrameShown = null;

      this.playerInstance = null;
      this.videoJsVideoElement = null;
      this.videoElementParent = null;

      this.events = null;
      this.metrics = null;

      this.LogSourceBuffer = null;
      this.LogSourceBufferTopic = null;

      this.latestSegmentReceived = null;
      this.segmentIntervalAverage = null;
      this.segmentInterval = null;
      this.segmentIntervals = null;

      this.moovBox = null;
      this.guid = null;
      this.mimeCodec = null;

      this.mediaSourceWrapper.destroy();
      this.mediaSourceWrapper = null;

      // Setting the src of the video element to an empty string is
      // the only reliable way we have found to ensure that MediaSource,
      // SourceBuffer, and various Video elements are properly dereferenced
      // to avoid memory leaks
      this.videoElement.src = '';
      this.videoElement = null;
    }
  }]);

  return IOVPlayer;
}(_utils_ListenerBaseClass__WEBPACK_IMPORTED_MODULE_2__["default"]);

IOVPlayer.DEBUG_NAME = 'skyline:clsp:iov:player';
IOVPlayer.EVENT_NAMES = ['metric', 'firstFrameShown', 'videoReceived', 'videoInfoReceived'];
IOVPlayer.METRIC_TYPES = ['iovPlayer.sourceBuffer.bufferTimeEnd', 'iovPlayer.video.currentTime', 'iovPlayer.video.drift', 'iovPlayer.video.driftCorrection', 'iovPlayer.video.segmentInterval', 'iovPlayer.video.segmentIntervalAverage'];
/* harmony default export */ __webpack_exports__["default"] = (IOVPlayer);
;

/***/ }),

/***/ "./src/js/mse/MediaSourceWrapper.js":
/*!******************************************!*\
  !*** ./src/js/mse/MediaSourceWrapper.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/defaults */ "./node_modules/lodash/defaults.js");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/noop */ "./node_modules/lodash/noop.js");
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_noop__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_ListenerBaseClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ~/utils/ListenerBaseClass */ "./src/js/utils/ListenerBaseClass.js");
/* harmony import */ var _SourceBufferWrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SourceBufferWrapper */ "./src/js/mse/SourceBufferWrapper.js");


var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





// import { mp4toJSON } from '~/utils/mp4-inspect';

var MediaSourceWrapper = function (_ListenerBaseClass) {
  _inherits(MediaSourceWrapper, _ListenerBaseClass);

  _createClass(MediaSourceWrapper, null, [{
    key: 'isMimeCodecSupported',
    value: function isMimeCodecSupported(mimeCodec) {
      return window.MediaSource && window.MediaSource.isTypeSupported(mimeCodec);
    }
  }, {
    key: 'factory',
    value: function factory(videoElement) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return new MediaSourceWrapper(videoElement, options);
    }
  }]);

  function MediaSourceWrapper(videoElement) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MediaSourceWrapper);

    var _this = _possibleConstructorReturn(this, (MediaSourceWrapper.__proto__ || Object.getPrototypeOf(MediaSourceWrapper)).call(this, MediaSourceWrapper.DEBUG_NAME));

    _this.debug('Constructing...');

    if (!videoElement) {
      throw new Error('videoElement is required to construct an MediaSourceWrapper.');
    }

    _this.videoElement = videoElement;

    _this.options = lodash_defaults__WEBPACK_IMPORTED_MODULE_0___default()({}, options, {
      duration: 10,
      enableMetrics: true
    });

    _this.eventListeners = {
      sourceopen: function sourceopen() {
        // This can only be set when the media source is open.
        // @todo - does this do memory management for us so we don't have
        // to call remove on the buffer, which is expensive?  It seems
        // like it...
        _this.mediaSource.duration = _this.options.duration;

        _this.trigger('sourceOpen');
      },
      sourceended: function sourceended() {
        _this.trigger('sourceEnded');
      },
      error: function error(_error) {
        _this.trigger('error', _error);
      }
    };

    _this.destroyed = false;
    _this.mediaSource = null;
    _this.sourceBuffer = null;
    _this.objectURL = null;
    return _this;
  }

  _createClass(MediaSourceWrapper, [{
    key: 'initializeMediaSource',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.debug('Initializing mediaSource...');

                options = lodash_defaults__WEBPACK_IMPORTED_MODULE_0___default()({}, options, {
                  onSourceOpen: lodash_noop__WEBPACK_IMPORTED_MODULE_1___default.a,
                  onSourceEnded: lodash_noop__WEBPACK_IMPORTED_MODULE_1___default.a,
                  onError: lodash_noop__WEBPACK_IMPORTED_MODULE_1___default.a
                });

                this.metric('mediaSource.created', 1);

                // Kill the existing media source
                _context.next = 5;
                return this.destroyMediaSource();

              case 5:

                this.mediaSource = new window.MediaSource();

                this.mediaSource.addEventListener('sourceopen', this.eventListeners.sourceopen);
                this.mediaSource.addEventListener('sourceended', this.eventListeners.sourceended);
                this.mediaSource.addEventListener('error', this.eventListeners.error);

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initializeMediaSource() {
        return _ref.apply(this, arguments);
      }

      return initializeMediaSource;
    }()
  }, {
    key: 'registerMimeCodec',
    value: function registerMimeCodec(mimeCodec) {
      if (!MediaSourceWrapper.isMimeCodecSupported(mimeCodec)) {
        throw new Error('Mime codec of "' + mimeCodec + '" is not supported.');
      }

      this.mimeCodec = mimeCodec;
    }
  }, {
    key: 'getVideoElementSrc',
    value: function getVideoElementSrc() {
      this.debug('getVideoElementSrc...');

      if (!this.mediaSource) {
        // @todo - should this throw?
        return;
      }

      // @todo - should multiple calls to this method with the same mediaSource
      // result in multiple objectURLs being created?  The docs for this say that
      // it creates something on the document, which lives until revokeObjectURL
      // is called on it.  Does that mean we should only ever have one per
      // this.mediaSource?  It seems like it, but I do not know.  Having only one
      // seems more predictable, and more memory efficient.

      // Ensure only a single objectURL exists at one time
      if (!this.objectURL) {
        this.metric('mediaSource.objectURL.created', 1);

        this.objectURL = window.URL.createObjectURL(this.mediaSource);
      }

      this.videoElement.src = this.objectURL;
    }
  }, {
    key: 'destroyVideoElementSrc',
    value: function destroyVideoElementSrc() {
      this.debug('destroyVideoElementSrc...');

      if (!this.mediaSource) {
        // @todo - should this throw?
        return;
      }

      if (!this.objectURL) {
        // @todo - should this throw?
        return;
      }

      this.metric('mediaSource.objectURL.revoked', 1);

      this.objectURL = null;

      if (this.sourceBuffer) {
        this.sourceBuffer.abort();
      }

      // free the resource
      return window.URL.revokeObjectURL(this.videoElement.src);
    }
  }, {
    key: 'reinitializeVideoElementSrc',
    value: function reinitializeVideoElementSrc() {
      this.metric('mediaSource.reinitialized', 1);

      this.destroyVideoElementSrc();

      // reallocate, this will call media source open which will
      // append the MOOV atom.
      return this.getVideoElementSrc();
    }
  }, {
    key: 'isReady',
    value: function isReady() {
      // found when stress testing many videos, it is possible for the
      // media source ready state not to be open even though
      // source open callback is being called.
      return this.mediaSource && this.mediaSource.readyState === 'open';
    }
  }, {
    key: 'initializeSourceBuffer',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.mimeCodec) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('You must register a valid mime codec first.');

              case 2:
                if (this.isReady()) {
                  _context2.next = 4;
                  break;
                }

                throw new Error('Cannot create the sourceBuffer if the mediaSource is not ready.');

              case 4:
                if (!this.sourceBuffer) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 7;
                return this.sourceBuffer.destroy();

              case 7:

                this.sourceBuffer = _SourceBufferWrapper__WEBPACK_IMPORTED_MODULE_3__["default"].factory(this, options);

              case 8:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function initializeSourceBuffer(_x4) {
        return _ref2.apply(this, arguments);
      }

      return initializeSourceBuffer;
    }()
  }, {
    key: 'destroyMediaSource',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.mediaSource) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return');

              case 2:

                this.mediaSource.removeEventListener('sourceopen', this.eventListeners.sourceopen);
                this.mediaSource.removeEventListener('sourceended', this.eventListeners.sourceended);
                this.mediaSource.removeEventListener('error', this.eventListeners.error);

                // let sourceBuffers = this.mediaSource.sourceBuffers;

                // if (sourceBuffers.SourceBuffers) {
                //   // @see - https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/sourceBuffers
                //   sourceBuffers = sourceBuffers.SourceBuffers();
                // }

                // for (let i = 0; i < sourceBuffers.length; i++) {
                // this.mediaSource.removeSourceBuffer(sourceBuffers[i]);
                // }

                // @todo - if either the media source or the source buffer isn't ready
                // at this point, does it matter?  is endOfStream necessary?  if so, we
                // need to be able to guarantee that it can be called.  This will likely
                // require tracking whether or not this has been called
                if (this.isReady() && this.sourceBuffer.isReady()) {
                  try {
                    this.mediaSource.endOfStream();
                  } catch (error) {
                    this.debug(error);
                    this.metric('mediaSource.endOfStream.error', 1);
                  }
                }

                // @todo - should the sourceBuffer do this?
                this.mediaSource.removeSourceBuffer(this.sourceBuffer.sourceBuffer);

                // @todo - is this happening at the right time, or should it happen
                // prior to removing the source buffers?
                this.destroyVideoElementSrc();

                _context3.next = 10;
                return this.sourceBuffer.destroy();

              case 10:

                this.metric('mediaSource.destroyed', 1);

                this.sourceBuffer = null;
                this.mediaSource = null;

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function destroyMediaSource() {
        return _ref3.apply(this, arguments);
      }

      return destroyMediaSource;
    }()
  }, {
    key: 'destroy',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.debug('destroySourceBuffer...');

                if (!this.destroyed) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt('return');

              case 3:

                this.destroyed = true;

                this.debug('Destroying mediaSource...');

                _context4.next = 7;
                return this.destroyMediaSource();

              case 7:

                this.videoElement = null;

                this.options = null;
                this.eventListeners = null;

                _get(MediaSourceWrapper.prototype.__proto__ || Object.getPrototypeOf(MediaSourceWrapper.prototype), 'destroy', this).call(this);

              case 11:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function destroy() {
        return _ref4.apply(this, arguments);
      }

      return destroy;
    }()
  }]);

  return MediaSourceWrapper;
}(_utils_ListenerBaseClass__WEBPACK_IMPORTED_MODULE_2__["default"]);

MediaSourceWrapper.DEBUG_NAME = 'skyline:clsp:mse:MediaSourceWrapper';
MediaSourceWrapper.EVENT_NAMES = ['metric', 'sourceOpen', 'sourceEnded', 'error'];
MediaSourceWrapper.METRIC_TYPES = ['mediaSource.created', 'mediaSource.destroyed', 'mediaSource.reinitialized', 'mediaSource.objectURL.created', 'mediaSource.objectURL.revoked', 'mediaSource.endOfStream.error'];
/* harmony default export */ __webpack_exports__["default"] = (MediaSourceWrapper);

/***/ }),

/***/ "./src/js/mse/SourceBufferWrapper.js":
/*!*******************************************!*\
  !*** ./src/js/mse/SourceBufferWrapper.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/defaults */ "./node_modules/lodash/defaults.js");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_ListenerBaseClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ~/utils/ListenerBaseClass */ "./src/js/utils/ListenerBaseClass.js");


var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



// import { mp4toJSON } from '~/utils/mp4-inspect';

var SourceBufferWrapper = function (_ListenerBaseClass) {
  _inherits(SourceBufferWrapper, _ListenerBaseClass);

  _createClass(SourceBufferWrapper, null, [{
    key: 'factory',
    value: function factory(mediaSource) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // @todo - do a type check here
      if (!mediaSource) {
        throw new Error('A mediaSource object is required to create a sourceBuffer.');
      }

      return new SourceBufferWrapper(mediaSource, options);
    }
  }]);

  function SourceBufferWrapper(mediaSource, options) {
    _classCallCheck(this, SourceBufferWrapper);

    var _this = _possibleConstructorReturn(this, (SourceBufferWrapper.__proto__ || Object.getPrototypeOf(SourceBufferWrapper)).call(this, SourceBufferWrapper.DEBUG_NAME));

    _this.debug('initializeSourceBuffer...');

    _this.options = lodash_defaults__WEBPACK_IMPORTED_MODULE_0___default()({}, options, {
      // These default buffer value provide the best results in my testing.
      // It keeps the memory usage as low as is practical, and rarely causes
      // the video to stutter
      bufferSizeLimit: 90 + Math.floor(Math.random() * 200),
      bufferTruncateFactor: 2,
      bufferTruncateValue: null,
      driftThreshold: 2000,
      enableMetrics: true,
      minimumBufferIncrementSize: 0.5
    });

    if (!_this.options.bufferTruncateValue) {
      _this.options.bufferTruncateValue = parseInt(_this.options.bufferSizeLimit / _this.options.bufferTruncateFactor);
    }

    _this.mediaSource = mediaSource;

    // @todo - don't use the mediaSource internal property
    _this.sourceBuffer = _this.mediaSource.mediaSource.addSourceBuffer(_this.mediaSource.mimeCodec);
    _this.sourceBuffer.mode = 'sequence';

    _this.metric('sourceBuffer.created', 1);

    _this.eventListeners = {
      onUpdateEnd: function onUpdateEnd() {
        _this.onUpdateEnd();
      },
      onAppendStart: function onAppendStart(moof) {
        _this.trigger('appendStart', moof);
      },
      onAppendFinish: function onAppendFinish(info) {
        _this.trigger('appendFinish', info);
      },
      onAppendError: function onAppendError(error) {
        _this.trigger('appendError', error);
      },
      onRemoveFinish: function onRemoveFinish(info) {
        _this.trigger('removeFinish', info);
      },
      onRemoveError: function onRemoveError(error) {
        _this.trigger('removeError', error);
      },
      onStreamFrozen: function onStreamFrozen() {
        _this.trigger('streamFrozen');
      },
      onError: function onError(error) {
        _this.trigger('error', error);
      }
    };

    // Supported Events
    _this.sourceBuffer.addEventListener('updateend', _this.eventListeners.onUpdateEnd);
    _this.sourceBuffer.addEventListener('error', _this.eventListeners.onError);

    _this.destroyed = false;
    _this.segmentQueue = [];
    _this.sequenceNumber = 0;
    _this.timeBuffered = null;
    _this.previousTimeEnd = null;
    return _this;
  }

  _createClass(SourceBufferWrapper, [{
    key: 'isReady',
    value: function isReady() {
      return this.sourceBuffer && this.sourceBuffer.updating === false;
    }
  }, {
    key: 'queueSegment',
    value: function queueSegment(segment) {
      this.debug('Queueing segment.  The queue now has ' + this.segmentQueue.length + ' segments.');

      this.metric('sourceBuffer.queue.added', 1);

      this.segmentQueue.push({
        timestamp: Date.now(),
        moof: segment
      });
    }
  }, {
    key: 'abort',
    value: function abort() {
      this.debug('Aborting current sourceBuffer operation');

      try {
        this.metric('sourceBuffer.abort', 1);

        this.sourceBuffer.abort();
      } catch (error) {
        this.metric('sourceBuffer.abort.error', 1);

        // Somehow, this can be become undefined...
        if (this.eventListeners.onAbortError) {
          this.eventListeners.onAbortError(error);
        }
      }
    }
  }, {
    key: 'processNextInQueue',
    value: function processNextInQueue() {
      this.silly('processNextInQueue');

      if (document.visibilityState === 'hidden') {
        this.debug('Tab not in focus - dropping frame...');
        this.metric('sourceBuffer.frameDrop.hiddenTab', 1);
        this.metric('sourceBuffer.queue.cannotProcessNext', 1);
        return;
      }

      if (!this.mediaSource.isReady()) {
        this.debug('The mediaSource is not ready');
        this.metric('sourceBuffer.queue.mediaSourceNotReady', 1);
        this.metric('sourceBuffer.queue.cannotProcessNext', 1);
        return;
      }

      if (!this.isReady()) {
        this.debug('The sourceBuffer is busy');
        this.metric('sourceBuffer.queue.sourceBufferNotReady', 1);
        this.metric('sourceBuffer.queue.cannotProcessNext', 1);
        return;
      }

      if (this.segmentQueue.length > 0) {
        this.metric('sourceBuffer.queue.shift', 1);
        this.metric('sourceBuffer.queue.canProcessNext', 1);
        this._append(this.segmentQueue.shift());
      }
    }
  }, {
    key: 'formatMoof',
    value: function formatMoof(moof) {
      // We must overwrite the sequence number locally, because it
      // the sequence that comes from the server will not necessarily
      // start at zero.  It should start from zero locally.  This
      // requirement may have changed with more recent versions of the
      // browser, but it appears to make the video play a little more
      // smoothly
      moof[20] = (this.sequenceNumber & 0xFF000000) >> 24;
      moof[21] = (this.sequenceNumber & 0x00FF0000) >> 16;
      moof[22] = (this.sequenceNumber & 0x0000FF00) >> 8;
      moof[23] = this.sequenceNumber & 0xFF;

      return moof;
    }
  }, {
    key: 'appendMoov',
    value: function appendMoov(moov) {
      this.debug('appendMoov');

      this.metric('sourceBuffer.lastMoovSize', moov.length);

      // Sometimes this can get hit after destroy is called
      if (!this.eventListeners.onAppendStart) {
        return;
      }

      this.debug('appending moov...');
      this.queueSegment(moov);

      this.processNextInQueue();
    }
  }, {
    key: 'append',
    value: function append(moof) {
      this.silly('Append');

      this.metric('sourceBuffer.lastMoofSize', moof.length);

      // console.log(mp4toJSON(moof));

      // Sometimes this can get hit after destroy is called
      if (!this.eventListeners.onAppendStart) {
        return;
      }

      this.eventListeners.onAppendStart(moof);

      this.metric('sourceBuffer.queue.append', 1);

      this.queueSegment(this.formatMoof(moof));
      this.sequenceNumber++;

      this.processNextInQueue();
    }
  }, {
    key: '_append',
    value: function _append(_ref) {
      var timestamp = _ref.timestamp,
          moof = _ref.moof;

      this.silly('Appending to the sourceBuffer...');

      try {
        var estimatedDrift = Date.now() - timestamp;

        if (estimatedDrift > this.options.driftThreshold) {
          this.debug('Estimated drift of ' + estimatedDrift + ' is above the ' + this.options.driftThreshold + ' threshold.  Flushing queue...');
          // @todo - perhaps we should re-add the last segment to the queue with a fresh
          // timestamp?  I think one cause of stream freezing is the sourceBuffer getting
          // starved, but I don't know if that's correct
          this.metric('queue.removed', this.segmentQueue.length + 1);
          this.segmentQueue = [];
          return;
        }

        this.debug('Appending to the buffer with an estimated drift of ' + estimatedDrift);

        this.metric('sourceBuffer.append', 1);

        this.sourceBuffer.appendBuffer(moof);
      } catch (error) {
        this.metric('sourceBuffer.append.error', 1);

        this.eventListeners.onAppendError(error, moof);
      }
    }
  }, {
    key: 'getBufferTimes',
    value: function getBufferTimes() {
      var previousBufferSize = this.timeBuffered;
      var bufferTimeStart = this.sourceBuffer.buffered.start(0);
      var bufferTimeEnd = this.sourceBuffer.buffered.end(0);
      var currentBufferSize = bufferTimeEnd - bufferTimeStart;

      var info = {
        previousBufferSize: previousBufferSize,
        currentBufferSize: currentBufferSize,
        bufferTimeStart: bufferTimeStart,
        bufferTimeEnd: bufferTimeEnd
      };

      return info;
    }
  }, {
    key: 'trimBuffer',
    value: function trimBuffer(info) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      this.metric('sourceBuffer.lastKnownBufferSize', this.timeBuffered);

      try {
        if (!info) {
          info = this.getBufferTimes();
        }

        if (force || this.timeBuffered > this.options.bufferSizeLimit && this.isReady()) {
          this.debug('Removing old stuff from sourceBuffer...');

          // @todo - this is the biggest performance problem we have with this player.
          // Can you figure out how to manage the memory usage without causing the streams
          // to stutter?
          this.metric('sourceBuffer.trim', this.options.bufferTruncateValue);
          this.sourceBuffer.remove(info.bufferTimeStart, info.bufferTimeStart + this.options.bufferTruncateValue);
        }
      } catch (error) {
        this.metric('sourceBuffer.trim.error', 1);
        this.eventListeners.onRemoveError(error);
      }
    }
  }, {
    key: 'onRemoveFinish',
    value: function onRemoveFinish() {
      var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getBufferTimes();

      this.debug('On remove finish...');

      this.metric('sourceBuffer.updateEnd.removeEvent', 1);
      this.eventListeners.onRemoveFinish(info);
    }
  }, {
    key: 'onAppendFinish',
    value: function onAppendFinish() {
      var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getBufferTimes();

      this.silly('On append finish...');

      this.metric('sourceBuffer.updateEnd.appendEvent', 1);

      // The current buffer size should always be bigger.If it isn't, there is a problem,
      // and we need to reinitialize or something.
      if (this.previousTimeEnd && info.bufferTimeEnd <= this.previousTimeEnd) {
        this.metric('sourceBuffer.updateEnd.bufferFrozen', 1);
        this.eventListeners.onStreamFrozen();
        return;
      }

      if (info.previousBufferSize && info.currentBufferSize - info.previousBufferSize < this.options.minimumBufferIncrementSize) {
        this.metric('sourceBuffer.insufficientBufferAppends', 1);
      }

      this.previousTimeEnd = info.bufferTimeEnd;

      this.eventListeners.onAppendFinish(info);
      this.trimBuffer(info);
    }
  }, {
    key: 'onUpdateEnd',
    value: function onUpdateEnd() {
      this.silly('onUpdateEnd');

      this.metric('sourceBuffer.updateEnd', 1);

      try {
        // Sometimes the mediaSource is removed while an update is being
        // processed, resulting in an error when trying to read the
        // "buffered" property.
        if (this.sourceBuffer.buffered.length <= 0) {
          this.metric('sourceBuffer.updateEnd.bufferLength.empty', 1);
          this.debug('After updating, the sourceBuffer has no length!');
          return;
        }
      } catch (error) {
        // @todo - do we need to handle this?
        this.metric('sourceBuffer.updateEnd.bufferLength.error', 1);
        this.debug('The mediaSource was removed while an update operation was occurring.');
        return;
      }

      var info = this.getBufferTimes();

      this.timeBuffered = info.currentBufferSize;

      if (info.previousBufferSize !== null && info.previousBufferSize > this.timeBuffered) {
        this.onRemoveFinish(info);
      } else {
        this.onAppendFinish(info);
      }

      this.processNextInQueue();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2.destroyed) {
          return resolve();
        }

        _this2.destroyed = true;

        _this2.abort();

        _this2.sourceBuffer.removeEventListener('updateend', _this2.eventListeners.onUpdateEnd);
        _this2.sourceBuffer.removeEventListener('error', _this2.eventListeners.onError);

        _this2.sourceBuffer.addEventListener('updateend', function () {
          resolve();
        });

        _this2.trimBuffer(undefined, true);

        _this2.timeBuffered = null;
        _this2.previousTimeEnd = null;
        _this2.segmentQueue = null;

        _this2.options = null;
        _this2.eventListeners = null;

        _this2.mediaSource = null;
        _this2.sourceBuffer = null;

        _get(SourceBufferWrapper.prototype.__proto__ || Object.getPrototypeOf(SourceBufferWrapper.prototype), 'destroy', _this2).call(_this2);
      });
    }
  }]);

  return SourceBufferWrapper;
}(_utils_ListenerBaseClass__WEBPACK_IMPORTED_MODULE_1__["default"]);

SourceBufferWrapper.DEBUG_NAME = 'skyline:clsp:mse:SourceBufferWrapper';
SourceBufferWrapper.EVENT_NAMES = ['metric', 'appendStart', 'appendFinish', 'removeFinish', 'appendError', 'removeError', 'streamFrozen', 'error'];
SourceBufferWrapper.METRIC_TYPES = ['sourceBuffer.created', 'sourceBuffer.destroyed', 'sourceBuffer.queue.added', 'sourceBuffer.queue.removed', 'sourceBuffer.append', 'sourceBuffer.append.error', 'sourceBuffer.frameDrop.hiddenTab', 'sourceBuffer.queue.mediaSourceNotReady', 'sourceBuffer.queue.sourceBufferNotReady', 'sourceBuffer.queue.shift', 'sourceBuffer.queue.append', 'sourceBuffer.lastKnownBufferSize', 'sourceBuffer.insufficientBufferAppends', 'sourceBuffer.trim', 'sourceBuffer.trim.error', 'sourceBuffer.updateEnd', 'sourceBuffer.updateEnd.bufferLength.empty', 'sourceBuffer.updateEnd.bufferLength.error', 'sourceBuffer.updateEnd.removeEvent', 'sourceBuffer.updateEnd.appendEvent', 'sourceBuffer.updateEnd.bufferFrozen', 'sourceBuffer.abort', 'sourceBuffer.abort.error', 'sourceBuffer.lastMoofSize'];
/* harmony default export */ __webpack_exports__["default"] = (SourceBufferWrapper);

/***/ }),

/***/ "./src/js/plugin/MqttConduitCollection.js":
/*!************************************************!*\
  !*** ./src/js/plugin/MqttConduitCollection.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _iov_Conduit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ~/iov/Conduit */ "./src/js/iov/Conduit.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





var singleton = void 0;

var MqttConduitCollection = function () {
  _createClass(MqttConduitCollection, null, [{
    key: 'factory',
    value: function factory() {
      if (!singleton) {
        singleton = new MqttConduitCollection();
      }

      return singleton;
    }
  }]);

  function MqttConduitCollection() {
    var _this = this;

    _classCallCheck(this, MqttConduitCollection);

    this.onMessage = function (event) {
      _this.silly('window on message');

      var clientId = event.data.clientId;

      if (!_this.exists(clientId)) {
        // When the mqtt connection is interupted due to a listener being removed,
        // a fail event is always sent.  It is not necessary to log this as an error
        // in the console, because it is not an error.
        if (!event.data.event === 'fail') {
          console.error('No conduit with id "' + clientId + '" exists!');
        }

        return;
      }

      _this.getById(clientId).iov.onMessage(event);
    };

    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('skyline:clsp:plugin:MqttConduitCollection');
    this.silly = debug__WEBPACK_IMPORTED_MODULE_0___default()('skyline:silly:clsp:plugin:MqttConduitCollection');

    this.debug('constructing...');

    this._conduits = {};

    window.addEventListener('message', this.onMessage);
  }

  _createClass(MqttConduitCollection, [{
    key: 'set',
    value: function set(id, conduit) {
      this.debug('setting...', id, conduit);

      this._conduits[id] = conduit;

      return conduit;
    }
  }, {
    key: 'getById',
    value: function getById(id) {
      this.silly('getting...', id);

      return this._conduits[id];
    }
  }, {
    key: 'exists',
    value: function exists(id) {
      this.silly('exists?', id);

      return this._conduits.hasOwnProperty(id);
    }
  }, {
    key: 'remove',
    value: function remove(id) {
      delete this._conduits[id];
    }
  }, {
    key: 'addFromIov',
    value: function addFromIov(iov) {
      this.debug('adding from iov...', iov);

      var conduit = this.exists(iov.config.clientId) ? this.getById(iov.config.clientId) : _iov_Conduit__WEBPACK_IMPORTED_MODULE_1__["default"].factory(iov);

      return this.set(iov.config.clientId, conduit);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.debug('destroying...');

      this._conduits = null;

      window.removeEventListener('message', this.onMessage);
    }
  }]);

  return MqttConduitCollection;
}();

/* harmony default export */ __webpack_exports__["default"] = (MqttConduitCollection);

/***/ }),

/***/ "./src/js/plugin/MqttHandler.js":
/*!**************************************!*\
  !*** ./src/js/plugin/MqttHandler.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _iov_IOV__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ~/iov/IOV */ "./src/js/iov/IOV.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var Component = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getComponent('Component');

var MqttHandler = function (_Component) {
  _inherits(MqttHandler, _Component);

  function MqttHandler(source, tech, conduits, options) {
    _classCallCheck(this, MqttHandler);

    var _this = _possibleConstructorReturn(this, (MqttHandler.__proto__ || Object.getPrototypeOf(MqttHandler)).call(this, tech, options.mqtt));

    _this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('skyline:clsp:plugin:MqttHandler');
    _this.debug('constructor');

    _this.tech_ = tech;
    _this.source_ = source;

    // @todo - is there a better way to do this where we don't pollute the
    // top level namespace?  does it matter?
    _this.iov = null;
    _this.conduits = conduits;
    return _this;
  }

  _createClass(MqttHandler, [{
    key: 'createIOV',
    value: function createIOV(player) {
      this.debug('createIOV');

      this.updateIOV(_iov_IOV__WEBPACK_IMPORTED_MODULE_2__["default"].fromUrl(this.source_.src, this.conduits, player));

      this.iov.initialize();
    }
  }, {
    key: 'updateIOV',
    value: function updateIOV(iov) {
      this.debug('updateIOV');

      if (this.iov) {
        // If the IOV is the same, do nothing
        if (this.iov.id === iov.id) {
          return;
        }

        this.iov.destroy();
      }

      this.iov = iov;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.debug('destroying...');

      this.debug = null;
      this.tech_ = null;
      this.source_ = null;
      this.iov = null;
      this.conduits = null;
    }
  }]);

  return MqttHandler;
}(Component);

/* harmony default export */ __webpack_exports__["default"] = (MqttHandler);
;

/***/ }),

/***/ "./src/js/plugin/MqttSourceHandler.js":
/*!********************************************!*\
  !*** ./src/js/plugin/MqttSourceHandler.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _MqttHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MqttHandler */ "./src/js/plugin/MqttHandler.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ~/utils/utils */ "./src/js/utils/utils.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @see https://github.com/videojs/videojs-contrib-hls/blob/master/src/videojs-contrib-hls.js
 * @see https://github.com/videojs/http-streaming/blob/master/src/videojs-http-streaming.js
 *
 * The Source Handler object, which informs video.js what additional
 * MIME types are supported and sets up playback. It is registered
 * automatically to the appropriate tech based on the capabilities of
 * the browser it is running in. It is not necessary to use or modify
 * this object in normal usage.
 */







var MqttSourceHandler = function () {
  _createClass(MqttSourceHandler, null, [{
    key: 'factory',
    value: function factory(mode, conduits) {
      return new MqttSourceHandler(mode, conduits);
    }
  }]);

  function MqttSourceHandler(mode, conduits) {
    _classCallCheck(this, MqttSourceHandler);

    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('skyline:clsp:plugin:MqttSourceHandler');
    this.debug('constructor');

    this.name = _utils_utils__WEBPACK_IMPORTED_MODULE_3__["default"].name;
    this.VERSION = _utils_utils__WEBPACK_IMPORTED_MODULE_3__["default"].version;

    this.mode = mode;
    this.conduits = conduits;
    this.defaultLocalOptions = { mqtt: { mode: this.mode } };
  }

  _createClass(MqttSourceHandler, [{
    key: 'canHandleSource',
    value: function canHandleSource(srcObj) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.debug('canHandleSource');

      if (!srcObj.src) {
        console.error('srcObj doesn\'t contain src');
        this.debug(srcObj);
        return false;
      }

      if (!srcObj.src.startsWith('clsp')) {
        console.error('srcObj.src is not clsp protocol');
        return false;
      }

      if (!_utils_utils__WEBPACK_IMPORTED_MODULE_3__["default"].supported()) {
        this.debug('Browser not supported. Chrome 52+ is required.');
        return false;
      }

      return this.canPlayType(srcObj.type);
    }
  }, {
    key: 'handleSource',
    value: function handleSource(source, tech) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.debug('handleSource');

      var localOptions = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.mergeOptions(video_js__WEBPACK_IMPORTED_MODULE_1___default.a.options, options, this.defaultLocalOptions);

      tech.mqtt = new _MqttHandler__WEBPACK_IMPORTED_MODULE_2__["default"](source, tech, this.conduits, localOptions);

      return tech.mqtt;
    }
  }, {
    key: 'canPlayType',
    value: function canPlayType(type) {
      this.debug('canPlayType');

      if (_utils_utils__WEBPACK_IMPORTED_MODULE_3__["default"].isSupportedMimeType(type)) {
        this.debug('found supported mime type');
        return 'maybe';
      }

      this.debug('mime type not supported');

      return '';
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.debug('destroying...');

      this.debug = null;
      this.name = null;
      this.VERSION = null;
      this.mode = null;
      this.conduits = null;
      this.defaultLocalOptions = null;
    }
  }]);

  return MqttSourceHandler;
}();

/* harmony default export */ __webpack_exports__["default"] = (MqttSourceHandler);
;

/***/ }),

/***/ "./src/js/plugin/MseOverMqttPlugin.js":
/*!********************************************!*\
  !*** ./src/js/plugin/MseOverMqttPlugin.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var videojs_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! videojs-errors */ "./node_modules/videojs-errors/dist/videojs-errors.es.js");
/* harmony import */ var _styles_clsp_videojs_plugin_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ~styles/clsp-videojs-plugin.scss */ "./src/styles/clsp-videojs-plugin.scss");
/* harmony import */ var _styles_clsp_videojs_plugin_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_clsp_videojs_plugin_scss__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var paho_client__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! paho-client */ "./node_modules/paho-client/src/paho-mqtt.js");
/* harmony import */ var paho_client__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(paho_client__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ~/utils/utils */ "./src/js/utils/utils.js");
/* harmony import */ var _MqttSourceHandler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./MqttSourceHandler */ "./src/js/plugin/MqttSourceHandler.js");
/* harmony import */ var _MqttConduitCollection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./MqttConduitCollection */ "./src/js/plugin/MqttConduitCollection.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



// This is configured as an external library by webpack, so the caller must
// provide videojs on `window`


// @todo - can this be up to the caller?


// @todo - can webpack be configured to process this without having
// include it like this?








var Plugin = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getPlugin('plugin');

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var _class, _temp;

  var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _temp = _class = function (_Plugin) {
    _inherits(MseOverMqttPlugin, _Plugin);

    _createClass(MseOverMqttPlugin, null, [{
      key: 'register',
      value: function register() {
        if (video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getPlugin(_utils_utils__WEBPACK_IMPORTED_MODULE_5__["default"].name)) {
          throw new Error('You can only register the clsp plugin once, and it has already been registered.');
        }

        window.Paho = paho_client__WEBPACK_IMPORTED_MODULE_4___default.a;

        var sourceHandler = _MqttSourceHandler__WEBPACK_IMPORTED_MODULE_6__["default"].factory('html5', MseOverMqttPlugin.conduits);

        video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getTech('Html5').registerSourceHandler(sourceHandler, 0);
        video_js__WEBPACK_IMPORTED_MODULE_1___default.a.registerPlugin(_utils_utils__WEBPACK_IMPORTED_MODULE_5__["default"].name, MseOverMqttPlugin);

        return MseOverMqttPlugin;
      }
    }]);

    function MseOverMqttPlugin(player, options) {
      _classCallCheck(this, MseOverMqttPlugin);

      var _this = _possibleConstructorReturn(this, (MseOverMqttPlugin.__proto__ || Object.getPrototypeOf(MseOverMqttPlugin)).call(this, player, options));

      _this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('skyline:clsp:plugin:MseOverMqttPlugin');
      _this.debug('constructing...');

      options = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.mergeOptions(defaults, options);

      player.addClass('vjs-clsp');

      if (options.customClass) {
        player.addClass(options.customClass);
      }

      player.errors({
        errors: {
          PLAYER_ERR_NOT_COMPAT: {
            headline: 'This browser is unsupported.',
            message: 'Chrome 52+ is required.'
          }
        },
        timeout: 120 * 1000
      });

      if (!_utils_utils__WEBPACK_IMPORTED_MODULE_5__["default"].supported()) {
        var _ret;

        return _ret = player.error({
          code: 'PLAYER_ERR_NOT_COMPAT',
          dismiss: false
        }), _possibleConstructorReturn(_this, _ret);
      }

      // Needed to make videojs-errors think that the video is progressing
      // If we do not do this, videojs-errors will give us a timeout error
      player._currentTime = 0;
      player.currentTime = function () {
        return player._currentTime++;
      };

      // @todo - we are currently creating the IOV for this player on `firstplay`
      // but we could do it on the `ready` event.  However, in order to support
      // this, we need to make the IOV and its player able to be instantiated
      // without automatically playing AND without automatically listening via
      // a conduit
      player.on('firstplay', function (event) {
        _this.debug('on player firstplay');

        var mqttHandler = player.tech(true).mqtt;

        if (!mqttHandler) {
          throw new Error('VideoJS Player ' + player.id() + ' does not have mqtt tech!');
        }

        mqttHandler.createIOV(player);

        // Any time a metric is received, let the caller know
        mqttHandler.iov.player.on('metric', function (metric) {
          // @see - https://docs.videojs.com/tutorial-plugins.html#events
          // Note that I originally tried to trigger this event on the player
          // rather than the tech, but that causes the video not to play...
          _this.trigger('metric', { metric: metric });
        });
      });
      return _this;
    }

    _createClass(MseOverMqttPlugin, [{
      key: 'destroy',
      value: function destroy() {
        this.debug('destroying...');

        this.debug = null;
      }
    }]);

    return MseOverMqttPlugin;
  }(Plugin), _class.VERSION = _utils_utils__WEBPACK_IMPORTED_MODULE_5__["default"].version, _class.utils = _utils_utils__WEBPACK_IMPORTED_MODULE_5__["default"], _class.conduits = _MqttConduitCollection__WEBPACK_IMPORTED_MODULE_7__["default"].factory(), _temp;
});

/***/ }),

/***/ "./src/js/utils/ListenerBaseClass.js":
/*!*******************************************!*\
  !*** ./src/js/utils/ListenerBaseClass.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var ListenerBaseClass = function () {
  function ListenerBaseClass(debugName) {
    _classCallCheck(this, ListenerBaseClass);

    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(debugName);
    this.silly = debug__WEBPACK_IMPORTED_MODULE_0___default()('silly:' + debugName);

    this.metrics = {};
    this.events = {};

    for (var i = 0; i < this.constructor.EVENT_NAMES.length; i++) {
      this.events[this.constructor.EVENT_NAMES[i]] = [];
    }
  }

  _createClass(ListenerBaseClass, [{
    key: 'on',
    value: function on(name, action) {
      this.debug('Registering Listener for ' + name + ' event...');

      if (!this.constructor.EVENT_NAMES.includes(name)) {
        throw new Error('"' + name + '" is not a valid event."');
      }

      this.events[name].push(action);
    }
  }, {
    key: 'trigger',
    value: function trigger(name, value) {
      if (name === 'metric') {
        this.silly('Triggering ' + name + ' event...');
      } else {
        this.debug('Triggering ' + name + ' event...');
      }

      if (!this.constructor.EVENT_NAMES.includes(name)) {
        throw new Error('"' + name + '" is not a valid event."');
      }

      for (var i = 0; i < this.events[name].length; i++) {
        this.events[name][i](value, this);
      }
    }
  }, {
    key: 'metric',
    value: function metric(type, value) {
      if (!this.options || !this.options.enableMetrics) {
        return;
      }

      if (!this.constructor.METRIC_TYPES.includes(type)) {
        // @todo - should this throw?
        return;
      }

      // @todo - decouple these metric types
      switch (type) {
        case 'iovPlayer.sourceBuffer.bufferTimeEnd':
        case 'iovPlayer.video.currentTime':
        case 'iovPlayer.video.drift':
        case 'iovPlayer.video.segmentInterval':
        case 'iovPlayer.video.segmentIntervalAverage':
        case 'sourceBuffer.lastKnownBufferSize':
        case 'sourceBuffer.lastMoofSize':
          {
            this.metrics[type] = value;
            break;
          }
        default:
          {
            if (!this.metrics.hasOwnProperty(type)) {
              this.metrics[type] = 0;
            }

            this.metrics[type] += value;
          }
      }

      this.trigger('metric', {
        type: type,
        value: this.metrics[type]
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.metrics = null;
      this.events = null;
      this.debug = null;
      this.silly = null;
    }
  }]);

  return ListenerBaseClass;
}();

ListenerBaseClass.DEBUG_NAME = 'skyline:clsp:utils:ListenerBaseClass';
ListenerBaseClass.EVENT_NAMES = [];
ListenerBaseClass.METRIC_TYPES = [];
/* harmony default export */ __webpack_exports__["default"] = (ListenerBaseClass);

/***/ }),

/***/ "./src/js/utils/utils.js":
/*!*******************************!*\
  !*** ./src/js/utils/utils.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ~root/package.json */ "./package.json");
var _root_package_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ~root/package.json */ "./package.json", 1);


var PLUGIN_NAME = 'clsp';
var MINIMUM_CHROME_VERSION = 52;
var SUPPORTED_MIME_TYPE = "video/mp4; codecs='avc1.42E01E'";

function browserIsCompatable() {
  var isChrome = Boolean(window.chrome) && Boolean(window.chrome.webstore);

  if (!isChrome) {
    return false;
  }

  // For the MAC
  window.MediaSource = window.MediaSource || window.WebKitMediaSource;

  if (!window.MediaSource) {
    console.error('Media Source Extensions not supported in your browser: Claris Live Streaming will not work!');

    return false;
  }

  try {
    return parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10) >= MINIMUM_CHROME_VERSION;
  } catch (error) {
    console.error(error);

    return false;
  }
}

function isSupportedMimeType(mimeType) {
  return mimeType === SUPPORTED_MIME_TYPE;
}

/* harmony default export */ __webpack_exports__["default"] = ({
  version: _root_package_json__WEBPACK_IMPORTED_MODULE_0__["version"],
  name: PLUGIN_NAME,
  supported: browserIsCompatable,
  isSupportedMimeType: isSupportedMimeType
});

/***/ }),

/***/ "./src/styles/clsp-videojs-plugin.scss":
/*!*********************************************!*\
  !*** ./src/styles/clsp-videojs-plugin.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!*********************************************!*\
  !*** multi ./src/js/clsp-videojs-plugin.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/user/vagrant/github/clsp-videojs-plugin/src/js/clsp-videojs-plugin.js */"./src/js/clsp-videojs-plugin.js");


/***/ }),

/***/ 1:
/*!******************************!*\
  !*** min-document (ignored) ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "video.js":
/*!**************************!*\
  !*** external "videojs" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = videojs;

/***/ })

/******/ });
//# sourceMappingURL=clsp-videojs-plugin.js.map