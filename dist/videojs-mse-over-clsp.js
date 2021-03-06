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

/* WEBPACK VAR INJECTION */(function(process) {/* eslint-env browser */

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
  return typeof console === 'object' && console.log && (_console = console).log.apply(_console, arguments);
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
    r = Object({"NODE_ENV":"development"}).DEBUG;
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/debug/src/common.js":
/*!******************************************!*\
  !*** ./node_modules/debug/src/common.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */
function setup(env) {
  createDebug.debug = createDebug;
  createDebug["default"] = createDebug;
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
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // Disabled?
      if (!debug.enabled) {
        return;
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
    var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
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
  * @return {String} namespaces
  * @api public
  */


  function disable() {
    var namespaces = [].concat(_toConsumableArray(createDebug.names.map(toNamespace)), _toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
      return '-' + namespace;
    }))).join(',');
    createDebug.enable('');
    return namespaces;
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
  * Convert regexp to namespace
  *
  * @param {RegExp} regxep
  * @return {String} namespace
  * @api private
  */


  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
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
var Symbol = root.Symbol;

module.exports = Symbol;


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
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
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
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
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

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

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
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
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
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

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
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
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
var baseSetToString = !defineProperty ? identity : function(func, string) {
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
  return function(value) {
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

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

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

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

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
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

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
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ "./node_modules/lodash/_isIterateeCall.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_isIterateeCall.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
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
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
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
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

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

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

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
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
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

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

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

  return function() {
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
      return (func + '');
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
  return function() {
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
var defaults = baseRest(function(object, sources) {
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

      if (value === undefined ||
          (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
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
  return value === other || (value !== value && other !== other);
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
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
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

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js"),
    stubFalse = __webpack_require__(/*! ./stubFalse */ "./node_modules/lodash/stubFalse.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

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
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
  var type = typeof value;
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
  return value != null && typeof value == 'object';
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

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
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
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
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

/***/ "./node_modules/paho-mqtt/paho-mqtt.js":
/*!*********************************************!*\
  !*** ./node_modules/paho-mqtt/paho-mqtt.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*******************************************************************************
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
	if(true){
		module.exports = factory();
	} else {}
})(this, function LibraryFactory(){


	var PahoMQTT = (function (global) {

	// Private variables below, these are only visible inside the function closure
	// which is used to define the module.
	var version = "@VERSION@-@BUILDLEVEL@";

	/**
	 * @private
	 */
	var localStorage = global.localStorage || (function () {
		var data = {};

		return {
			setItem: function (key, item) { data[key] = item; },
			getItem: function (key) { return data[key]; },
			removeItem: function (key) { delete data[key]; },
		};
	})();

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
		var validate = function(obj, keys) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (keys.hasOwnProperty(key)) {
						if (typeof obj[key] !== keys[key])
							throw new Error(format(ERROR.INVALID_TYPE, [typeof obj[key], key]));
					} else {
						var errorStr = "Unknown property, " + key + ". Valid properties are:";
						for (var validKey in keys)
							if (keys.hasOwnProperty(validKey))
								errorStr = errorStr+" "+validKey;
						throw new Error(errorStr);
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
		var scope = function (f, scope) {
			return function () {
				return f.apply(scope, arguments);
			};
		};

		/**
	 * Unique message type identifiers, with associated
	 * associated integer values.
	 * @private
	 */
		var ERROR = {
			OK: {code:0, text:"AMQJSC0000I OK."},
			CONNECT_TIMEOUT: {code:1, text:"AMQJSC0001E Connect timed out."},
			SUBSCRIBE_TIMEOUT: {code:2, text:"AMQJS0002E Subscribe timed out."},
			UNSUBSCRIBE_TIMEOUT: {code:3, text:"AMQJS0003E Unsubscribe timed out."},
			PING_TIMEOUT: {code:4, text:"AMQJS0004E Ping timed out."},
			INTERNAL_ERROR: {code:5, text:"AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"},
			CONNACK_RETURNCODE: {code:6, text:"AMQJS0006E Bad Connack return code:{0} {1}."},
			SOCKET_ERROR: {code:7, text:"AMQJS0007E Socket error:{0}."},
			SOCKET_CLOSE: {code:8, text:"AMQJS0008I Socket closed."},
			MALFORMED_UTF: {code:9, text:"AMQJS0009E Malformed UTF data:{0} {1} {2}."},
			UNSUPPORTED: {code:10, text:"AMQJS0010E {0} is not supported by this browser."},
			INVALID_STATE: {code:11, text:"AMQJS0011E Invalid state {0}."},
			INVALID_TYPE: {code:12, text:"AMQJS0012E Invalid type {0} for {1}."},
			INVALID_ARGUMENT: {code:13, text:"AMQJS0013E Invalid argument {0} for {1}."},
			UNSUPPORTED_OPERATION: {code:14, text:"AMQJS0014E Unsupported operation."},
			INVALID_STORED_DATA: {code:15, text:"AMQJS0015E Invalid data in local storage key={0} value={1}."},
			INVALID_MQTT_MESSAGE_TYPE: {code:16, text:"AMQJS0016E Invalid MQTT message type {0}."},
			MALFORMED_UNICODE: {code:17, text:"AMQJS0017E Malformed Unicode string:{0} {1}."},
			BUFFER_FULL: {code:18, text:"AMQJS0018E Message buffer is full, maximum buffer size: {0}."},
		};

		/** CONNACK RC Meaning. */
		var CONNACK_RC = {
			0:"Connection Accepted",
			1:"Connection Refused: unacceptable protocol version",
			2:"Connection Refused: identifier rejected",
			3:"Connection Refused: server unavailable",
			4:"Connection Refused: bad user name or password",
			5:"Connection Refused: not authorized"
		};

	/**
	 * Format an error message text.
	 * @private
	 * @param {error} ERROR value above.
	 * @param {substitutions} [array] substituted into the text.
	 * @return the text with the substitutions made.
	 */
		var format = function(error, substitutions) {
			var text = error.text;
			if (substitutions) {
				var field,start;
				for (var i=0; i<substitutions.length; i++) {
					field = "{"+i+"}";
					start = text.indexOf(field);
					if(start > 0) {
						var part1 = text.substring(0,start);
						var part2 = text.substring(start+field.length);
						text = part1+substitutions[i]+part2;
					}
				}
			}
			return text;
		};

		//MQTT protocol and version          6    M    Q    I    s    d    p    3
		var MqttProtoIdentifierv3 = [0x00,0x06,0x4d,0x51,0x49,0x73,0x64,0x70,0x03];
		//MQTT proto/version for 311         4    M    Q    T    T    4
		var MqttProtoIdentifierv4 = [0x00,0x04,0x4d,0x51,0x54,0x54,0x04];

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
		var WireMessage = function (type, options) {
			this.type = type;
			for (var name in options) {
				if (options.hasOwnProperty(name)) {
					this[name] = options[name];
				}
			}
		};

		WireMessage.prototype.encode = function() {
		// Compute the first byte of the fixed header
			var first = ((this.type & 0x0f) << 4);

			/*
		 * Now calculate the length of the variable header + payload by adding up the lengths
		 * of all the component parts
		 */

			var remLength = 0;
			var topicStrLength = [];
			var destinationNameLength = 0;
			var willMessagePayloadBytes;

			// if the message contains a messageIdentifier then we need two bytes for that
			if (this.messageIdentifier !== undefined)
				remLength += 2;

			switch(this.type) {
			// If this a Connect then we need to include 12 bytes for its header
			case MESSAGE_TYPE.CONNECT:
				switch(this.mqttVersion) {
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
					if (!(willMessagePayloadBytes instanceof Uint8Array))
						willMessagePayloadBytes = new Uint8Array(payloadBytes);
					remLength += willMessagePayloadBytes.byteLength +2;
				}
				if (this.userName !== undefined)
					remLength += UTF8Length(this.userName) + 2;
				if (this.password !== undefined)
					remLength += UTF8Length(this.password) + 2;
				break;

			// Subscribe, Unsubscribe can both contain topic strings
			case MESSAGE_TYPE.SUBSCRIBE:
				first |= 0x02; // Qos = 1;
				for ( var i = 0; i < this.topics.length; i++) {
					topicStrLength[i] = UTF8Length(this.topics[i]);
					remLength += topicStrLength[i] + 2;
				}
				remLength += this.requestedQos.length; // 1 byte for each topic's Qos
				// QoS on Subscribe only
				break;

			case MESSAGE_TYPE.UNSUBSCRIBE:
				first |= 0x02; // Qos = 1;
				for ( var i = 0; i < this.topics.length; i++) {
					topicStrLength[i] = UTF8Length(this.topics[i]);
					remLength += topicStrLength[i] + 2;
				}
				break;

			case MESSAGE_TYPE.PUBREL:
				first |= 0x02; // Qos = 1;
				break;

			case MESSAGE_TYPE.PUBLISH:
				if (this.payloadMessage.duplicate) first |= 0x08;
				first  = first |= (this.payloadMessage.qos << 1);
				if (this.payloadMessage.retained) first |= 0x01;
				destinationNameLength = UTF8Length(this.payloadMessage.destinationName);
				remLength += destinationNameLength + 2;
				var payloadBytes = this.payloadMessage.payloadBytes;
				remLength += payloadBytes.byteLength;
				if (payloadBytes instanceof ArrayBuffer)
					payloadBytes = new Uint8Array(payloadBytes);
				else if (!(payloadBytes instanceof Uint8Array))
					payloadBytes = new Uint8Array(payloadBytes.buffer);
				break;

			case MESSAGE_TYPE.DISCONNECT:
				break;

			default:
				break;
			}

			// Now we can allocate a buffer for the message

			var mbi = encodeMBI(remLength);  // Convert the length to MQTT MBI format
			var pos = mbi.length + 1;        // Offset of start of variable header
			var buffer = new ArrayBuffer(remLength + pos);
			var byteStream = new Uint8Array(buffer);    // view it as a sequence of bytes

			//Write the fixed header into the buffer
			byteStream[0] = first;
			byteStream.set(mbi,1);

			// If this is a PUBLISH then the variable header starts with a topic
			if (this.type == MESSAGE_TYPE.PUBLISH)
				pos = writeString(this.payloadMessage.destinationName, destinationNameLength, byteStream, pos);
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
				if (this.cleanSession)
					connectFlags = 0x02;
				if (this.willMessage !== undefined ) {
					connectFlags |= 0x04;
					connectFlags |= (this.willMessage.qos<<3);
					if (this.willMessage.retained) {
						connectFlags |= 0x20;
					}
				}
				if (this.userName !== undefined)
					connectFlags |= 0x80;
				if (this.password !== undefined)
					connectFlags |= 0x40;
				byteStream[pos++] = connectFlags;
				pos = writeUint16 (this.keepAliveInterval, byteStream, pos);
			}

			// Output the messageIdentifier - if there is one
			if (this.messageIdentifier !== undefined)
				pos = writeUint16 (this.messageIdentifier, byteStream, pos);

			switch(this.type) {
			case MESSAGE_TYPE.CONNECT:
				pos = writeString(this.clientId, UTF8Length(this.clientId), byteStream, pos);
				if (this.willMessage !== undefined) {
					pos = writeString(this.willMessage.destinationName, UTF8Length(this.willMessage.destinationName), byteStream, pos);
					pos = writeUint16(willMessagePayloadBytes.byteLength, byteStream, pos);
					byteStream.set(willMessagePayloadBytes, pos);
					pos += willMessagePayloadBytes.byteLength;

				}
				if (this.userName !== undefined)
					pos = writeString(this.userName, UTF8Length(this.userName), byteStream, pos);
				if (this.password !== undefined)
					pos = writeString(this.password, UTF8Length(this.password), byteStream, pos);
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
				for (var i=0; i<this.topics.length; i++) {
					pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
					byteStream[pos++] = this.requestedQos[i];
				}
				break;

			case MESSAGE_TYPE.UNSUBSCRIBE:
				// UNSUBSCRIBE has a list of topic strings
				for (var i=0; i<this.topics.length; i++)
					pos = writeString(this.topics[i], topicStrLength[i], byteStream, pos);
				break;

			default:
				// Do nothing.
			}

			return buffer;
		};

		function decodeMessage(input,pos) {
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
					return [null,startingPos];
				}
				digit = input[pos++];
				remLength += ((digit & 0x7F) * multiplier);
				multiplier *= 128;
			} while ((digit & 0x80) !== 0);

			var endPos = pos+remLength;
			if (endPos > input.length) {
				return [null,startingPos];
			}

			var wireMessage = new WireMessage(type);
			switch(type) {
			case MESSAGE_TYPE.CONNACK:
				var connectAcknowledgeFlags = input[pos++];
				if (connectAcknowledgeFlags & 0x01)
					wireMessage.sessionPresent = true;
				wireMessage.returnCode = input[pos++];
				break;

			case MESSAGE_TYPE.PUBLISH:
				var qos = (messageInfo >> 1) & 0x03;

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
				if ((messageInfo & 0x01) == 0x01)
					message.retained = true;
				if ((messageInfo & 0x08) == 0x08)
					message.duplicate =  true;
				message.qos = qos;
				message.destinationName = topicName;
				wireMessage.payloadMessage = message;
				break;

			case  MESSAGE_TYPE.PUBACK:
			case  MESSAGE_TYPE.PUBREC:
			case  MESSAGE_TYPE.PUBREL:
			case  MESSAGE_TYPE.PUBCOMP:
			case  MESSAGE_TYPE.UNSUBACK:
				wireMessage.messageIdentifier = readUint16(input, pos);
				break;

			case  MESSAGE_TYPE.SUBACK:
				wireMessage.messageIdentifier = readUint16(input, pos);
				pos += 2;
				wireMessage.returnCode = input.subarray(pos, endPos);
				break;

			default:
				break;
			}

			return [wireMessage,endPos];
		}

		function writeUint16(input, buffer, offset) {
			buffer[offset++] = input >> 8;      //MSB
			buffer[offset++] = input % 256;     //LSB
			return offset;
		}

		function writeString(input, utf8Length, buffer, offset) {
			offset = writeUint16(utf8Length, buffer, offset);
			stringToUTF8(input, buffer, offset);
			return offset + utf8Length;
		}

		function readUint16(buffer, offset) {
			return 256*buffer[offset] + buffer[offset+1];
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
			} while ( (number > 0) && (numBytes<4) );

			return output;
		}

		/**
	 * Takes a String and calculates its length in bytes when encoded in UTF8.
	 * @private
	 */
		function UTF8Length(input) {
			var output = 0;
			for (var i = 0; i<input.length; i++)
			{
				var charCode = input.charCodeAt(i);
				if (charCode > 0x7FF)
				{
					// Surrogate pair means its a 4 byte character
					if (0xD800 <= charCode && charCode <= 0xDBFF)
					{
						i++;
						output++;
					}
					output +=3;
				}
				else if (charCode > 0x7F)
					output +=2;
				else
					output++;
			}
			return output;
		}

		/**
	 * Takes a String and writes it into an array as UTF8 encoded bytes.
	 * @private
	 */
		function stringToUTF8(input, output, start) {
			var pos = start;
			for (var i = 0; i<input.length; i++) {
				var charCode = input.charCodeAt(i);

				// Check for a surrogate pair.
				if (0xD800 <= charCode && charCode <= 0xDBFF) {
					var lowCharCode = input.charCodeAt(++i);
					if (isNaN(lowCharCode)) {
						throw new Error(format(ERROR.MALFORMED_UNICODE, [charCode, lowCharCode]));
					}
					charCode = ((charCode - 0xD800)<<10) + (lowCharCode - 0xDC00) + 0x10000;

				}

				if (charCode <= 0x7F) {
					output[pos++] = charCode;
				} else if (charCode <= 0x7FF) {
					output[pos++] = charCode>>6  & 0x1F | 0xC0;
					output[pos++] = charCode     & 0x3F | 0x80;
				} else if (charCode <= 0xFFFF) {
					output[pos++] = charCode>>12 & 0x0F | 0xE0;
					output[pos++] = charCode>>6  & 0x3F | 0x80;
					output[pos++] = charCode     & 0x3F | 0x80;
				} else {
					output[pos++] = charCode>>18 & 0x07 | 0xF0;
					output[pos++] = charCode>>12 & 0x3F | 0x80;
					output[pos++] = charCode>>6  & 0x3F | 0x80;
					output[pos++] = charCode     & 0x3F | 0x80;
				}
			}
			return output;
		}

		function parseUTF8(input, offset, length) {
			var output = "";
			var utf16;
			var pos = offset;

			while (pos < offset+length)
			{
				var byte1 = input[pos++];
				if (byte1 < 128)
					utf16 = byte1;
				else
				{
					var byte2 = input[pos++]-128;
					if (byte2 < 0)
						throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16),""]));
					if (byte1 < 0xE0)             // 2 byte character
						utf16 = 64*(byte1-0xC0) + byte2;
					else
					{
						var byte3 = input[pos++]-128;
						if (byte3 < 0)
							throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16)]));
						if (byte1 < 0xF0)        // 3 byte character
							utf16 = 4096*(byte1-0xE0) + 64*byte2 + byte3;
						else
						{
							var byte4 = input[pos++]-128;
							if (byte4 < 0)
								throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
							if (byte1 < 0xF8)        // 4 byte character
								utf16 = 262144*(byte1-0xF0) + 4096*byte2 + 64*byte3 + byte4;
							else                     // longer encodings are not supported
								throw new Error(format(ERROR.MALFORMED_UTF, [byte1.toString(16), byte2.toString(16), byte3.toString(16), byte4.toString(16)]));
						}
					}
				}

				if (utf16 > 0xFFFF)   // 4 byte character - express as a surrogate pair
				{
					utf16 -= 0x10000;
					output += String.fromCharCode(0xD800 + (utf16 >> 10)); // lead character
					utf16 = 0xDC00 + (utf16 & 0x3FF);  // trail character
				}
				output += String.fromCharCode(utf16);
			}
			return output;
		}

		/**
	 * Repeat keepalive requests, monitor responses.
	 * @ignore
	 */
		var Pinger = function(client, keepAliveInterval) {
			this._client = client;
			this._keepAliveInterval = keepAliveInterval*1000;
			this.isReset = false;

			var pingReq = new WireMessage(MESSAGE_TYPE.PINGREQ).encode();

			var doTimeout = function (pinger) {
				return function () {
					return doPing.apply(pinger);
				};
			};

			/** @ignore */
			var doPing = function() {
				if (!this.isReset) {
					this._client._trace("Pinger.doPing", "Timed out");
					this._client._disconnected( ERROR.PING_TIMEOUT.code , format(ERROR.PING_TIMEOUT));
				} else {
					this.isReset = false;
					this._client._trace("Pinger.doPing", "send PINGREQ");
					this._client.socket.send(pingReq);
					this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
				}
			};

			this.reset = function() {
				this.isReset = true;
				clearTimeout(this.timeout);
				if (this._keepAliveInterval > 0)
					this.timeout = setTimeout(doTimeout(this), this._keepAliveInterval);
			};

			this.cancel = function() {
				clearTimeout(this.timeout);
			};
		};

		/**
	 * Monitor request completion.
	 * @ignore
	 */
		var Timeout = function(client, timeoutSeconds, action, args) {
			if (!timeoutSeconds)
				timeoutSeconds = 30;

			var doTimeout = function (action, client, args) {
				return function () {
					return action.apply(client, args);
				};
			};
			this.timeout = setTimeout(doTimeout(action, client, args), timeoutSeconds * 1000);

			this.cancel = function() {
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
		var ClientImpl = function (uri, host, port, path, clientId) {
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
			this._localKey=host+":"+port+(path!="/mqtt"?":"+path:"")+":"+clientId+":";

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
			for (var key in localStorage)
				if (   key.indexOf("Sent:"+this._localKey) === 0 || key.indexOf("Received:"+this._localKey) === 0)
					this.restore(key);
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

			if (this.connected)
				throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));
			if (this.socket)
				throw new Error(format(ERROR.INVALID_STATE, ["already connected"]));

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

			if (!this.connected)
				throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));

            var wireMessage = new WireMessage(MESSAGE_TYPE.SUBSCRIBE);
            wireMessage.topics = filter.constructor === Array ? filter : [filter];
            if (subscribeOptions.qos === undefined)
                subscribeOptions.qos = 0;
            wireMessage.requestedQos = [];
            for (var i = 0; i < wireMessage.topics.length; i++)
                wireMessage.requestedQos[i] = subscribeOptions.qos;

			if (subscribeOptions.onSuccess) {
				wireMessage.onSuccess = function(grantedQos) {subscribeOptions.onSuccess({invocationContext:subscribeOptions.invocationContext,grantedQos:grantedQos});};
			}

			if (subscribeOptions.onFailure) {
				wireMessage.onFailure = function(errorCode) {subscribeOptions.onFailure({invocationContext:subscribeOptions.invocationContext,errorCode:errorCode, errorMessage:format(errorCode)});};
			}

			if (subscribeOptions.timeout) {
				wireMessage.timeOut = new Timeout(this, subscribeOptions.timeout, subscribeOptions.onFailure,
					[{invocationContext:subscribeOptions.invocationContext,
						errorCode:ERROR.SUBSCRIBE_TIMEOUT.code,
						errorMessage:format(ERROR.SUBSCRIBE_TIMEOUT)}]);
			}

			// All subscriptions return a SUBACK.
			this._requires_ack(wireMessage);
			this._schedule_message(wireMessage);
		};

		/** @ignore */
		ClientImpl.prototype.unsubscribe = function(filter, unsubscribeOptions) {
			this._trace("Client.unsubscribe", filter, unsubscribeOptions);

			if (!this.connected)
				throw new Error(format(ERROR.INVALID_STATE, ["not connected"]));

            var wireMessage = new WireMessage(MESSAGE_TYPE.UNSUBSCRIBE);
            wireMessage.topics = filter.constructor === Array ? filter : [filter];

			if (unsubscribeOptions.onSuccess) {
				wireMessage.callback = function() {unsubscribeOptions.onSuccess({invocationContext:unsubscribeOptions.invocationContext});};
			}
			if (unsubscribeOptions.timeout) {
				wireMessage.timeOut = new Timeout(this, unsubscribeOptions.timeout, unsubscribeOptions.onFailure,
					[{invocationContext:unsubscribeOptions.invocationContext,
						errorCode:ERROR.UNSUBSCRIBE_TIMEOUT.code,
						errorMessage:format(ERROR.UNSUBSCRIBE_TIMEOUT)}]);
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

			if (!this.socket)
				throw new Error(format(ERROR.INVALID_STATE, ["not connecting or connected"]));

			var wireMessage = new WireMessage(MESSAGE_TYPE.DISCONNECT);

			// Run the disconnected call back as soon as the message has been sent,
			// in case of a failure later on in the disconnect processing.
			// as a consequence, the _disconected call back may be run several times.
			this._notify_msg_sent[wireMessage] = scope(this._disconnected, this);

			this._schedule_message(wireMessage);
		};

		ClientImpl.prototype.getTraceLog = function () {
			if ( this._traceBuffer !== null ) {
				this._trace("Client.getTraceLog", new Date());
				this._trace("Client.getTraceLog in flight messages", this._sentMessages.length);
				for (var key in this._sentMessages)
					this._trace("_sentMessages ",key, this._sentMessages[key]);
				for (var key in this._receivedMessages)
					this._trace("_receivedMessages ",key, this._receivedMessages[key]);

				return this._traceBuffer;
			}
		};

		ClientImpl.prototype.startTrace = function () {
			if ( this._traceBuffer === null ) {
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
			this._connectTimeout = new Timeout(this, this.connectOptions.timeout, this._disconnected,  [ERROR.CONNECT_TIMEOUT.code, format(ERROR.CONNECT_TIMEOUT)]);
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

		ClientImpl.prototype.store = function(prefix, wireMessage) {
			var storedMessage = {type:wireMessage.type, messageIdentifier:wireMessage.messageIdentifier, version:1};

			switch(wireMessage.type) {
			case MESSAGE_TYPE.PUBLISH:
				if(wireMessage.pubRecReceived)
					storedMessage.pubRecReceived = true;

				// Convert the payload to a hex string.
				storedMessage.payloadMessage = {};
				var hex = "";
				var messageBytes = wireMessage.payloadMessage.payloadBytes;
				for (var i=0; i<messageBytes.length; i++) {
					if (messageBytes[i] <= 0xF)
						hex = hex+"0"+messageBytes[i].toString(16);
					else
						hex = hex+messageBytes[i].toString(16);
				}
				storedMessage.payloadMessage.payloadHex = hex;

				storedMessage.payloadMessage.qos = wireMessage.payloadMessage.qos;
				storedMessage.payloadMessage.destinationName = wireMessage.payloadMessage.destinationName;
				if (wireMessage.payloadMessage.duplicate)
					storedMessage.payloadMessage.duplicate = true;
				if (wireMessage.payloadMessage.retained)
					storedMessage.payloadMessage.retained = true;

				// Add a sequence number to sent messages.
				if ( prefix.indexOf("Sent:") === 0 ) {
					if ( wireMessage.sequence === undefined )
						wireMessage.sequence = ++this._sequence;
					storedMessage.sequence = wireMessage.sequence;
				}
				break;

			default:
				throw Error(format(ERROR.INVALID_STORED_DATA, [prefix+this._localKey+wireMessage.messageIdentifier, storedMessage]));
			}
			localStorage.setItem(prefix+this._localKey+wireMessage.messageIdentifier, JSON.stringify(storedMessage));
		};

		ClientImpl.prototype.restore = function(key) {
			var value = localStorage.getItem(key);
			var storedMessage = JSON.parse(value);

			var wireMessage = new WireMessage(storedMessage.type, storedMessage);

			switch(storedMessage.type) {
			case MESSAGE_TYPE.PUBLISH:
				// Replace the payload message with a Message object.
				var hex = storedMessage.payloadMessage.payloadHex;
				var buffer = new ArrayBuffer((hex.length)/2);
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
				if (storedMessage.payloadMessage.duplicate)
					payloadMessage.duplicate = true;
				if (storedMessage.payloadMessage.retained)
					payloadMessage.retained = true;
				wireMessage.payloadMessage = payloadMessage;

				break;

			default:
				throw Error(format(ERROR.INVALID_STORED_DATA, [key, value]));
			}

			if (key.indexOf("Sent:"+this._localKey) === 0) {
				wireMessage.payloadMessage.duplicate = true;
				this._sentMessages[wireMessage.messageIdentifier] = wireMessage;
			} else if (key.indexOf("Received:"+this._localKey) === 0) {
				this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
			}
		};

		ClientImpl.prototype._process_queue = function () {
			var message = null;

			// Send all queued messages down socket connection
			while ((message = this._msg_queue.pop())) {
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
			if (messageCount > this.maxMessageIdentifier)
				throw Error ("Too many messages:"+messageCount);

			while(this._sentMessages[this._message_identifier] !== undefined) {
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
			for (var i = 0; i < messages.length; i+=1) {
				this._handleMessage(messages[i]);
			}
		};

		ClientImpl.prototype._deframeMessages = function(data) {
			var byteArray = new Uint8Array(data);
			var messages = [];
			if (this.receiveBuffer) {
				var newData = new Uint8Array(this.receiveBuffer.length+byteArray.length);
				newData.set(this.receiveBuffer);
				newData.set(byteArray,this.receiveBuffer.length);
				byteArray = newData;
				delete this.receiveBuffer;
			}
			try {
				var offset = 0;
				while(offset < byteArray.length) {
					var result = decodeMessage(byteArray,offset);
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
				var errorStack = ((error.hasOwnProperty("stack") == "undefined") ? error.stack.toString() : "No Error Stack Available");
				this._disconnected(ERROR.INTERNAL_ERROR.code , format(ERROR.INTERNAL_ERROR, [error.message,errorStack]));
				return;
			}
			return messages;
		};

		ClientImpl.prototype._handleMessage = function(wireMessage) {

			this._trace("Client._handleMessage", wireMessage);

			try {
				switch(wireMessage.type) {
				case MESSAGE_TYPE.CONNACK:
					this._connectTimeout.cancel();
					if (this._reconnectTimeout)
						this._reconnectTimeout.cancel();

					// If we have started using clean session then clear up the local state.
					if (this.connectOptions.cleanSession) {
						for (var key in this._sentMessages) {
							var sentMessage = this._sentMessages[key];
							localStorage.removeItem("Sent:"+this._localKey+sentMessage.messageIdentifier);
						}
						this._sentMessages = {};

						for (var key in this._receivedMessages) {
							var receivedMessage = this._receivedMessages[key];
							localStorage.removeItem("Received:"+this._localKey+receivedMessage.messageIdentifier);
						}
						this._receivedMessages = {};
					}
					// Client connected and ready for business.
					if (wireMessage.returnCode === 0) {

						this.connected = true;
						// Jump to the end of the list of uris and stop looking for a good host.

						if (this.connectOptions.uris)
							this.hostIndex = this.connectOptions.uris.length;

					} else {
						this._disconnected(ERROR.CONNACK_RETURNCODE.code , format(ERROR.CONNACK_RETURNCODE, [wireMessage.returnCode, CONNACK_RC[wireMessage.returnCode]]));
						break;
					}

					// Resend messages.
					var sequencedMessages = [];
					for (var msgId in this._sentMessages) {
						if (this._sentMessages.hasOwnProperty(msgId))
							sequencedMessages.push(this._sentMessages[msgId]);
					}

					// Also schedule qos 0 buffered messages if any
					if (this._buffered_msg_queue.length > 0) {
						var msg = null;
						while ((msg = this._buffered_msg_queue.pop())) {
							sequencedMessages.push(msg);
							if (this.onMessageDelivered)
								this._notify_msg_sent[msg] = this.onMessageDelivered(msg.payloadMessage);
						}
					}

					// Sort sentMessages into the original sent order.
					var sequencedMessages = sequencedMessages.sort(function(a,b) {return a.sequence - b.sequence;} );
					for (var i=0, len=sequencedMessages.length; i<len; i++) {
						var sentMessage = sequencedMessages[i];
						if (sentMessage.type == MESSAGE_TYPE.PUBLISH && sentMessage.pubRecReceived) {
							var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {messageIdentifier:sentMessage.messageIdentifier});
							this._schedule_message(pubRelMessage);
						} else {
							this._schedule_message(sentMessage);
						}
					}

					// Execute the connectOptions.onSuccess callback if there is one.
					// Will also now return if this connection was the result of an automatic
					// reconnect and which URI was successfully connected to.
					if (this.connectOptions.onSuccess) {
						this.connectOptions.onSuccess({invocationContext:this.connectOptions.invocationContext});
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
						localStorage.removeItem("Sent:"+this._localKey+wireMessage.messageIdentifier);
						if (this.onMessageDelivered)
							this.onMessageDelivered(sentMessage.payloadMessage);
					}
					break;

				case MESSAGE_TYPE.PUBREC:
					var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
					// If this is a re flow of a PUBREC after we have restarted receivedMessage will not exist.
					if (sentMessage) {
						sentMessage.pubRecReceived = true;
						var pubRelMessage = new WireMessage(MESSAGE_TYPE.PUBREL, {messageIdentifier:wireMessage.messageIdentifier});
						this.store("Sent:", sentMessage);
						this._schedule_message(pubRelMessage);
					}
					break;

				case MESSAGE_TYPE.PUBREL:
					var receivedMessage = this._receivedMessages[wireMessage.messageIdentifier];
					localStorage.removeItem("Received:"+this._localKey+wireMessage.messageIdentifier);
					// If this is a re flow of a PUBREL after we have restarted receivedMessage will not exist.
					if (receivedMessage) {
						this._receiveMessage(receivedMessage);
						delete this._receivedMessages[wireMessage.messageIdentifier];
					}
					// Always flow PubComp, we may have previously flowed PubComp but the server lost it and restarted.
					var pubCompMessage = new WireMessage(MESSAGE_TYPE.PUBCOMP, {messageIdentifier:wireMessage.messageIdentifier});
					this._schedule_message(pubCompMessage);


					break;

				case MESSAGE_TYPE.PUBCOMP:
					var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
					delete this._sentMessages[wireMessage.messageIdentifier];
					localStorage.removeItem("Sent:"+this._localKey+wireMessage.messageIdentifier);
					if (this.onMessageDelivered)
						this.onMessageDelivered(sentMessage.payloadMessage);
					break;

				case MESSAGE_TYPE.SUBACK:
					var sentMessage = this._sentMessages[wireMessage.messageIdentifier];
					if (sentMessage) {
						if(sentMessage.timeOut)
							sentMessage.timeOut.cancel();
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
						if (sentMessage.timeOut)
							sentMessage.timeOut.cancel();
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
					this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code , format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
					break;

				default:
					this._disconnected(ERROR.INVALID_MQTT_MESSAGE_TYPE.code , format(ERROR.INVALID_MQTT_MESSAGE_TYPE, [wireMessage.type]));
				}
			} catch (error) {
				var errorStack = ((error.hasOwnProperty("stack") == "undefined") ? error.stack.toString() : "No Error Stack Available");
				this._disconnected(ERROR.INTERNAL_ERROR.code , format(ERROR.INTERNAL_ERROR, [error.message,errorStack]));
				return;
			}
		};

		/** @ignore */
		ClientImpl.prototype._on_socket_error = function (error) {
			if (!this._reconnecting) {
				this._disconnected(ERROR.SOCKET_ERROR.code , format(ERROR.SOCKET_ERROR, [error.data]));
			}
		};

		/** @ignore */
		ClientImpl.prototype._on_socket_close = function () {
			if (!this._reconnecting) {
				this._disconnected(ERROR.SOCKET_CLOSE.code , format(ERROR.SOCKET_CLOSE));
			}
		};

		/** @ignore */
		ClientImpl.prototype._socket_send = function (wireMessage) {

			if (wireMessage.type == 1) {
				var wireMessageMasked = this._traceMask(wireMessage, "password");
				this._trace("Client._socket_send", wireMessageMasked);
			}
			else this._trace("Client._socket_send", wireMessage);

			this.socket.send(wireMessage.encode());
			/* We have proved to the server we are alive. */
			this.sendPinger.reset();
		};

		/** @ignore */
		ClientImpl.prototype._receivePublish = function (wireMessage) {
			switch(wireMessage.payloadMessage.qos) {
			case "undefined":
			case 0:
				this._receiveMessage(wireMessage);
				break;

			case 1:
				var pubAckMessage = new WireMessage(MESSAGE_TYPE.PUBACK, {messageIdentifier:wireMessage.messageIdentifier});
				this._schedule_message(pubAckMessage);
				this._receiveMessage(wireMessage);
				break;

			case 2:
				this._receivedMessages[wireMessage.messageIdentifier] = wireMessage;
				this.store("Received:", wireMessage);
				var pubRecMessage = new WireMessage(MESSAGE_TYPE.PUBREC, {messageIdentifier:wireMessage.messageIdentifier});
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
			if (this.onConnected)
				this.onConnected(reconnect, uri);
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
				if (this._reconnectInterval < 128)
					this._reconnectInterval = this._reconnectInterval * 2;
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
				if (this.socket.readyState === 1)
					this.socket.close();
				delete this.socket;
			}

			if (this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length-1) {
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
						this.onConnectionLost({errorCode:errorCode, errorMessage:errorText, reconnect:this.connectOptions.reconnect, uri:this._wsuri});
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
					} else if(this.connectOptions.onFailure) {
						this.connectOptions.onFailure({invocationContext:this.connectOptions.invocationContext, errorCode:errorCode, errorMessage:errorText});
					}
				}
			}
		};

		/** @ignore */
		ClientImpl.prototype._trace = function () {
		// Pass trace message back to client's callback function
			if (this.traceFunction) {
				var args = Array.prototype.slice.call(arguments);
				for (var i in args)
				{
					if (typeof args[i] !== "undefined")
						args.splice(i, 1, JSON.stringify(args[i]));
				}
				var record = args.join("");
				this.traceFunction ({severity: "Debug", message: record	});
			}

			//buffer style trace
			if ( this._traceBuffer !== null ) {
				for (var i = 0, max = arguments.length; i < max; i++) {
					if ( this._traceBuffer.length == this._MAX_TRACE_ENTRIES ) {
						this._traceBuffer.shift();
					}
					if (i === 0) this._traceBuffer.push(arguments[i]);
					else if (typeof arguments[i] === "undefined" ) this._traceBuffer.push(arguments[i]);
					else this._traceBuffer.push("  "+JSON.stringify(arguments[i]));
				}
			}
		};

		/** @ignore */
		ClientImpl.prototype._traceMask = function (traceObject, masked) {
			var traceObjectMasked = {};
			for (var attr in traceObject) {
				if (traceObject.hasOwnProperty(attr)) {
					if (attr == masked)
						traceObjectMasked[attr] = "******";
					else
						traceObjectMasked[attr] = traceObject[attr];
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
		var Client = function (host, port, path, clientId) {

			var uri;

			if (typeof host !== "string")
				throw new Error(format(ERROR.INVALID_TYPE, [typeof host, "host"]));

			if (arguments.length == 2) {
			// host: must be full ws:// uri
			// port: clientId
				clientId = port;
				uri = host;
				var match = uri.match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);
				if (match) {
					host = match[4]||match[2];
					port = parseInt(match[7]);
					path = match[8];
				} else {
					throw new Error(format(ERROR.INVALID_ARGUMENT,[host,"host"]));
				}
			} else {
				if (arguments.length == 3) {
					clientId = path;
					path = "/mqtt";
				}
				if (typeof port !== "number" || port < 0)
					throw new Error(format(ERROR.INVALID_TYPE, [typeof port, "port"]));
				if (typeof path !== "string")
					throw new Error(format(ERROR.INVALID_TYPE, [typeof path, "path"]));

				var ipv6AddSBracket = (host.indexOf(":") !== -1 && host.slice(0,1) !== "[" && host.slice(-1) !== "]");
				uri = "ws://"+(ipv6AddSBracket?"["+host+"]":host)+":"+port+path;
			}

			var clientIdLength = 0;
			for (var i = 0; i<clientId.length; i++) {
				var charCode = clientId.charCodeAt(i);
				if (0xD800 <= charCode && charCode <= 0xDBFF)  {
					i++; // Surrogate pair.
				}
				clientIdLength++;
			}
			if (typeof clientId !== "string" || clientIdLength > 65535)
				throw new Error(format(ERROR.INVALID_ARGUMENT, [clientId, "clientId"]));

			var client = new ClientImpl(uri, host, port, path, clientId);

			//Public Properties
			Object.defineProperties(this,{
				"host":{
					get: function() { return host; },
					set: function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); }
				},
				"port":{
					get: function() { return port; },
					set: function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); }
				},
				"path":{
					get: function() { return path; },
					set: function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); }
				},
				"uri":{
					get: function() { return uri; },
					set: function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); }
				},
				"clientId":{
					get: function() { return client.clientId; },
					set: function() { throw new Error(format(ERROR.UNSUPPORTED_OPERATION)); }
				},
				"onConnected":{
					get: function() { return client.onConnected; },
					set: function(newOnConnected) {
						if (typeof newOnConnected === "function")
							client.onConnected = newOnConnected;
						else
							throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnConnected, "onConnected"]));
					}
				},
				"disconnectedPublishing":{
					get: function() { return client.disconnectedPublishing; },
					set: function(newDisconnectedPublishing) {
						client.disconnectedPublishing = newDisconnectedPublishing;
					}
				},
				"disconnectedBufferSize":{
					get: function() { return client.disconnectedBufferSize; },
					set: function(newDisconnectedBufferSize) {
						client.disconnectedBufferSize = newDisconnectedBufferSize;
					}
				},
				"onConnectionLost":{
					get: function() { return client.onConnectionLost; },
					set: function(newOnConnectionLost) {
						if (typeof newOnConnectionLost === "function")
							client.onConnectionLost = newOnConnectionLost;
						else
							throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnConnectionLost, "onConnectionLost"]));
					}
				},
				"onMessageDelivered":{
					get: function() { return client.onMessageDelivered; },
					set: function(newOnMessageDelivered) {
						if (typeof newOnMessageDelivered === "function")
							client.onMessageDelivered = newOnMessageDelivered;
						else
							throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageDelivered, "onMessageDelivered"]));
					}
				},
				"onMessageArrived":{
					get: function() { return client.onMessageArrived; },
					set: function(newOnMessageArrived) {
						if (typeof newOnMessageArrived === "function")
							client.onMessageArrived = newOnMessageArrived;
						else
							throw new Error(format(ERROR.INVALID_TYPE, [typeof newOnMessageArrived, "onMessageArrived"]));
					}
				},
				"trace":{
					get: function() { return client.traceFunction; },
					set: function(trace) {
						if(typeof trace === "function"){
							client.traceFunction = trace;
						}else{
							throw new Error(format(ERROR.INVALID_TYPE, [typeof trace, "onTrace"]));
						}
					}
				},
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
				connectOptions = connectOptions || {} ;
				validate(connectOptions,  {timeout:"number",
					userName:"string",
					password:"string",
					willMessage:"object",
					keepAliveInterval:"number",
					cleanSession:"boolean",
					useSSL:"boolean",
					invocationContext:"object",
					onSuccess:"function",
					onFailure:"function",
					hosts:"object",
					ports:"object",
					reconnect:"boolean",
					mqttVersion:"number",
					mqttVersionExplicit:"boolean",
					uris: "object"});

				// If no keep alive interval is set, assume 60 seconds.
				if (connectOptions.keepAliveInterval === undefined)
					connectOptions.keepAliveInterval = 60;

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
				if (connectOptions.password !== undefined && connectOptions.userName === undefined)
					throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.password, "connectOptions.password"]));

				if (connectOptions.willMessage) {
					if (!(connectOptions.willMessage instanceof Message))
						throw new Error(format(ERROR.INVALID_TYPE, [connectOptions.willMessage, "connectOptions.willMessage"]));
					// The will message must have a payload that can be represented as a string.
					// Cause the willMessage to throw an exception if this is not the case.
					connectOptions.willMessage.stringPayload = null;

					if (typeof connectOptions.willMessage.destinationName === "undefined")
						throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.willMessage.destinationName, "connectOptions.willMessage.destinationName"]));
				}
				if (typeof connectOptions.cleanSession === "undefined")
					connectOptions.cleanSession = true;
				if (connectOptions.hosts) {

					if (!(connectOptions.hosts instanceof Array) )
						throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));
					if (connectOptions.hosts.length <1 )
						throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts, "connectOptions.hosts"]));

					var usingURIs = false;
					for (var i = 0; i<connectOptions.hosts.length; i++) {
						if (typeof connectOptions.hosts[i] !== "string")
							throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.hosts[i], "connectOptions.hosts["+i+"]"]));
						if (/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(connectOptions.hosts[i])) {
							if (i === 0) {
								usingURIs = true;
							} else if (!usingURIs) {
								throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts["+i+"]"]));
							}
						} else if (usingURIs) {
							throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.hosts[i], "connectOptions.hosts["+i+"]"]));
						}
					}

					if (!usingURIs) {
						if (!connectOptions.ports)
							throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
						if (!(connectOptions.ports instanceof Array) )
							throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));
						if (connectOptions.hosts.length !== connectOptions.ports.length)
							throw new Error(format(ERROR.INVALID_ARGUMENT, [connectOptions.ports, "connectOptions.ports"]));

						connectOptions.uris = [];

						for (var i = 0; i<connectOptions.hosts.length; i++) {
							if (typeof connectOptions.ports[i] !== "number" || connectOptions.ports[i] < 0)
								throw new Error(format(ERROR.INVALID_TYPE, [typeof connectOptions.ports[i], "connectOptions.ports["+i+"]"]));
							var host = connectOptions.hosts[i];
							var port = connectOptions.ports[i];

							var ipv6 = (host.indexOf(":") !== -1);
							uri = "ws://"+(ipv6?"["+host+"]":host)+":"+port+path;
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
				if (typeof filter !== "string" && filter.constructor !== Array)
					throw new Error("Invalid argument:"+filter);
				subscribeOptions = subscribeOptions || {} ;
				validate(subscribeOptions,  {qos:"number",
					invocationContext:"object",
					onSuccess:"function",
					onFailure:"function",
					timeout:"number"
				});
				if (subscribeOptions.timeout && !subscribeOptions.onFailure)
					throw new Error("subscribeOptions.timeout specified with no onFailure callback.");
				if (typeof subscribeOptions.qos !== "undefined" && !(subscribeOptions.qos === 0 || subscribeOptions.qos === 1 || subscribeOptions.qos === 2 ))
					throw new Error(format(ERROR.INVALID_ARGUMENT, [subscribeOptions.qos, "subscribeOptions.qos"]));
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
				if (typeof filter !== "string" && filter.constructor !== Array)
					throw new Error("Invalid argument:"+filter);
				unsubscribeOptions = unsubscribeOptions || {} ;
				validate(unsubscribeOptions,  {invocationContext:"object",
					onSuccess:"function",
					onFailure:"function",
					timeout:"number"
				});
				if (unsubscribeOptions.timeout && !unsubscribeOptions.onFailure)
					throw new Error("unsubscribeOptions.timeout specified with no onFailure callback.");
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
			this.send = function (topic,payload,qos,retained) {
				var message ;

				if(arguments.length === 0){
					throw new Error("Invalid argument."+"length");

				}else if(arguments.length == 1) {

					if (!(topic instanceof Message) && (typeof topic !== "string"))
						throw new Error("Invalid argument:"+ typeof topic);

					message = topic;
					if (typeof message.destinationName === "undefined")
						throw new Error(format(ERROR.INVALID_ARGUMENT,[message.destinationName,"Message.destinationName"]));
					client.send(message);

				}else {
				//parameter checking in Message object
					message = new Message(payload);
					message.destinationName = topic;
					if(arguments.length >= 3)
						message.qos = qos;
					if(arguments.length >= 4)
						message.retained = retained;
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
			this.publish = function(topic,payload,qos,retained) {
				var message ;

				if(arguments.length === 0){
					throw new Error("Invalid argument."+"length");

				}else if(arguments.length == 1) {

					if (!(topic instanceof Message) && (typeof topic !== "string"))
						throw new Error("Invalid argument:"+ typeof topic);

					message = topic;
					if (typeof message.destinationName === "undefined")
						throw new Error(format(ERROR.INVALID_ARGUMENT,[message.destinationName,"Message.destinationName"]));
					client.send(message);

				}else {
					//parameter checking in Message object
					message = new Message(payload);
					message.destinationName = topic;
					if(arguments.length >= 3)
						message.qos = qos;
					if(arguments.length >= 4)
						message.retained = retained;
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

			this.isConnected = function() {
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
		var Message = function (newPayload) {
			var payload;
			if (   typeof newPayload === "string" ||
		newPayload instanceof ArrayBuffer ||
		(ArrayBuffer.isView(newPayload) && !(newPayload instanceof DataView))
			) {
				payload = newPayload;
			} else {
				throw (format(ERROR.INVALID_ARGUMENT, [newPayload, "newPayload"]));
			}

			var destinationName;
			var qos = 0;
			var retained = false;
			var duplicate = false;

			Object.defineProperties(this,{
				"payloadString":{
					enumerable : true,
					get : function () {
						if (typeof payload === "string")
							return payload;
						else
							return parseUTF8(payload, 0, payload.length);
					}
				},
				"payloadBytes":{
					enumerable: true,
					get: function() {
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
				"destinationName":{
					enumerable: true,
					get: function() { return destinationName; },
					set: function(newDestinationName) {
						if (typeof newDestinationName === "string")
							destinationName = newDestinationName;
						else
							throw new Error(format(ERROR.INVALID_ARGUMENT, [newDestinationName, "newDestinationName"]));
					}
				},
				"qos":{
					enumerable: true,
					get: function() { return qos; },
					set: function(newQos) {
						if (newQos === 0 || newQos === 1 || newQos === 2 )
							qos = newQos;
						else
							throw new Error("Invalid argument:"+newQos);
					}
				},
				"retained":{
					enumerable: true,
					get: function() { return retained; },
					set: function(newRetained) {
						if (typeof newRetained === "boolean")
							retained = newRetained;
						else
							throw new Error(format(ERROR.INVALID_ARGUMENT, [newRetained, "newRetained"]));
					}
				},
				"topic":{
					enumerable: true,
					get: function() { return destinationName; },
					set: function(newTopic) {destinationName=newTopic;}
				},
				"duplicate":{
					enumerable: true,
					get: function() { return duplicate; },
					set: function(newDuplicate) {duplicate=newDuplicate;}
				}
			});
		};

		// Module contents.
		return {
			Client: Client,
			Message: Message
		};
	// eslint-disable-next-line no-nested-ternary
	})(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	return PahoMQTT;
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
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
function defaultClearTimeout () {
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
} ())
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
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
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
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
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
    while(len) {
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

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/srcdoc-polyfill/srcdoc-polyfill.js":
/*!*********************************************************!*\
  !*** ./node_modules/srcdoc-polyfill/srcdoc-polyfill.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
	// `root` does not resolve to the global window object in a Browserified
	// bundle, so a direct reference to that object is used instead.
	var _srcDoc = window.srcDoc;

	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function(exports) {
			factory(exports, _srcDoc);
			root.srcDoc = exports;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
})(this, function(exports, _srcDoc) {
	var idx, iframes;
	var isCompliant = !!("srcdoc" in document.createElement("iframe"));
	var sandboxMsg = "Polyfill may not function in the presence of the " +
		"`sandbox` attribute. Consider using the `force` option.";
	var sandboxAllow = /\ballow-same-origin\b/;
	/**
	 * Determine if the operation may be blocked by the `sandbox` attribute in
	 * some environments, and optionally issue a warning or remove the
	 * attribute.
	 */
	var validate = function( iframe, options ) {
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
		compliant: function( iframe, content, options ) {

			if (content) {
				validate(iframe, options);
				iframe.setAttribute("srcdoc", content);
			}
		},
		legacy: function( iframe, content, options ) {

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
		logError = function(msg) {
			window.console.error("[srcdoc-polyfill] " + msg);
		};
	} else {
		logError = function() {};
	}

	// Assume the best
	srcDoc.set = implementations.compliant;
	srcDoc.noConflict = function() {
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
		srcDoc.set( iframes[idx] );
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
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
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
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

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

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

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

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
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

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
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
/*! exports provided: name, title, version, description, main, keywords, license, scripts, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = {"name":"videojs-mse-over-clsp","title":"CLSP Plugin","version":"0.16.3","description":"Uses clsp (iot) as a video distribution system, video is is received via the clsp client then rendered using the media source extensions. ","main":"dist/videojs-mse-over-clsp.js","keywords":["videojs","videojs-plugin"],"license":"MIT","scripts":{"build":"./scripts/build.sh","serve":"./scripts/serve.sh","serve:vagrant":"WATCH_WITH_POLLING=true yarn run serve","lint":"./scripts/lint.sh","lint-fix":"./scripts/lint.sh --fix","preversion":"./scripts/version.sh --pre","version":"./scripts/version.sh","postversion":"./scripts/version.sh --post"},"dependencies":{"debug":"4.1.1","lodash":"4.17.11","paho-mqtt":"1.1.0"},"devDependencies":{"@babel/core":"7.4.4","@babel/plugin-proposal-class-properties":"7.4.4","@babel/plugin-proposal-object-rest-spread":"7.4.4","@babel/plugin-syntax-dynamic-import":"7.2.0","@babel/polyfill":"7.4.4","@babel/preset-env":"7.4.4","babel-eslint":"10.0.1","babel-loader":"8.0.5","chalk":"2.4.2","css-loader":"2.1.1","eslint":"5.16.0","eslint-config-standard":"12.0.0","eslint-plugin-import":"2.17.2","eslint-plugin-node":"9.0.1","eslint-plugin-promise":"4.1.1","eslint-plugin-standard":"4.0.0","extract-text-webpack-plugin":"4.0.0-beta.0","humanize":"0.0.9","jquery":"3.4.1","moment":"2.24.0","node-sass":"4.12.0","pre-commit":"1.2.2","progress-bar-webpack-plugin":"1.12.1","sass-loader":"7.1.0","srcdoc-polyfill":"1.0.0","standard":"12.0.1","style-loader":"0.23.1","terser-webpack-plugin":"1.2.3","url-loader":"1.1.2","video.js":"7.5.4","videojs-errors":"4.2.0","webpack":"4.31.0","webpack-bundle-analyzer":"3.3.2","webpack-dev-server":"3.3.1","write-file-webpack-plugin":"4.5.0"}};

/***/ }),

/***/ "./src/js/conduit/Conduit.js":
/*!***********************************!*\
  !*** ./src/js/conduit/Conduit.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Conduit; });
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Router */ "./src/js/conduit/Router.js");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/logger */ "./src/js/utils/logger.js");

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a single video. This is basically an in-browser micro service which
 * uses cross-document communication to route data to and from the iframe.
 *
 * This code is a layer of abstraction on top of the mqtt router, and the
 * controller of the iframe that contains the router.
 */

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var MAX_RECONNECTION_ATTEMPTS = 200;

var Conduit =
/*#__PURE__*/
function () {
  _createClass(Conduit, null, [{
    key: "factory",
    value: function factory(clientId, _ref) {
      var iovId = _ref.iovId,
          wsbroker = _ref.wsbroker,
          wsport = _ref.wsport,
          useSSL = _ref.useSSL,
          b64_jwt_access_url = _ref.b64_jwt_access_url,
          jwt = _ref.jwt,
          b64_hash_access_url = _ref.b64_hash_access_url,
          hash = _ref.hash;
      return new Conduit(clientId, {
        iovId: iovId,
        wsbroker: wsbroker,
        wsport: wsport,
        useSSL: useSSL,
        b64_jwt_access_url: b64_jwt_access_url,
        jwt: jwt,
        b64_hash_access_url: b64_hash_access_url,
        hash: hash
      });
    }
    /**
     * @private
     *
     * clientId - the guid to be used to construct the topic
     * iovId - the ID of the parent iov, used for logging purposes
     * wsbroker - the host (url or ip) of the SFS that is providing the stream
     * wsport - the port the stream is served over
     * useSSL - true to request the stream over clsps, false to request the stream over clsp
     * [b64_jwt_access_url] - the "tokenized" url
     * [jwt] - the access token
     */

  }]);

  function Conduit(clientId, _ref2) {
    var iovId = _ref2.iovId,
        wsbroker = _ref2.wsbroker,
        wsport = _ref2.wsport,
        useSSL = _ref2.useSSL,
        b64_jwt_access_url = _ref2.b64_jwt_access_url,
        jwt = _ref2.jwt,
        b64_hash_access_url = _ref2.b64_hash_access_url,
        hash = _ref2.hash;

    _classCallCheck(this, Conduit);

    this.iovId = iovId;
    this.clientId = clientId;
    this.logger = Object(_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])().factory("Conduit ".concat(this.iovId));
    this.logger.debug('Constructing...');
    this.wsbroker = wsbroker;
    this.wsport = wsport;
    this.useSSL = useSSL;
    this.b64_jwt_access_url = b64_jwt_access_url;
    this.jwt = jwt;
    this.b64_hash_access_url = b64_hash_access_url;
    this.hash = hash;
    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.clientId
    };
    this.handlers = {};
    this.reconnectionAttempts = 0;
    this.connected = false;
  }
  /**
   * After constructing, call this to initialize the conduit, which will create
   * the iframe and the Router needed to get the stream from the server.
   *
   * @returns Promise
   *   Resolves when the Router has been successfully created.
   *   Rejects upon failure to create the Router.
   */


  _createClass(Conduit, [{
    key: "initialize",
    value: function initialize(videoElementParent) {
      var _this = this;

      this.logger.debug('Initializing...');
      return new Promise(function (resolve, reject) {
        _this._onRouterCreate = function (event) {
          var clientId = event.data.clientId; // A window message was received that is not related to CLSP

          if (!clientId) {
            return;
          } // This message was intended for another conduit


          if (_this.clientId !== clientId) {
            return;
          }

          var eventType = event.data.event; // Filter out all other window messages

          if (eventType !== 'router_created' && eventType !== 'router_create_failure') {
            return;
          }

          _this.logger.debug("Message received for \"".concat(eventType, "\" event")); // Whether success or failure, remove the event listener


          window.removeEventListener('message', _this._onRouterCreate);
          _this._onRouterCreate = null;

          if (eventType === 'router_create_failure') {
            return reject(event.data.reason);
          }

          resolve();
        }; // When the Router in the iframe connects, it will broadcast a message
        // letting us know it connected, or letting us know it failed.


        window.addEventListener('message', _this._onRouterCreate);
        _this.iframe = _this._generateIframe();
        videoElementParent.appendChild(_this.iframe);
      });
    }
    /**
     * After initialization, call this to establish the connection to the server.
     *
     * Note that this is called within the play method, so you shouldn't ever need
     * to manually call `connect`.
     *
     * @returns Promise
     *   Resolves when the connection is successfully established.
     *   Rejects upon failure to connect after a number of retries.
     */

  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;

      this.logger.debug('Connecting to MQTT server...');
      return new Promise(function (resolve, reject) {
        _this2._onConnect = function (event) {
          var clientId = event.data.clientId; // A window message was received that is not related to CLSP

          if (!clientId) {
            return;
          } // This message was intended for another conduit


          if (_this2.clientId !== clientId) {
            return;
          }

          var eventType = event.data.event; // Filter out all other window messages

          if (eventType !== 'connect_success' && eventType !== 'connect_failure') {
            return;
          }

          _this2.logger.debug("Message received for \"".concat(eventType, "\" event")); // Whether success or failure, remove the event listener


          window.removeEventListener('message', _this2._onConnect);
          _this2._onConnect = null;

          if (eventType === 'connect_failure') {
            _this2.logger.error(new Error(event.data.reason));

            _this2._reconnect().then(resolve)["catch"](reject);

            return;
          } // the mse service will stop streaming to us if we don't send
          // a message to iov/stats within 1 minute.


          _this2._statsTimer = setInterval(function () {
            _this2._publishStats();
          }, 5000);
          _this2.connected = true;
          resolve();
        };

        window.addEventListener('message', _this2._onConnect);

        _this2._command({
          method: 'connect'
        });
      });
    }
    /**
     * Called many times, each time a moof (segment) is received
     *
     * @callback Conduit-onMoof
     * @param {any} moof - a stream segment
     */

    /**
     * If the JWT is valid or if we are not using a JWT, perform the necessary
     * conduit operations to retrieve stream segments (moofs).  The actual
     * "playing" occurs in the player, since it involves taking those received
     * stream segments and using MSE to display them.
     *
     * @param {string} streamName - the name of the stream to get segments for
     * @param {Conduit-onMoof} onMoof - the function that will handle the moof
     */

  }, {
    key: "play",
    value: function () {
      var _play = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(streamName, onMoof) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.connect();

              case 2:
                if (!(this.jwt.length > 0)) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 5;
                return this.validateJwt();

              case 5:
                streamName = _context2.sent;
                _context2.next = 12;
                break;

              case 8:
                if (!(this.hash.length > 0)) {
                  _context2.next = 12;
                  break;
                }

                _context2.next = 11;
                return this.validateHash();

              case 11:
                streamName = _context2.sent;

              case 12:
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  try {
                    _this3.requestStream(streamName, function (_ref3) {
                      var mimeCodec = _ref3.mimeCodec,
                          guid = _ref3.guid;
                      _this3.guid = guid;
                      var initSegmentTopic = "".concat(_this3.clientId, "/init-segment/").concat(parseInt(Math.random() * 1000000)); // Set up the listener for the stream init

                      _this3.subscribe(initSegmentTopic,
                      /*#__PURE__*/
                      function () {
                        var _ref5 = _asyncToGenerator(
                        /*#__PURE__*/
                        regeneratorRuntime.mark(function _callee(_ref4) {
                          var payloadBytes, moov, newTopic;
                          return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  payloadBytes = _ref4.payloadBytes;
                                  moov = payloadBytes;

                                  _this3.unsubscribe(initSegmentTopic);

                                  newTopic = "iov/video/".concat(guid, "/live"); // Set up the listener for the stream itself

                                  _this3.subscribe(newTopic, function (mqttMessage) {
                                    if (onMoof) {
                                      onMoof(mqttMessage);
                                    }
                                  });

                                  resolve({
                                    guid: guid,
                                    mimeCodec: mimeCodec,
                                    moov: moov
                                  });

                                case 6:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        }));

                        return function (_x3) {
                          return _ref5.apply(this, arguments);
                        };
                      }()); // Ask the server for the stream


                      _this3.publish("iov/video/".concat(_this3.guid, "/play"), {
                        initSegmentTopic: initSegmentTopic,
                        clientId: _this3.clientId,
                        jwt: _this3.jwt
                      });
                    });
                  } catch (error) {
                    reject(error);
                  }
                }));

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function play(_x, _x2) {
        return _play.apply(this, arguments);
      }

      return play;
    }()
    /**
     * Disconnect from the mqtt server
     *
     * @todo - return a promise that resolves when the disconnection is complete
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      this.logger.debug('Disconnecting...');
      this.connected = false; // when a stream fails, it no longer needs to send stats to the
      // server, and it may not even be connected to the server

      clearInterval(this._statsTimer);

      this._command({
        method: 'disconnect'
      });
    }
    /**
     * Stop the playing stream
     *
     * @todo - make this async and await the disconnection, and maybe even the
     * unsubscribes
     */

  }, {
    key: "stop",
    value: function stop() {
      this.logger.debug('Stopping stream...');

      if (!this.guid) {
        this.logger.warn('No guid, so not stopping stream...');
        return;
      } // Stop listening for moofs


      this.unsubscribe("iov/video/".concat(this.guid, "/live")); // Stop listening for resync events

      this.unsubscribe("iov/video/".concat(this.guid, "/resync")); // Tell the server we've stopped

      this.publish("iov/video/".concat(this.guid, "/stop"), {
        clientId: this.clientId
      });
      this.disconnect();
    }
    /**
     * Validate the jwt that this conduit was constructed with.
     *
     * @returns Promise
     *   Resolves the streamName when the response is received AND is successful.
     *   Rejects if the transaction fails or if the response code is not 200.
     */

  }, {
    key: "validateJwt",
    value: function validateJwt() {
      var _this4 = this;

      this.logger.debug('Validating JWT...');
      return new Promise(function (resolve, reject) {
        try {
          _this4.transaction('iov/jwtValidate', {
            b64_access_url: _this4.b64_jwt_access_url,
            token: _this4.jwt
          }, function (response) {
            // response ->  {"status": 200, "target_url": "clsp://sfs1/fakestream", "error": null}
            if (response.status !== 200) {
              if (response.status === 403) {
                return reject(new Error('JwtUnAuthorized'));
              }

              return reject(new Error('JwtInvalid'));
            } //TODO, figure out how to handle a change in the sfs url from the
            // clsp-jwt from the target url returned from decrypting the jwt
            // token.
            // Example:
            //    user enters 'clsp-jwt://sfs1/jwt?Start=0&End=...' for source
            //    clspUrl = 'clsp://SFS2/streamOnDifferentSfs
            // --- due to the videojs architecture i don't see a clean way of doing this.
            // ==============================================================================
            //    The only way I can see doing this cleanly is to change videojs itself to
            //    allow the 'canHandleSource' function in MqttSourceHandler to return a
            //    promise not a value, then ascychronously find out if it can play this
            //    source after making the call to decrypt the jwt token.22
            // =============================================================================
            // Note: this could go away in architecture 2.0 if MQTT was a cluster in this
            // case what is now the sfs ip address in clsp url will always be the same it will
            // be the public ip of cluster gateway.


            var t = response.target_url.split('/'); // get the actual stream name

            var streamName = t[t.length - 1];
            resolve(streamName);
          });
        } catch (error) {
          reject(error);
        }
      });
    }
    /**
     * Validate the hash that this conduit was constructed with.
     *
     * @returns Promise
     *   Resolves the streamName when the response is received AND is successful.
     *   Rejects if the transaction fails or if the response code is not 200.
     */

  }, {
    key: "validateHash",
    value: function validateHash() {
      var _this5 = this;

      this.logger.debug('Validating Hash...');
      return new Promise(function (resolve, reject) {
        try {
          _this5.transaction('iov/hashValidate', {
            b64HashURL: _this5.b64_hash_access_url,
            token: _this5.hash
          }, function (response) {
            // response ->  {"status": 200, "target_url": "clsp://sfs1/fakestream", "error": null}
            if (response.status !== 200) {
              if (response.status === 403) {
                return reject(new Error('HashUnAuthorized'));
              }

              return reject(new Error('HashInvalid'));
            } //TODO, figure out how to handle a change in the sfs url from the
            // clsp-hash from the target url returned from decrypting the hash
            // token.
            // Example:
            //    user enters 'clsp-hash://sfs1/hash?start=0&end=...&token=...' for source
            //    clspUrl = 'clsp://SFS2/streamOnDifferentSfs
            // --- due to the videojs architecture i don't see a clean way of doing this.
            // ==============================================================================
            //    The only way I can see doing this cleanly is to change videojs itself to
            //    allow the 'canHandleSource' function in MqttSourceHandler to return a
            //    promise not a value, then ascychronously find out if it can play this
            //    source after making the call to decrypt the hash token.22
            // =============================================================================
            // Note: this could go away in architecture 2.0 if MQTT was a cluster in this
            // case what is now the sfs ip address in clsp url will always be the same it will
            // be the public ip of cluster gateway.


            var t = response.target_url.split('/'); // get the actual stream name

            var streamName = t[t.length - 1];
            resolve(streamName);
          });
        } catch (error) {
          reject(error);
        }
      });
    }
    /**
     * Get the `guid` and `mimeCodec` for the stream
     *
     * @todo - return a Promise
     *
     * @param {string} streamName - the name of the stream
     * @param {Conduit-requestStreamCallback} cb
     *
     * @returns {void}
     */

  }, {
    key: "requestStream",
    value: function requestStream(streamName, cb) {
      this.logger.debug('Requesting Stream...');
      this.transaction("iov/video/".concat(window.btoa(streamName), "/request"), {
        clientId: this.clientId
      }, cb);
    }
    /**
     * @callback Conduit-resyncStreamCb
     * @param {any} - @todo - document this
     */

    /**
     * @todo - provide method description
     *
     * @todo - return a Promise
     *
     * @param {Conduit-resyncStreamCb} cb
     *   The callback for the resync operation
     */

  }, {
    key: "resyncStream",
    value: function resyncStream(cb) {
      // subscribe to a sync topic that will be called if the stream that is feeding
      // the mse service dies and has to be restarted that this player should restart the stream
      this.subscribe("iov/video/".concat(this.guid, "/resync"), cb);
    }
    /**
     * @callback Conduit-getStreamListCallback
     * @param {any} - the list of available CLSP streams on the SFS
     */

    /**
     * Get the list of available CLSP streams from the SFS
     *
     * @todo - return a Promise
     *
     * @param {Conduit-getStreamListCallback} cb
     *
     * @returns {void}
     */

  }, {
    key: "getStreamList",
    value: function getStreamList(cb) {
      this.logger.debug('Getting Stream List...');
      this.transaction('iov/video/list', {}, cb);
    }
    /**
     * Clean up and dereference the necessary properties.  Will also disconnect
     * and destroy the iframe.
     *
     * @todo - return a Promise, but do not wait for the promise to resolve to
     * continue the destroy logic.  the promise should resolve/reject based on
     * the disconnect method call
     *
     * @returns {void}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.logger.debug('Destroying...');

      if (this.destroyed) {
        return;
      }

      this.destroyed = true;
      clearInterval(this._statsTimer);

      if (this._onConnect) {
        window.removeEventListener('message', this._onConnect);
        this._onConnect = null;
      }

      if (this._onRouterCreate) {
        window.removeEventListener('message', this._onRouterCreate);
        this._onRouterCreate = null;
      }

      this.disconnect();
      this.clientId = null;
      this.wsbroker = null;
      this.wsport = null;
      this.useSSL = null;
      this.b64_jwt_access_url = null;
      this.jwt = null; // Destroy iframe

      this.iframe.parentNode.removeChild(this.iframe); // this.iframe.remove();

      this.iframe.srcdoc = '';
      this.iframe = null;
      this.handlers = null;
      this.reconnectionAttempts = null;
    }
    /**
     * Handler for an iframe window message.
     *
     * @param {Object} event
     *   We expect event to have "data.event", which represents the event that
     *   occurred relative to the clsp stream.  "ready" means the stream is ready,
     *   "fail" means there was an error, "data" means a video segment / moof was
     *   sent.
     */

  }, {
    key: "onMessage",
    value: function onMessage(event) {
      var eventType = event.data.event;
      this.logger.debug("Message received for \"".concat(eventType, "\" event"));

      switch (eventType) {
        case 'mqtt_data':
          {
            this._onMqttData(event.data);

            break;
          }

        case 'connection_lost':
          {
            this.disconnect();

            this._reconnect();

            break;
          }

        case 'window_message_fail':
          {
            // @todo - do we really need to disconnect?
            this.disconnect();
            break;
          }

        case 'router_created':
        case 'connect_success':
        case 'disconnect_success':
          {
            break;
          }

        default:
          {
            this.logger.error("No match for event: ".concat(eventType));
          }
      }
    }
    /**
     * To be called when a segment / moof is "shown".  In realistic terms, this is
     * meant to be called when the moof is appended to the MSE SourceBuffer.  This
     * method is meant to update stats.
     *
     * @param {Array} byteArray
     *   The raw segment / moof
     */

  }, {
    key: "segmentUsed",
    value: function segmentUsed(byteArray) {
      // @todo - it appears that this is never used!
      if (this.LogSourceBuffer === true && this.LogSourceBufferTopic !== null) {
        this.directSend({
          method: 'send',
          topic: this.LogSourceBufferTopic,
          byteArray: byteArray
        });
      }

      this.statsMsg.byteCount += byteArray.length;
    }
    /**
     * Every time a segment / moof is received from the server, it should be
     * passed to this method
     *
     * @param {*} message
     */

  }, {
    key: "_onMqttData",
    value: function _onMqttData(message) {
      var topic = message.destinationName;
      this.logger.debug("Handling message for topic \"".concat(topic, "\""));

      if (!topic) {
        throw new Error('Message contained no topic to handle!');
      }

      var handler = this.handlers[topic];

      if (!handler) {
        throw new Error("No handler for ".concat(topic));
      }

      handler(message);
    }
    /**
     * @todo - provide method description
     *
     * @todo - return a Promise
     *
     * @param {String} topic
     *   The topic to subscribe to
     * @param {Conduit-subscribeCb} cb
     *   The callback for the subscribe operation
     */

  }, {
    key: "subscribe",
    value: function subscribe(topic, handler) {
      this.logger.debug("Subscribing to topic \"".concat(topic, "\""));
      this.handlers[topic] = handler;

      this._command({
        method: 'subscribe',
        topic: topic
      });
    }
    /**
     * @todo - provide method description
     *
     * @todo - return a Promise
     *
     * @param {String} topic
     *   The topic to unsubscribe from
     */

  }, {
    key: "unsubscribe",
    value: function unsubscribe(topic) {
      this.logger.debug("Unsubscribing from topic \"".concat(topic, "\""));
      delete this.handlers[topic];

      this._command({
        method: 'unsubscribe',
        topic: topic
      });
    }
    /**
     * @todo - provide method description
     *
     * @todo - return a Promise
     *
     * @param {String} topic
     *   The topic to publish to
     * @param {Object} data
     *   The data to publish
     */

  }, {
    key: "publish",
    value: function publish(topic, data) {
      this.logger.debug("Publishing to topic \"".concat(topic, "\""));

      this._command({
        method: 'publish',
        topic: topic,
        data: data
      });
    }
    /**
     * @todo - provide method description
     *
     * @todo - return a Promise
     *
     * @param {String} topic
     *   The topic to send to
     * @param {Array} byteArray
     *   The raw data to send
     */

  }, {
    key: "directSend",
    value: function directSend(topic, byteArray) {
      this.logger.debug('directSend...');

      this._command({
        method: 'send',
        topic: topic,
        byteArray: byteArray
      });
    }
    /**
     * @todo - provide method description
     *
     * @todo - return a Promise
     *
     * @param {String} topic
     *   The topic to perform a transaction on
     * @param {Object} messageData
     *   The data to be published
     * @param {Conduit-transactionCb} cb
     */

  }, {
    key: "transaction",
    value: function transaction(topic) {
      var _this6 = this;

      var messageData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cb = arguments.length > 2 ? arguments[2] : undefined;
      this.logger.debug('transaction...');
      messageData.resp_topic = "".concat(this.clientId, "/response/").concat(parseInt(Math.random() * 1000000));
      this.subscribe(messageData.resp_topic, function (response) {
        if (cb) {
          cb(JSON.parse(response.payloadString));
        }

        _this6.unsubscribe(messageData.resp_topic);
      });
      this.publish(topic, messageData);
    }
    /**
     * @private
     *
     * Generate an iframe with an embedded mqtt router.  The router will be what
     * this Conduit instance communicates with in subsequent commands.
     *
     * @returns Element
     */

  }, {
    key: "_generateIframe",
    value: function _generateIframe() {
      this.logger.debug('Generating Iframe...');
      var iframe = document.createElement('iframe');
      iframe.setAttribute('id', this.clientId); // This iframe should be invisible

      iframe.width = 0;
      iframe.height = 0;
      iframe.setAttribute('style', 'display:none;');
      iframe.srcdoc = "\n      <html>\n        <head>\n          <script type=\"text/javascript\">\n            // Include the logger\n            window.Logger = ".concat(_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"].toString(), ";\n\n            // Configure the CLSP properties\n            window.mqttRouterConfig = {\n              iovId: '").concat(this.iovId, "',\n              clientId: '").concat(this.clientId, "',\n              host: '").concat(this.wsbroker, "',\n              port: ").concat(this.wsport, ",\n              useSSL: ").concat(this.useSSL, ",\n            };\n\n            window.iframeEventHandlers = ").concat(_Router__WEBPACK_IMPORTED_MODULE_0__["default"].toString(), "();\n          </script>\n        </head>\n        <body\n          onload=\"window.iframeEventHandlers.onload();\"\n          onunload=\"window.iframeEventHandlers.onunload();\"\n        >\n          <div id=\"message\"></div>\n        </body>\n      </html>\n    ");
      return iframe;
    }
    /**
     * Attempt to reconnect a certain number of times
     *
     * @returns Promise
     *   Resolves when the connection is successfully established
     *   Rejects when the connection fails
     */

  }, {
    key: "_reconnect",
    value: function () {
      var _reconnect2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.reconnectionAttempts++;

                if (!(this.reconnectionAttempts > MAX_RECONNECTION_ATTEMPTS)) {
                  _context3.next = 3;
                  break;
                }

                throw new Error("Failed to reconnect after ".concat(this.reconnectionAttempts, " attempts."));

              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return this.connect();

              case 6:
                this.reconnectionAttempts = 0;
                _context3.next = 13;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](3);
                this.logger.error(_context3.t0);

                this._reconnect();

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 9]]);
      }));

      function _reconnect() {
        return _reconnect2.apply(this, arguments);
      }

      return _reconnect;
    }()
    /**
     * @private
     *
     * Pass an mqtt command to the iframe.
     *
     * @param {Object} message
     */

  }, {
    key: "_command",
    value: function _command(message) {
      this.logger.debug('Sending a message to the iframe...');

      try {
        // @todo - we should not be dispatching to '*' - we should provide the SFS
        // host here instead
        // @see - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
        this.iframe.contentWindow.postMessage(message, '*');
      } catch (error) {
        // @todo - we should probably throw here...
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
    /**
     * @private
     *
     * Send stats to the server
     */

  }, {
    key: "_publishStats",
    value: function _publishStats() {
      this.statsMsg.inkbps = this.statsMsg.byteCount * 8 / 30000.0;
      this.statsMsg.byteCount = 0;
      this.publish('iov/stats', this.statsMsg);
      this.logger.debug('iov status', this.statsMsg);
    }
  }]);

  return Conduit;
}();



