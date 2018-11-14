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

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
    };
  }return _typeof(obj);
}

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
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
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
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
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
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
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}
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
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);
var formatters = module.exports.formatters;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node-libs-browser/node_modules/process/browser.js */ "./node_modules/node-libs-browser/node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/debug/src/common.js":
/*!******************************************!*\
  !*** ./node_modules/debug/src/common.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");
  Object.keys(env).forEach(function (key) {
    createDebug[key] = env[key];
  });
  /**
  * Active `debug` instances.
  */

  createDebug.instances = [];
  /**
  * The currently active debug mode names, and names to skip.
  */

  createDebug.names = [];
  createDebug.skips = [];
  /**
  * Map of special "%n" handling functions, for the debug "format" argument.
  *
  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  */

  createDebug.formatters = {};
  /**
  * Selects a color for a debug namespace
  * @param {String} namespace The namespace string for the for the debug instance to be colored
  * @return {Number|String} An ANSI color code for the given namespace
  * @api private
  */

  function selectColor(namespace) {
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }

  createDebug.selectColor = selectColor;
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
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  }
  /**
  * Enables a debug mode by namespaces. This can include modes
  * separated by a colon and wildcards.
  *
  * @param {String} namespaces
  * @api public
  */

  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.names = [];
    createDebug.skips = [];
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

    for (i = 0; i < len; i++) {
      if (!split[i]) {
        // ignore empty strings
        continue;
      }

      namespaces = split[i].replace(/\*/g, '.*?');

      if (namespaces[0] === '-') {
        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        createDebug.names.push(new RegExp('^' + namespaces + '$'));
      }
    }

    for (i = 0; i < createDebug.instances.length; i++) {
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */

  function disable() {
    createDebug.enable('');
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

    var i;
    var len;

    for (i = 0, len = createDebug.skips.length; i < len; i++) {
      if (createDebug.skips[i].test(name)) {
        return false;
      }
    }

    for (i = 0, len = createDebug.names.length; i < len; i++) {
      if (createDebug.names[i].test(name)) {
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
    if (val instanceof Error) {
      return val.stack || val.message;
    }

    return val;
  }

  createDebug.enable(createDebug.load());
  return createDebug;
}

module.exports = setup;

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
var w = d * 7;
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
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
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
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
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
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
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
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
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

module.exports = {"name":"videojs-mse-over-clsp","version":"0.13.6","description":"Uses clsp (iot) as a video distribution system, video is is received via the clsp client then rendered using the media source extensions. ","main":"dist/videojs-mse-over-clsp.js","generator-videojs-plugin":{"version":"5.0.0"},"scripts":{"build":"./scripts/build.sh","serve":"./scripts/serve.sh","lint":"eslint ./ --cache --quiet --ext .jsx --ext .js","lint-fix":"eslint ./ --cache --quiet --ext .jsx --ext .js --fix","preversion":"./scripts/version.sh --pre","version":"./scripts/version.sh","postversion":"./scripts/version.sh --post"},"keywords":["videojs","videojs-plugin"],"author":"dschere@skylinenet.net","license":"MIT","dependencies":{"debug":"^3.1.0","lodash":"^4.17.10","paho-mqtt":"^1.0.4","videojs-errors":"^4.1.1"},"devDependencies":{"babel-core":"^6.26.3","babel-eslint":"^8.2.5","babel-loader":"^7.1.5","babel-plugin-transform-class-properties":"^6.24.1","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-polyfill":"^6.26.0","babel-preset-env":"^1.7.0","css-loader":"^0.28.11","eslint":"^5.0.1","extract-text-webpack-plugin":"^4.0.0-beta.0","gulp":"^3.9.1","gulp-load-plugins":"^1.5.0","jquery":"^3.3.1","moment":"^2.22.2","js-string-escape":"^1.0.1","node-sass":"^4.9.1","pre-commit":"^1.2.2","run-sequence":"^2.2.0","sass-loader":"^7.0.3","srcdoc-polyfill":"^1.0.0","standard":"^11.0.1","style-loader":"^0.21.0","uglifyjs-webpack-plugin":"^1.2.7","url-loader":"^1.0.1","video.js":"6.7.1","webpack":"^4.15.1","webpack-serve":"^2.0.2","write-file-webpack-plugin":"^4.3.2"}};

/***/ }),

/***/ "./src/js/MqttConduitCollection.js":
/*!*****************************************!*\
  !*** ./src/js/MqttConduitCollection.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var DEBUG_PREFIX = 'skyline:clsp';

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

    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':MqttConduitCollection');

    this.debug('constructing...');

    this._conduits = {};

    window.addEventListener('message', function (event) {
      _this.debug('window on message');

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

      var conduit = _this.getById(clientId);
      var iov = conduit.iov;

      iov.onMessage(event);
    });
  }

  _createClass(MqttConduitCollection, [{
    key: 'set',
    value: function set(id, conduit) {
      this.debug('setting...', id, conduit);

      this._conduits[id] = conduit;

      return conduit;
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

      var conduit = this.exists(iov.config.clientId) ? this.getById(iov.config.clientId) : window.mqttConduit(iov);

      return this.set(iov.config.clientId, conduit);
    }
  }, {
    key: 'getById',
    value: function getById(id) {
      this.debug('getting...', id);

      return this._conduits[id];
    }
  }, {
    key: 'exists',
    value: function exists(id) {
      this.debug('exists?', id);

      return this._conduits.hasOwnProperty(id);
    }
  }]);

  return MqttConduitCollection;
}();

/* harmony default export */ __webpack_exports__["default"] = (MqttConduitCollection);

/***/ }),

/***/ "./src/js/MqttHandler.js":
/*!*******************************!*\
  !*** ./src/js/MqttHandler.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _iov_IOV__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./iov/IOV */ "./src/js/iov/IOV.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var Component = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getComponent('Component');

var DEBUG_PREFIX = 'skyline:clsp';

var MqttHandler = function (_Component) {
  _inherits(MqttHandler, _Component);

  function MqttHandler(source, tech, mqttConduitCollection, options) {
    _classCallCheck(this, MqttHandler);

    var _this = _possibleConstructorReturn(this, (MqttHandler.__proto__ || Object.getPrototypeOf(MqttHandler)).call(this, tech, options.mqtt));

    _this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':MqttHandler');
    _this.debug('constructor');

    _this.tech_ = tech;
    _this.source_ = source;

    // @todo - is there a better way to do this where we don't pollute the
    // top level namespace?
    _this.iov = null;
    _this.mqttConduitCollection = mqttConduitCollection;
    return _this;
  }

  _createClass(MqttHandler, [{
    key: 'createIOV',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(player) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.debug('createIOV');

                _context.next = 3;
                return this.updateIOV(_iov_IOV__WEBPACK_IMPORTED_MODULE_2__["default"].fromUrl(this.source_.src, this.mqttConduitCollection, player));

              case 3:

                this.iov.initialize();

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createIOV(_x) {
        return _ref.apply(this, arguments);
      }

      return createIOV;
    }()
  }, {
    key: 'updateIOV',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(iov) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.debug('updateIOV');

                if (!this.iov) {
                  _context2.next = 6;
                  break;
                }

                if (!(this.iov.id === iov.id)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt('return');

              case 4:
                _context2.next = 6;
                return this.iov.destroy();

              case 6:

                this.iov = iov;

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function updateIOV(_x2) {
        return _ref2.apply(this, arguments);
      }

      return updateIOV;
    }()
  }]);

  return MqttHandler;
}(Component);

/* harmony default export */ __webpack_exports__["default"] = (MqttHandler);
;

/***/ }),

/***/ "./src/js/MqttSourceHandler.js":
/*!*************************************!*\
  !*** ./src/js/MqttSourceHandler.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _MqttHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MqttHandler */ "./src/js/MqttHandler.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");






var DEBUG_PREFIX = 'skyline:clsp';
var SUPPORTED_MIME_TYPE = "video/mp4; codecs='avc1.42E01E'";

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':MqttSourceHandler');

  return function (mode, mqttConduitCollection) {
    var obj = {
      canHandleSource: function canHandleSource(srcObj) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        debug('canHandleSource');

        if (!srcObj.src) {
          console.error('srcObj doesn\'t contain src');
          debug(srcObj);
          return false;
        }

        if (!srcObj.src.startsWith('clsp')) {
          console.error('srcObj.src is not clsp protocol');
          return false;
        }

        if (!_utils__WEBPACK_IMPORTED_MODULE_3__["default"].supported()) {
          debug('Browser not supported. Chrome 52+ is required.');
          return false;
        }

        return obj.canPlayType(srcObj.type);
      },
      handleSource: function handleSource(source, tech) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        debug('handleSource');

        var localOptions = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.mergeOptions(video_js__WEBPACK_IMPORTED_MODULE_1___default.a.options, options, { mqtt: { mode: mode } });

        tech.mqtt = new _MqttHandler__WEBPACK_IMPORTED_MODULE_2__["default"](source, tech, mqttConduitCollection, localOptions);

        return tech.mqtt;
      },
      canPlayType: function canPlayType(type) {
        debug('canPlayType');

        if (type === SUPPORTED_MIME_TYPE) {
          return 'maybe';
        }

        console.error('clsp type=\'' + type + '\' rejected');

        return '';
      }
    };

    return obj;
  };
});

/***/ }),

/***/ "./src/js/MseOverMqttPlugin.js":
/*!*************************************!*\
  !*** ./src/js/MseOverMqttPlugin.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _MqttSourceHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MqttSourceHandler */ "./src/js/MqttSourceHandler.js");
/* harmony import */ var _MqttConduitCollection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MqttConduitCollection */ "./src/js/MqttConduitCollection.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");



var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



// This is configured as an external library by webpack, so the caller must
// provide videojs on `window`






var Plugin = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getPlugin('plugin');

/* harmony default export */ __webpack_exports__["default"] = (function () {
  var _class, _temp;

  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _temp = _class = function (_Plugin) {
    _inherits(ClspPlugin, _Plugin);

    _createClass(ClspPlugin, null, [{
      key: 'register',
      value: function register() {
        if (video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getPlugin(_utils__WEBPACK_IMPORTED_MODULE_4__["default"].name)) {
          throw new Error('You can only register the clsp plugin once, and it has already been registered.');
        }

        video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getTech('Html5').registerSourceHandler(Object(_MqttSourceHandler__WEBPACK_IMPORTED_MODULE_2__["default"])()('html5', _MqttConduitCollection__WEBPACK_IMPORTED_MODULE_3__["default"].factory()), 0);
        video_js__WEBPACK_IMPORTED_MODULE_1___default.a.registerPlugin(_utils__WEBPACK_IMPORTED_MODULE_4__["default"].name, ClspPlugin);

        return ClspPlugin;
      }
    }, {
      key: 'getDefaultOptions',
      value: function getDefaultOptions() {
        return {
          /**
           * The number of times to retry playing the video when there is an error
           * that we know we can recover from.
           *
           * If a negative number is passed, retry indefinitely
           * If 0 is passed, never retry
           * If a positive number is passed, retry that many times
           */
          maxRetriesOnError: -1,
          tourDuration: 10 * 1000,
          enableMetrics: false,
          videojsErrorsOptions: {}
        };
      }
    }]);

    function ClspPlugin(player, options) {
      var _this2 = this;

      _classCallCheck(this, ClspPlugin);

      var _this = _possibleConstructorReturn(this, (ClspPlugin.__proto__ || Object.getPrototypeOf(ClspPlugin)).call(this, player, options));

      _this.onMqttHandlerError = function () {
        var mqttHandler = _this.player.tech(true).mqtt;

        mqttHandler.destroy();

        _this.player.error({
          // @todo - change the code to 'INSUFFICIENT_RESOURCES'
          code: 0,
          type: 'INSUFFICIENT_RESOURCES',
          headline: 'Insufficient Resources',
          message: 'The current hardware cannot support the current number of playing streams.'
        });
      };

      _this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('skyline:clsp:plugin:ClspPlugin');
      _this.debug('constructing...');

      var playerOptions = player.options();

      _this.options = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.mergeOptions(_extends({}, _this.constructor.getDefaultOptions(), defaultOptions, playerOptions.clsp || {}), options);

      _this._playerOptions = playerOptions;
      _this.currentSourceIndex = 0;

      player.addClass('vjs-mse-over-mqtt');

      if (_this.options.customClass) {
        player.addClass(_this.options.customClass);
      }

      _this.resetErrors(player);

      // @todo - this error doesn't work or display the way it's intended to
      if (!_utils__WEBPACK_IMPORTED_MODULE_4__["default"].supported()) {
        var _ret;

        return _ret = player.error({
          code: 'PLAYER_ERR_NOT_COMPAT',
          type: 'PLAYER_ERR_NOT_COMPAT',
          dismiss: false
        }), _possibleConstructorReturn(_this, _ret);
      }

      _this.autoplayEnabled = playerOptions.autoplay || player.getAttribute('autoplay') === 'true';

      // for debugging...

      // const oldTrigger = player.trigger.bind(player);
      // player.trigger = (eventName, ...args) => {
      //   console.log(eventName);
      //   console.log(...args);
      //   oldTrigger(eventName, ...args);
      // };

      // Track the number of times we've retried on error
      player._errorRetriesCount = 0;

      // Needed to make videojs-errors think that the video is progressing
      // If we do not do this, videojs-errors will give us a timeout error
      player._currentTime = 0;
      player.currentTime = function () {
        return player._currentTime++;
      };

      // @todo - are we not using videojs properly?
      // @see - https://github.com/videojs/video.js/issues/5233
      // @see - https://jsfiddle.net/karstenlh/96hrzp5w/
      // This is currently needed for autoplay.
      player.on('ready', function () {
        if (_this.autoplayEnabled) {
          // Even though the "ready" event has fired, it's not actually ready
          // until the "next tick"...
          setTimeout(function () {
            player.play();
          });
        }
      });

      // @todo - this seems like we aren't using videojs properly
      player.on('error', function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
          var error, iov;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  error = player.error();
                  _context.t0 = error.code;
                  _context.next = _context.t0 === 0 ? 4 : _context.t0 === 4 ? 4 : _context.t0 === 5 ? 4 : _context.t0 === 'PLAYER_ERR_IOV' ? 4 : 5;
                  break;

                case 4:
                  return _context.abrupt('break', 18);

                case 5:
                  if (!(_this.options.maxRetriesOnError === 0)) {
                    _context.next = 7;
                    break;
                  }

                  return _context.abrupt('break', 18);

                case 7:
                  if (!(_this.options.maxRetriesOnError < 0 || player._errorRetriesCount <= _this.options.maxRetriesOnError)) {
                    _context.next = 18;
                    break;
                  }

                  // @todo - when can we reset this to zero?
                  player._errorRetriesCount++;

                  _this.resetErrors(player);

                  iov = player.tech(true).mqtt.iov;

                  // @todo - investigate how this can be called when the iov has been destroyed

                  if (!(!iov || iov.destroyed || !iov.player)) {
                    _context.next = 16;
                    break;
                  }

                  _context.next = 14;
                  return _this.initializeIOV(player);

                case 14:
                  _context.next = 18;
                  break;

                case 16:
                  _context.next = 18;
                  return iov.player.restart();

                case 18:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this2);
        }));

        return function (_x2) {
          return _ref.apply(this, arguments);
        };
      }());

      // @todo - we are currently creating the IOV for this player on `firstplay`
      // but we could do it on the `ready` event.  However, in order to support
      // this, we need to make the IOV and its player able to be instantiated
      // without automatically playing AND without automatically listening via
      // a conduit
      player.on('firstplay', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _this.debug('on player firstplay');

                  _context2.next = 3;
                  return _this.initializeIOV(player);

                case 3:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this2);
        }));

        return function (_x3) {
          return _ref2.apply(this, arguments);
        };
      }());

      player.on('dispose', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return player.tech(true).mqtt.iov.destroy();

              case 3:
                _context3.next = 8;
                break;

              case 5:
                _context3.prev = 5;
                _context3.t0 = _context3['catch'](0);

                // @todo - need to improve iov destroy logic...
                console.error(_context3.t0);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this2, [[0, 5]]);
      })));
      return _this;
    }

    _createClass(ClspPlugin, [{
      key: 'getVideojsErrorsOptions',
      value: function getVideojsErrorsOptions() {
        return _extends({
          timeout: 20 * 1000,
          errors: {
            PLAYER_ERR_NOT_COMPAT: {
              type: 'PLAYER_ERR_NOT_COMPAT',
              headline: 'This browser is unsupported.',
              message: 'Chrome 52+ is required.'
            }
          }
        }, this.options.videojsErrorsOptions);
      }
    }, {
      key: 'resetErrors',
      value: function resetErrors(player) {
        // @see - https://github.com/videojs/video.js/issues/4401
        player.error(null);
        player.errorDisplay.close();

        // Support for the videojs-errors library
        // After an error occurs, and then we clear the error and its message
        // above, we must re-enable videojs-errors on the player
        if (player.errors) {
          player.errors(this.getVideojsErrorsOptions());
        }
      }
    }, {
      key: 'initializeIOV',
      value: function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(player) {
          var mqttHandler;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  mqttHandler = player.tech(true).mqtt;

                  if (mqttHandler) {
                    _context4.next = 3;
                    break;
                  }

                  throw new Error('VideoJS Player ' + player.id() + ' does not have mqtt tech!');

                case 3:

                  mqttHandler.off('error', this.onMqttHandlerError);
                  mqttHandler.on('error', this.onMqttHandlerError);

                  _context4.next = 7;
                  return mqttHandler.createIOV(player, {
                    enableMetrics: this.options.enableMetrics,
                    defaultNonSslPort: this.options.defaultNonSslPort,
                    defaultSslPort: this.options.defaultSslPort
                  });

                case 7:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        function initializeIOV(_x4) {
          return _ref4.apply(this, arguments);
        }

        return initializeIOV;
      }()
    }, {
      key: 'destroy',
      value: function destroy() {
        this.debug('destroying...');

        var mqttHandler = this.player.tech(true).mqtt;

        mqttHandler.off('error', this.onMqttHandlerError);

        this._playerOptions = null;
        this.currentSourceIndex = null;
        this.debug = null;
      }
    }]);

    return ClspPlugin;
  }(Plugin), _class.VERSION = _utils__WEBPACK_IMPORTED_MODULE_4__["default"].version, _class.utils = _utils__WEBPACK_IMPORTED_MODULE_4__["default"], _class.METRIC_TYPES = ['videojs.errorRetriesCount'], _temp;
});