/***/ }),

/***/ "./src/js/conduit/Router.js":
/*!**********************************!*\
  !*** ./src/js/conduit/Router.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

/**
 * This is the lowest level controller of the actual mqtt connection.
 *
 * Note that this is the code that gets duplicated in each iframe.
 * Keep the contents of the exported function light and ES5 only.
 *
 * @todo - have a custom loader for webpack that can convert this to ES5 and
 * minify it in a self-contained way at the time it is required so that we can
 * use ES6 and multiple files.
 *
 * @todo - should all thrown errors send a message to the parent Conduit?
 */

/**
 * This router will manage an MQTT connection for a given clientId, and pass
 * the relevant data and messages back up to the conduit.
 *
 * @see - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
 * @see - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body
 * @see - https://www.eclipse.org/paho/files/jsdoc/index.html
 *
 * The following events are sent to the parent window:
 *
 * router_created
 *   when the router creation is finished.
 *   can only happen at time of router instantiation.
 * router_create_failure
 *   when the router creation fails.
 *   can only happen at time of router instantiation.
 * mqtt_data
 *   when a segment / moof is transmitted.
 *   can happen for as long as the connection is open.
 * connect_success
 *   when the connection to the mqtt server is established.can only happen at time of connection.
 * connect_failure
 *   when trying to connect to the mqtt server fails.
 *   can only happen at time of connection.
 * connection_lost
 *   when the connection to the mqtt server has been established, but is later lost.
 *   can happen for as long as the connection is open.
 * disconnect_success
 *   when the connection to the mqtt server is terminated normally.
 *   can only happen at time of disconnection.
 * subscribe_failure
 *   when trying to subscribe to a topic fails.
 *   can only happen when a subscribe is attempted.
 * unsubscribe_failure
 *   when trying to unsubscribe from a topic fails.
 *   can only happen when an unsubscribe is attempted.
 * window_message_fail
 *   when an error is encountered while processing window messages.
 *   can happen any time.
 *
 * @export - the function that provides the Router and constants
 */

/* harmony default export */ __webpack_exports__["default"] = (function () {
  // The error code from paho mqtt that represents the socket not being
  // connected
  var PAHO_MQTT_ERROR_CODE_NOT_CONNECTED = 'AMQJS0011E';
  var PAHO_MQTT_ERROR_CODE_ALREADY_CONNECTED = 'AMQJS0011E';
  var Paho = window.parent.Paho;
  /**
   * @todo - define this as a class, and in a different file.  This will require
   * a change the way webpack processes the file though...
   *
   * A Router that can be used to set up an MQTT connection to the specified
   * host and port, using a conduit-provided clientId that will be a part of every
   * message that is passed from this iframe window to the parent window, so
   * that the conduit can identify what client the message is for.
   *
   * @param {String} iovId
   *   the ID of the parent iov, used for logging purposes
   * @param {String} clientId
   *   the guid to be used to construct the topic
   * @param {String} host
   *   the host (url or ip) of the SFS that is providing the stream
   * @param {Number} port
   *   the port the stream is served over
   * @param {Boolean} useSSL
   *   true to request the stream over clsps, false to request the stream over clsp
   */

  function Router(iovId, clientId, host, port, useSSL) {
    try {
      this.iovId = iovId;
      this.logger = window.Logger().factory("Router ".concat(this.iovId));
      this.clientId = clientId;
      this.host = host;
      this.port = port;
      this.useSSL = useSSL;
      this.logger.debug('Constructing...');
      this.retryInterval = 2000;
      this.Reconnect = null;
      this.connectionTimeout = 120; // @todo - there is a "private" method named "_doConnect" in the paho mqtt
      // library that is responsible for instantiating the WebSocket.  We have
      // seen at least 1 instance where the instantiation of the WebSocket fails
      // which was due to the error "ERR_NAME_NOT_RESOLVED", but it does not
      // seem like this error is "passed" up to the caller (e.g. Router.connect)
      // and therefore we cannot respond to it.  If we could, perhaps we could
      // attempt to reconnect, or at least send a message to Router's parent.
      // Given this, should we override Paho.MQTT.Client._doConnect and wrap
      // the original prototype method call in a try/catch that we can control
      // and respond to?  I'm not even sure that that would solve the problem.
      // Presumably, the instantiation of the WebSocket would throw, which would
      // be caught by our Router.connect try/catch block...

      this.mqttClient = new Paho.MQTT.Client(this.host, this.port, '/mqtt', this.clientId);
      this.mqttClient.onConnectionLost = this._onConnectionLost.bind(this);
      this.mqttClient.onMessageArrived = this._onMessageArrived.bind(this);
      this.boundWindowMessageEventHandler = this._windowMessageEventHandler.bind(this);
      window.addEventListener('message', this.boundWindowMessageEventHandler, false);
    } catch (error) {
      this.logger.error('IFRAME error for clientId: ' + clientId);
      this.logger.error(error);
    }
  }
  /**
   * @private
   *
   * Post a "message" with the current `clientId` to the parent window.
   *
   * @param {Object} message
   *   The message to send to the parent window
   *
   * @returns {void}
   */


  Router.prototype._sendToParent = function (message) {
    this.logger.debug('Sending message to parent window...');

    if (typeof message !== 'object') {
      throw new Error('_sendToParent must be passed an object');
    }

    message.clientId = this.clientId;

    switch (message.event) {
      case 'router_created':
      case 'connect_success':
      case 'disconnect_success':
        {
          // no validation needed
          break;
        }

      case 'mqtt_data':
        {
          if (!message.hasOwnProperty('destinationName') || !message.hasOwnProperty('payloadString') || !message.hasOwnProperty('payloadBytes')) {
            throw new Error('improperly formatted "data" message sent to _sendToParent');
          }

          break;
        }

      case 'connect_failure':
      case 'connection_lost':
      case 'subscribe_failure':
      case 'unsubscribe_failure':
      case 'window_message_fail':
        {
          if (!message.hasOwnProperty('reason')) {
            throw new Error('improperly formatted "fail" message sent to _sendToParent');
          }

          break;
        }

      default:
        {
          throw new Error('Unknown event ' + message.event + ' sent to _sendToParent');
        }
    }

    try {
      window.parent.postMessage(message, '*');
    } catch (error) {
      // When the connection to the SFS fails, and the conduit is destroyed,
      // there is still a message that is attempted to be sent to the parent.
      // In this case, the only way this "orphaned" iframe object can
      // communicate with the console is by throwing an error.  Therefore, it is
      // difficult to debug and I do not know what the final message is.  Having
      // the error written to the console here will still allow errors under
      // "normal" operations to be written to the console, but will suppress the
      // final unwanted error.
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  /**
   * @private
   *
   * To be called when a message has arrived in this Paho.MQTT.client
   *
   * The idea here is that when the server sends an mqtt message, whether a
   * moof, moov, or something else, that data needs to be sent to the appropriate
   * player (client).  So when this router gets that chunk of data, it sends it
   * back to the conduit with the clientId, and the conduit is then responsible
   * for passing it to the appropriate player.
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {Object} mqttMessage
   *   The incoming message
   *
   * @returns {void}
   */


  Router.prototype._onMessageArrived = function (mqttMessage) {
    this.logger.debug('Received MQTT message...');

    try {
      var payloadString = '';

      try {
        payloadString = mqttMessage.payloadString;
      } catch (error) {// I have no idea what is going on here, but every single time we do the
        // assignment above, an error is thrown.  When I console.log(payloadString)
        // it appears to be an empty string.  However, if that assignment is not
        // done, no video gets displayed!!
        // There should be some way to only use the payloadBytes here...
      }

      this._sendToParent({
        event: 'mqtt_data',
        destinationName: mqttMessage.destinationName,
        payloadString: payloadString,
        // @todo - why is this necessary when it doesn't exist?
        payloadBytes: mqttMessage.payloadBytes || null
      });
    } catch (error) {
      this.logger.error(error);
    }
  };
  /**
   * @private
   *
   * called when an mqttClient connection has been lost, or after a connect()
   * method has succeeded.
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */


  Router.prototype._onConnectionLost = function (response) {
    this.logger.warn('MQTT connection lost!');
    var errorCode = parseInt(response.errorCode);

    if (errorCode === 0) {
      // The connection was "properly" terminated
      this._sendToParent({
        event: 'disconnect_success'
      });

      return;
    }

    this._sendToParent({
      event: 'connection_lost',
      reason: 'connection lost error code "' + errorCode + '" with message: ' + response.errorMessage
    });
  };
  /**
   * @private
   *
   * Any time a "message" event occurs on the window respond to it by inspecting
   * the messages "method" property and taking the appropriate action.
   *
   * @param {Object} event
   *   The window message event
   *
   * @returns {void}
   */


  Router.prototype._windowMessageEventHandler = function (event) {
    var message = event.data;
    var method = message.method;
    this.logger.debug('Handling incoming window message for "' + method + '"...');

    try {
      switch (method) {
        case 'subscribe':
          {
            this._subscribe(message.topic);

            break;
          }

        case 'unsubscribe':
          {
            this._unsubscribe(message.topic);

            break;
          }

        case 'publish':
          {
            var payload = null;

            try {
              payload = JSON.stringify(message.data);
            } catch (error) {
              this.logger.error('ERROR: Unable to handle the "publish" window message event!');
              this.logger.error('json stringify error: ' + message.data); // @todo - should we throw here?
              // throw error;

              return;
            }

            this._publish(payload, message.topic);

            break;
          }

        case 'connect':
          {
            this.connect();
            break;
          }

        case 'disconnect':
          {
            this.disconnect();
            break;
          }

        case 'send':
          {
            this._publish(message.byteArray, message.topic);

            break;
          }

        default:
          {
            this.logger.error('unknown message method: ' + method);
          }
      }
    } catch (error) {
      this.logger.error(error);

      this._sendToParent({
        event: 'window_message_fail',
        reason: 'window message event failure'
      });
    }
  };
  /**
   * @private
   *
   * Success handler for "connect".  Registers the window message event handler,
   * and notifies the parent window that this client is "ready".
   *
   * @todo - track the "connected" status to prevent multiple window message
   * event handlers from being attached
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */


  Router.prototype._connect_onSuccess = function (response) {
    this.logger.info('Successfully established MQTT connection');

    this._sendToParent({
      event: 'connect_success'
    });
  };
  /**
   * @private
   *
   * Failure handler for "connect".  Sends a "fail" message to the parent
   * window
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */


  Router.prototype._connect_onFailure = function (response) {
    this.logger.info('MQTT Connection Failure!');

    this._sendToParent({
      event: 'connect_failure',
      reason: 'Connection Failed - Error code ' + parseInt(response.errorCode) + ': ' + response.errorMessage
    });
  };
  /**
   * @private
   *
   * Success handler for "subscribe".
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic that was successfully subscribed to
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */


  Router.prototype._subscribe_onSuccess = function (topic, response) {
    this.logger.debug('Successfully subscribed to topic "' + topic + '"'); // @todo
  };
  /**
   * @private
   *
   * Failure handler for "subscribe".  Sends a "fail" message to the parent
   * window
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic that was attempted to be subscribed to
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */


  Router.prototype._subscribe_onFailure = function (topic, response) {
    this.logger.error('Failed to subscribe to topic "' + topic + '"');

    this._sendToParent({
      event: 'subscribe_failure',
      reason: 'Subscribe Failed - Error code ' + parseInt(response.errorCode) + ': ' + response.errorMessage
    });
  };
  /**
   * @private
   *
   * Start receiving messages for the given topic
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic to subscribe to
   *
   * @returns {void}
   */


  Router.prototype._subscribe = function (topic) {
    this.logger.debug('Subscribing to topic "' + topic + '"');

    if (!topic) {
      throw new Error('topic is a required argument when subscribing');
    }

    this.mqttClient.subscribe(topic, {
      onSuccess: this._subscribe_onSuccess.bind(this, topic),
      onFailure: this._subscribe_onFailure.bind(this, topic)
    });
  };
  /**
   * @private
   *
   * Success handler for "unsubscribe".
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic that was successfully unsubscribed from
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */


  Router.prototype._unsubscribe_onSuccess = function (topic, response) {
    this.logger.debug('Successfully unsubscribed from topic "' + topic + '"'); // @todo
  };
  /**
   * @private
   *
   * Failure handler for "unsubscribe".  Sends a "fail" message to the parent
   * window
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic that was successfully subscribed to
   * @param {Object} response
   *   The response object
   *
   * @returns {void}
   */


  Router.prototype._unsubscribe_onFailure = function (topic, response) {
    this.logger.debug('Failed to unsubscribe from topic "' + topic + '"');

    this._sendToParent({
      event: 'unsubscribe_failure',
      reason: 'Unsubscribe Failed - Error code ' + parseInt(response.errorCode) + ': ' + response.errorMessage
    });
  };
  /**
   * @private
   *
   * Stop receiving messages for the given topic
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @param {String} topic
   *   The topic to unsubscribe from
   *
   * @returns {void}
   */


  Router.prototype._unsubscribe = function (topic) {
    this.logger.debug('Unsubscribing from topic "' + topic + '"');

    if (!topic) {
      throw new Error('topic is a required argument when unsubscribing');
    }

    this.mqttClient.unsubscribe(topic, {
      onSuccess: this._unsubscribe_onSuccess.bind(this, topic),
      onFailure: this._unsubscribe_onFailure.bind(this, topic)
    });
  };
  /**
   * @private
   *
   * Publish a message to the clients that are listening for the given topic
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Message.html
   *
   * @param {String|ArrayBuffer} payload
   *   The message data to be sent
   * @param {String} topic
   *   The topic to publish to
   *
   * @returns {void}
   */


  Router.prototype._publish = function (payload, topic) {
    this.logger.debug('Publishing to topic "' + topic + '"');

    if (!payload) {
      throw new Error('payload is a required argument when publishing');
    }

    if (!topic) {
      throw new Error('topic is a required argument when publishing');
    }

    var mqttMessage = new Paho.MQTT.Message(payload);
    mqttMessage.destinationName = topic;
    this.mqttClient.send(mqttMessage);
  };
  /**
   * Connect this Messaging client to its server
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Message.html
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @returns {void}
   */


  Router.prototype.connect = function () {
    this.logger.info('Connecting...'); // last will message sent on disconnect

    var willMessage = new Paho.MQTT.Message(JSON.stringify({
      clientId: this.clientId
    }));
    willMessage.destinationName = 'iov/clientDisconnect';
    var connectionOptions = {
      timeout: this.connectionTimeout,
      onSuccess: this._connect_onSuccess.bind(this),
      onFailure: this._connect_onFailure.bind(this),
      willMessage: willMessage // @todo - should `reconnect` be set here?

    };

    if (this.useSSL === true) {
      connectionOptions.useSSL = true;
    }

    try {
      this.mqttClient.connect(connectionOptions);
      this.logger.info('Connected');
    } catch (error) {
      if (error.message.startsWith(PAHO_MQTT_ERROR_CODE_ALREADY_CONNECTED)) {
        // if we're already connected, there's no error to report
        return;
      }

      this.logger.error('Failed to connect', error);

      this._sendToParent({
        event: 'connect_failure',
        reason: 'General error when trying to connect.'
      });
    }
  };
  /**
   * Disconnect the messaging client from the server
   *
   * @see - https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
   *
   * @returns {void}
   */


  Router.prototype.disconnect = function () {
    this.logger.info('Disconnecting');

    try {
      this.mqttClient.disconnect();
    } catch (error) {
      if (error.message.startsWith(PAHO_MQTT_ERROR_CODE_NOT_CONNECTED)) {
        // if we're not connected when we attempted to disconnect, there's no
        // error to report
        return;
      }

      this.logger.error('ERROR while disconnecting');
      this.logger.error(error);
      throw error;
    }
  }; // This is a series of "controllers" to keep the conduit's iframe as dumb as
  // possible.  Call each of these in the corresponding attribute on the
  // "body" tag.


  return {
    onload: function onload() {
      try {
        window.router = new Router(window.mqttRouterConfig.iovId, window.mqttRouterConfig.clientId, window.mqttRouterConfig.host, window.mqttRouterConfig.port, window.mqttRouterConfig.useSSL);

        window.router._sendToParent({
          event: 'router_created'
        });

        window.router.logger.info('onload - Router created');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        window.parent.postMessage({
          event: 'router_create_failure',
          reason: error
        }, '*');
      }
    },
    onunload: function onunload() {
      if (!window.router) {
        return;
      } // @todo - do we need destroy logic?  or does the destruction of the
      // iframe handle all dereferences for us?


      try {
        window.router.logger.info('onunload - Router disconnecting in onunload...');
        window.router.disconnect();
        window.router.logger.info('onunload - Router disconnected in onunload');
      } catch (error) {
        if (error.message.startsWith(PAHO_MQTT_ERROR_CODE_NOT_CONNECTED)) {
          // if there wasn't a connection, do not show an error
          return;
        }

        window.router.logger.error(error);
      }
    }
  };
});

/***/ }),