/***/ }),

/***/ "./src/js/conduit/clspConduit.generated.js":
/*!*************************************************!*\
  !*** ./src/js/conduit/clspConduit.generated.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
Creates a hidden iframe that is used to establish a dedicated mqtt websocket
for a single video. This is basically an in browser micro service which
uses cross document communication to route data to and from the iframe.
*/

// The below string literals allow the iframe to be created completely withinjavascript allowing
// the videojs to be completely protable.


// this code is filled in by the gulpfile.js
var iframe_code = "/*******************************************************************************\n * Copyright (c) 2013, 2016 IBM Corp.\n *\n * All rights reserved. This program and the accompanying materials\n * are made available under the terms of the Eclipse Public License v1.0\n * and Eclipse Distribution License v1.0 which accompany this distribution.\n *\n * The Eclipse Public License is available at\n *    http://www.eclipse.org/legal/epl-v10.html\n * and the Eclipse Distribution License is available at\n *   http://www.eclipse.org/org/documents/edl-v10.php.\n *\n *******************************************************************************/\n(function(p,s){\"object\"===typeof exports&&\"object\"===typeof module?module.exports=s():\"function\"===typeof define&&define.amd?define(s):\"object\"===typeof exports?exports=s():(\"undefined\"===typeof p.Paho&&(p.Paho={}),p.Paho.MQTT=s())})(this,function(){return function(p){function s(a,b,c){b[c++]=a>>8;b[c++]=a%256;return c}function u(a,b,c,k){k=s(b,c,k);D(a,c,k);return k+b}function n(a){for(var b=0,c=0;c<a.length;c++){var k=a.charCodeAt(c);2047<k?(55296<=k&&56319>=k&&(c++,b++),b+=3):127<k?b+=2:b++}return b}\nfunction D(a,b,c){for(var k=0;k<a.length;k++){var e=a.charCodeAt(k);if(55296<=e&&56319>=e){var g=a.charCodeAt(++k);if(isNaN(g))throw Error(f(h.MALFORMED_UNICODE,[e,g]));e=(e-55296<<10)+(g-56320)+65536}127>=e?b[c++]=e:(2047>=e?b[c++]=e>>6&31|192:(65535>=e?b[c++]=e>>12&15|224:(b[c++]=e>>18&7|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b}function E(a,b,c){for(var k=\"\",e,g=b;g<b+c;){e=a[g++];if(!(128>e)){var m=a[g++]-128;if(0>m)throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),\n\"\"]));if(224>e)e=64*(e-192)+m;else{var d=a[g++]-128;if(0>d)throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),d.toString(16)]));if(240>e)e=4096*(e-224)+64*m+d;else{var l=a[g++]-128;if(0>l)throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),d.toString(16),l.toString(16)]));if(248>e)e=262144*(e-240)+4096*m+64*d+l;else throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),d.toString(16),l.toString(16)]));}}}65535<e&&(e-=65536,k+=String.fromCharCode(55296+(e>>10)),e=56320+(e&\n1023));k+=String.fromCharCode(e)}return k}var z=function(a,b){for(var c in a)if(a.hasOwnProperty(c))if(b.hasOwnProperty(c)){if(typeof a[c]!==b[c])throw Error(f(h.INVALID_TYPE,[typeof a[c],c]));}else{c=\"Unknown property, \"+c+\". Valid properties are:\";for(var k in b)b.hasOwnProperty(k)&&(c=c+\" \"+k);throw Error(c);}},v=function(a,b){return function(){return a.apply(b,arguments)}},h={OK:{code:0,text:\"AMQJSC0000I OK.\"},CONNECT_TIMEOUT:{code:1,text:\"AMQJSC0001E Connect timed out.\"},SUBSCRIBE_TIMEOUT:{code:2,\ntext:\"AMQJS0002E Subscribe timed out.\"},UNSUBSCRIBE_TIMEOUT:{code:3,text:\"AMQJS0003E Unsubscribe timed out.\"},PING_TIMEOUT:{code:4,text:\"AMQJS0004E Ping timed out.\"},INTERNAL_ERROR:{code:5,text:\"AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}\"},CONNACK_RETURNCODE:{code:6,text:\"AMQJS0006E Bad Connack return code:{0} {1}.\"},SOCKET_ERROR:{code:7,text:\"AMQJS0007E Socket error:{0}.\"},SOCKET_CLOSE:{code:8,text:\"AMQJS0008I Socket closed.\"},MALFORMED_UTF:{code:9,text:\"AMQJS0009E Malformed UTF data:{0} {1} {2}.\"},\nUNSUPPORTED:{code:10,text:\"AMQJS0010E {0} is not supported by this browser.\"},INVALID_STATE:{code:11,text:\"AMQJS0011E Invalid state {0}.\"},INVALID_TYPE:{code:12,text:\"AMQJS0012E Invalid type {0} for {1}.\"},INVALID_ARGUMENT:{code:13,text:\"AMQJS0013E Invalid argument {0} for {1}.\"},UNSUPPORTED_OPERATION:{code:14,text:\"AMQJS0014E Unsupported operation.\"},INVALID_STORED_DATA:{code:15,text:\"AMQJS0015E Invalid data in local storage key\\x3d{0} value\\x3d{1}.\"},INVALID_MQTT_MESSAGE_TYPE:{code:16,text:\"AMQJS0016E Invalid MQTT message type {0}.\"},\nMALFORMED_UNICODE:{code:17,text:\"AMQJS0017E Malformed Unicode string:{0} {1}.\"},BUFFER_FULL:{code:18,text:\"AMQJS0018E Message buffer is full, maximum buffer size: {0}.\"}},H={0:\"Connection Accepted\",1:\"Connection Refused: unacceptable protocol version\",2:\"Connection Refused: identifier rejected\",3:\"Connection Refused: server unavailable\",4:\"Connection Refused: bad user name or password\",5:\"Connection Refused: not authorized\"},f=function(a,b){var c=a.text;if(b)for(var k,e,g=0;g<b.length;g++)if(k=\"{\"+\ng+\"}\",e=c.indexOf(k),0<e)var h=c.substring(0,e),c=c.substring(e+k.length),c=h+b[g]+c;return c},A=[0,6,77,81,73,115,100,112,3],B=[0,4,77,81,84,84,4],q=function(a,b){this.type=a;for(var c in b)b.hasOwnProperty(c)&&(this[c]=b[c])};q.prototype.encode=function(){var a=(this.type&15)<<4,b=0,c=[],k=0,e;void 0!==this.messageIdentifier&&(b+=2);switch(this.type){case 1:switch(this.mqttVersion){case 3:b+=A.length+3;break;case 4:b+=B.length+3}b+=n(this.clientId)+2;void 0!==this.willMessage&&(b+=n(this.willMessage.destinationName)+\n2,e=this.willMessage.payloadBytes,e instanceof Uint8Array||(e=new Uint8Array(h)),b+=e.byteLength+2);void 0!==this.userName&&(b+=n(this.userName)+2);void 0!==this.password&&(b+=n(this.password)+2);break;case 8:for(var a=a|2,g=0;g<this.topics.length;g++)c[g]=n(this.topics[g]),b+=c[g]+2;b+=this.requestedQos.length;break;case 10:a|=2;for(g=0;g<this.topics.length;g++)c[g]=n(this.topics[g]),b+=c[g]+2;break;case 6:a|=2;break;case 3:this.payloadMessage.duplicate&&(a|=8);a=a|=this.payloadMessage.qos<<1;this.payloadMessage.retained&&\n(a|=1);var k=n(this.payloadMessage.destinationName),h=this.payloadMessage.payloadBytes,b=b+(k+2)+h.byteLength;h instanceof ArrayBuffer?h=new Uint8Array(h):h instanceof Uint8Array||(h=new Uint8Array(h.buffer))}var f=b,g=Array(1),d=0;do{var t=f%128,f=f>>7;0<f&&(t|=128);g[d++]=t}while(0<f&&4>d);f=g.length+1;b=new ArrayBuffer(b+f);d=new Uint8Array(b);d[0]=a;d.set(g,1);if(3==this.type)f=u(this.payloadMessage.destinationName,k,d,f);else if(1==this.type){switch(this.mqttVersion){case 3:d.set(A,f);f+=A.length;\nbreak;case 4:d.set(B,f),f+=B.length}a=0;this.cleanSession&&(a=2);void 0!==this.willMessage&&(a=a|4|this.willMessage.qos<<3,this.willMessage.retained&&(a|=32));void 0!==this.userName&&(a|=128);void 0!==this.password&&(a|=64);d[f++]=a;f=s(this.keepAliveInterval,d,f)}void 0!==this.messageIdentifier&&(f=s(this.messageIdentifier,d,f));switch(this.type){case 1:f=u(this.clientId,n(this.clientId),d,f);void 0!==this.willMessage&&(f=u(this.willMessage.destinationName,n(this.willMessage.destinationName),d,f),\nf=s(e.byteLength,d,f),d.set(e,f),f+=e.byteLength);void 0!==this.userName&&(f=u(this.userName,n(this.userName),d,f));void 0!==this.password&&u(this.password,n(this.password),d,f);break;case 3:d.set(h,f);break;case 8:for(g=0;g<this.topics.length;g++)f=u(this.topics[g],c[g],d,f),d[f++]=this.requestedQos[g];break;case 10:for(g=0;g<this.topics.length;g++)f=u(this.topics[g],c[g],d,f)}return b};var F=function(a,b,c){this._client=a;this._window=b;this._keepAliveInterval=1E3*c;this.isReset=!1;var k=(new q(12)).encode(),\ne=function(a){return function(){return g.apply(a)}},g=function(){this.isReset?(this.isReset=!1,this._client._trace(\"Pinger.doPing\",\"send PINGREQ\"),this._client.socket.send(k),this.timeout=this._window.setTimeout(e(this),this._keepAliveInterval)):(this._client._trace(\"Pinger.doPing\",\"Timed out\"),this._client._disconnected(h.PING_TIMEOUT.code,f(h.PING_TIMEOUT)))};this.reset=function(){this.isReset=!0;this._window.clearTimeout(this.timeout);0<this._keepAliveInterval&&(this.timeout=setTimeout(e(this),\nthis._keepAliveInterval))};this.cancel=function(){this._window.clearTimeout(this.timeout)}},w=function(a,b,c,f,e){this._window=b;c||(c=30);this.timeout=setTimeout(function(a,b,c){return function(){return a.apply(b,c)}}(f,a,e),1E3*c);this.cancel=function(){this._window.clearTimeout(this.timeout)}},d=function(a,b,c,d,e){if(!(\"WebSocket\"in p&&null!==p.WebSocket))throw Error(f(h.UNSUPPORTED,[\"WebSocket\"]));if(!(\"localStorage\"in p&&null!==p.localStorage))throw Error(f(h.UNSUPPORTED,[\"localStorage\"]));\nif(!(\"ArrayBuffer\"in p&&null!==p.ArrayBuffer))throw Error(f(h.UNSUPPORTED,[\"ArrayBuffer\"]));this._trace(\"Paho.MQTT.Client\",a,b,c,d,e);this.host=b;this.port=c;this.path=d;this.uri=a;this.clientId=e;this._wsuri=null;this._localKey=b+\":\"+c+(\"/mqtt\"!=d?\":\"+d:\"\")+\":\"+e+\":\";this._msg_queue=[];this._buffered_msg_queue=[];this._sentMessages={};this._receivedMessages={};this._notify_msg_sent={};this._message_identifier=1;this._sequence=0;for(var g in localStorage)0!==g.indexOf(\"Sent:\"+this._localKey)&&0!==\ng.indexOf(\"Received:\"+this._localKey)||this.restore(g)};d.prototype.host=null;d.prototype.port=null;d.prototype.path=null;d.prototype.uri=null;d.prototype.clientId=null;d.prototype.socket=null;d.prototype.connected=!1;d.prototype.maxMessageIdentifier=65536;d.prototype.connectOptions=null;d.prototype.hostIndex=null;d.prototype.onConnected=null;d.prototype.onConnectionLost=null;d.prototype.onMessageDelivered=null;d.prototype.onMessageArrived=null;d.prototype.traceFunction=null;d.prototype._msg_queue=\nnull;d.prototype._buffered_msg_queue=null;d.prototype._connectTimeout=null;d.prototype.sendPinger=null;d.prototype.receivePinger=null;d.prototype._reconnectInterval=1;d.prototype._reconnecting=!1;d.prototype._reconnectTimeout=null;d.prototype.disconnectedPublishing=!1;d.prototype.disconnectedBufferSize=5E3;d.prototype.receiveBuffer=null;d.prototype._traceBuffer=null;d.prototype._MAX_TRACE_ENTRIES=100;d.prototype.connect=function(a){var b=this._traceMask(a,\"password\");this._trace(\"Client.connect\",\nb,this.socket,this.connected);if(this.connected)throw Error(f(h.INVALID_STATE,[\"already connected\"]));if(this.socket)throw Error(f(h.INVALID_STATE,[\"already connected\"]));this._reconnecting&&(this._reconnectTimeout.cancel(),this._reconnectTimeout=null,this._reconnecting=!1);this.connectOptions=a;this._reconnectInterval=1;this._reconnecting=!1;a.uris?(this.hostIndex=0,this._doConnect(a.uris[0])):this._doConnect(this.uri)};d.prototype.subscribe=function(a,b){this._trace(\"Client.subscribe\",a,b);if(!this.connected)throw Error(f(h.INVALID_STATE,\n[\"not connected\"]));var c=new q(8);c.topics=[a];c.requestedQos=void 0!==b.qos?[b.qos]:[0];b.onSuccess&&(c.onSuccess=function(a){b.onSuccess({invocationContext:b.invocationContext,grantedQos:a})});b.onFailure&&(c.onFailure=function(a){b.onFailure({invocationContext:b.invocationContext,errorCode:a,errorMessage:f(a)})});b.timeout&&(c.timeOut=new w(this,window,b.timeout,b.onFailure,[{invocationContext:b.invocationContext,errorCode:h.SUBSCRIBE_TIMEOUT.code,errorMessage:f(h.SUBSCRIBE_TIMEOUT)}]));this._requires_ack(c);\nthis._schedule_message(c)};d.prototype.unsubscribe=function(a,b){this._trace(\"Client.unsubscribe\",a,b);if(!this.connected)throw Error(f(h.INVALID_STATE,[\"not connected\"]));var c=new q(10);c.topics=[a];b.onSuccess&&(c.callback=function(){b.onSuccess({invocationContext:b.invocationContext})});b.timeout&&(c.timeOut=new w(this,window,b.timeout,b.onFailure,[{invocationContext:b.invocationContext,errorCode:h.UNSUBSCRIBE_TIMEOUT.code,errorMessage:f(h.UNSUBSCRIBE_TIMEOUT)}]));this._requires_ack(c);this._schedule_message(c)};\nd.prototype.send=function(a){this._trace(\"Client.send\",a);wireMessage=new q(3);wireMessage.payloadMessage=a;if(this.connected)0<a.qos?this._requires_ack(wireMessage):this.onMessageDelivered&&(this._notify_msg_sent[wireMessage]=this.onMessageDelivered(wireMessage.payloadMessage)),this._schedule_message(wireMessage);else if(this._reconnecting&&this.disconnectedPublishing){if(Object.keys(this._sentMessages).length+this._buffered_msg_queue.length>this.disconnectedBufferSize)throw Error(f(h.BUFFER_FULL,\n[this.disconnectedBufferSize]));0<a.qos?this._requires_ack(wireMessage):(wireMessage.sequence=++this._sequence,this._buffered_msg_queue.push(wireMessage))}else throw Error(f(h.INVALID_STATE,[\"not connected\"]));};d.prototype.disconnect=function(){this._trace(\"Client.disconnect\");this._reconnecting&&(this._reconnectTimeout.cancel(),this._reconnectTimeout=null,this._reconnecting=!1);if(!this.socket)throw Error(f(h.INVALID_STATE,[\"not connecting or connected\"]));wireMessage=new q(14);this._notify_msg_sent[wireMessage]=\nv(this._disconnected,this);this._schedule_message(wireMessage)};d.prototype.getTraceLog=function(){if(null!==this._traceBuffer){this._trace(\"Client.getTraceLog\",new Date);this._trace(\"Client.getTraceLog in flight messages\",this._sentMessages.length);for(var a in this._sentMessages)this._trace(\"_sentMessages \",a,this._sentMessages[a]);for(a in this._receivedMessages)this._trace(\"_receivedMessages \",a,this._receivedMessages[a]);return this._traceBuffer}};d.prototype.startTrace=function(){null===this._traceBuffer&&\n(this._traceBuffer=[]);this._trace(\"Client.startTrace\",new Date,\"1.0.3\")};d.prototype.stopTrace=function(){delete this._traceBuffer};d.prototype._doConnect=function(a){this.connectOptions.useSSL&&(a=a.split(\":\"),a[0]=\"wss\",a=a.join(\":\"));this._wsuri=a;this.connected=!1;this.socket=4>this.connectOptions.mqttVersion?new WebSocket(a,[\"mqttv3.1\"]):new WebSocket(a,[\"mqtt\"]);this.socket.binaryType=\"arraybuffer\";this.socket.onopen=v(this._on_socket_open,this);this.socket.onmessage=v(this._on_socket_message,\nthis);this.socket.onerror=v(this._on_socket_error,this);this.socket.onclose=v(this._on_socket_close,this);this.sendPinger=new F(this,window,this.connectOptions.keepAliveInterval);this.receivePinger=new F(this,window,this.connectOptions.keepAliveInterval);this._connectTimeout&&(this._connectTimeout.cancel(),this._connectTimeout=null);this._connectTimeout=new w(this,window,this.connectOptions.timeout,this._disconnected,[h.CONNECT_TIMEOUT.code,f(h.CONNECT_TIMEOUT)])};d.prototype._schedule_message=function(a){this._msg_queue.push(a);\nthis.connected&&this._process_queue()};d.prototype.store=function(a,b){var c={type:b.type,messageIdentifier:b.messageIdentifier,version:1};switch(b.type){case 3:b.pubRecReceived&&(c.pubRecReceived=!0);c.payloadMessage={};for(var d=\"\",e=b.payloadMessage.payloadBytes,g=0;g<e.length;g++)d=15>=e[g]?d+\"0\"+e[g].toString(16):d+e[g].toString(16);c.payloadMessage.payloadHex=d;c.payloadMessage.qos=b.payloadMessage.qos;c.payloadMessage.destinationName=b.payloadMessage.destinationName;b.payloadMessage.duplicate&&\n(c.payloadMessage.duplicate=!0);b.payloadMessage.retained&&(c.payloadMessage.retained=!0);0===a.indexOf(\"Sent:\")&&(void 0===b.sequence&&(b.sequence=++this._sequence),c.sequence=b.sequence);break;default:throw Error(f(h.INVALID_STORED_DATA,[key,c]));}localStorage.setItem(a+this._localKey+b.messageIdentifier,JSON.stringify(c))};d.prototype.restore=function(a){var b=localStorage.getItem(a),c=JSON.parse(b),d=new q(c.type,c);switch(c.type){case 3:for(var b=c.payloadMessage.payloadHex,e=new ArrayBuffer(b.length/\n2),e=new Uint8Array(e),g=0;2<=b.length;){var m=parseInt(b.substring(0,2),16),b=b.substring(2,b.length);e[g++]=m}b=new Paho.MQTT.Message(e);b.qos=c.payloadMessage.qos;b.destinationName=c.payloadMessage.destinationName;c.payloadMessage.duplicate&&(b.duplicate=!0);c.payloadMessage.retained&&(b.retained=!0);d.payloadMessage=b;break;default:throw Error(f(h.INVALID_STORED_DATA,[a,b]));}0===a.indexOf(\"Sent:\"+this._localKey)?(d.payloadMessage.duplicate=!0,this._sentMessages[d.messageIdentifier]=d):0===a.indexOf(\"Received:\"+\nthis._localKey)&&(this._receivedMessages[d.messageIdentifier]=d)};d.prototype._process_queue=function(){for(var a=null,b=this._msg_queue.reverse();a=b.pop();)this._socket_send(a),this._notify_msg_sent[a]&&(this._notify_msg_sent[a](),delete this._notify_msg_sent[a])};d.prototype._requires_ack=function(a){var b=Object.keys(this._sentMessages).length;if(b>this.maxMessageIdentifier)throw Error(\"Too many messages:\"+b);for(;void 0!==this._sentMessages[this._message_identifier];)this._message_identifier++;\na.messageIdentifier=this._message_identifier;this._sentMessages[a.messageIdentifier]=a;3===a.type&&this.store(\"Sent:\",a);this._message_identifier===this.maxMessageIdentifier&&(this._message_identifier=1)};d.prototype._on_socket_open=function(){var a=new q(1,this.connectOptions);a.clientId=this.clientId;this._socket_send(a)};d.prototype._on_socket_message=function(a){this._trace(\"Client._on_socket_message\",a.data);a=this._deframeMessages(a.data);for(var b=0;b<a.length;b+=1)this._handleMessage(a[b])};\nd.prototype._deframeMessages=function(a){a=new Uint8Array(a);var b=[];if(this.receiveBuffer){var c=new Uint8Array(this.receiveBuffer.length+a.length);c.set(this.receiveBuffer);c.set(a,this.receiveBuffer.length);a=c;delete this.receiveBuffer}try{for(c=0;c<a.length;){var d;a:{var e=a,g=c,m=g,n=e[g],l=n>>4,t=n&15,g=g+1,x=void 0,C=0,p=1;do{if(g==e.length){d=[null,m];break a}x=e[g++];C+=(x&127)*p;p*=128}while(0!==(x&128));x=g+C;if(x>e.length)d=[null,m];else{var y=new q(l);switch(l){case 2:e[g++]&1&&(y.sessionPresent=\n!0);y.returnCode=e[g++];break;case 3:var m=t>>1&3,s=256*e[g]+e[g+1],g=g+2,u=E(e,g,s),g=g+s;0<m&&(y.messageIdentifier=256*e[g]+e[g+1],g+=2);var r=new Paho.MQTT.Message(e.subarray(g,x));1==(t&1)&&(r.retained=!0);8==(t&8)&&(r.duplicate=!0);r.qos=m;r.destinationName=u;y.payloadMessage=r;break;case 4:case 5:case 6:case 7:case 11:y.messageIdentifier=256*e[g]+e[g+1];break;case 9:y.messageIdentifier=256*e[g]+e[g+1],g+=2,y.returnCode=e.subarray(g,x)}d=[y,x]}}var v=d[0],c=d[1];if(null!==v)b.push(v);else break}c<\na.length&&(this.receiveBuffer=a.subarray(c))}catch(w){d=\"undefined\"==w.hasOwnProperty(\"stack\")?w.stack.toString():\"No Error Stack Available\";this._disconnected(h.INTERNAL_ERROR.code,f(h.INTERNAL_ERROR,[w.message,d]));return}return b};d.prototype._handleMessage=function(a){this._trace(\"Client._handleMessage\",a);try{switch(a.type){case 2:this._connectTimeout.cancel();this._reconnectTimeout&&this._reconnectTimeout.cancel();if(this.connectOptions.cleanSession){for(var b in this._sentMessages){var c=this._sentMessages[b];\nlocalStorage.removeItem(\"Sent:\"+this._localKey+c.messageIdentifier)}this._sentMessages={};for(b in this._receivedMessages){var d=this._receivedMessages[b];localStorage.removeItem(\"Received:\"+this._localKey+d.messageIdentifier)}this._receivedMessages={}}if(0===a.returnCode)this.connected=!0,this.connectOptions.uris&&(this.hostIndex=this.connectOptions.uris.length);else{this._disconnected(h.CONNACK_RETURNCODE.code,f(h.CONNACK_RETURNCODE,[a.returnCode,H[a.returnCode]]));break}a=[];for(var e in this._sentMessages)this._sentMessages.hasOwnProperty(e)&&\na.push(this._sentMessages[e]);if(0<this._buffered_msg_queue.length){e=null;for(var g=this._buffered_msg_queue.reverse();e=g.pop();)a.push(e),this.onMessageDelivered&&(this._notify_msg_sent[e]=this.onMessageDelivered(e.payloadMessage))}a=a.sort(function(a,b){return a.sequence-b.sequence});for(var g=0,m=a.length;g<m;g++)if(c=a[g],3==c.type&&c.pubRecReceived){var n=new q(6,{messageIdentifier:c.messageIdentifier});this._schedule_message(n)}else this._schedule_message(c);if(this.connectOptions.onSuccess)this.connectOptions.onSuccess({invocationContext:this.connectOptions.invocationContext});\nc=!1;this._reconnecting&&(c=!0,this._reconnectInterval=1,this._reconnecting=!1);this._connected(c,this._wsuri);this._process_queue();break;case 3:this._receivePublish(a);break;case 4:if(c=this._sentMessages[a.messageIdentifier])if(delete this._sentMessages[a.messageIdentifier],localStorage.removeItem(\"Sent:\"+this._localKey+a.messageIdentifier),this.onMessageDelivered)this.onMessageDelivered(c.payloadMessage);break;case 5:if(c=this._sentMessages[a.messageIdentifier])c.pubRecReceived=!0,n=new q(6,{messageIdentifier:a.messageIdentifier}),\nthis.store(\"Sent:\",c),this._schedule_message(n);break;case 6:d=this._receivedMessages[a.messageIdentifier];localStorage.removeItem(\"Received:\"+this._localKey+a.messageIdentifier);d&&(this._receiveMessage(d),delete this._receivedMessages[a.messageIdentifier]);var l=new q(7,{messageIdentifier:a.messageIdentifier});this._schedule_message(l);break;case 7:c=this._sentMessages[a.messageIdentifier];delete this._sentMessages[a.messageIdentifier];localStorage.removeItem(\"Sent:\"+this._localKey+a.messageIdentifier);\nif(this.onMessageDelivered)this.onMessageDelivered(c.payloadMessage);break;case 9:if(c=this._sentMessages[a.messageIdentifier]){c.timeOut&&c.timeOut.cancel();if(128===a.returnCode[0]){if(c.onFailure)c.onFailure(a.returnCode)}else if(c.onSuccess)c.onSuccess(a.returnCode);delete this._sentMessages[a.messageIdentifier]}break;case 11:if(c=this._sentMessages[a.messageIdentifier])c.timeOut&&c.timeOut.cancel(),c.callback&&c.callback(),delete this._sentMessages[a.messageIdentifier];break;case 13:this.sendPinger.reset();\nbreak;case 14:this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code,f(h.INVALID_MQTT_MESSAGE_TYPE,[a.type]));break;default:this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code,f(h.INVALID_MQTT_MESSAGE_TYPE,[a.type]))}}catch(t){c=\"undefined\"==t.hasOwnProperty(\"stack\")?t.stack.toString():\"No Error Stack Available\",this._disconnected(h.INTERNAL_ERROR.code,f(h.INTERNAL_ERROR,[t.message,c]))}};d.prototype._on_socket_error=function(a){this._reconnecting||this._disconnected(h.SOCKET_ERROR.code,f(h.SOCKET_ERROR,\n[a.data]))};d.prototype._on_socket_close=function(){this._reconnecting||this._disconnected(h.SOCKET_CLOSE.code,f(h.SOCKET_CLOSE))};d.prototype._socket_send=function(a){if(1==a.type){var b=this._traceMask(a,\"password\");this._trace(\"Client._socket_send\",b)}else this._trace(\"Client._socket_send\",a);this.socket.send(a.encode());this.sendPinger.reset()};d.prototype._receivePublish=function(a){switch(a.payloadMessage.qos){case \"undefined\":case 0:this._receiveMessage(a);break;case 1:var b=new q(4,{messageIdentifier:a.messageIdentifier});\nthis._schedule_message(b);this._receiveMessage(a);break;case 2:this._receivedMessages[a.messageIdentifier]=a;this.store(\"Received:\",a);a=new q(5,{messageIdentifier:a.messageIdentifier});this._schedule_message(a);break;default:throw Error(\"Invaild qos\\x3d\"+wireMmessage.payloadMessage.qos);}};d.prototype._receiveMessage=function(a){if(this.onMessageArrived)this.onMessageArrived(a.payloadMessage)};d.prototype._connected=function(a,b){if(this.onConnected)this.onConnected(a,b)};d.prototype._reconnect=\nfunction(){this._trace(\"Client._reconnect\");this.connected||(this._reconnecting=!0,this.sendPinger.cancel(),this.receivePinger.cancel(),128>this._reconnectInterval&&(this._reconnectInterval*=2),this.connectOptions.uris?(this.hostIndex=0,this._doConnect(this.connectOptions.uris[0])):this._doConnect(this.uri))};d.prototype._disconnected=function(a,b){this._trace(\"Client._disconnected\",a,b);if(void 0!==a&&this._reconnecting)this._reconnectTimeout=new w(this,window,this._reconnectInterval,this._reconnect);\nelse if(this.sendPinger.cancel(),this.receivePinger.cancel(),this._connectTimeout&&(this._connectTimeout.cancel(),this._connectTimeout=null),this._msg_queue=[],this._buffered_msg_queue=[],this._notify_msg_sent={},this.socket&&(this.socket.onopen=null,this.socket.onmessage=null,this.socket.onerror=null,this.socket.onclose=null,1===this.socket.readyState&&this.socket.close(),delete this.socket),this.connectOptions.uris&&this.hostIndex<this.connectOptions.uris.length-1)this.hostIndex++,this._doConnect(this.connectOptions.uris[this.hostIndex]);\nelse if(void 0===a&&(a=h.OK.code,b=f(h.OK)),this.connected){this.connected=!1;if(this.onConnectionLost)this.onConnectionLost({errorCode:a,errorMessage:b,reconnect:this.connectOptions.reconnect,uri:this._wsuri});a!==h.OK.code&&this.connectOptions.reconnect&&(this._reconnectInterval=1,this._reconnect())}else if(4===this.connectOptions.mqttVersion&&!1===this.connectOptions.mqttVersionExplicit)this._trace(\"Failed to connect V4, dropping back to V3\"),this.connectOptions.mqttVersion=3,this.connectOptions.uris?\n(this.hostIndex=0,this._doConnect(this.connectOptions.uris[0])):this._doConnect(this.uri);else if(this.connectOptions.onFailure)this.connectOptions.onFailure({invocationContext:this.connectOptions.invocationContext,errorCode:a,errorMessage:b})};d.prototype._trace=function(){if(this.traceFunction){for(var a in arguments)\"undefined\"!==typeof arguments[a]&&arguments.splice(a,1,JSON.stringify(arguments[a]));a=Array.prototype.slice.call(arguments).join(\"\");this.traceFunction({severity:\"Debug\",message:a})}if(null!==\nthis._traceBuffer){a=0;for(var b=arguments.length;a<b;a++)this._traceBuffer.length==this._MAX_TRACE_ENTRIES&&this._traceBuffer.shift(),0===a?this._traceBuffer.push(arguments[a]):\"undefined\"===typeof arguments[a]?this._traceBuffer.push(arguments[a]):this._traceBuffer.push(\"  \"+JSON.stringify(arguments[a]))}};d.prototype._traceMask=function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=d==b?\"******\":a[d]);return c};var G=function(a,b,c,k){var e;if(\"string\"!==typeof a)throw Error(f(h.INVALID_TYPE,\n[typeof a,\"host\"]));if(2==arguments.length){k=b;e=a;var g=e.match(/^(wss?):\\/\\/((\\[(.+)\\])|([^\\/]+?))(:(\\d+))?(\\/.*)$/);if(g)a=g[4]||g[2],b=parseInt(g[7]),c=g[8];else throw Error(f(h.INVALID_ARGUMENT,[a,\"host\"]));}else{3==arguments.length&&(k=c,c=\"/mqtt\");if(\"number\"!==typeof b||0>b)throw Error(f(h.INVALID_TYPE,[typeof b,\"port\"]));if(\"string\"!==typeof c)throw Error(f(h.INVALID_TYPE,[typeof c,\"path\"]));e=\"ws://\"+(-1!==a.indexOf(\":\")&&\"[\"!==a.slice(0,1)&&\"]\"!==a.slice(-1)?\"[\"+a+\"]\":a)+\":\"+b+c}for(var m=\ng=0;m<k.length;m++){var n=k.charCodeAt(m);55296<=n&&56319>=n&&m++;g++}if(\"string\"!==typeof k||65535<g)throw Error(f(h.INVALID_ARGUMENT,[k,\"clientId\"]));var l=new d(e,a,b,c,k);this._getHost=function(){return a};this._setHost=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getPort=function(){return b};this._setPort=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getPath=function(){return c};this._setPath=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getURI=function(){return e};\nthis._setURI=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getClientId=function(){return l.clientId};this._setClientId=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getOnConnected=function(){return l.onConnected};this._setOnConnected=function(a){if(\"function\"===typeof a)l.onConnected=a;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onConnected\"]));};this._getDisconnectedPublishing=function(){return l.disconnectedPublishing};this._setDisconnectedPublishing=function(a){l.disconnectedPublishing=\na};this._getDisconnectedBufferSize=function(){return l.disconnectedBufferSize};this._setDisconnectedBufferSize=function(a){l.disconnectedBufferSize=a};this._getOnConnectionLost=function(){return l.onConnectionLost};this._setOnConnectionLost=function(a){if(\"function\"===typeof a)l.onConnectionLost=a;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onConnectionLost\"]));};this._getOnMessageDelivered=function(){return l.onMessageDelivered};this._setOnMessageDelivered=function(a){if(\"function\"===typeof a)l.onMessageDelivered=\na;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onMessageDelivered\"]));};this._getOnMessageArrived=function(){return l.onMessageArrived};this._setOnMessageArrived=function(a){if(\"function\"===typeof a)l.onMessageArrived=a;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onMessageArrived\"]));};this._getTrace=function(){return l.traceFunction};this._setTrace=function(a){if(\"function\"===typeof a)l.traceFunction=a;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onTrace\"]));};this.connect=function(a){a=a||{};z(a,\n{timeout:\"number\",userName:\"string\",password:\"string\",willMessage:\"object\",keepAliveInterval:\"number\",cleanSession:\"boolean\",useSSL:\"boolean\",invocationContext:\"object\",onSuccess:\"function\",onFailure:\"function\",hosts:\"object\",ports:\"object\",reconnect:\"boolean\",mqttVersion:\"number\",mqttVersionExplicit:\"boolean\",uris:\"object\"});void 0===a.keepAliveInterval&&(a.keepAliveInterval=60);if(4<a.mqttVersion||3>a.mqttVersion)throw Error(f(h.INVALID_ARGUMENT,[a.mqttVersion,\"connectOptions.mqttVersion\"]));void 0===\na.mqttVersion?(a.mqttVersionExplicit=!1,a.mqttVersion=4):a.mqttVersionExplicit=!0;if(void 0!==a.password&&void 0===a.userName)throw Error(f(h.INVALID_ARGUMENT,[a.password,\"connectOptions.password\"]));if(a.willMessage){if(!(a.willMessage instanceof r))throw Error(f(h.INVALID_TYPE,[a.willMessage,\"connectOptions.willMessage\"]));a.willMessage.stringPayload=null;if(\"undefined\"===typeof a.willMessage.destinationName)throw Error(f(h.INVALID_TYPE,[typeof a.willMessage.destinationName,\"connectOptions.willMessage.destinationName\"]));\n}\"undefined\"===typeof a.cleanSession&&(a.cleanSession=!0);if(a.hosts){if(!(a.hosts instanceof Array))throw Error(f(h.INVALID_ARGUMENT,[a.hosts,\"connectOptions.hosts\"]));if(1>a.hosts.length)throw Error(f(h.INVALID_ARGUMENT,[a.hosts,\"connectOptions.hosts\"]));for(var b=!1,d=0;d<a.hosts.length;d++){if(\"string\"!==typeof a.hosts[d])throw Error(f(h.INVALID_TYPE,[typeof a.hosts[d],\"connectOptions.hosts[\"+d+\"]\"]));if(/^(wss?):\\/\\/((\\[(.+)\\])|([^\\/]+?))(:(\\d+))?(\\/.*)$/.test(a.hosts[d]))if(0===d)b=!0;else{if(!b)throw Error(f(h.INVALID_ARGUMENT,\n[a.hosts[d],\"connectOptions.hosts[\"+d+\"]\"]));}else if(b)throw Error(f(h.INVALID_ARGUMENT,[a.hosts[d],\"connectOptions.hosts[\"+d+\"]\"]));}if(b)a.uris=a.hosts;else{if(!a.ports)throw Error(f(h.INVALID_ARGUMENT,[a.ports,\"connectOptions.ports\"]));if(!(a.ports instanceof Array))throw Error(f(h.INVALID_ARGUMENT,[a.ports,\"connectOptions.ports\"]));if(a.hosts.length!==a.ports.length)throw Error(f(h.INVALID_ARGUMENT,[a.ports,\"connectOptions.ports\"]));a.uris=[];for(d=0;d<a.hosts.length;d++){if(\"number\"!==typeof a.ports[d]||\n0>a.ports[d])throw Error(f(h.INVALID_TYPE,[typeof a.ports[d],\"connectOptions.ports[\"+d+\"]\"]));var b=a.hosts[d],g=a.ports[d];e=\"ws://\"+(-1!==b.indexOf(\":\")?\"[\"+b+\"]\":b)+\":\"+g+c;a.uris.push(e)}}}l.connect(a)};this.subscribe=function(a,b){if(\"string\"!==typeof a)throw Error(\"Invalid argument:\"+a);b=b||{};z(b,{qos:\"number\",invocationContext:\"object\",onSuccess:\"function\",onFailure:\"function\",timeout:\"number\"});if(b.timeout&&!b.onFailure)throw Error(\"subscribeOptions.timeout specified with no onFailure callback.\");\nif(\"undefined\"!==typeof b.qos&&0!==b.qos&&1!==b.qos&&2!==b.qos)throw Error(f(h.INVALID_ARGUMENT,[b.qos,\"subscribeOptions.qos\"]));l.subscribe(a,b)};this.unsubscribe=function(a,b){if(\"string\"!==typeof a)throw Error(\"Invalid argument:\"+a);b=b||{};z(b,{invocationContext:\"object\",onSuccess:\"function\",onFailure:\"function\",timeout:\"number\"});if(b.timeout&&!b.onFailure)throw Error(\"unsubscribeOptions.timeout specified with no onFailure callback.\");l.unsubscribe(a,b)};this.send=function(a,b,c,d){var e;if(0===\narguments.length)throw Error(\"Invalid argument.length\");if(1==arguments.length){if(!(a instanceof r)&&\"string\"!==typeof a)throw Error(\"Invalid argument:\"+typeof a);e=a;if(\"undefined\"===typeof e.destinationName)throw Error(f(h.INVALID_ARGUMENT,[e.destinationName,\"Message.destinationName\"]));}else e=new r(b),e.destinationName=a,3<=arguments.length&&(e.qos=c),4<=arguments.length&&(e.retained=d);l.send(e)};this.publish=function(a,b,c,d){console.log(\"Publising message to: \",a);var e;if(0===arguments.length)throw Error(\"Invalid argument.length\");\nif(1==arguments.length){if(!(a instanceof r)&&\"string\"!==typeof a)throw Error(\"Invalid argument:\"+typeof a);e=a;if(\"undefined\"===typeof e.destinationName)throw Error(f(h.INVALID_ARGUMENT,[e.destinationName,\"Message.destinationName\"]));}else e=new r(b),e.destinationName=a,3<=arguments.length&&(e.qos=c),4<=arguments.length&&(e.retained=d);l.send(e)};this.disconnect=function(){l.disconnect()};this.getTraceLog=function(){return l.getTraceLog()};this.startTrace=function(){l.startTrace()};this.stopTrace=\nfunction(){l.stopTrace()};this.isConnected=function(){return l.connected}};G.prototype={get host(){return this._getHost()},set host(a){this._setHost(a)},get port(){return this._getPort()},set port(a){this._setPort(a)},get path(){return this._getPath()},set path(a){this._setPath(a)},get clientId(){return this._getClientId()},set clientId(a){this._setClientId(a)},get onConnected(){return this._getOnConnected()},set onConnected(a){this._setOnConnected(a)},get disconnectedPublishing(){return this._getDisconnectedPublishing()},\nset disconnectedPublishing(a){this._setDisconnectedPublishing(a)},get disconnectedBufferSize(){return this._getDisconnectedBufferSize()},set disconnectedBufferSize(a){this._setDisconnectedBufferSize(a)},get onConnectionLost(){return this._getOnConnectionLost()},set onConnectionLost(a){this._setOnConnectionLost(a)},get onMessageDelivered(){return this._getOnMessageDelivered()},set onMessageDelivered(a){this._setOnMessageDelivered(a)},get onMessageArrived(){return this._getOnMessageArrived()},set onMessageArrived(a){this._setOnMessageArrived(a)},\nget trace(){return this._getTrace()},set trace(a){this._setTrace(a)}};var r=function(a){var b;if(\"string\"===typeof a||a instanceof ArrayBuffer||a instanceof Int8Array||a instanceof Uint8Array||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)b=a;else throw f(h.INVALID_ARGUMENT,[a,\"newPayload\"]);this._getPayloadString=function(){return\"string\"===typeof b?b:E(b,0,b.length)};this._getPayloadBytes=\nfunction(){if(\"string\"===typeof b){var a=new ArrayBuffer(n(b)),a=new Uint8Array(a);D(b,a,0);return a}return b};var c;this._getDestinationName=function(){return c};this._setDestinationName=function(a){if(\"string\"===typeof a)c=a;else throw Error(f(h.INVALID_ARGUMENT,[a,\"newDestinationName\"]));};var d=0;this._getQos=function(){return d};this._setQos=function(a){if(0===a||1===a||2===a)d=a;else throw Error(\"Invalid argument:\"+a);};var e=!1;this._getRetained=function(){return e};this._setRetained=function(a){if(\"boolean\"===\ntypeof a)e=a;else throw Error(f(h.INVALID_ARGUMENT,[a,\"newRetained\"]));};var g=!1;this._getDuplicate=function(){return g};this._setDuplicate=function(a){g=a}};r.prototype={get payloadString(){return this._getPayloadString()},get payloadBytes(){return this._getPayloadBytes()},get destinationName(){return this._getDestinationName()},set destinationName(a){this._setDestinationName(a)},get topic(){return this._getDestinationName()},set topic(a){this._setDestinationName(a)},get qos(){return this._getQos()},\nset qos(a){this._setQos(a)},get retained(){return this._getRetained()},set retained(a){this._setRetained(a)},get duplicate(){return this._getDuplicate()},set duplicate(a){this._setDuplicate(a)}};return{Client:G,Message:r}}(window)});\nfunction _clspRouter() {\n    function send(m){\n        // route message to parent which will in turn route to the correct\n        // player based on clientId.\n        m.clientId = MqttClientId;\n        window.parent.postMessage(m,\"*\");\n    }// end send\n\n\n    function routeInbound(message){\n        var pstring = \"\";\n\n        try {\n            pstring = message.payloadString;\n        } catch(e) {\n            //bogus excepton?\n        }\n\n        send({\n          event: \'data\',\n          destinationName: message.destinationName,\n          payloadString: pstring,\n          payloadBytes: message.payloadBytes || null\n        });\n    }// end route inbound\n\n    function disconnect () {\n        var ERROR_CODE_NOT_CONNECTED = \'AMQJS0011E\';\n\n        try {\n            MQTTClient.disconnect();\n        } catch (e) {\n            if (!e.message.startsWith(ERROR_CODE_NOT_CONNECTED)) {\n                console.error(e);\n            }\n        }\n    }\n\n    function eventHandler(evt){\n        var m = evt.data;\n\n        try {\n            if (m.method === \'subscribe\') {\n                MQTTClient.subscribe(m.topic);\n            } else if (m.method === \'unsubscribe\') {\n                MQTTClient.unsubscribe(m.topic);\n            } else if (m.method === \'publish\') {\n                var mqtt_payload = null;\n                try {\n                    mqtt_payload = JSON.stringify(m.data);\n                } catch( json_error ) {\n                    console.error(\"json stringify error: \" + m.data);\n                    return;\n                }\n\n                var mqtt_msg = new Paho.MQTT.Message(mqtt_payload);\n                mqtt_msg.destinationName = m.topic;\n                MQTTClient.send(mqtt_msg);\n            } else if (m.method === \'connect\') {\n                connect();\n            } else if (m.method === \'disconnect\') {\n                disconnect();\n            }\n        } catch(e) {\n            // we are dead!\n           send({\n               event: \'fail\',\n               reason: \"network failure\"\n            });\n\n            disconnect();\n        }\n\n    }\n\n    function AppReady() {\n        window.removeEventListener(\"message\", eventHandler);\n        window.addEventListener(\"message\", eventHandler, false);\n\n        send({\n          event: \'ready\'\n        });\n\n        if (Reconnect !== -1)\n        {\n            clearInterval(Reconnect);\n            Reconnect = -1;\n        }\n\n    }// application ready\n\n\n    function AppFail(message) {\n      var e = \"Error code \" +\n          parseInt(message.errorCode) + \": \" + message.errorMessage;\n      send({\n        event: \'fail\',\n        reason: e\n      });\n    }\n\n    MQTTClient = new Paho.MQTT.Client(\n        MqttIp,\n        MqttPort,\n        MqttClientId\n    );\n\n    /*\n     * Hold the id of the reconnect interval task\n     */\n    var Reconnect = -1;\n\n    /*\n     * Callback which gets called when the connection is lost\n     */\n    function onConnectionLost(message){\n        if (message.errorCode === 0) {\n            return;\n        }\n\n        send({\n            event: \'fail\',\n            reason: \"connection lost error code \" + parseInt(message.errorCode)\n        });\n        if (Reconnect === -1) {\n            Reconnect = setInterval(function () {\n                connect();\n            }, 2000);\n        }\n    }\n\n    MQTTClient.onConnectionLost = onConnectionLost;\n\n    // perhaps the busiest function in this module ;)\n    MQTTClient.onMessageArrived = function(message) {\n        try {\n             routeInbound(message);\n        }catch(e) {\n            if (e) {\n                console.error(e);\n            }\n        }\n    };\n\n    /**\n     * Connect to MQTT...\n     */\n    function connect()\n    {\n        // setup connection options\n        var options = {\n            timeout: 120,\n            onSuccess:  AppReady,\n            onFailure: AppFail\n        };\n        // last will message sent on disconnect\n        var willmsg = new Paho.MQTT.Message(JSON.stringify({\n            clientId: MqttClientId\n        }));\n        willmsg.destinationName = \"iov/clientDisconnect\";\n        options.willMessage = willmsg;\n\n        if (MqttUseSSL === true) {\n            options.useSSL = true;\n        }\n\n        try {\n            MQTTClient.connect(options);\n        } catch(e) {\n            var ERROR_CODE_ALREADY_CONNECTED = \'AMQJS0011E\';\n\n            if (!e.message.startsWith(ERROR_CODE_ALREADY_CONNECTED)) {\n                console.error(\"connect failed\", e);\n                send({\n                    event: \'fail\',\n                    reason: \"connect failed\"\n                });\n            }\n        }\n    }\n\n    connect();\n}\n\nfunction clspRouter() {\n    try {\n        _clspRouter();\n    } catch(e) {\n        console.error(\"IFRAME error\");\n        console.error(e);\n    }\n}\n\nfunction onunload()\n{\n    if (typeof MQTTClient !== \'undefined\') {\n        try {\n            MQTTClient.disconnect();\n        } catch (e) {\n            if (!e.message.startsWith(\'AMQJS0011E\')) {\n                console.error(e);\n            }\n        }\n    }\n}\n";