/***/ "./src/js/iov/IOV.js":
/*!***************************!*\
  !*** ./src/js/iov/IOV.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return IOV; });
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _conduit_Conduit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../conduit/Conduit */ "./src/js/conduit/Conduit.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player */ "./src/js/iov/player.js");
/* harmony import */ var _MSEWrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MSEWrapper */ "./src/js/iov/MSEWrapper.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./src/js/utils/index.js");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/logger */ "./src/js/utils/logger.js");


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

var IOV =
/*#__PURE__*/
function () {
  _createClass(IOV, null, [{
    key: "generateConfigFromUrl",
    value: function generateConfigFromUrl(url) {
      if (!url) {
        throw new Error('No source was given to be parsed!');
      } // We use an anchor tag here beacuse, when an href is added to
      // an anchor dom Element, the parsing is done for you by the
      // browser.


      var parser = document.createElement('a');
      var useSSL;
      var default_port;
      var jwtUrl;
      var hashUrl;
      var b64_jwt_access_url = '';
      var jwt = '';
      var b64_hash_access_url = '';
      var hash = ''; // Chrome is the only browser that allows non-http protocols in
      // the anchor tag's href, so change them all to http here so we
      // get the benefits of the anchor tag's parsing

      if (url.substring(0, 9).toLowerCase() === 'clsps-jwt') {
        useSSL = true;
        parser.href = url.replace('clsps-jwt', 'https');
        default_port = 443;
        jwtUrl = true;
        hashUrl = false;
      } else if (url.substring(0, 8).toLowerCase() === 'clsp-jwt') {
        useSSL = false;
        parser.href = url.replace('clsp-jwt', 'http');
        default_port = 9001;
        jwtUrl = true;
        hashUrl = false;
      } else if (url.substring(0, 10).toLowerCase() === 'clsps-hash') {
        useSSL = true;
        parser.href = url.replace('clsps-hash', 'https');
        default_port = 443;
        jwtUrl = false;
        hashUrl = true;
      } else if (url.substring(0, 9).toLowerCase() === 'clsp-hash') {
        useSSL = false;
        parser.href = url.replace('clsp-hash', 'http');
        default_port = 9001;
        jwtUrl = false;
        hashUrl = true;
      } else if (url.substring(0, 5).toLowerCase() === 'clsps') {
        useSSL = true;
        parser.href = url.replace('clsps', 'https');
        default_port = 443;
        jwtUrl = false;
        hashUrl = false;
      } else if (url.substring(0, 4).toLowerCase() === 'clsp') {
        useSSL = false;
        parser.href = url.replace('clsp', 'http');
        default_port = 9001;
        jwtUrl = false;
        hashUrl = false;
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

      port = parseInt(port); // @ is a special address meaning the server that loaded the web page.

      if (hostname === '@') {
        hostname = window.location.hostname;
      } // if jwt extract required url parameters.


      if (jwtUrl === true) {
        // Url: clsp[s]-jwt://<sfs addr>[:9001]/<jwt>?Start=...&End=...
        var qp_offset = url.indexOf(parser.pathname) + parser.pathname.length;
        var qr_args = url.substr(qp_offset).split('?')[1];
        var query = {};
        var pairs = qr_args.split('&');

        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }

        if (typeof query.Start === 'undefined') {
          throw new Error("Required 'Start' query parameter not defined for a clsp[s]-jwt");
        }

        if (typeof query.End === 'undefined') {
          throw new Error("Required 'End' query parameter not defined for a clsp[s]-jwt");
        }

        if (typeof query.token === 'undefined') {
          throw new Error("Required 'token' query parameter not defined for a clsp[s]-jwt");
        }

        var protocol = useSSL ? 'clsps-jwt' : 'clsp-jwt';

        var _jwtUrl = "".concat(protocol, "://").concat(hostname, ":").concat(port, "/jwt?Start=").concat(query.Start, "&End=").concat(query.End);

        b64_jwt_access_url = window.btoa(_jwtUrl);
        jwt = query.token;
      } else if (hashUrl === true) {
        // URL: clsp[s]-hash://<sfs-addr>[:9001]/<stream>?start=...&end=...&token=...
        var _qp_offset = url.indexOf(parser.pathname) + parser.pathname.length;

        var _qr_args = url.substr(_qp_offset).split('?')[1];
        var _query = {};

        var _pairs = _qr_args.split('&');

        for (var _i = 0; _i < _pairs.length; _i++) {
          var _pair = _pairs[_i].split('=');

          _query[decodeURIComponent(_pair[0])] = decodeURIComponent(_pair[1] || '');
        }

        if (typeof _query.start === 'undefined') {
          throw new Error("Required 'start' query parameter not defined for a clsp[s]-hash");
        }

        if (typeof _query.end === 'undefined') {
          throw new Error("Required 'end' query parameter not defined for a clsp[s]-hash");
        }

        if (typeof _query.token === 'undefined') {
          throw new Error("Required 'token' query parameter not defined for a clsp[s]-hash");
        }

        var _protocol = useSSL ? 'clsps-hash' : 'clsp-hash';

        var _hashUrl = "".concat(_protocol, "://").concat(hostname, ":").concat(port, "/").concat(streamName, "?start=").concat(_query.start, "&end=").concat(_query.end, "&token=").concat(_query.token);

        b64_hash_access_url = window.btoa(_hashUrl);
        hash = _query.token;
      }

      return {
        wsbroker: hostname,
        wsport: port,
        streamName: streamName,
        useSSL: useSSL,
        b64_jwt_access_url: b64_jwt_access_url,
        jwt: jwt,
        b64_hash_access_url: b64_hash_access_url,
        hash: hash
      };
    }
  }, {
    key: "factory",
    value: function factory(videoElement) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new IOV(videoElement, config);
    }
  }, {
    key: "fromUrl",
    value: function fromUrl(url, videoElement) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return IOV.factory(videoElement, _objectSpread({}, config, IOV.generateConfigFromUrl(url)));
    }
  }]);

  function IOV(videoElement, config) {
    var _this = this;

    _classCallCheck(this, IOV);

    _defineProperty(this, "onConnectionChange", function () {
      if (window.navigator.onLine) {
        _this.logger.debug('Back online...');

        if (_this.player.stopped) {
          // Without this timeout, the video appears blank.  Not sure if there is
          // some race condition...
          setTimeout(function () {
            _this.play();
          }, 2000);
        }
      } else {
        _this.logger.debug('Offline!');

        _this.stop();
      }
    });

    _defineProperty(this, "onVisibilityChange", function () {
      var hiddenStateName = _utils__WEBPACK_IMPORTED_MODULE_4__["default"].windowStateNames.hiddenStateName;

      if (document[hiddenStateName]) {
        // Stop playing when tab is hidden or window is minimized
        _this.visibilityChangeTimeout = setTimeout(
        /*#__PURE__*/
        _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this.logger.debug('Stopping because tab is not visible...');

                  _context.next = 3;
                  return _this.stop();

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        })), 1000);
        return;
      }

      if (_this.visibilityChangeTimeout) {
        clearTimeout(_this.visibilityChangeTimeout);
      }

      if (_this.player.stopped) {
        _this.logger.debug('Playing because tab became visible...');

        _this.play();
      }
    });

    if (!_utils__WEBPACK_IMPORTED_MODULE_4__["default"].supported()) {
      throw new Error('You are using an unsupported browser - Unable to play CLSP video');
    }

    this.id = config.id || uuid_v4__WEBPACK_IMPORTED_MODULE_0___default()(); // This MUST be globally unique!  The MQTT server will broadcast the stream
    // to a topic that contains this id, so if there is ANY other client
    // connected that has the same id anywhere in the world, the stream to all
    // clients that use that topic will fail.  This is why we use guids rather
    // than an incrementing integer.

    this.clientId = config.clientId || uuid_v4__WEBPACK_IMPORTED_MODULE_0___default()();
    this.logger = Object(_utils_logger__WEBPACK_IMPORTED_MODULE_5__["default"])().factory("IOV ".concat(this.id));
    this.logger.debug('Constructing...');
    this.metrics = {}; // @todo - there must be a more proper way to do events than this...

    this.events = {};

    for (var i = 0; i < IOV.EVENT_NAMES.length; i++) {
      this.events[IOV.EVENT_NAMES[i]] = [];
    }

    this.destroyed = false;
    this.onReadyAlreadyCalled = false;
    this.videoElement = videoElement;
    this.eid = this.videoElement.id;
    this.config = {
      clientId: this.clientId,
      wsbroker: config.wsbroker,
      wsport: config.wsport,
      useSSL: config.useSSL,
      streamName: config.streamName,
      appStart: config.appStart,
      jwt: config.jwt,
      b64_jwt_access_url: config.b64_jwt_access_url,
      hash: config.hash,
      b64_hash_access_url: config.b64_hash_access_url
    };
    var visibilityChangeEventName = _utils__WEBPACK_IMPORTED_MODULE_4__["default"].windowStateNames.visibilityChangeEventName;

    if (visibilityChangeEventName) {
      document.addEventListener(visibilityChangeEventName, this.onVisibilityChange, false);
    }

    window.addEventListener('online', this.onConnectionChange, false);
    window.addEventListener('offline', this.onConnectionChange, false);
  }

  _createClass(IOV, [{
    key: "on",
    value: function on(name, action) {
      this.logger.debug("Registering Listener for ".concat(name, " event..."));

      if (!IOV.EVENT_NAMES.includes(name)) {
        throw new Error("\"".concat(name, "\" is not a valid event.\""));
      }

      if (this.destroyed) {
        return;
      }

      this.events[name].push(action);
    }
  }, {
    key: "trigger",
    value: function trigger(name, value) {
      var sillyMetrics = [];

      if (sillyMetrics.includes(name)) {
        this.logger.silly("Triggering ".concat(name, " event..."));
      } else {
        this.logger.debug("Triggering ".concat(name, " event..."));
      }

      if (this.destroyed) {
        return;
      }

      if (!IOV.EVENT_NAMES.includes(name)) {
        throw new Error("\"".concat(name, "\" is not a valid event.\""));
      }

      for (var i = 0; i < this.events[name].length; i++) {
        this.events[name][i](value, this);
      }
    }
  }, {
    key: "metric",
    value: function metric(type, value) {
      if (!this.options.enableMetrics) {
        return;
      }

      if (!IOV.METRIC_TYPES.includes(type)) {
        // @todo - should this throw?
        return;
      }

      this.metrics[type] = value;
      this.trigger('metric', {
        type: type,
        value: this.metrics[type]
      });
    }
  }, {
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var videoElementParent;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.logger.debug('Initializing...');

                if (this.videoElement) {
                  _context2.next = 3;
                  break;
                }

                throw new Error("Unable to find an element in the DOM with id \"".concat(this.eid, "\"."));

              case 3:
                this.videoElement.classList.add('clsp-video');
                videoElementParent = this.videoElement.parentNode;

                if (videoElementParent) {
                  _context2.next = 7;
                  break;
                }

                throw new Error('There is no iframe container element to attach the iframe to!');

              case 7:
                this.player = _player__WEBPACK_IMPORTED_MODULE_2__["default"].factory(this, this.videoElement); // @todo - this seems to be videojs specific, and should be removed or moved
                // somewhere else

                this.player.on('firstFrameShown', function () {
                  // @todo - this may be overkill given the changeSourceMaxWait...
                  // When the video is ready to be displayed, swap out the video player if
                  // the source has changed.  This is what allows tours to switch to the next
                  try {
                    var videos = videoElementParent.getElementsByTagName('video');

                    for (var i = 0; i < videos.length; i++) {
                      var video = videos[i];
                      var id = video.getAttribute('id');

                      if (id !== _this2.eid) {
                        // video.pause();
                        // video.removeAttribute('src');
                        // video.load();
                        // video.style.display = 'none';
                        videoElementParent.removeChild(video);
                        video.remove();
                        video = null;
                        videos = null;
                        break;
                      }
                    } // videoElementParent.replaceChild(this.videoElement, this.videoJsVideoElement);
                    // is there still a reference to this element?
                    // this.videoJsVideoElement = null;

                  } catch (error) {
                    _this2.logger.error(error);
                  }

                  _this2.trigger('firstFrameShown');
                });
                this.player.on('videoReceived', function () {
                  _this2.trigger('videoReceived');
                });
                this.player.on('videoInfoReceived', function () {
                  _this2.trigger('videoInfoReceived');
                });
                this.conduit = _conduit_Conduit__WEBPACK_IMPORTED_MODULE_1__["default"].factory(this.clientId, {
                  iovId: this.id,
                  wsbroker: this.config.wsbroker,
                  wsport: this.config.wsport,
                  useSSL: this.config.useSSL,
                  b64_jwt_access_url: this.config.b64_jwt_access_url,
                  jwt: this.config.jwt,
                  b64_hash_access_url: this.config.b64_hash_access_url,
                  hash: this.config.hash
                });
                _context2.next = 14;
                return this.conduit.initialize(videoElementParent);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function initialize() {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }, {
    key: "clone",
    value: function clone(config) {
      this.logger.debug('clone');

      var clonedConfig = _objectSpread({}, config); // @todo - is it possible to reuse the iov player?


      return IOV.factory(this.videoElement, clonedConfig);
    }
  }, {
    key: "cloneFromUrl",
    value: function cloneFromUrl(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.logger.debug('cloneFromUrl');
      return this.clone(_objectSpread({}, IOV.generateConfigFromUrl(url), config));
    }
  }, {
    key: "play",
    value: function () {
      var _play2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.player.play();

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function play() {
        return _play2.apply(this, arguments);
      }

      return play;
    }()
  }, {
    key: "stop",
    value: function () {
      var _stop2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.player.stop();

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function stop() {
        return _stop2.apply(this, arguments);
      }

      return stop;
    }()
  }, {
    key: "restart",
    value: function () {
      var _restart = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.stop();

              case 2:
                _context5.next = 4;
                return this.play();

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function restart() {
        return _restart.apply(this, arguments);
      }

      return restart;
    }()
  }, {
    key: "_play",
    value: function () {
      var _play3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(onMoov, onMoof) {
        var _ref2, mimeCodec, moov;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!this.player.stopped) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt("return");

              case 2:
                _context6.next = 4;
                return this.conduit.play(this.config.streamName, onMoof);

              case 4:
                _ref2 = _context6.sent;
                mimeCodec = _ref2.mimeCodec;
                moov = _ref2.moov;

                if (!_MSEWrapper__WEBPACK_IMPORTED_MODULE_3__["default"].isMimeCodecSupported(mimeCodec)) {
                  this.trigger('unsupportedMimeCodec', "Unsupported mime codec: ".concat(mimeCodec));
                  this.stop();
                }

                if (onMoov) {
                  onMoov(mimeCodec, moov);
                }

              case 9:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function _play(_x, _x2) {
        return _play3.apply(this, arguments);
      }

      return _play;
    }()
  }, {
    key: "_stop",
    value: function _stop() {
      this.conduit.stop();
    }
  }, {
    key: "resyncStream",
    value: function resyncStream(cb) {
      this.conduit.resyncStream(cb);
    }
  }, {
    key: "onAppendStart",
    value: function onAppendStart(byteArray) {
      this.conduit.segmentUsed(byteArray);
    }
  }, {
    key: "enterFullscreen",
    value: function enterFullscreen() {
      if (!document.fullscreenElement) {
        this.videoElement.requestFullscreen();
      }
    }
  }, {
    key: "exitFullscreen",
    value: function exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, {
    key: "toggleFullscreen",
    value: function toggleFullscreen() {
      if (!document.fullscreenElement) {
        this.enterFullscreen();
      } else {
        this.exitFullscreen();
      }
    }
    /**
     * Dereference the necessary properties, clear any intervals and timeouts, and
     * remove any listeners.  Will also destroy the player and the conduit.
     *
     * @returns {void}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.logger.debug('destroy');

      if (this.destroyed) {
        return;
      }

      this.destroyed = true;
      var visibilityChangeEventName = _utils__WEBPACK_IMPORTED_MODULE_4__["default"].windowStateNames.visibilityChangeEventName;

      if (visibilityChangeEventName) {
        document.removeEventListener(visibilityChangeEventName, this.onVisibilityChange);
      }

      window.removeEventListener('online', this.onConnectionChange);
      window.removeEventListener('offline', this.onConnectionChange);
      this.player.destroy();
      this.player = null;
      this.conduit.destroy();
      this.conduit = null;
      this.events = null;
      this.metrics = null;
    }
  }]);

  return IOV;
}();

_defineProperty(IOV, "EVENT_NAMES", ['metric', 'unsupportedMimeCodec', 'firstFrameShown', 'videoReceived', 'videoInfoReceived']);

_defineProperty(IOV, "METRIC_TYPES", []);



/***/ }),

/***/ "./src/js/iov/MSEWrapper.js":
/*!**********************************!*\
  !*** ./src/js/iov/MSEWrapper.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MSEWrapper; });
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/defaults */ "./node_modules/lodash/defaults.js");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/noop */ "./node_modules/lodash/noop.js");
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_noop__WEBPACK_IMPORTED_MODULE_2__);


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



 // import { mp4toJSON } from './mp4-inspect';

var DEBUG_PREFIX = 'skyline:clsp:iov';
var debug = debug__WEBPACK_IMPORTED_MODULE_0___default()("".concat(DEBUG_PREFIX, ":MSEWrapper"));
var silly = debug__WEBPACK_IMPORTED_MODULE_0___default()("silly:".concat(DEBUG_PREFIX, ":MSEWrapper")); // This is the original error text, but it is subject to change by chrome,
// and we are only checking the part of the error text that contains no
// punctuation (and is all lower case).
// "Failed to execute 'appendBuffer' on 'SourceBuffer': The SourceBuffer is full, and cannot free space to append additional buffers.";

var FULL_BUFFER_ERROR = 'and cannot free space to append additional buffers';

var MSEWrapper =
/*#__PURE__*/
function () {
  _createClass(MSEWrapper, null, [{
    key: "isMimeCodecSupported",
    value: function isMimeCodecSupported(mimeCodec) {
      return window.MediaSource && window.MediaSource.isTypeSupported(mimeCodec);
    }
  }, {
    key: "factory",
    value: function factory(videoElement) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new MSEWrapper(videoElement, options);
    }
  }]);

  function MSEWrapper(videoElement) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MSEWrapper);

    _defineProperty(this, "onSourceBufferUpdateEnd", function () {
      silly('onUpdateEnd');

      _this.metric('sourceBuffer.updateEnd', 1);

      if (_this.shouldAbort) {
        _this.sourceBufferAbort();
      }

      try {
        // Sometimes the mediaSource is removed while an update is being
        // processed, resulting in an error when trying to read the
        // "buffered" property.
        if (_this.sourceBuffer.buffered.length <= 0) {
          _this.metric('sourceBuffer.updateEnd.bufferLength.empty', 1);

          debug('After updating, the sourceBuffer has no length!');
          return;
        }
      } catch (error) {
        // @todo - do we need to handle this?
        _this.metric('sourceBuffer.updateEnd.bufferLength.error', 1);

        debug('The mediaSource was removed while an update operation was occurring.');
        return;
      }

      var info = _this.getBufferTimes();

      _this.timeBuffered = info.currentBufferSize;

      if (info.previousBufferSize !== null && info.previousBufferSize > _this.timeBuffered) {
        _this.onRemoveFinish(info);
      } else {
        _this.onAppendFinish(info);
      }

      _this.processNextInQueue();
    });

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
      enableMetrics: false,
      appendsWithSameTimeEndThreshold: 1
    });
    this.segmentQueue = [];
    this.sequenceNumber = 0;
    this.mediaSource = null;
    this.sourceBuffer = null;
    this.objectURL = null;
    this.timeBuffered = null;
    this.appendsSinceTimeEndUpdated = 0;

    if (!this.options.bufferTruncateValue) {
      this.options.bufferTruncateValue = parseInt(this.options.bufferSizeLimit / this.options.bufferTruncateFactor);
    }

    this.metrics = {}; // @todo - there must be a more proper way to do events than this...

    this.events = {};

    for (var i = 0; i < MSEWrapper.EVENT_NAMES.length; i++) {
      this.events[MSEWrapper.EVENT_NAMES[i]] = [];
    }

    this.eventListeners = {
      mediaSource: {},
      sourceBuffer: {}
    };
  }

  _createClass(MSEWrapper, [{
    key: "on",
    value: function on(name, action) {
      debug("Registering Listener for ".concat(name, " event..."));

      if (!MSEWrapper.EVENT_NAMES.includes(name)) {
        throw new Error("\"".concat(name, "\" is not a valid event.\""));
      }

      this.events[name].push(action);
    }
  }, {
    key: "trigger",
    value: function trigger(name, value) {
      if (name === 'metric') {
        silly("Triggering ".concat(name, " event..."));
      } else {
        debug("Triggering ".concat(name, " event..."));
      }

      if (!MSEWrapper.EVENT_NAMES.includes(name)) {
        throw new Error("\"".concat(name, "\" is not a valid event.\""));
      }

      for (var i = 0; i < this.events[name].length; i++) {
        this.events[name][i](value, this);
      }
    }
  }, {
    key: "metric",
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
    key: "initializeMediaSource",
    value: function initializeMediaSource() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      debug('Initializing mediaSource...');
      options = lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default()({}, options, {
        onSourceOpen: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
        onSourceEnded: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a,
        onError: lodash_noop__WEBPACK_IMPORTED_MODULE_2___default.a
      });
      this.metric('mediaSource.created', 1); // Kill the existing media source

      this.destroyMediaSource();
      this.mediaSource = new window.MediaSource();

      this.eventListeners.mediaSource.sourceopen = function () {
        // This can only be set when the media source is open.
        // @todo - does this do memory management for us so we don't have
        // to call remove on the buffer, which is expensive?  It seems
        // like it...
        _this2.mediaSource.duration = _this2.options.duration;
        options.onSourceOpen();
      };

      this.eventListeners.mediaSource.sourceended = options.onSourceEnded;
      this.eventListeners.mediaSource.error = options.onError;
      this.mediaSource.addEventListener('sourceopen', this.eventListeners.mediaSource.sourceopen);
      this.mediaSource.addEventListener('sourceended', this.eventListeners.mediaSource.sourceended);
      this.mediaSource.addEventListener('error', this.eventListeners.mediaSource.error);
    }
  }, {
    key: "getVideoElementSrc",
    value: function getVideoElementSrc() {
      debug('getVideoElementSrc...');

      if (!this.mediaSource) {
        // @todo - should this throw?
        return;
      } // @todo - should multiple calls to this method with the same mediaSource
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
    key: "destroyVideoElementSrc",
    value: function destroyVideoElementSrc() {
      debug('destroyVideoElementSrc...');

      if (!this.mediaSource) {
        // @todo - should this throw?
        return;
      }

      if (!this.objectURL) {
        // @todo - should this throw?
        return;
      } // this.metric('objectURL.revoked', 1);


      this.objectURL = null;

      if (this.sourceBuffer) {
        this.shouldAbort = true;
      } // free the resource


      return window.URL.revokeObjectURL(this.videoElement.src);
    }
  }, {
    key: "reinitializeVideoElementSrc",
    value: function reinitializeVideoElementSrc() {
      this.metric('mediaSource.reinitialized', 1);
      this.destroyVideoElementSrc(); // reallocate, this will call media source open which will
      // append the MOOV atom.

      return this.getVideoElementSrc();
    }
  }, {
    key: "isMediaSourceReady",
    value: function isMediaSourceReady() {
      // found when stress testing many videos, it is possible for the
      // media source ready state not to be open even though
      // source open callback is being called.
      return this.mediaSource && this.mediaSource.readyState === 'open';
    }
  }, {
    key: "isSourceBufferReady",
    value: function isSourceBufferReady() {
      return this.sourceBuffer && this.sourceBuffer.updating === false;
    }
  }, {
    key: "initializeSourceBuffer",
    value: function () {
      var _initializeSourceBuffer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(mimeCodec) {
        var options,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
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
                  _context.next = 5;
                  break;
                }

                throw new Error('Cannot create the sourceBuffer if the mediaSource is not ready.');

              case 5:
                _context.next = 7;
                return this.destroySourceBuffer();

              case 7:
                this.metric('sourceBuffer.created', 1);
                this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeCodec);
                this.sourceBuffer.mode = 'sequence'; // Custom Events

                this.eventListeners.sourceBuffer.onAppendStart = options.onAppendStart;
                this.eventListeners.sourceBuffer.onAppendError = options.onAppendError;
                this.eventListeners.sourceBuffer.onRemoveFinish = options.onRemoveFinish;
                this.eventListeners.sourceBuffer.onAppendFinish = options.onAppendFinish;
                this.eventListeners.sourceBuffer.onRemoveError = options.onRemoveError;
                this.eventListeners.sourceBuffer.onStreamFrozen = options.onStreamFrozen;
                this.eventListeners.sourceBuffer.onError = options.onError; // Supported Events

                this.sourceBuffer.addEventListener('updateend', this.onSourceBufferUpdateEnd);
                this.sourceBuffer.addEventListener('error', this.eventListeners.sourceBuffer.onError);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initializeSourceBuffer(_x) {
        return _initializeSourceBuffer.apply(this, arguments);
      }

      return initializeSourceBuffer;
    }()
  }, {
    key: "queueSegment",
    value: function queueSegment(segment) {
      if (this.segmentQueue.length) {
        debug("Queueing segment.  The queue currently has ".concat(this.segmentQueue.length, " segments."));
      } else {
        silly("Queueing segment.  The queue is currently empty.");
      }

      this.metric('queue.added', 1);
      this.segmentQueue.push({
        timestamp: Date.now(),
        byteArray: segment
      });
    }
  }, {
    key: "sourceBufferAbort",
    value: function sourceBufferAbort() {
      debug('Aborting current sourceBuffer operation');

      try {
        this.metric('sourceBuffer.abort', 1);

        if (this.sourceBuffer) {
          this.sourceBuffer.abort();
          this.shouldAbort = false;
        }
      } catch (error) {
        this.metric('error.sourceBuffer.abort', 1); // Somehow, this can be become undefined...

        if (this.eventListeners.sourceBuffer.onAbortError) {
          this.eventListeners.sourceBuffer.onAbortError(error);
        }
      }
    }
  }, {
    key: "_append",
    value: function _append(_ref) {
      var timestamp = _ref.timestamp,
          byteArray = _ref.byteArray;
      silly('Appending to the sourceBuffer...');

      try {
        var estimatedDrift = Date.now() - timestamp;

        if (estimatedDrift > this.options.driftThreshold) {
          debug("Estimated drift of ".concat(estimatedDrift, " is above the ").concat(this.options.driftThreshold, " threshold.  Flushing queue...")); // @todo - perhaps we should re-add the last segment to the queue with a fresh
          // timestamp?  I think one cause of stream freezing is the sourceBuffer getting
          // starved, but I don't know if that's correct

          this.metric('queue.removed', this.segmentQueue.length + 1);
          this.segmentQueue = [];
          return;
        }

        silly("Appending to the buffer with an estimated drift of ".concat(estimatedDrift));
        this.metric('sourceBuffer.append', 1);
        this.sourceBuffer.appendBuffer(byteArray);
      } catch (error) {
        if (error.message && error.message.toLowerCase().includes(FULL_BUFFER_ERROR)) {
          // @todo - make this a valid metric
          // this.metric('error.sourceBuffer.filled', 1);
          // If the buffer is full, we will flush it
          console.warn('source buffer is full, about to flush it...');
          this.trimBuffer(undefined, true);
        } else {
          this.metric('error.sourceBuffer.append', 1);
          this.eventListeners.sourceBuffer.onAppendError(error, byteArray);
        }
      }
    }
  }, {
    key: "processNextInQueue",
    value: function processNextInQueue() {
      silly('processNextInQueue');

      if (this.destroyed) {
        return;
      }

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
    key: "formatMoof",
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
    key: "appendMoov",
    value: function appendMoov(moov) {
      debug('appendMoov');

      if (!moov) {
        // @todo - do we need to throw here or something?  Under what
        // circumstance would this be called with no moov?
        return;
      }

      this.metric('sourceBuffer.lastMoovSize', moov.length); // Sometimes this can get hit after destroy is called

      if (!this.eventListeners.sourceBuffer.onAppendStart) {
        return;
      }

      debug('appending moov...');
      this.queueSegment(moov);
      this.processNextInQueue();
    }
  }, {
    key: "append",
    value: function append(byteArray) {
      silly('Append');

      if (this.destroyed) {
        return;
      }

      this.metric('sourceBuffer.lastMoofSize', byteArray.length); // console.log(mp4toJSON(byteArray));
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
    key: "getBufferTimes",
    value: function getBufferTimes() {
      silly('getBufferTimes...');

      try {
        var previousBufferSize = this.timeBuffered;
        var bufferTimeStart = this.sourceBuffer.buffered.start(0);
        var bufferTimeEnd = this.sourceBuffer.buffered.end(0);
        var currentBufferSize = bufferTimeEnd - bufferTimeStart;
        silly('getBufferTimes finished successfully...');
        return {
          previousBufferSize: previousBufferSize,
          currentBufferSize: currentBufferSize,
          bufferTimeStart: bufferTimeStart,
          bufferTimeEnd: bufferTimeEnd
        };
      } catch (error) {
        debug('getBufferTimes finished unsuccessfully...');
        return null;
      }
    }
  }, {
    key: "trimBuffer",
    value: function trimBuffer() {
      var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getBufferTimes();
      var clearBuffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      silly('trimBuffer...');
      this.metric('sourceBuffer.lastKnownBufferSize', this.timeBuffered);

      try {
        if (info && (clearBuffer || this.timeBuffered > this.options.bufferSizeLimit) && this.isSourceBufferReady()) {
          debug('Removing old stuff from sourceBuffer...'); // @todo - this is the biggest performance problem we have with this player.
          // Can you figure out how to manage the memory usage without causing the streams
          // to stutter?

          this.metric('sourceBuffer.trim', this.options.bufferTruncateValue);
          var trimEndTime = clearBuffer ? Infinity : info.bufferTimeStart + this.options.bufferTruncateValue;
          debug('trimming buffer...');
          this.sourceBuffer.remove(info.bufferTimeStart, trimEndTime);
          debug('finished trimming buffer...');
        }
      } catch (error) {
        debug('trimBuffer failure!');
        this.metric('sourceBuffer.trim.error', 1);
        this.eventListeners.sourceBuffer.onRemoveError(error);
        console.error(error);
      }

      silly('trimBuffer finished...');
    }
  }, {
    key: "onRemoveFinish",
    value: function onRemoveFinish() {
      var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getBufferTimes();
      debug('On remove finish...');
      this.metric('sourceBuffer.updateEnd.removeEvent', 1);
      this.eventListeners.sourceBuffer.onRemoveFinish(info);
    }
  }, {
    key: "onAppendFinish",
    value: function onAppendFinish() {
      var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getBufferTimes();
      silly('On append finish...');
      this.metric('sourceBuffer.updateEnd.appendEvent', 1); // The current buffer size should always be bigger.If it isn't, there is a problem,
      // and we need to reinitialize or something.  Sometimes the buffer is the same.  This is
      // allowed for consecutive appends, but only a configurable number of times.  The default
      // is 1

      debug('Appends with same time end: ' + this.appendsSinceTimeEndUpdated);

      if (this.previousTimeEnd && info.bufferTimeEnd <= this.previousTimeEnd) {
        this.appendsSinceTimeEndUpdated += 1;
        this.metric('sourceBuffer.updateEnd.bufferFrozen', 1); //append threshold with same time end has been crossed.  Reinitialize frozen stream.

        if (this.appendsSinceTimeEndUpdated > this.options.appendsWithSameTimeEndThreshold) {
          debug('stream frozen!');
          this.eventListeners.sourceBuffer.onStreamFrozen();
          return;
        }
      }

      this.appendsSinceTimeEndUpdated = 0;
      this.previousTimeEnd = info.bufferTimeEnd;
      this.eventListeners.sourceBuffer.onAppendFinish(info);
      this.trimBuffer(info);
    }
  }, {
    key: "destroySourceBuffer",
    value: function destroySourceBuffer() {
      var _this3 = this;

      debug('destroySourceBuffer...');
      return new Promise(function (resolve, reject) {
        var finish = function finish() {
          if (_this3.sourceBuffer) {
            _this3.sourceBuffer.removeEventListener('updateend', finish);
          } // We must abort in the final updateend listener to ensure that
          // any operations, especially the remove operation, finish first,
          // as aborting while removing is deprecated.


          _this3.sourceBufferAbort();

          debug('destroySourceBuffer finished...');
          resolve();
        };

        if (!_this3.sourceBuffer) {
          return finish();
        }

        _this3.sourceBuffer.removeEventListener('updateend', _this3.onSourceBufferUpdateEnd);

        _this3.sourceBuffer.removeEventListener('error', _this3.eventListeners.sourceBuffer.onError);

        _this3.sourceBuffer.addEventListener('updateend', finish); // @todo - this is a hack - sometimes, the trimBuffer operation does not cause an update
        // on the sourceBuffer.  This acts as a timeout to ensure the destruction of this mseWrapper
        // instance can complete.


        debug('giving sourceBuffer some time to finish updating itself...');
        setTimeout(finish, 1000);
      });
    }
  }, {
    key: "destroyMediaSource",
    value: function destroyMediaSource() {
      this.metric('sourceBuffer.destroyed', 1);
      debug('Destroying mediaSource...');

      if (!this.mediaSource) {
        return;
      } // We must do this PRIOR to the sourceBuffer being destroyed, to ensure that the
      // 'buffered' property is still available, which is necessary for completely
      // emptying the sourceBuffer.


      this.trimBuffer(undefined, true);
      this.mediaSource.removeEventListener('sourceopen', this.eventListeners.mediaSource.sourceopen);
      this.mediaSource.removeEventListener('sourceended', this.eventListeners.mediaSource.sourceended);
      this.mediaSource.removeEventListener('error', this.eventListeners.mediaSource.error); // let sourceBuffers = this.mediaSource.sourceBuffers;
      // if (sourceBuffers.SourceBuffers) {
      //   // @see - https://developer.mozilla.org/en-US/docs/Web/API/MediaSource/sourceBuffers
      //   sourceBuffers = sourceBuffers.SourceBuffers();
      // }
      // for (let i = 0; i < sourceBuffers.length; i++) {
      // this.mediaSource.removeSourceBuffer(sourceBuffers[i]);
      // }

      if (this.isMediaSourceReady() && this.isSourceBufferReady()) {
        debug('media source was ready for endOfStream and removeSourceBuffer');
        this.mediaSource.endOfStream();
        this.mediaSource.removeSourceBuffer(this.sourceBuffer);
      } // @todo - is this happening at the right time, or should it happen
      // prior to removing the source buffers?


      this.destroyVideoElementSrc();
      this.metric('mediaSource.destroyed', 1);
    }
  }, {
    key: "_freeAllResources",
    value: function _freeAllResources() {
      debug('_freeAllResources...'); // We make NO assumptions here about what instance properties are
      // needed during the asynchronous destruction of the source buffer,
      // therefore we wait until it is finished to free all of these
      // resources.

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
      debug('_freeAllResources finished...');
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this4 = this;

      debug('destroy...');

      if (this.destroyed) {
        return Promise.resolve();
      }

      this.destroyed = true;
      this.destroyMediaSource(); // We MUST not force the destroy method here to be asynchronous, even
      // though it "should" be.  This is because we cannot assume that the
      // caller has control over whether or not its destroy method can be
      // properly run asynchronously.  The specific use case here is that
      // many client side libraries (angular, marionette, react, etc.) do
      // not all give pre-destruction methods or events that can wait for
      // an asynchronous operation.  If angular decides it is going to
      // destroy a DOM element when a user navigates, we have no way of
      // ensuring that it supports asynchronous operations, or that the
      // caller is properly using them, if they exist.  Therefore, this
      // destroy method will clean up the source buffer later, allowing the
      // rest of the clsp destruction logic to continue.  The use case for
      // needing that functionality is that the conduit needs to use the its
      // iframe to contact the server, and if the iframe is destroyed before
      // the conduit talks to the server, errors will be thrown during
      // destruction, which will lead to resources not being free / memory
      // leaks, which may cause the browser to crash after extended periods
      // of time, such as 24 hours.
      // Note that we still return the promise, so that the caller has the
      // option of waiting if they choose.

      var destroyPromise = this.destroySourceBuffer().then(function () {
        debug('destroySourceBuffer successfully finished...');

        _this4._freeAllResources();

        debug('destroy successfully finished...');
      })["catch"](function (error) {
        debug('destroySourceBuffer failed...');
        console.error('Error while destroying the source buffer!');
        console.error(error); // Do our best at memory management, even on failure

        _this4._freeAllResources();

        debug('destroy unsuccessfully finished...');
      });
      debug('exiting destroy, asynchronous destroy logic in progress...');
      return destroyPromise;
    }
  }]);

  return MSEWrapper;
}();