function pframe_client(iframe, iov) {
    var self = {
        dispatch: {},
        iov: iov
    };

    // primitive function that routes message to iframe
    function command(m) {

        if (iframe.contentWindow !== null) {
            iframe.contentWindow.postMessage(m, "*");
            return;
        }

        var t = setInterval(function () {
            if (iframe.contentWindow !== null) {
                iframe.contentWindow.postMessage(m, "*");
                clearInterval(t);
            }
        }, 1000);
    }

    /* message from mqttRouter routeInbound go handler which associates this
       client with the clientId. It then calls self.inboundHandler handler to
       process the message from the iframe.
    */
    self.inboundHandler = function (message) {
        var handler = self.dispatch[message.destinationName];
        if (typeof handler !== 'undefined') {
            try {
                handler(message);
            } catch (e) {
                console.error(e);
            }
        } else {
            console.error("No handler for " + message.destinationName);
        }
    };

    self.subscribe = function (topic, callback) {
        self.dispatch[topic] = callback;
        command({
            method: "subscribe",
            topic: topic
        });
    };

    self.unsubscribe = function (topic) {
        if (topic in self.dispatch) {
            delete self.dispatch[topic];
        }
        command({
            method: "unsubscribe",
            topic: topic
        });
    };

    self.publish = function (topic, data) {
        command({
            method: "publish",
            topic: topic,
            data: data
        });
    };

    self.connect = function () {
        command({
            method: "connect"
        });
    };

    self.disconnect = function () {
        command({
            method: "disconnect"
        });
    };

    self.transaction = function (topic, callback, obj) {
        obj.resp_topic = iov.config.clientId + "/response/" + parseInt(Math.random() * 1000000);
        self.subscribe(obj.resp_topic, function (mqtt_resp) {
            //call user specified callback to handle response from remote process
            var resp = JSON.parse(mqtt_resp.payloadString);
            // call user specified callback to handle response
            callback(resp);
            // cleanup.
            self.unsubscribe(obj.resp_topic);
        });

        // start transaction
        //MQTTClient.send(mqtt_msg);
        self.publish(topic, obj);
    };

    // return client for video player.
    return self;
}