_defineProperty(MSEWrapper, "EVENT_NAMES", ['metric']);

_defineProperty(MSEWrapper, "METRIC_TYPES", ['mediaSource.created', 'mediaSource.destroyed', 'objectURL.created', 'objectURL.revoked', 'mediaSource.reinitialized', 'sourceBuffer.created', 'sourceBuffer.destroyed', 'queue.added', 'queue.removed', 'sourceBuffer.append', 'error.sourceBuffer.append', 'frameDrop.hiddenTab', 'queue.mediaSourceNotReady', 'queue.sourceBufferNotReady', 'queue.shift', 'queue.append', 'sourceBuffer.lastKnownBufferSize', 'sourceBuffer.trim', 'sourceBuffer.trim.error', 'sourceBuffer.updateEnd', 'sourceBuffer.updateEnd.bufferLength.empty', 'sourceBuffer.updateEnd.bufferLength.error', 'sourceBuffer.updateEnd.removeEvent', 'sourceBuffer.updateEnd.appendEvent', 'sourceBuffer.updateEnd.bufferFrozen', 'sourceBuffer.abort', 'error.sourceBuffer.abort', 'sourceBuffer.lastMoofSize']);



/***/ }),

/***/ "./src/js/iov/collection.js":
/*!**********************************!*\
  !*** ./src/js/iov/collection.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return IovCollection; });
/* harmony import */ var paho_mqtt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! paho-mqtt */ "./node_modules/paho-mqtt/paho-mqtt.js");
/* harmony import */ var paho_mqtt__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(paho_mqtt__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _IOV__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IOV */ "./src/js/iov/IOV.js");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/logger */ "./src/js/utils/logger.js");


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




 // Even though the export of paho-mqtt is { Client, Message }, there is an
// internal reference that the library makes to itself, and it expects
// itself to exist at Paho.MQTT.  FIRED!

window.Paho = {
  MQTT: paho_mqtt__WEBPACK_IMPORTED_MODULE_0___default.a
}; // @todo - this could cause an overflow!

var totalIovCount = 0;
var collection;
/**
 * The IOV Collection is meant ot be a singleton, and is meant to manage all
 * IOVs in a given browser window/document.  There are certain centralized
 * functions it is meant to perform, such as generating the guids that are
 * needed to establish a connection to a unique topic on the SFS, and to listen
 * to window messages and route the relevant messages to the appropriate IOV
 * instance.
 */

var IovCollection =
/*#__PURE__*/
function () {
  _createClass(IovCollection, null, [{
    key: "asSingleton",
    value: function asSingleton() {
      if (!collection) {
        collection = IovCollection.factory();
      }

      return collection;
    }
  }, {
    key: "factory",
    value: function factory() {
      return new IovCollection();
    }
    /**
     * @private
     *
     * Note that this should ONLY be used as a singleton because it currently
     * uses a window event for receiving clsp video segments.  Therefore, if you
     * use more than one, you run the risk of having more than one IOV listening
     * for segments using the same clientId.
     */

  }]);

  function IovCollection() {
    var _this = this;

    _classCallCheck(this, IovCollection);

    _defineProperty(this, "_onWindowMessage", function (event) {
      var clientId = event.data.clientId;
      var eventType = event.data.event;

      if (!clientId) {
        // A window message was received that is not related to CLSP
        return;
      }

      _this.logger.debug('window on message');

      if (!_this.hasByClientId(clientId)) {
        // When the mqtt connection is interupted due to a listener being removed,
        // a fail event is always sent.  It is not necessary to log this as an error
        // in the console, because it is not an error.
        // @todo - the fail event no longer exists - what is the name of the new
        // corresponding event?
        if (eventType === 'fail') {
          return;
        } // Do not throw an error on disconnection


        if (eventType === 'disconnect_success') {
          return;
        } // Don't show an error for iovs that have been deleted


        if (_this.deletedIovIds.includes(clientId)) {
          _this.logger.warn("Received a message for deleted iov ".concat(clientId));

          return;
        }

        throw new Error("Unable to route message of type ".concat(eventType, " for IOV with clientId \"").concat(clientId, "\".  An IOV for that clientId does not exist."));
      } // If the document is hidden, don't execute the onMessage handler.  If the
      // handler is executed, for some reason, the conduit will continue to
      // request/receive data from the server, which will eventually result in
      // unconstrained resource utilization, and ultimately a browser crash


      if (document.hidden) {
        return;
      }

      _this.getByClientId(clientId).conduit.onMessage(event);
    });

    this.logger = Object(_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])().factory('IovCollection');
    this.logger.debug('Constructing...');
    this.iovs = {};
    this.iovsByClientId = {};
    this.deletedIovIds = [];
    window.addEventListener('message', this._onWindowMessage);
  }
  /**
   * @private
   *
   * The listener for the "message" event on the window.  It's job is to
   * identify messages that are intended for an IOV and route them to the
   * correct one.  The most common example of this is when a Router receives
   * a moof/segment from a server, and posts a message to the window.  This
   * listener will route that moof/segment to the IOV it was intended for.
   *
   * @param {Object} event
   *   The window message event
   *
   * @returns {void}
   */


  _createClass(IovCollection, [{
    key: "create",

    /**
     * Create an IOV for a specific stream, and add it to this collection.
     *
     * @param {String} url
     *   The url to the clsp stream
     * @param {DOMNode} videoElement
     *   The video element that will serve as the video player in the DOM
     *
     * @returns {IOV}
     */
    value: function () {
      var _create = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(url, videoElement) {
        var iov;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                iov = _IOV__WEBPACK_IMPORTED_MODULE_2__["default"].fromUrl(url, videoElement, {
                  id: (++totalIovCount).toString(),
                  clientId: uuid_v4__WEBPACK_IMPORTED_MODULE_1___default()()
                });
                this.add(iov);
                _context.next = 4;
                return iov.initialize();

              case 4:
                return _context.abrupt("return", iov);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create(_x, _x2) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
    /**
     * Add an IOV instance to this collection.  It can then be accessed by its id
     * or its clientId.
     *
     * @param {IOV} iov
     *   The iov instance to add
     *
     * @returns {this}
     */

  }, {
    key: "add",
    value: function add(iov) {
      var id = iov.id;
      var clientId = iov.clientId;
      this.iovs[id] = iov;
      this.iovsByClientId[clientId] = iov;
      return this;
    }
    /**
     * Determine whether or not an iov with the passed id exists in this
     * collection.
     *
     * @param {String} id
     *   The id of the iov to find
     *
     * @returns {Boolean}
     *   True if the iov with the given id exists
     *   False if the iov with the given id does not exist
     */

  }, {
    key: "has",
    value: function has(id) {
      return this.iovs.hasOwnProperty(id);
    }
    /**
     * Determine whether or not an iov with the passed clientId exists in this
     * collection.
     *
     * @param {String} clientId
     *   The clientId of the iov to find
     *
     * @returns {Boolean}
     *   True if the iov with the given clientId exists
     *   False if the iov with the given clientId does not exist
     */

  }, {
    key: "hasByClientId",
    value: function hasByClientId(clientId) {
      return this.iovsByClientId.hasOwnProperty(clientId);
    }
    /**
     * Get an iov with the passed id from this collection.
     *
     * @param {String} id
     *   The id of the iov instance to get
     *
     * @returns {IOV|undefined}
     *   If an iov with this id doest not exist, undefined is returned.
     */

  }, {
    key: "get",
    value: function get(id) {
      return this.iovs[id];
    }
    /**
     * Get an iov with the passed clientId from this collection.
     *
     * @param {String} clientId
     *   The clientId of the iov instance to get
     *
     * @returns {IOV|undefined}
     *   If an iov with this clientId doest not exist, undefined is returned.
     */

  }, {
    key: "getByClientId",
    value: function getByClientId(clientId) {
      return this.iovsByClientId[clientId];
    }
    /**
     * Remove an iov instance from this collection and destroy it.
     *
     * @param {String} id
     *   The id of the iov to remove and destroy
     *
     * @returns {this}
     */

  }, {
    key: "remove",
    value: function remove(id) {
      var iov = this.get(id);

      if (!iov) {
        return;
      }

      delete this.iovs[id];
      delete this.iovsByClientId[iov.clientId];
      iov.destroy();
      this.deletedIovIds.push(id);
      return this;
    }
    /**
     * Destroy this collection and destroy all iov instances in this collection.
     *
     * @returns {void}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.destroyed = true;
      window.removeEventListener('message', this._onWindowMessage);

      for (var id in this.iovs) {
        this.remove(id);
      }

      this.iovs = null;
      this.iovsByClientId = null;
    }
  }]);

  return IovCollection;
}();



/***/ }),

/***/ "./src/js/iov/player.js":
/*!******************************!*\
  !*** ./src/js/iov/player.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return IOVPlayer; });
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/defaults */ "./node_modules/lodash/defaults.js");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _MSEWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MSEWrapper */ "./src/js/iov/MSEWrapper.js");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/logger */ "./src/js/utils/logger.js");


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




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

var IOVPlayer =
/*#__PURE__*/
function () {
  _createClass(IOVPlayer, null, [{
    key: "factory",
    value: function factory(iov, videoElement) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new IOVPlayer(iov, videoElement, options);
    }
  }]);

  function IOVPlayer(iov, videoElement, options) {
    var _this = this;

    _classCallCheck(this, IOVPlayer);

    _defineProperty(this, "onMoov",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(mimeCodec, moov) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!_this.stopped) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _this.moovBox = moov; // this.trigger('firstChunk');

                _context.next = 5;
                return _this.reinitializeMseWrapper(mimeCodec);

              case 5:
                _this.iov.resyncStream(function () {
                  // console.log('sync received re-initialize media source buffer');
                  _this.reinitializeMseWrapper(mimeCodec);
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "onMoof", function (mqttMessage) {
      // @todo - this seems like a hack...
      if (_this.stopped) {
        return;
      }

      _this.trigger('videoReceived');

      _this.getSegmentIntervalMetrics();

      _this.mseWrapper.append(mqttMessage.payloadBytes);
    });

    this.logger = Object(_utils_logger__WEBPACK_IMPORTED_MODULE_2__["default"])().factory("IOV Player ".concat(iov.id));
    this.logger.debug('constructor');
    this.metrics = {}; // @todo - there must be a more proper way to do events than this...

    this.events = {};

    for (var i = 0; i < IOVPlayer.EVENT_NAMES.length; i++) {
      this.events[IOVPlayer.EVENT_NAMES[i]] = [];
    }

    this.iov = iov;
    this.videoElement = videoElement;
    this.options = lodash_defaults__WEBPACK_IMPORTED_MODULE_0___default()({}, options, {
      segmentIntervalSampleSize: IOVPlayer.SEGMENT_INTERVAL_SAMPLE_SIZE,
      driftCorrectionConstant: IOVPlayer.DRIFT_CORRECTION_CONSTANT,
      enableMetrics: false
    });
    this.firstFrameShown = false;
    this.stopped = false; // Used for determining the size of the internal buffer hidden from the MSE
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
  }

  _createClass(IOVPlayer, [{
    key: "on",
    value: function on(name, action) {
      this.logger.debug("Registering Listener for ".concat(name, " event..."));

      if (!IOVPlayer.EVENT_NAMES.includes(name)) {
        throw new Error("\"".concat(name, "\" is not a valid event.\""));
      }

      if (this.destroyed) {
        return;
      }

      this.events[name].push(action);
    }
  }, {
    key: "trigger",
    value: function trigger(name, value) {
      var sillyMetrics = ['metric', 'videoReceived'];

      if (sillyMetrics.includes(name)) {
        this.logger.silly("Triggering ".concat(name, " event..."));
      } else {
        this.logger.debug("Triggering ".concat(name, " event..."));
      }

      if (this.destroyed) {
        return;
      }

      if (!IOVPlayer.EVENT_NAMES.includes(name)) {
        throw new Error("\"".concat(name, "\" is not a valid event.\""));
      }

      for (var i = 0; i < this.events[name].length; i++) {
        this.events[name][i](value, this);
      }
    }
  }, {
    key: "metric",
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
    key: "_onError",
    value: function _onError(type, message, error) {
      this.logger.warn(type, ':', message);
      this.logger.error(error);
    }
  }, {
    key: "_html5Play",
    value: function _html5Play() {
      var _this2 = this;

      // @see - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
      try {
        var promise = this.videoElement.play();

        if (typeof promise !== 'undefined') {
          promise["catch"](function (error) {
            _this2._onError('play.promise', 'Error while trying to play clsp video', error);
          });
        }
      } catch (error) {
        this._onError('play.notPromise', 'Error while trying to play clsp video - the play operation was NOT a promise!', error);
      }
    }
  }, {
    key: "reinitializeMseWrapper",
    value: function () {
      var _reinitializeMseWrapper = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(mimeCodec) {
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
                this.mseWrapper = _MSEWrapper__WEBPACK_IMPORTED_MODULE_1__["default"].factory(this.videoElement);
                this.mseWrapper.on('metric', function (_ref2) {
                  var type = _ref2.type,
                      value = _ref2.value;

                  _this3.trigger('metric', {
                    type: type,
                    value: value
                  });
                });
                this.mseWrapper.initializeMediaSource({
                  onSourceOpen: function () {
                    var _onSourceOpen = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee5() {
                      return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              _this3.logger.debug('on mediaSource sourceopen');

                              _context5.next = 3;
                              return _this3.mseWrapper.initializeSourceBuffer(mimeCodec, {
                                onAppendStart: function onAppendStart(byteArray) {
                                  _this3.logger.silly('On Append Start...');

                                  _this3.iov.onAppendStart(byteArray);
                                },
                                onAppendFinish: function onAppendFinish(info) {
                                  _this3.logger.silly('On Append Finish...');

                                  if (!_this3.firstFrameShown) {
                                    _this3.firstFrameShown = true;

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
                                    _this3.logger.debug('Video is paused!');

                                    _this3._html5Play();
                                  }
                                },
                                onRemoveFinish: function onRemoveFinish(info) {
                                  _this3.logger.debug('onRemoveFinish');
                                },
                                onAppendError: function () {
                                  var _onAppendError = _asyncToGenerator(
                                  /*#__PURE__*/
                                  regeneratorRuntime.mark(function _callee2(error) {
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
                                          case "end":
                                            return _context2.stop();
                                        }
                                      }
                                    }, _callee2);
                                  }));

                                  function onAppendError(_x4) {
                                    return _onAppendError.apply(this, arguments);
                                  }

                                  return onAppendError;
                                }(),
                                onRemoveError: function onRemoveError(error) {
                                  if (error.constructor.name === 'DOMException') {
                                    // @todo - every time the mseWrapper is destroyed, there is a
                                    // sourceBuffer error.  No need to log that, but you should fix it
                                    return;
                                  } // observed this fail during a memry snapshot in chrome
                                  // otherwise no observed failure, so ignore exception.


                                  _this3._onError('sourceBuffer.remove', 'Error while removing segments from sourceBuffer', error);
                                },
                                onStreamFrozen: function () {
                                  var _onStreamFrozen = _asyncToGenerator(
                                  /*#__PURE__*/
                                  regeneratorRuntime.mark(function _callee3() {
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                      while (1) {
                                        switch (_context3.prev = _context3.next) {
                                          case 0:
                                            _this3.logger.debug('stream appears to be frozen - reinitializing...');

                                            _context3.next = 3;
                                            return _this3.reinitializeMseWrapper(mimeCodec);

                                          case 3:
                                          case "end":
                                            return _context3.stop();
                                        }
                                      }
                                    }, _callee3);
                                  }));

                                  function onStreamFrozen() {
                                    return _onStreamFrozen.apply(this, arguments);
                                  }

                                  return onStreamFrozen;
                                }(),
                                onError: function () {
                                  var _onError2 = _asyncToGenerator(
                                  /*#__PURE__*/
                                  regeneratorRuntime.mark(function _callee4(error) {
                                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                      while (1) {
                                        switch (_context4.prev = _context4.next) {
                                          case 0:
                                            _this3._onError('mediaSource.sourceBuffer.generic', 'mediaSource sourceBuffer error', error);

                                            _context4.next = 3;
                                            return _this3.reinitializeMseWrapper(mimeCodec);

                                          case 3:
                                          case "end":
                                            return _context4.stop();
                                        }
                                      }
                                    }, _callee4);
                                  }));

                                  function onError(_x5) {
                                    return _onError2.apply(this, arguments);
                                  }

                                  return onError;
                                }()
                              });

                            case 3:
                              _this3.trigger('videoInfoReceived'); // @todo - the moovBox is currently set in the IOV - do something else


                              _this3.mseWrapper.appendMoov(_this3.moovBox);

                            case 5:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      }, _callee5);
                    }));

                    function onSourceOpen() {
                      return _onSourceOpen.apply(this, arguments);
                    }

                    return onSourceOpen;
                  }(),
                  onSourceEnded: function () {
                    var _onSourceEnded = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee6() {
                      return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              _this3.logger.debug('on mediaSource sourceended');

                              _context6.next = 3;
                              return _this3.stop();

                            case 3:
                            case "end":
                              return _context6.stop();
                          }
                        }
                      }, _callee6);
                    }));

                    function onSourceEnded() {
                      return _onSourceEnded.apply(this, arguments);
                    }

                    return onSourceEnded;
                  }(),
                  onError: function onError(error) {
                    _this3._onError('mediaSource.generic', 'mediaSource error', // @todo - sometimes, this error is an event rather than an error!
                    // If different onError calls use different method signatures, that
                    // needs to be accounted for in the MSEWrapper, and the actual error
                    // that was thrown must ALWAYS be the first argument here.  As a
                    // shortcut, we can log `...args` here instead.
                    error);
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
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function reinitializeMseWrapper(_x3) {
        return _reinitializeMseWrapper.apply(this, arguments);
      }

      return reinitializeMseWrapper;
    }()
  }, {
    key: "restart",
    value: function () {
      var _restart = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                this.logger.debug('restart');
                _context8.next = 3;
                return this.iov.stop();

              case 3:
                _context8.next = 5;
                return this.iov.play();

              case 5:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function restart() {
        return _restart.apply(this, arguments);
      }

      return restart;
    }()
  }, {
    key: "play",
    value: function () {
      var _play = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                this.logger.debug('play');
                this.stopped = false;
                _context9.next = 4;
                return this.iov._play(this.onMoov, this.onMoof);

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function play() {
        return _play.apply(this, arguments);
      }

      return play;
    }()
  }, {
    key: "stop",
    value: function stop() {
      var _this4 = this;

      this.logger.debug('stop...');
      this.stopped = true;
      this.moovBox = null;

      this.iov._stop();

      this.logger.debug('stop about to finish synchronous operations and return promise...'); // The logic above MUST be run synchronously when called, therefore,
      // we cannot use async to define the stop method, and must return a
      // promise here rather than using await.  We return this promise so
      // that the caller has the option of waiting, but is not forced to
      // wait.

      return new Promise(function (resolve, reject) {
        // Don't wait until the next play event or the destruction of this player
        // to clear the MSE
        if (_this4.mseWrapper) {
          _this4.mseWrapper.destroy().then(function () {
            _this4.mseWrapper = null;

            _this4.logger.debug('stop succeeded asynchronously...');

            resolve();
          })["catch"](function (error) {
            _this4.mseWrapper = null;

            _this4.logger.error('stop failed asynchronously...');

            reject(error);
          });
        } else {
          _this4.logger.debug('stop succeeded asynchronously...');

          resolve();
        }
      });
    }
  }, {
    key: "getSegmentIntervalMetrics",
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
    key: "_freeAllResources",
    value: function _freeAllResources() {
      this.logger.debug('_freeAllResources...'); // Note you will need to destroy the iov yourself.  The child should
      // probably not destroy the parent

      this.iov = null;
      this.firstFrameShown = null;
      this.events = null;
      this.metrics = null;
      this.LogSourceBuffer = null;
      this.LogSourceBufferTopic = null;
      this.latestSegmentReceived = null;
      this.segmentIntervalAverage = null;
      this.segmentInterval = null;
      this.segmentIntervals = null;
      this.moovBox = null;
      this.logger.debug('_freeAllResources finished...');
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this5 = this;

      this.logger.debug('destroy...');

      if (this.destroyed) {
        return;
      }

      this.destroyed = true; // Note that we DO NOT wait for the stop command to finish execution,
      // because this destroy method MUST be treated as a synchronous operation
      // to ensure that the caller is not forced to wait on destruction.  This
      // allows us to properly support client side libraries and frameworks that
      // do not support asynchronous destruction.  See the comments in the destroy
      // method on the MSEWrapper for a more detailed explanation.

      this.logger.debug('about to stop...');
      this.stop().then(function () {
        _this5.logger.debug('stopped successfully...');

        _this5._freeAllResources();

        _this5.logger.debug('destroy successfully finished...');
      })["catch"](function (error) {
        _this5.logger.debug('stopped unsuccessfully...');

        _this5.logger.error('Error while destroying the iov player!');

        _this5.logger.error(error);

        _this5._freeAllResources();

        _this5.logger.debug('destroy unsuccessfully finished...');
      }); // Setting the src of the video element to an empty string is
      // the only reliable way we have found to ensure that MediaSource,
      // SourceBuffer, and various Video elements are properly dereferenced
      // to avoid memory leaks

      this.videoElement.src = '';
      this.videoElement = null;
      this.logger.debug('exiting destroy, asynchronous destroy logic in progress...');
    }
  }]);

  return IOVPlayer;
}();

_defineProperty(IOVPlayer, "EVENT_NAMES", ['metric', 'firstFrameShown', 'videoReceived', 'videoInfoReceived']);

_defineProperty(IOVPlayer, "METRIC_TYPES", ['sourceBuffer.bufferTimeEnd', 'video.currentTime', 'video.drift', 'video.driftCorrection', 'video.segmentInterval', 'video.segmentIntervalAverage']);

_defineProperty(IOVPlayer, "SEGMENT_INTERVAL_SAMPLE_SIZE", 5);

_defineProperty(IOVPlayer, "DRIFT_CORRECTION_CONSTANT", 2);



/***/ }),

/***/ "./src/js/utils/index.js":
/*!*******************************!*\
  !*** ./src/js/utils/index.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils/utils.js");




if (!window.clspUtils) {
  window.clspUtils = _utils__WEBPACK_IMPORTED_MODULE_0__["default"];
}

/* harmony default export */ __webpack_exports__["default"] = (_utils__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/js/utils/logger.js":
/*!********************************!*\
  !*** ./src/js/utils/logger.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

/* eslint no-console: off */

/**
 * We use this in the router as well, so keep it light and ES5!
 */

/* harmony default export */ __webpack_exports__["default"] = (function (logLevel) {
  function Logger(prefix) {
    if (logLevel === undefined) {
      // The logLevel may be set in localstorage
      // e.g. localStorage.setItem('skyline.clspPlugin.logLevel', 3), then refresh
      logLevel = isNaN(Number(window.localStorage.getItem('skyline.clspPlugin.logLevel'))) ? 1 : Number(window.localStorage.getItem('skyline.clspPlugin.logLevel'));
      window.localStorage.setItem('skyline.clspPlugin.logLevel', logLevel);
    }

    this.logLevel = logLevel;
    this.prefix = prefix;
  }

  Logger.factory = function (prefix) {
    return new Logger(prefix || '');
  };

  Logger.prototype._constructMessage = function (type, message) {
    if (!this.prefix) {
      return message;
    }

    return this.prefix + ' (' + type + ')' + ' --> ' + message;
  };

  Logger.prototype.silly = function (message) {
    if (this.logLevel >= 4) {
      console.log(this._constructMessage('silly', message));
    }
  };

  Logger.prototype.debug = function (message) {
    if (this.logLevel >= 3) {
      console.log(this._constructMessage('debug', message));
    }
  };

  Logger.prototype.info = function (message) {
    if (this.logLevel >= 2) {
      console.log(this._constructMessage('info', message));
    }
  };

  Logger.prototype.warn = function (message) {
    if (this.logLevel >= 1) {
      console.warn(this._constructMessage('warn', message));
    }
  };

  Logger.prototype.error = function (message) {
    console.error(this._constructMessage('error', message));
  };

  return Logger;
});

/***/ }),

/***/ "./src/js/utils/utils.js":
/*!*******************************!*\
  !*** ./src/js/utils/utils.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../package.json */ "./package.json");
var _package_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../../package.json */ "./package.json", 1);
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/logger */ "./src/js/utils/logger.js");




var PLUGIN_NAME = 'clsp';
var MINIMUM_CHROME_VERSION = 52; // @todo - this mime type, though used in the videojs plugin, and
// seemingly enforced, is not actually enforced.  The only enforcement
// done is requiring the user provide this string on the video element
// in the DOM.  The codecs that are supplied by the SFS's vary.  Here
// are some "valid", though not enforced mimeCodec values I have come
// across:
// video/mp4; codecs="avc1.4DE016"
// video/mp4; codecs="avc1.42E00C"
// video/mp4; codecs="avc1.42E00D"

var SUPPORTED_MIME_TYPE = "video/mp4; codecs='avc1.42E01E'";
var logger = Object(_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])().factory();

function browserIsCompatable() {
  try {
    mediaSourceExtensionsCheck();
  } catch (error) {
    logger.error(error);
    return false;
  } // We don't support Internet Explorer


  var isInternetExplorer = navigator.userAgent.toLowerCase().indexOf('trident') > -1;

  if (isInternetExplorer) {
    logger.debug('Detected Internet Explorer browser');
    return false;
  } // We don't support Edge (yet)


  var isEdge = navigator.userAgent.toLowerCase().indexOf('edge') > -1;

  if (isEdge) {
    logger.debug('Detected Edge browser');
    return false;
  } // We support a limited number of streams in Firefox
  // no specific version of firefox required for now.


  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  if (isFirefox) {
    logger.debug('Detected Firefox browser');
    return true;
  } // Most browsers have "Chrome" in their user agent.  The above filters rule
  // out Internet Explorer and Edge, so we are going to assume that if we're at
  // this point, we're really dealing with Chrome.


  var isChrome = Boolean(window.chrome);

  if (!isChrome) {
    return false;
  }

  try {
    // Rather than accounting for match returning null, we'll catch the error
    var chromeVersion = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10);
    logger.debug("Detected Chrome version ".concat(chromeVersion));
    return chromeVersion >= MINIMUM_CHROME_VERSION;
  } catch (error) {
    logger.error(error);
    return false;
  }
}

function mediaSourceExtensionsCheck() {
  // For the MAC
  window.MediaSource = window.MediaSource || window.WebKitMediaSource;

  if (!window.MediaSource) {
    throw new Error('Media Source Extensions not supported in your browser: Claris Live Streaming will not work!');
  }
}

function isSupportedMimeType(mimeType) {
  return mimeType === SUPPORTED_MIME_TYPE;
}

function _getWindowStateNames() {
  logger.debug('Determining Page_Visibility_API property names.'); // @see - https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

  if (typeof document.hidden !== 'undefined') {
    logger.debug('Using standard Page_Visibility_API property names.');
    return {
      hiddenStateName: 'hidden',
      visibilityChangeEventName: 'visibilitychange'
    };
  }

  if (typeof document.msHidden !== 'undefined') {
    logger.debug('Using Microsoft Page_Visibility_API property names.');
    return {
      hiddenStateName: 'msHidden',
      visibilityChangeEventName: 'msvisibilitychange'
    };
  }

  if (typeof document.webkitHidden !== 'undefined') {
    logger.debug('Using Webkit Page_Visibility_API property names.');
    return {
      hiddenStateName: 'webkitHidden',
      visibilityChangeEventName: 'webkitvisibilitychange'
    };
  }

  logger.error('Unable to use the page visibility api - switching tabs and minimizing the page may result in slow downs and page crashes.');
  return {
    hiddenStateName: '',
    visibilityChangeEventName: ''
  };
}