window.mqttConduit = function (iov) {
    var iframe = document.createElement('iframe');
    var MqttUseSSL = iov.config.useSSL || false ? "true" : "false";

    var markup = '<html><head>' + '<script>\n' + "var MqttIp = '" + iov.config.wsbroker + "' ; \n" + "var MqttPort = " + iov.config.wsport + "; \n" + "var MqttUseSSL = " + MqttUseSSL + "; \n" + "var MqttClientId = '" + iov.config.clientId + "' ; \n" + "var Origin = '" + window.location.origin + "' ; \n" + iframe_code + '\n' + '</script>\n' + '</head><body onload="clspRouter();" onunload="onunload();"><body>' + '<div id="message"></div>' + '</body></html>';

    // inject code into iframe
    iframe.srcdoc = markup;

    iframe.width = 0;
    iframe.height = 0;
    iframe.setAttribute('style', 'display:none;');
    iframe.setAttribute('id', iov.config.clientId);

    // attach hidden iframe to player
    //document.body.appendChild(iframe);
    if (iov.config.videoElementParent !== null) {
        iov.config.videoElementParent.appendChild(iframe);
    } else if (iov.videoElement.parentNode !== null) {
        iov.videoElement.parentNode.appendChild(iframe);
        iov.config.videoElementParent = iov.videoElement.parentNode;
    } else {
        var t = setInterval(function () {
            if (iov.videoElement.parentNode !== null) {
                iov.videoElement.parentNode.appendChild(iframe);
                iov.config.videoElementParent = iov.videoElement.parentNode;
                clearInterval(t);
            }
        }, 1000);
    }

    return pframe_client(iframe, iov);
};

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
/* harmony import */ var _MqttTopicHandlers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MqttTopicHandlers */ "./src/js/iov/MqttTopicHandlers.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./player */ "./src/js/iov/player.js");
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }







var DEBUG_PREFIX = 'skyline:clsp:iov';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

//  @todo - should this be the videojs component?  it seems like the
// mqttHandler does nothing, and that this could replace it

var IOV = function () {
  _createClass(IOV, null, [{
    key: 'compatibilityCheck',
    value: function compatibilityCheck() {
      // @todo - shouldn't this be done in the utils function?
      // @todo - does this need to throw an error?
      // For the MAC
      var NoMediaSourceAlert = false;

      window.MediaSource = window.MediaSource || window.WebKitMediaSource;

      if (!window.MediaSource) {
        if (NoMediaSourceAlert === false) {
          window.alert('Media Source Extensions not supported in your browser: Claris Live Streaming will not work!');
        }

        NoMediaSourceAlert = true;
      }
    }
  }, {
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

      return new IOV(mqttConduitCollection, player, config);
    }
  }, {
    key: 'fromUrl',
    value: function fromUrl(url, mqttConduitCollection, player) {
      var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      return IOV.factory(mqttConduitCollection, player, _extends({}, config, IOV.generateConfigFromUrl(url)));
    }
  }]);

  function IOV(mqttConduitCollection, player, config) {
    _classCallCheck(this, IOV);

    IOV.compatibilityCheck();

    this.id = uuid_v4__WEBPACK_IMPORTED_MODULE_1___default()();

    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':' + this.id + ':main');
    this.debug('constructor');

    this.destroyed = false;
    this.onReadyAlreadyCalled = false;
    this.playerInstance = player;
    this.videoElement = this.playerInstance.el();

    this.config = {
      clientId: this.id,
      wsbroker: config.wsbroker,
      wsport: config.wsport,
      useSSL: config.useSSL,
      streamName: config.streamName,
      appStart: config.appStart,
      videoElementParent: config.videoElementParent || null,
      changeSourceMaxWait: config.changeSourceMaxWait || IOV.CHANGE_SOURCE_MAX_WAIT
    };

    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.config.clientId
    };

    // @todo - this needs to be a global service or something
    this.mqttConduitCollection = mqttConduitCollection;

    // handle inbound messages from MQTT, including video
    // and distributes them to players.
    this.mqttTopicHandlers = new _MqttTopicHandlers__WEBPACK_IMPORTED_MODULE_2__["default"](this.id, this);

    this.events = {
      connection_lost: function connection_lost(responseObject) {
        // @todo - close all players and display an error message
        console.error('MQTT connection lost');
        console.error(responseObject);
      },

      // @todo - does this ever get fired?
      on_message: this.mqttTopicHandlers.msghandler,

      // generic exception handler
      exception: function exception(text, e) {
        console.error(text);
        if (typeof e !== 'undefined') {
          console.error(e.stack);
        }
      }
    };
  }

  _createClass(IOV, [{
    key: 'initialize',
    value: function initialize() {
      this.conduit = this.mqttConduitCollection.addFromIov(this);
      this.player = _player__WEBPACK_IMPORTED_MODULE_3__["default"].factory(this, this.playerInstance);
    }
  }, {
    key: 'clone',
    value: function clone(config) {
      this.debug('clone');

      var cloneConfig = _extends({}, config, {
        videoElementParent: this.config.videoElementParent
      });

      // @todo - is it possible to reuse the iov player?
      return IOV.factory(this.mqttConduitCollection, this.playerInstance, cloneConfig);
    }
  }, {
    key: 'cloneFromUrl',
    value: function cloneFromUrl(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.debug('cloneFromUrl');

      return this.clone(_extends({}, IOV.generateConfigFromUrl(url), config));
    }

    // query remote server and get a list of all stream names

  }, {
    key: 'getAvailableStreams',
    value: function getAvailableStreams(callback) {
      this.debug('getAvailableStreams');

      this.conduit.transaction('iov/video/list', callback, {});
    }
  }, {
    key: 'onChangeSource',
    value: function onChangeSource(url) {
      var _this = this;

      this.debug('changeSource on player "' + this.id + '""');

      if (!url) {
        throw new Error('Unable to change source because there is no url!');
      }

      var clone = this.cloneFromUrl(url);

      clone.initialize();

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
      setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return clone.playerInstance.tech(true).mqtt.updateIOV(clone);

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      })), clone.config.changeSourceMaxWait);

      // Under normal circumstances, meaning when the tab is in focus, we want
      // to respond by switching the IOV when the new IOV Player has something
      // to display
      clone.player.on('firstFrameShown', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return clone.playerInstance.tech(true).mqtt.updateIOV(clone);

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      })));
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

      // @todo - there must be a better way to determine autoplay...
      if (videoTag.getAttribute('autoplay') !== null) {
        // playButton.trigger('click');
        this.playerInstance.trigger('play', videoTag);
      }

      if (this.onReadyAlreadyCalled) {
        console.warn('tried to use this player more than once...');
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

      this.playerInstanceEventListeners = {
        changesrc: function changesrc(event, _ref3) {
          var url = _ref3.url;
          return _this2.onChangeSource(url);
        }
      };

      this.playerInstance.on('changesrc', this.playerInstanceEventListeners.changesrc);

      if (!document.hidden) {
        this.player.play();
      }

      this.videoElement.addEventListener('mse-error-event', function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(e) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return _this2.player.restart();

                case 2:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this2);
        }));

        return function (_x4) {
          return _ref4.apply(this, arguments);
        };
      }(), false);

      // the mse service will stop streaming to us if we don't send
      // a message to iov/stats within 1 minute.
      this._statsTimer = setInterval(function () {
        _this2.statsMsg.inkbps = _this2.statsMsg.byteCount * 8 / 30000.0;
        _this2.statsMsg.byteCount = 0;

        _this2.conduit.publish('iov/stats', _this2.statsMsg);

        _this2.debug('iov status', _this2.statsMsg);
      }, 5000);
    }
  }, {
    key: 'onFail',
    value: function onFail(event) {
      this.debug('onFail');

      // when a stream fails, it no longer needs to send stats to the
      // server, and it may not even be connected to the server
      clearInterval(this._statsTimer);

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
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var iframe;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.debug('destroy');

                if (!this.destroyed) {
                  _context4.next = 3;
                  break;
                }

                return _context4.abrupt('return');

              case 3:

                this.destroyed = true;

                clearInterval(this._statsTimer);

                // this.playerInstanceEventListeners will not be defined if the iov is
                // destroyed too early
                if (this.playerInstanceEventListeners) {
                  this.playerInstance.off('changesrc', this.playerInstanceEventListeners.changesrc);
                }

                _context4.next = 8;
                return this.player.destroy();

              case 8:

                this.playerInstance = null;
                this.player = null;

                this.mqttConduitCollection.remove(this.id);

                iframe = document.getElementById(this.config.clientId);

                iframe.parentNode.removeChild(iframe);
                iframe.srcdoc = '';

              case 14:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function destroy() {
        return _ref5.apply(this, arguments);
      }

      return destroy;
    }()
  }]);

  return IOV;
}();