/* harmony default export */ __webpack_exports__["default"] = ({
  version: _package_json__WEBPACK_IMPORTED_MODULE_0__["version"],
  name: PLUGIN_NAME,
  supported: browserIsCompatable,
  mediaSourceExtensionsCheck: mediaSourceExtensionsCheck,
  isSupportedMimeType: isSupportedMimeType,
  windowStateNames: _getWindowStateNames()
});

/***/ }),

/***/ "./src/js/video-js-plugin/MqttHandler.js":
/*!***********************************************!*\
  !*** ./src/js/video-js-plugin/MqttHandler.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MqttHandler; });
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _iov_collection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../iov/collection */ "./src/js/iov/collection.js");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/logger */ "./src/js/utils/logger.js");
 // This is configured as an external library by webpack, so the caller must
// provide videojs on `window`

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var Component = video_js__WEBPACK_IMPORTED_MODULE_0___default.a.getComponent('Component');
var DEFAULT_CHANGE_SOURCE_MAX_WAIT = 5000;

var MqttHandler =
/*#__PURE__*/
function (_Component) {
  _inherits(MqttHandler, _Component);

  function MqttHandler(source, tech, options) {
    var _this;

    _classCallCheck(this, MqttHandler);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MqttHandler).call(this, tech, options.mqtt));

    _defineProperty(_assertThisInitialized(_this), "onChangeSource", function (event, _ref) {
      var url = _ref.url;

      _this.logger.debug("changeSource on player \"".concat(_this.id, "\"\""));

      if (!url) {
        throw new Error('Unable to change source because there is no url!');
      }

      var clone = _this.iov.cloneFromUrl(url);

      clone.initialize(); // When the tab is not in focus, chrome doesn't handle things the same
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
        _this.updateIOV(clone);
      }, _this.changeSourceMaxWait); // Under normal circumstances, meaning when the tab is in focus, we want
      // to respond by switching the IOV when the new IOV Player has something
      // to display

      clone.player.on('firstFrameShown', function () {
        _this.updateIOV(clone);
      });
    });

    _this.logger = Object(_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])().factory('MqttHandler');

    _this.logger.debug('constructor');

    _this.tech_ = tech;
    _this.source_ = source; // @todo - is there a better way to do this where we don't pollute the
    // top level namespace?

    _this.changeSourceMaxWait = options.changeSourceMaxWait || DEFAULT_CHANGE_SOURCE_MAX_WAIT;
    _this.iov = null;
    _this.player = null;
    return _this;
  }

  _createClass(MqttHandler, [{
    key: "createIOV",
    value: function () {
      var _createIOV = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(player) {
        var _this2 = this;

        var videoId, videoJsVideoElement, videoElementParent, videoElement, iov;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.logger.debug('createIOV');
                this.player = player;
                videoId = "clsp-video-".concat(uuid_v4__WEBPACK_IMPORTED_MODULE_1___default()());
                videoJsVideoElement = this.player.el().firstChild;
                videoElementParent = videoJsVideoElement.parentNode; // when videojs initializes the video element (or something like that),
                // it creates events and listeners on that element that it uses, however
                // these events interfere with our ability to play clsp streams.  Cloning
                // the element like this and reinserting it is a blunt instrument to remove
                // all of the videojs events so that we are in control of the player.

                videoElement = videoJsVideoElement.cloneNode();
                videoElement.setAttribute('id', videoId);
                videoElementParent.insertBefore(videoElement, videoJsVideoElement);
                _context.next = 10;
                return _iov_collection__WEBPACK_IMPORTED_MODULE_2__["default"].asSingleton().create(this.source_.src, videoElement);

              case 10:
                iov = _context.sent;
                this.player.on('ready', function () {
                  if (_this2.onReadyAlreadyCalled) {
                    _this2.logger.warn('tried to use this player more than once...');

                    return;
                  }

                  _this2.onReadyAlreadyCalled = true;

                  var videoTag = _this2.player.children()[0]; // @todo - there must be a better way to determine autoplay...


                  if (videoTag.getAttribute('autoplay') !== null) {
                    // playButton.trigger('click');
                    _this2.player.trigger('play', videoTag);
                  }

                  iov.on('firstFrameShown', function () {
                    _this2.player.trigger('firstFrameShown');

                    videoTag.style.display = 'none';
                  });
                  iov.on('videoReceived', function () {
                    // reset the timeout monitor from videojs-errors
                    _this2.player.trigger('timeupdate');
                  });
                  iov.on('videoInfoReceived', function () {
                    // reset the timeout monitor from videojs-errors
                    _this2.player.trigger('timeupdate');
                  });

                  _this2.player.on('changesrc', _this2.onChangeSource);
                });
                this.updateIOV(iov); // this.iov.on('unsupportedMimeCodec', (error) => {
                //   this.videoPlayer.errors.extend({
                //     PLAYER_ERR_IOV: {
                //       headline: 'Error Playing Stream',
                //       message: error,
                //     },
                //   });
                //   this.videoPlayer.error({
                //     code: 'PLAYER_ERR_IOV',
                //   });
                // });

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createIOV(_x) {
        return _createIOV.apply(this, arguments);
      }

      return createIOV;
    }()
  }, {
    key: "updateIOV",
    value: function updateIOV(iov) {
      this.logger.debug('updateIOV');

      if (this.iov) {
        // If the IOV is the same, do nothing
        if (this.iov.id === iov.id) {
          return;
        }

        _iov_collection__WEBPACK_IMPORTED_MODULE_2__["default"].asSingleton().remove(this.iov.id).add(iov.id, iov);
      }

      this.iov = iov;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.logger.debug('destroy');

      if (this.destroyed) {
        return;
      }

      this.destroyed = true;

      if (this.onReadyAlreadyCalled) {
        this.player.off('changesrc', this.onChangeSource);
      }

      _iov_collection__WEBPACK_IMPORTED_MODULE_2__["default"].asSingleton().remove(this.iov.id);
      this.iov = null;
      this.player = null;
    }
  }]);

  return MqttHandler;
}(Component);



/***/ }),

/***/ "./src/js/video-js-plugin/MqttSourceHandler.js":
/*!*****************************************************!*\
  !*** ./src/js/video-js-plugin/MqttSourceHandler.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/logger */ "./src/js/utils/logger.js");
/* harmony import */ var _MqttHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MqttHandler */ "./src/js/video-js-plugin/MqttHandler.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./src/js/utils/index.js");
 // This is configured as an external library by webpack, so the caller must
// provide videojs on `window`





var SUPPORTED_MIME_TYPE = "video/mp4; codecs='avc1.42E01E'";
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var logger = Object(_utils_logger__WEBPACK_IMPORTED_MODULE_1__["default"])().factory('MqttSourceHandler');
  return function (mode) {
    var obj = {
      canHandleSource: function canHandleSource(srcObj) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        logger.debug('canHandleSource');

        if (!srcObj.src) {
          logger.debug("srcObj doesn't contain src");
          return false;
        }

        if (!srcObj.src.startsWith('clsp')) {
          logger.debug('srcObj.src is not clsp protocol');
          return false;
        } // Note that we used to do a browser compatibility check here, but if
        // we return false when the browser does not support CLSP, videojs's
        // failover mechanisms do not continue.  Meaning, if we return false
        // here, and a second HLS source is supplied in the video tag (for
        // example), videojs will never try to play the HLS url with the HLS
        // tech.


        return obj.canPlayType(srcObj.type);
      },
      handleSource: function handleSource(source, tech) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        logger.debug('handleSource');
        var localOptions = video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mergeOptions(video_js__WEBPACK_IMPORTED_MODULE_0___default.a.options, options, {
          mqtt: {
            mode: mode
          }
        });
        tech.mqtt = new _MqttHandler__WEBPACK_IMPORTED_MODULE_2__["default"](source, tech, localOptions);
        return tech.mqtt;
      },
      canPlayType: function canPlayType(type) {
        logger.debug('canPlayType');

        if (type === SUPPORTED_MIME_TYPE) {
          return 'maybe';
        } // eslint-disable-next-line no-console


        console.error("clsp type='".concat(type, "' rejected"));
        return '';
      }
    };
    return obj;
  };
});

/***/ }),

/***/ "./src/js/video-js-plugin/index.js":
/*!*****************************************!*\
  !*** ./src/js/video-js-plugin/index.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! srcdoc-polyfill */ "./node_modules/srcdoc-polyfill/srcdoc-polyfill.js");
/* harmony import */ var srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/ */ "./src/js/utils/index.js");
/* harmony import */ var _plugin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plugin */ "./src/js/video-js-plugin/plugin.js");
/* harmony import */ var _styles_videojs_mse_over_clsp_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../styles/videojs-mse-over-clsp.scss */ "./src/styles/videojs-mse-over-clsp.scss");
/* harmony import */ var _styles_videojs_mse_over_clsp_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_videojs_mse_over_clsp_scss__WEBPACK_IMPORTED_MODULE_3__);






var clspPlugin = Object(_plugin__WEBPACK_IMPORTED_MODULE_2__["default"])(); // @todo - do not initialize the plugin by default, since that is a side
// effect.  make the caller call the initialize function.  also, is it
// possible to unregister the plugin?

clspPlugin.register();
/* harmony default export */ __webpack_exports__["default"] = (clspPlugin);

/***/ }),

/***/ "./src/js/video-js-plugin/plugin.js":
/*!******************************************!*\
  !*** ./src/js/video-js-plugin/plugin.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _MqttSourceHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MqttSourceHandler */ "./src/js/video-js-plugin/MqttSourceHandler.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "./src/js/utils/index.js");
/* harmony import */ var _utils_logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/logger */ "./src/js/utils/logger.js");
 // This is configured as an external library by webpack, so the caller must
// provide videojs on `window`

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var Plugin = video_js__WEBPACK_IMPORTED_MODULE_0___default.a.getPlugin('plugin'); // Note that the value can never be zero!

var VIDEOJS_ERRORS_PLAYER_CURRENT_TIME_MIN = 1;
var VIDEOJS_ERRORS_PLAYER_CURRENT_TIME_MAX = 20;
var logger = Object(_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])().factory('clsp-videojs-plugin');
var totalPluginCount = 0;
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var _class, _temp;

  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _temp = _class =
  /*#__PURE__*/
  function (_Plugin) {
    _inherits(ClspPlugin, _Plugin);

    _createClass(ClspPlugin, null, [{
      key: "register",
      value: function register() {
        if (video_js__WEBPACK_IMPORTED_MODULE_0___default.a.getPlugin(_utils__WEBPACK_IMPORTED_MODULE_2__["default"].name)) {
          throw new Error('You can only register the clsp plugin once, and it has already been registered.');
        }

        var sourceHandler = Object(_MqttSourceHandler__WEBPACK_IMPORTED_MODULE_1__["default"])()('html5');
        video_js__WEBPACK_IMPORTED_MODULE_0___default.a.getTech('Html5').registerSourceHandler(sourceHandler, 0);
        video_js__WEBPACK_IMPORTED_MODULE_0___default.a.registerPlugin(_utils__WEBPACK_IMPORTED_MODULE_2__["default"].name, ClspPlugin);
        logger.debug('plugin registered');
        return ClspPlugin;
      }
    }, {
      key: "getDefaultOptions",
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
      var _this;

      _classCallCheck(this, ClspPlugin);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ClspPlugin).call(this, player, options));

      _defineProperty(_assertThisInitialized(_this), "onVisibilityChange", function () {
        _this.logger.debug('tab visibility changed...');

        var hiddenStateName = _utils__WEBPACK_IMPORTED_MODULE_2__["default"].windowStateNames.hiddenStateName;

        if (document[hiddenStateName]) {
          // Continue to update the time, which will prevent videojs-errors from
          // issuing a timeout error
          _this.visibilityChangeInterval = setInterval(
          /*#__PURE__*/
          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _this.logger.debug('updating time...');

                    _this.player.trigger('timeupdate');

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          })), 2000);
          return;
        }

        if (_this.visibilityChangeInterval) {
          clearInterval(_this.visibilityChangeInterval);
        }
      });

      _defineProperty(_assertThisInitialized(_this), "onMqttHandlerError", function () {
        _this.logger.debug('handling mqtt error...');

        var mqttHandler = _this.getMqttHandler();

        mqttHandler.destroy();

        _this.player.error({
          // @todo - change the code to 'INSUFFICIENT_RESOURCES'
          code: 0,
          type: 'INSUFFICIENT_RESOURCES',
          headline: 'Insufficient Resources',
          message: 'The current hardware cannot support the current number of playing streams.'
        });
      });

      _this.id = ++totalPluginCount;
      _this.logger = Object(_utils_logger__WEBPACK_IMPORTED_MODULE_3__["default"])().factory("CLSP Plugin ".concat(_this.id));

      _this.logger.debug('creating plugin instance');

      var playerOptions = player.options_;
      _this.options = video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mergeOptions(_objectSpread({}, _this.constructor.getDefaultOptions(), defaultOptions, playerOptions.clsp || {}), options);
      _this._playerOptions = playerOptions;
      _this.currentSourceIndex = 0;
      player.addClass('vjs-mse-over-mqtt');

      if (_this.options.customClass) {
        player.addClass(_this.options.customClass);
      }

      _this.resetErrors(player); // @todo - this error doesn't work or display the way it's intended to


      if (!_utils__WEBPACK_IMPORTED_MODULE_2__["default"].supported()) {
        return _possibleConstructorReturn(_this, player.error({
          code: 'PLAYER_ERR_NOT_COMPAT',
          type: 'PLAYER_ERR_NOT_COMPAT',
          dismiss: false
        }));
      }

      _this.autoplayEnabled = playerOptions.autoplay || player.getAttribute('autoplay') === 'true'; // for debugging...
      // const oldTrigger = player.trigger.bind(player);
      // player.trigger = (eventName, ...args) => {
      //   console.log(eventName);
      //   console.log(...args);
      //   oldTrigger(eventName, ...args);
      // };
      // Track the number of times we've retried on error

      player._errorRetriesCount = 0; // Needed to make videojs-errors think that the video is progressing.
      // If we do not do this, videojs-errors will give us a timeout error.
      // The number just needs to change, it doesn't need to continually increment

      player._currentTime = VIDEOJS_ERRORS_PLAYER_CURRENT_TIME_MIN;

      player.currentTime = function () {
        // Don't let this number get over 2 billion!
        if (player._currentTime > VIDEOJS_ERRORS_PLAYER_CURRENT_TIME_MAX) {
          player._currentTime = VIDEOJS_ERRORS_PLAYER_CURRENT_TIME_MIN;
        } else {
          player._currentTime++;
        }

        return player._currentTime;
      }; // @todo - are we not using videojs properly?
      // @see - https://github.com/videojs/video.js/issues/5233
      // @see - https://jsfiddle.net/karstenlh/96hrzp5w/
      // This is currently needed for autoplay.


      player.on('ready', function () {
        _this.logger.debug('the player is ready');

        if (_this.autoplayEnabled) {
          // Even though the "ready" event has fired, it's not actually ready
          // until the "next tick"...
          setTimeout(function () {
            player.play();
          });
        }
      }); // @todo - this seems like we aren't using videojs properly

      player.on('error',
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee3(event) {
          var retry, error;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _this.logger.debug('the player encountered an error');

                  retry =
                  /*#__PURE__*/
                  function () {
                    var _ref3 = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee2() {
                      var iov;
                      return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _this.logger.debug('retrying due to error');

                              if (!(_this.options.maxRetriesOnError === 0)) {
                                _context2.next = 3;
                                break;
                              }

                              return _context2.abrupt("return");

                            case 3:
                              if (!(_this.options.maxRetriesOnError < 0 || player._errorRetriesCount <= _this.options.maxRetriesOnError)) {
                                _context2.next = 14;
                                break;
                              }

                              // @todo - when can we reset this to zero?
                              player._errorRetriesCount++;

                              _this.resetErrors(player);

                              iov = _this.getIov(); // @todo - investigate how this can be called when the iov has been destroyed

                              if (!(!iov || iov.destroyed)) {
                                _context2.next = 12;
                                break;
                              }

                              _context2.next = 10;
                              return _this.initializeIOV(player);

                            case 10:
                              _context2.next = 14;
                              break;

                            case 12:
                              _context2.next = 14;
                              return iov.restart();

                            case 14:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2);
                    }));

                    return function retry() {
                      return _ref3.apply(this, arguments);
                    };
                  }();

                  error = player.error();
                  _context3.t0 = error.code;
                  _context3.next = _context3.t0 === -2 ? 6 : _context3.t0 === 0 ? 7 : _context3.t0 === 4 ? 7 : _context3.t0 === 5 ? 7 : _context3.t0 === 'PLAYER_ERR_IOV' ? 7 : 8;
                  break;

                case 6:
                  return _context3.abrupt("return", retry());

                case 7:
                  return _context3.abrupt("break", 9);

                case 8:
                  return _context3.abrupt("return", retry());

                case 9:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }());
      player.on('play',
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _this.logger.debug('on player play event'); // @todo - it is probably unnecessary to have to completely tear down the
                // existing iov and create a new one.  But for now, this works


                _context4.next = 3;
                return _this.initializeIOV(player);

              case 3:
                // @todo - this hides it permanently.  it should be re-enabled when the
                // player stops or pauses.  This will likely involve using some videojs
                // classes rather than using the .hide method
                _this.player.loadingSpinner.hide();

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))); // the "pause" event gets triggered for some reason in scenarios where I do
      // not expect it to be triggered.  Therefore, we will create our own "stop"
      // event to be able to better control the player to stop.

      player.on('stop', function () {
        _this.logger.debug('on player stop event');

        _this.player.pause();

        _this.getIov().stop();
      });
      player.on('dispose', function () {
        _this.logger.debug('on dispose stop event');

        _this.destroy(player);
      });
      var visibilityChangeEventName = _utils__WEBPACK_IMPORTED_MODULE_2__["default"].windowStateNames.visibilityChangeEventName;

      if (visibilityChangeEventName) {
        document.addEventListener(visibilityChangeEventName, _this.onVisibilityChange, false);
      }

      return _this;
    }

    _createClass(ClspPlugin, [{
      key: "getVideojsErrorsOptions",
      value: function getVideojsErrorsOptions() {
        this.logger.debug('getting videojs errors options...');
        return _objectSpread({
          timeout: 120 * 1000,
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
      key: "resetErrors",
      value: function resetErrors(player) {
        this.logger.debug('resetting errors...'); // @see - https://github.com/videojs/video.js/issues/4401

        player.error(null);
        player.errorDisplay.close(); // Support for the videojs-errors library
        // After an error occurs, and then we clear the error and its message
        // above, we must re-enable videojs-errors on the player

        if (player.errors) {
          player.errors(this.getVideojsErrorsOptions());
        }
      }
    }, {
      key: "getMqttHandler",
      value: function getMqttHandler() {
        var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.player;
        this.logger.debug('getting mqtt handler IOV...');
        return player.tech(true).mqtt;
      }
    }, {
      key: "getIov",
      value: function getIov() {
        this.logger.debug('getting IOV...');
        return this.getMqttHandler().iov;
      }
    }, {
      key: "initializeIOV",
      value: function () {
        var _initializeIOV = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee5(player) {
          var _this2 = this;

          var mqttHandler, iovPlayer;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  this.logger.debug('initializing IOV...');
                  mqttHandler = this.getMqttHandler();

                  if (mqttHandler) {
                    _context5.next = 4;
                    break;
                  }

                  throw new Error("VideoJS Player ".concat(player.id(), " does not have mqtt tech!"));

                case 4:
                  mqttHandler.off('error', this.onMqttHandlerError);
                  mqttHandler.on('error', this.onMqttHandlerError);
                  _context5.next = 8;
                  return mqttHandler.createIOV(player, {
                    enableMetrics: this.options.enableMetrics,
                    defaultNonSslPort: this.options.defaultNonSslPort,
                    defaultSslPort: this.options.defaultSslPort
                  });

                case 8:
                  iovPlayer = this.getIov();
                  this.logger.debug('resgistering "firstFrameShown" event');
                  iovPlayer.on('firstFrameShown', function () {
                    _this2.logger.debug('about to trigger "firstFrameShown" event on videojs player');

                    player.trigger('firstFrameShown');
                  });
                  _context5.next = 13;
                  return iovPlayer.restart();

                case 13:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));

        function initializeIOV(_x2) {
          return _initializeIOV.apply(this, arguments);
        }

        return initializeIOV;
      }()
    }, {
      key: "destroy",
      value: function destroy() {
        var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.player;
        this.logger.debug('destroying...'); // Note that when the 'dispose' event is fired, this.player no longer exists

        if (!player) {
          this.logger.warn('Unable to destroy CLSP Plugin without the player!');
          return;
        }

        if (this.destroyed) {
          this.logger.debug('Tried to destroy when already destroyed');
          return;
        }

        this.destroyed = true; // @todo - destroy the tech, since it is a player-specific instance

        try {
          var mqttHandler = this.getMqttHandler(player);
          mqttHandler.destroy();
          mqttHandler.off('error', this.onMqttHandlerError);
          var visibilityChangeEventName = _utils__WEBPACK_IMPORTED_MODULE_2__["default"].windowStateNames.visibilityChangeEventName;

          if (visibilityChangeEventName) {
            this.logger.debug('removing onVisibilityChange listener...');
            document.removeEventListener(visibilityChangeEventName, this.onVisibilityChange);
          }

          if (this.visibilityChangeInterval) {
            this.logger.debug('removing visibilityChangeInterval...');
            clearInterval(this.visibilityChangeInterval);
          }

          this._playerOptions = null;
          this.currentSourceIndex = null;
        } catch (error) {
          // @todo - need to improve iov destroy logic...
          this.logger.error('Error while destroying clsp plugin instance!');
          this.logger.error(error);
        }
      }
    }]);

    return ClspPlugin;
  }(Plugin), _defineProperty(_class, "VERSION", _utils__WEBPACK_IMPORTED_MODULE_2__["default"].version), _defineProperty(_class, "utils", _utils__WEBPACK_IMPORTED_MODULE_2__["default"]), _defineProperty(_class, "METRIC_TYPES", ['videojs.errorRetriesCount']), _temp;
});

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
  !*** multi ./src/js/video-js-plugin/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/user/projects/clsp/clsp-videojs-plugin/src/js/video-js-plugin/index.js */"./src/js/video-js-plugin/index.js");


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