IOV.CHANGE_SOURCE_MAX_WAIT = 5000;
/* harmony default export */ __webpack_exports__["default"] = (IOV);
;

/***/ }),

/***/ "./src/js/iov/MSEWrapper.js":
/*!**********************************!*\
  !*** ./src/js/iov/MSEWrapper.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/defaults */ "./node_modules/lodash/defaults.js");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/noop */ "./node_modules/lodash/noop.js");
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_noop__WEBPACK_IMPORTED_MODULE_2__);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




// import { mp4toJSON } from './mp4-inspect';

var DEBUG_PREFIX = 'skyline:clsp:iov';

var debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':MSEWrapper');
var silly = debug__WEBPACK_IMPORTED_MODULE_0___default()('silly:' + DEBUG_PREFIX + ':MSEWrapper');

var MSEWrapper = function () {
  _createClass(MSEWrapper, null, [{
    key: 'isMimeCodecSupported',
    value: function isMimeCodecSupported(mimeCodec) {
      return window.MediaSource && window.MediaSource.isTypeSupported(mimeCodec);
    }
  }, {
    key: 'factory',
    value: function factory(videoElement) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return new MSEWrapper(videoElement, options);
    }
  }]);

  function MSEWrapper(videoElement) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MSEWrapper);

    debug('Constructing...');

    if (!videoElement) {
      throw new Error('videoElement is required to construct an MSEWrapper.');
    }

    this.destroyed = false;

    this.videoElement = videoElement;

    this.options = lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default()({}, options, {
      // These default buffer value provide the best results in my testing.
      // It keeps the memory usage as low as is practical, and rarely causes
      // the video to stutter
      bufferSizeLimit: 90 + Math.floor(Math.random() * 200),
      bufferTruncateFactor: 2,
      bufferTruncateValue: null,
      driftThreshold: 2000,
      duration: 10,
      enableMetrics: false
    });

    this.segmentQueue = [];
    this.sequenceNumber = 0;

    this.mediaSource = null;
    this.sourceBuffer = null;
    this.objectURL = null;
    this.timeBuffered = null;

    if (!this.options.bufferTruncateValue) {
      this.options.bufferTruncateValue = parseInt(this.options.bufferSizeLimit / this.options.bufferTruncateFactor);
    }

    this.metrics = {};

    // @todo - there must be a more proper way to do events than this...
    this.events = {};

    for (var i = 0; i < MSEWrapper.EVENT_NAMES.length; i++) {
      this.events[MSEWrapper.EVENT_NAMES[i]] = [];
    }

    this.eventListeners = {
      mediaSource: {},
      sourceBuffer: {}
    };

    this.onSourceBufferUpdateEnd = this.onSourceBufferUpdateEnd.bind(this);
  }

  _createClass(MSEWrapper, [{
    key: 'on',
    value: function on(name, action) {
      debug('Registering Listener for ' + name + ' event...');

      if (!MSEWrapper.EVENT_NAMES.includes(name)) {
        throw new Error('"' + name + '" is not a valid event."');
      }

      this.events[name].push(action);
    }
  }, {
    key: 'trigger',
    value: function trigger(name, value) {
      if (name === 'metric') {
        silly('Triggering ' + name + ' event...');
      } else {
        debug('Triggering ' + name + ' event...');
      }

      if (!MSEWrapper.EVENT_NAMES.includes(name)) {
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

      if (!MSEWrapper.METRIC_TYPES.includes(type)) {
        // @todo - should this throw?
        return;
      }

      switch (type) {
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
    key: 'initializeMediaSource',
    value: function initializeMediaSource() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      debug('Initializing mediaSource...');

      options = lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default()({}, options, {
        onSourceOpen: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
        onSourceEnded: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
        onError: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a
      });

      this.metric('mediaSource.created', 1);

      // Kill the existing media source
      this.destroyMediaSource();

      this.mediaSource = new window.MediaSource();

      this.eventListeners.mediaSource.sourceopen = function () {
        // This can only be set when the media source is open.
        // @todo - does this do memory management for us so we don't have
        // to call remove on the buffer, which is expensive?  It seems
        // like it...
        _this.mediaSource.duration = _this.options.duration;

        options.onSourceOpen();
      };
      this.eventListeners.mediaSource.sourceended = options.onSourceEnded;
      this.eventListeners.mediaSource.error = options.onError;

      this.mediaSource.addEventListener('sourceopen', this.eventListeners.mediaSource.sourceopen);
      this.mediaSource.addEventListener('sourceended', this.eventListeners.mediaSource.sourceended);
      this.mediaSource.addEventListener('error', this.eventListeners.mediaSource.error);
    }
  }, {
    key: 'getVideoElementSrc',
    value: function getVideoElementSrc() {
      debug('getVideoElementSrc...');

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
        this.metric('objectURL.created', 1);

        this.objectURL = window.URL.createObjectURL(this.mediaSource);
      }

      this.videoElement.src = this.objectURL;
    }
  }, {
    key: 'destroyVideoElementSrc',
    value: function destroyVideoElementSrc() {
      debug('destroyVideoElementSrc...');

      if (!this.mediaSource) {
        // @todo - should this throw?
        return;
      }

      if (!this.objectURL) {
        // @todo - should this throw?
        return;
      }

      // this.metric('objectURL.revoked', 1);

      this.objectURL = null;

      if (this.sourceBuffer) {
        this.sourceBufferAbort();
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
    key: 'isMediaSourceReady',
    value: function isMediaSourceReady() {
      // found when stress testing many videos, it is possible for the
      // media source ready state not to be open even though
      // source open callback is being called.
      return this.mediaSource && this.mediaSource.readyState === 'open';
    }
  }, {
    key: 'isSourceBufferReady',
    value: function isSourceBufferReady() {
      return this.sourceBuffer && this.sourceBuffer.updating === false;
    }
  }, {
    key: 'initializeSourceBuffer',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(mimeCodec) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                debug('initializeSourceBuffer...');

                options = lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default()({}, options, {
                  onAppendStart: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
                  onAppendFinish: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
                  onRemoveFinish: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
                  onAppendError: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
                  onRemoveError: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
                  onStreamFrozen: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
                  onError: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
                  retry: true
                });

                if (this.isMediaSourceReady()) {
                  _context.next = 4;
                  break;
                }

                throw new Error('Cannot create the sourceBuffer if the mediaSource is not ready.');

              case 4:
                _context.next = 6;
                return this.destroySourceBuffer();

              case 6:

                this.metric('sourceBuffer.created', 1);

                this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeCodec);
                this.sourceBuffer.mode = 'sequence';

                // Custom Events
                this.eventListeners.sourceBuffer.onAppendStart = options.onAppendStart;
                this.eventListeners.sourceBuffer.onAppendError = options.onAppendError;
                this.eventListeners.sourceBuffer.onRemoveFinish = options.onRemoveFinish;
                this.eventListeners.sourceBuffer.onAppendFinish = options.onAppendFinish;
                this.eventListeners.sourceBuffer.onRemoveError = options.onRemoveError;
                this.eventListeners.sourceBuffer.onStreamFrozen = options.onStreamFrozen;
                this.eventListeners.sourceBuffer.onError = options.onError;

                // Supported Events
                this.sourceBuffer.addEventListener('updateend', this.onSourceBufferUpdateEnd);
                this.sourceBuffer.addEventListener('error', this.eventListeners.sourceBuffer.onError);

              case 18:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initializeSourceBuffer(_x5) {
        return _ref.apply(this, arguments);
      }

      return initializeSourceBuffer;
    }()
  }, {
    key: 'queueSegment',
    value: function queueSegment(segment) {
      debug('Queueing segment.  The queue now has ' + this.segmentQueue.length + ' segments.');

      this.metric('queue.added', 1);

      this.segmentQueue.push({
        timestamp: Date.now(),
        byteArray: segment
      });
    }
  }, {
    key: 'sourceBufferAbort',
    value: function sourceBufferAbort() {
      debug('Aborting current sourceBuffer operation');

      try {
        this.metric('sourceBuffer.abort', 1);

        this.sourceBuffer.abort();
      } catch (error) {
        this.metric('error.sourceBuffer.abort', 1);

        // Somehow, this can be become undefined...
        if (this.eventListeners.sourceBuffer.onAbortError) {
          this.eventListeners.sourceBuffer.onAbortError(error);
        }
      }
    }
  }, {
    key: '_append',
    value: function _append(_ref2) {
      var timestamp = _ref2.timestamp,
          byteArray = _ref2.byteArray;

      silly('Appending to the sourceBuffer...');

      try {
        var estimatedDrift = Date.now() - timestamp;

        if (estimatedDrift > this.options.driftThreshold) {
          debug('Estimated drift of ' + estimatedDrift + ' is above the ' + this.options.driftThreshold + ' threshold.  Flushing queue...');
          // @todo - perhaps we should re-add the last segment to the queue with a fresh
          // timestamp?  I think one cause of stream freezing is the sourceBuffer getting
          // starved, but I don't know if that's correct
          this.metric('queue.removed', this.segmentQueue.length + 1);
          this.segmentQueue = [];
          return;
        }

        debug('Appending to the buffer with an estimated drift of ' + estimatedDrift);

        this.metric('sourceBuffer.append', 1);

        this.sourceBuffer.appendBuffer(byteArray);
      } catch (error) {
        this.metric('error.sourceBuffer.append', 1);

        this.eventListeners.sourceBuffer.onAppendError(error, byteArray);
      }
    }
  }, {
    key: 'processNextInQueue',
    value: function processNextInQueue() {
      silly('processNextInQueue');

      if (document.hidden) {
        debug('Tab not in focus - dropping frame...');
        this.metric('frameDrop.hiddenTab', 1);
        this.metric('queue.cannotProcessNext', 1);
        return;
      }

      if (!this.isMediaSourceReady()) {
        debug('The mediaSource is not ready');
        this.metric('queue.mediaSourceNotReady', 1);
        this.metric('queue.cannotProcessNext', 1);
        return;
      }

      if (!this.isSourceBufferReady()) {
        debug('The sourceBuffer is busy');
        this.metric('queue.sourceBufferNotReady', 1);
        this.metric('queue.cannotProcessNext', 1);
        return;
      }

      if (this.segmentQueue.length > 0) {
        this.metric('queue.shift', 1);
        this.metric('queue.canProcessNext', 1);
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
      debug('appendMoov');

      this.metric('sourceBuffer.lastMoovSize', moov.length);

      // Sometimes this can get hit after destroy is called
      if (!this.eventListeners.sourceBuffer.onAppendStart) {
        return;
      }

      debug('appending moov...');
      this.queueSegment(moov);

      this.processNextInQueue();
    }
  }, {
    key: 'append',
    value: function append(byteArray) {
      silly('Append');

      this.metric('sourceBuffer.lastMoofSize', byteArray.length);

      // console.log(mp4toJSON(byteArray));

      // Sometimes this can get hit after destroy is called
      if (!this.eventListeners.sourceBuffer.onAppendStart) {
        return;
      }

      this.eventListeners.sourceBuffer.onAppendStart(byteArray);

      this.metric('queue.append', 1);

      this.queueSegment(this.formatMoof(byteArray));
      this.sequenceNumber++;

      this.processNextInQueue();
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

        if (force || this.timeBuffered > this.options.bufferSizeLimit && this.isSourceBufferReady()) {
          debug('Removing old stuff from sourceBuffer...');

          // @todo - this is the biggest performance problem we have with this player.
          // Can you figure out how to manage the memory usage without causing the streams
          // to stutter?
          this.metric('sourceBuffer.trim', this.options.bufferTruncateValue);
          this.sourceBuffer.remove(info.bufferTimeStart, info.bufferTimeStart + this.options.bufferTruncateValue);
        }
      } catch (error) {
        this.metric('sourceBuffer.trim.error', 1);
        this.eventListeners.sourceBuffer.onRemoveError(error);
      }
    }
  }, {
    key: 'onRemoveFinish',
    value: function onRemoveFinish() {
      var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getBufferTimes();

      debug('On remove finish...');

      this.metric('sourceBuffer.updateEnd.removeEvent', 1);
      this.eventListeners.sourceBuffer.onRemoveFinish(info);
    }
  }, {
    key: 'onAppendFinish',
    value: function onAppendFinish() {
      var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getBufferTimes();

      silly('On append finish...');

      this.metric('sourceBuffer.updateEnd.appendEvent', 1);

      // The current buffer size should always be bigger.If it isn't, there is a problem,
      // and we need to reinitialize or something.
      if (this.previousTimeEnd && info.bufferTimeEnd <= this.previousTimeEnd) {
        this.metric('sourceBuffer.updateEnd.bufferFrozen', 1);
        this.eventListeners.sourceBuffer.onStreamFrozen();
        return;
      }

      this.previousTimeEnd = info.bufferTimeEnd;

      this.eventListeners.sourceBuffer.onAppendFinish(info);
      this.trimBuffer(info);
    }
  }, {
    key: 'onSourceBufferUpdateEnd',
    value: function onSourceBufferUpdateEnd() {
      silly('onUpdateEnd');

      this.metric('sourceBuffer.updateEnd', 1);

      try {
        // Sometimes the mediaSource is removed while an update is being
        // processed, resulting in an error when trying to read the
        // "buffered" property.
        if (this.sourceBuffer.buffered.length <= 0) {
          this.metric('sourceBuffer.updateEnd.bufferLength.empty', 1);
          debug('After updating, the sourceBuffer has no length!');
          return;
        }
      } catch (error) {
        // @todo - do we need to handle this?
        this.metric('sourceBuffer.updateEnd.bufferLength.error', 1);
        debug('The mediaSource was removed while an update operation was occurring.');
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
    key: 'destroySourceBuffer',
    value: function destroySourceBuffer() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (!_this2.sourceBuffer) {
          return resolve();
        }

        _this2.sourceBufferAbort();

        _this2.sourceBuffer.removeEventListener('updateend', _this2.onSourceBufferUpdateEnd);
        _this2.sourceBuffer.removeEventListener('error', _this2.eventListeners.sourceBuffer.onError);

        _this2.sourceBuffer.addEventListener('updateend', function () {
          resolve();
        });

        _this2.trimBuffer(undefined, true);
      });
    }
  }, {
    key: 'destroyMediaSource',
    value: function destroyMediaSource() {
      this.metric('sourceBuffer.destroyed', 1);

      debug('Destroying mediaSource...');

      if (!this.mediaSource) {
        return;
      }

      this.mediaSource.removeEventListener('sourceopen', this.eventListeners.mediaSource.sourceopen);
      this.mediaSource.removeEventListener('sourceended', this.eventListeners.mediaSource.sourceended);
      this.mediaSource.removeEventListener('error', this.eventListeners.mediaSource.error);

      // let sourceBuffers = this.mediaSource.sourceBuffers;

      // if (sourceBuffers.SourceBuffers) {
      //   // @see - https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/sourceBuffers
      //   sourceBuffers = sourceBuffers.SourceBuffers();
      // }

      // for (let i = 0; i < sourceBuffers.length; i++) {
      // this.mediaSource.removeSourceBuffer(sourceBuffers[i]);
      // }

      if (this.isMediaSourceReady() && this.isSourceBufferReady()) {
        this.mediaSource.endOfStream();
        this.mediaSource.removeSourceBuffer(this.sourceBuffer);
      }

      // @todo - is this happening at the right time, or should it happen
      // prior to removing the source buffers?
      this.destroyVideoElementSrc();

      this.metric('mediaSource.destroyed', 1);
    }
  }, {
    key: 'destroy',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                debug('destroySourceBuffer...');

                if (!this.destroyed) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return');

              case 3:

                this.destroyed = true;

                this.destroyMediaSource();
                _context2.next = 7;
                return this.destroySourceBuffer();

              case 7:

                this.mediaSource = null;
                this.sourceBuffer = null;
                this.videoElement = null;

                this.timeBuffered = null;
                this.previousTimeEnd = null;
                this.segmentQueue = null;

                this.options = null;
                this.metrics = null;
                this.events = null;
                this.eventListeners = null;
                this.onSourceBufferUpdateEnd = null;

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function destroy() {
        return _ref3.apply(this, arguments);
      }

      return destroy;
    }()
  }]);

  return MSEWrapper;
}();

MSEWrapper.EVENT_NAMES = ['metric'];
MSEWrapper.METRIC_TYPES = ['mediaSource.created', 'mediaSource.destroyed', 'objectURL.created', 'objectURL.revoked', 'mediaSource.reinitialized', 'sourceBuffer.created', 'sourceBuffer.destroyed', 'queue.added', 'queue.removed', 'sourceBuffer.append', 'error.sourceBuffer.append', 'frameDrop.hiddenTab', 'queue.mediaSourceNotReady', 'queue.sourceBufferNotReady', 'queue.shift', 'queue.append', 'sourceBuffer.lastKnownBufferSize', 'sourceBuffer.trim', 'sourceBuffer.trim.error', 'sourceBuffer.updateEnd', 'sourceBuffer.updateEnd.bufferLength.empty', 'sourceBuffer.updateEnd.bufferLength.error', 'sourceBuffer.updateEnd.removeEvent', 'sourceBuffer.updateEnd.appendEvent', 'sourceBuffer.updateEnd.bufferFrozen', 'sourceBuffer.abort', 'error.sourceBuffer.abort', 'sourceBuffer.lastMoofSize'];
/* harmony default export */ __webpack_exports__["default"] = (MSEWrapper);

/***/ }),

/***/ "./src/js/iov/MqttTopicHandlers.js":
/*!*****************************************!*\
  !*** ./src/js/iov/MqttTopicHandlers.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var DEBUG_PREFIX = 'skyline:clsp:iov';

/**
 * route inbound messages/data to player's event handlers.
 */

var MqttTopicHandlers = function () {
  function MqttTopicHandlers(id, iov) {
    _classCallCheck(this, MqttTopicHandlers);

    this.id = id;
    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':' + this.id + ':MqttTopicHandlers');

    this.debug('constructing...');

    this.iov = iov;
    this._handlers = {};
  }

  _createClass(MqttTopicHandlers, [{
    key: 'get',
    value: function get(topic) {
      this.debug('getting...', topic);

      return this._handlers[topic];
    }
  }, {
    key: 'register',
    value: function register(topic, callback) {
      var _this = this;

      this.debug('register...', topic);

      this._handlers[topic] = function () {
        _this.debug('executing handler...', topic);

        callback.apply(undefined, arguments);
      };
    }
  }, {
    key: 'unregister',
    value: function unregister(topic) {
      this.debug('unregistering...', topic);

      if (this.exists(topic)) {
        delete this._handlers[topic];
      }
    }
  }, {
    key: 'exists',
    value: function exists(topic) {
      this.debug('exists?', topic);

      return this._handlers.hasOwnProperty(topic);
    }

    // central entry point for all MQTT inbound traffic.

  }, {
    key: 'msghandler',
    value: function msghandler(message) {
      this.debug('msghandler...', message);

      var topic = message.destinationName;

      if (!this.exists(topic)) {
        this.debug('No handler for ' + topic + ' - message dropped', message);

        return;
      }

      try {
        this.get(topic)(message);
      } catch (e) {
        this.iov.events.exception(topic + ' handler exception', e);
      }
    }
  }]);

  return MqttTopicHandlers;
}();

/* harmony default export */ __webpack_exports__["default"] = (MqttTopicHandlers);

/***/ }),

/***/ "./src/js/iov/player.js":
/*!******************************!*\
  !*** ./src/js/iov/player.js ***!
  \******************************/
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
/* harmony import */ var _MSEWrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MSEWrapper */ "./src/js/iov/MSEWrapper.js");
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }







var DEBUG_PREFIX = 'skyline:clsp:iov';
var debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':IOVPlayer');
var silly = debug__WEBPACK_IMPORTED_MODULE_0___default()('silly:' + DEBUG_PREFIX + ':IOVPlayer');

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

var IOVPlayer = function () {
  _createClass(IOVPlayer, null, [{
    key: 'factory',
    value: function factory(iov, playerInstance) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return new IOVPlayer(iov, playerInstance, options);
    }
  }]);

  function IOVPlayer(iov, playerInstance, options) {
    var _this = this;

    _classCallCheck(this, IOVPlayer);

    this.onVisibilityChange = function () {
      // @todo - the timeout value will be created every time this function is
      // executed, which means that if you switch tabs and come back faster than
      // one second, the timeout from the tab switch will never be cleared (because
      // it is no longer in scope), and the video will be stopped and never re-played
      var timeout = void 0;

      if (document.hidden) {
        timeout = setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _this.stop();

                case 2:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        })), 1000);
      } else {
        clearTimeout(timeout);
        _this.play();
      }
    };

    debug('constructor');

    this.metrics = {};

    // @todo - there must be a more proper way to do events than this...
    this.events = {};

    for (var i = 0; i < IOVPlayer.EVENT_NAMES.length; i++) {
      this.events[IOVPlayer.EVENT_NAMES[i]] = [];
    }

    this._id = uuid_v4__WEBPACK_IMPORTED_MODULE_1___default()();
    this.iov = iov;
    this.playerInstance = playerInstance;
    this.eid = this.playerInstance.el().firstChild.id;
    this.id = this.eid.replace('_html5_api', '');

    this.initializeVideoElement();

    this.options = lodash_defaults__WEBPACK_IMPORTED_MODULE_2___default()({}, options, {
      segmentIntervalSampleSize: IOVPlayer.SEGMENT_INTERVAL_SAMPLE_SIZE,
      driftCorrectionConstant: IOVPlayer.DRIFT_CORRECTION_CONSTANT,
      enableMetrics: false
    });

    this.state = 'initializing';
    this.firstFrameShown = false;
    this.stopped = false;

    // Used for determining the size of the internal buffer hidden from the MSE
    // api by recording the size and time of each chunk of video upon buffer append
    // and recording the time when the updateend event is called.
    this.LogSourceBuffer = false;
    this.LogSourceBufferTopic = null;

    this.latestSegmentReceived = null;
    this.segmentIntervalAverage = null;
    this.segmentInterval = null;
    this.segmentIntervals = [];

    this.mseWrapper = null;
    this.moovBox = null;
    this.guid = null;
    this.mimeCodec = null;

    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  _createClass(IOVPlayer, [{
    key: 'on',
    value: function on(name, action) {
      debug('Registering Listener for ' + name + ' event...');

      if (!IOVPlayer.EVENT_NAMES.includes(name)) {
        throw new Error('"' + name + '" is not a valid event."');
      }

      if (this.destroyed) {
        return;
      }

      this.events[name].push(action);
    }
  }, {
    key: 'trigger',
    value: function trigger(name, value) {
      if (name === 'metric') {
        silly('Triggering ' + name + ' event...');
      } else {
        debug('Triggering ' + name + ' event...');
      }

      if (this.destroyed) {
        return;
      }

      if (!IOVPlayer.EVENT_NAMES.includes(name)) {
        throw new Error('"' + name + '" is not a valid event."');
      }

      for (var i = 0; i < this.events[name].length; i++) {
        this.events[name][i](value, this);
      }
    }
  }, {
    key: 'metric',
    value: function metric(type, value) {
      if (!this.options.enableMetrics) {
        return;
      }

      if (!IOVPlayer.METRIC_TYPES.includes(type)) {
        // @todo - should this throw?
        return;
      }

      switch (type) {
        case 'video.driftCorrection':
          {
            if (!this.metrics[type]) {
              this.metrics[type] = 0;
            }

            this.metrics[type] += value;

            break;
          }
        default:
          {
            this.metrics[type] = value;
          }
      }

      this.trigger('metric', {
        type: type,
        value: this.metrics[type]
      });
    }
  }, {
    key: '_onError',
    value: function _onError(type, message, error) {
      console.warn(type, ':', message);
      console.error(error);
    }
  }, {
    key: 'assertMimeCodecSupported',
    value: function assertMimeCodecSupported(mimeCodec) {
      if (!_MSEWrapper__WEBPACK_IMPORTED_MODULE_3__["default"].isMimeCodecSupported(mimeCodec)) {
        this.state = 'unsupported-mime-codec';

        var message = 'Unsupported mime codec: ' + mimeCodec;

        this.videoPlayer.errors.extend({
          PLAYER_ERR_IOV: {
            headline: 'Error Playing Stream',
            message: message
          }
        });

        this.videoPlayer.error({ code: 'PLAYER_ERR_IOV' });

        throw new Error(message);
      }
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(mimeCodec) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!this.mseWrapper) {
                  _context7.next = 3;
                  break;
                }

                _context7.next = 3;
                return this.mseWrapper.destroy();

              case 3:

                this.mseWrapper = _MSEWrapper__WEBPACK_IMPORTED_MODULE_3__["default"].factory(this.videoElement);

                this.mseWrapper.on('metric', function (_ref3) {
                  var type = _ref3.type,
                      value = _ref3.value;

                  _this3.trigger('metric', { type: type, value: value });
                });

                this.mseWrapper.initializeMediaSource({
                  onSourceOpen: function () {
                    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                      return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              debug('on mediaSource sourceopen');

                              _context5.next = 3;
                              return _this3.mseWrapper.initializeSourceBuffer(mimeCodec, {
                                onAppendStart: function onAppendStart(byteArray) {
                                  silly('On Append Start...');

                                  if (_this3.LogSourceBuffer === true && _this3.LogSourceBufferTopic !== null) {
                                    debug('Recording ' + parseInt(byteArray.length) + ' bytes of data.');

                                    var mqtt_msg = new window.Paho.MQTT.Message(byteArray);
                                    mqtt_msg.destinationName = _this3.LogSourceBufferTopic;
                                    window.MQTTClient.send(mqtt_msg);
                                  }

                                  _this3.iov.statsMsg.byteCount += byteArray.length;
                                },
                                onAppendFinish: function onAppendFinish(info) {
                                  silly('On Append Finish...');

                                  if (!_this3.firstFrameShown) {
                                    _this3.firstFrameShown = true;
                                    _this3.playerInstance.trigger('firstFrameShown');
                                    _this3.trigger('firstFrameShown');
                                  }

                                  _this3.drift = info.bufferTimeEnd - _this3.videoElement.currentTime;

                                  _this3.metric('sourceBuffer.bufferTimeEnd', info.bufferTimeEnd);
                                  _this3.metric('video.currentTime', _this3.videoElement.currentTime);
                                  _this3.metric('video.drift', _this3.drift);

                                  if (_this3.drift > _this3.segmentIntervalAverage / 1000 + _this3.options.driftCorrectionConstant) {
                                    _this3.metric('video.driftCorrection', 1);
                                    _this3.videoElement.currentTime = info.bufferTimeEnd;
                                  }

                                  if (_this3.videoElement.paused === true) {
                                    debug('Video is paused!');

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
                                },
                                onRemoveFinish: function onRemoveFinish(info) {
                                  debug('onRemoveFinish');
                                },
                                onAppendError: function () {
                                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(error) {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                      while (1) {
                                        switch (_context2.prev = _context2.next) {
                                          case 0:
                                            // internal error, this has been observed to happen the tab
                                            // in the browser where this video player lives is hidden
                                            // then reselected. 'ex' is undefined the error is bug
                                            // within the MSE C++ implementation in the browser.
                                            _this3._onError('sourceBuffer.append', 'Error while appending to sourceBuffer', error);

                                            _context2.next = 3;
                                            return _this3.reinitializeMseWrapper(mimeCodec);

                                          case 3:
                                          case 'end':
                                            return _context2.stop();
                                        }
                                      }
                                    }, _callee2, _this3);
                                  }));

                                  function onAppendError(_x3) {
                                    return _ref5.apply(this, arguments);
                                  }

                                  return onAppendError;
                                }(),
                                onRemoveError: function onRemoveError(error) {
                                  if (error.constructor.name === 'DOMException') {
                                    // @todo - every time the mseWrapper is destroyed, there is a
                                    // sourceBuffer error.  No need to log that, but you should fix it
                                    return;
                                  }

                                  // observed this fail during a memry snapshot in chrome
                                  // otherwise no observed failure, so ignore exception.
                                  _this3._onError('sourceBuffer.remove', 'Error while removing segments from sourceBuffer', error);
                                },
                                onStreamFrozen: function () {
                                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                      while (1) {
                                        switch (_context3.prev = _context3.next) {
                                          case 0:
                                            debug('stream appears to be frozen - reinitializing...');

                                            _context3.next = 3;
                                            return _this3.reinitializeMseWrapper(mimeCodec);

                                          case 3:
                                          case 'end':
                                            return _context3.stop();
                                        }
                                      }
                                    }, _callee3, _this3);
                                  }));

                                  function onStreamFrozen() {
                                    return _ref6.apply(this, arguments);
                                  }

                                  return onStreamFrozen;
                                }(),
                                onError: function () {
                                  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(error) {
                                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                      while (1) {
                                        switch (_context4.prev = _context4.next) {
                                          case 0:
                                            _this3._onError('mediaSource.sourceBuffer.generic', 'mediaSource sourceBuffer error', error);

                                            _context4.next = 3;
                                            return _this3.reinitializeMseWrapper(mimeCodec);

                                          case 3:
                                          case 'end':
                                            return _context4.stop();
                                        }
                                      }
                                    }, _callee4, _this3);
                                  }));

                                  function onError(_x4) {
                                    return _ref7.apply(this, arguments);
                                  }

                                  return onError;
                                }()
                              });

                            case 3:

                              _this3.trigger('videoInfoReceived');
                              _this3.mseWrapper.appendMoov(_this3.moovBox);

                            case 5:
                            case 'end':
                              return _context5.stop();
                          }
                        }
                      }, _callee5, _this3);
                    }));

                    function onSourceOpen() {
                      return _ref4.apply(this, arguments);
                    }

                    return onSourceOpen;
                  }(),
                  onSourceEnded: function () {
                    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                      return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              debug('on mediaSource sourceended');

                              _context6.next = 3;
                              return _this3.stop();

                            case 3:
                            case 'end':
                              return _context6.stop();
                          }
                        }
                      }, _callee6, _this3);
                    }));

                    function onSourceEnded() {
                      return _ref8.apply(this, arguments);
                    }

                    return onSourceEnded;
                  }(),
                  onError: function onError(error) {
                    _this3._onError('mediaSource.generic', 'mediaSource error', error);
                  }
                });

                if (!(!this.mseWrapper.mediaSource || !this.videoElement)) {
                  _context7.next = 8;
                  break;
                }

                throw new Error('The video element or mediaSource is not ready!');

              case 8:

                this.mseWrapper.reinitializeVideoElementSrc();

              case 9:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function reinitializeMseWrapper(_x2) {
        return _ref2.apply(this, arguments);
      }

      return reinitializeMseWrapper;
    }()
  }, {
    key: 'resyncStream',
    value: function resyncStream(mimeCodec) {
      var _this4 = this;

      // subscribe to a sync topic that will be called if the stream that is feeding
      // the mse service dies and has to be restarted that this player should restart the stream
      debug('Trying to resync stream...');

      this.iov.conduit.subscribe('iov/video/' + this.guid + '/resync', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                debug('sync received re-initialize media source buffer');
                _context8.next = 3;
                return _this4.reinitializeMseWrapper(mimeCodec);

              case 3:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, _this4);
      })));
    }
  }, {
    key: 'restart',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                debug('restart');

                _context9.next = 3;
                return this.stop();

              case 3:
                this.play();

              case 4:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function restart() {
        return _ref10.apply(this, arguments);
      }

      return restart;
    }()
  }, {
    key: 'play',
    value: function play() {
      var _this5 = this;

      debug('play');

      this.stopped = false;

      // @todo - why doesn't this play/stop connect/disconnect work?
      // this.iov.conduit.connect();

      this.iov.conduit.transaction('iov/video/' + window.btoa(this.iov.config.streamName) + '/request', function () {
        return _this5.onIovPlayTransaction.apply(_this5, arguments);
      }, { clientId: this.iov.config.clientId });
    }
  }, {
    key: 'stop',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                debug('stop');

                this.stopped = true;
                this.moovBox = null;

                if (this.guid) {
                  // Stop listening for moofs
                  this.iov.conduit.unsubscribe('iov/video/' + this.guid + '/live');

                  // Stop listening for resync events
                  this.iov.conduit.unsubscribe('iov/video/' + this.guid + '/resync');

                  // Tell the server we've stopped
                  this.iov.conduit.publish('iov/video/' + this.guid + '/stop', { clientId: this.iov.config.clientId });

                  // @todo - why doesn't this play/stop connect/disconnect work?
                  // this.iov.conduit.disconnect();
                }

                // Don't wait until the next play event or the destruction of this player
                // to clear the MSE

                if (!this.mseWrapper) {
                  _context10.next = 8;
                  break;
                }

                _context10.next = 7;
                return this.mseWrapper.destroy();

              case 7:
                this.mseWrapper = null;

              case 8:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function stop() {
        return _ref11.apply(this, arguments);
      }

      return stop;
    }()
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

        this.metric('video.segmentInterval', this.segmentInterval);
        this.metric('video.segmentIntervalAverage', this.segmentIntervalAverage);
      }
    }
  }, {
    key: 'onIovPlayTransaction',


    // @todo - there is much shared between this and onChangeSourceTransaction
    value: function onIovPlayTransaction(_ref12) {
      var _this6 = this;

      var mimeCodec = _ref12.mimeCodec,
          guid = _ref12.guid;

      if (this.stopped) {
        return;
      }

      debug('onIovPlayTransaction');

      this.assertMimeCodecSupported(mimeCodec);

      var initSegmentTopic = this.iov.config.clientId + '/init-segment/' + parseInt(Math.random() * 1000000);

      this.state = 'waiting-for-first-moov';

      this.iov.conduit.subscribe(initSegmentTopic, function () {
        var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(_ref13) {
          var payloadBytes = _ref13.payloadBytes;
          var moov, newTopic;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  if (!_this6.stopped) {
                    _context11.next = 2;
                    break;
                  }

                  return _context11.abrupt('return');

                case 2:

                  debug('onIovPlayTransaction ' + initSegmentTopic + ' listener fired');
                  debug('received moov of type "' + (typeof payloadBytes === 'undefined' ? 'undefined' : _typeof(payloadBytes)) + '" from server');

                  moov = payloadBytes;


                  _this6.state = 'waiting-for-first-moof';

                  _this6.iov.conduit.unsubscribe(initSegmentTopic);

                  newTopic = 'iov/video/' + guid + '/live';

                  // subscribe to the live video topic.

                  _this6.iov.conduit.subscribe(newTopic, function (mqtt_msg) {
                    if (_this6.stopped) {
                      return;
                    }

                    _this6.trigger('videoReceived');
                    _this6.getSegmentIntervalMetrics();
                    _this6.mseWrapper.append(mqtt_msg.payloadBytes);
                  });

                  _this6.guid = guid;
                  _this6.moovBox = moov;
                  _this6.mimeCodec = mimeCodec;

                  // this.trigger('firstChunk');

                  _context11.next = 14;
                  return _this6.reinitializeMseWrapper(mimeCodec);

                case 14:
                  _this6.resyncStream(mimeCodec);

                case 15:
                case 'end':
                  return _context11.stop();
              }
            }
          }, _callee11, _this6);
        }));

        return function (_x5) {
          return _ref14.apply(this, arguments);
        };
      }());

      this.iov.conduit.publish('iov/video/' + guid + '/play', {
        initSegmentTopic: initSegmentTopic,
        clientId: this.iov.config.clientId
      });
    }
  }, {
    key: 'destroy',
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (!this.destroyed) {
                  _context12.next = 2;
                  break;
                }

                return _context12.abrupt('return');

              case 2:

                this.destroyed = true;

                _context12.next = 5;
                return this.stop();

              case 5:

                this.iov.conduit.disconnect();

                document.removeEventListener('visibilitychange', this.onVisibilityChange);

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

                this.guid = null;
                this.moovBox = null;
                this.mimeCodec = null;

                if (!this.mseWrapper) {
                  _context12.next = 28;
                  break;
                }

                _context12.next = 27;
                return this.mseWrapper.destroy();

              case 27:
                this.mseWrapper = null;

              case 28:

                // Setting the src of the video element to an empty string is
                // the only reliable way we have found to ensure that MediaSource,
                // SourceBuffer, and various Video elements are properly dereferenced
                // to avoid memory leaks
                this.videoElement.src = '';
                this.videoElement = null;

              case 30:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function destroy() {
        return _ref15.apply(this, arguments);
      }

      return destroy;
    }()
  }]);

  return IOVPlayer;
}();

IOVPlayer.EVENT_NAMES = ['metric', 'firstFrameShown', 'videoReceived', 'videoInfoReceived'];
IOVPlayer.METRIC_TYPES = ['sourceBuffer.bufferTimeEnd', 'video.currentTime', 'video.drift', 'video.driftCorrection', 'video.segmentInterval', 'video.segmentIntervalAverage'];
IOVPlayer.SEGMENT_INTERVAL_SAMPLE_SIZE = 5;
IOVPlayer.DRIFT_CORRECTION_CONSTANT = 2;
/* harmony default export */ __webpack_exports__["default"] = (IOVPlayer);
;

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../package.json */ "./package.json");
var _package_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../package.json */ "./package.json", 1);




var PLUGIN_NAME = 'clsp';
var MINIMUM_CHROME_VERSION = 52;

// @todo - this mime type, though used in the videojs plugin, and
// seemingly enforced, is not actually enforced.  The only enforcement
// done is requiring the user provide this string on the video element
// in the DOM.  The codecs that are supplied by the SFS's vary.  Here
// are some "valid", though not enforced mimeCodec values I have come
// across:
// video/mp4; codecs="avc1.4DE016"
// video/mp4; codecs="avc1.42E00C"
// video/mp4; codecs="avc1.42E00D"
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
  version: _package_json__WEBPACK_IMPORTED_MODULE_0__["version"],
  name: PLUGIN_NAME,
  supported: browserIsCompatable,
  isSupportedMimeType: isSupportedMimeType
});

/***/ }),

/***/ "./src/js/videojs-mse-over-clsp.js":
/*!*****************************************!*\
  !*** ./src/js/videojs-mse-over-clsp.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! srcdoc-polyfill */ "./node_modules/srcdoc-polyfill/srcdoc-polyfill.js");
/* harmony import */ var srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _conduit_clspConduit_generated_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./conduit/clspConduit.generated.js */ "./src/js/conduit/clspConduit.generated.js");
/* harmony import */ var _conduit_clspConduit_generated_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_conduit_clspConduit_generated_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _MseOverMqttPlugin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MseOverMqttPlugin */ "./src/js/MseOverMqttPlugin.js");
/* harmony import */ var _styles_videojs_mse_over_clsp_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/videojs-mse-over-clsp.scss */ "./src/styles/videojs-mse-over-clsp.scss");
/* harmony import */ var _styles_videojs_mse_over_clsp_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_videojs_mse_over_clsp_scss__WEBPACK_IMPORTED_MODULE_3__);








// @todo - do not initialize the plugin by default, since that is a side
// effect.  make the caller call the initialize function.  also, is it
// possible to unregister the plugin?
var clspPlugin = Object(_MseOverMqttPlugin__WEBPACK_IMPORTED_MODULE_2__["default"])();

clspPlugin.register();

/* harmony default export */ __webpack_exports__["default"] = (clspPlugin);

/***/ }),

/***/ "./src/styles/videojs-mse-over-clsp.scss":
/*!***********************************************!*\
  !*** ./src/styles/videojs-mse-over-clsp.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!***********************************************!*\
  !*** multi ./src/js/videojs-mse-over-clsp.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/js/videojs-mse-over-clsp.js */"./src/js/videojs-mse-over-clsp.js");


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
//# sourceMappingURL=videojs-mse-over-clsp.js.map