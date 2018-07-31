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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/videojs-mse-over-clsp.js");
/******/ })
/************************************************************************/
/******/ ({

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
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_0__);
/*! @name videojs-errors @version 4.1.1 @license Apache-2.0 */


var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var empty = {};

var empty$1 = /*#__PURE__*/Object.freeze({
  default: empty
});

var minDoc = empty$1 && empty || empty$1;

var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof window !== 'undefined' ? window : {};

var doccy;

if (typeof document !== 'undefined') {
  doccy = document;
} else {
  doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

  if (!doccy) {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
  }
}

var document_1 = doccy;

var version = "4.1.1";

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
    var content = document_1.createElement('div');
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

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

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, main, generator-videojs-plugin, scripts, keywords, author, license, dependencies, devDependencies, default */
/***/ (function(module) {

module.exports = {"name":"videojs-mse-over-clsp","version":"0.9.0","description":"Uses clsp (iot) as a video distribution system, video is is received via the clsp client then rendered using the media source extensions. ","main":"dist/videojs-mse-over-clsp.js","generator-videojs-plugin":{"version":"5.0.0"},"scripts":{"build":"gulp build","lint":"eslint ./ --cache --quiet --ext .jsx --ext .js","lint-fix":"eslint ./ --cache --quiet --ext .jsx --ext .js --fix","postversion":"git push && git push --tags","start-dev":"gulp start-dev"},"keywords":["videojs","videojs-plugin"],"author":"dschere@skylinenet.net","license":"MIT","dependencies":{"debug":"^3.1.0","node-sass":"^4.9.1","paho-mqtt":"^1.0.4","videojs-errors":"^4.1.1"},"devDependencies":{"babel-core":"^6.26.3","babel-eslint":"^8.2.5","babel-loader":"^7.1.5","babel-plugin-transform-class-properties":"^6.24.1","babel-plugin-transform-object-rest-spread":"^6.26.0","babel-polyfill":"^6.26.0","babel-preset-env":"^1.7.0","css-loader":"^0.28.11","eslint":"^5.0.1","extract-text-webpack-plugin":"^4.0.0-beta.0","gulp":"^3.9.1","gulp-load-plugins":"^1.5.0","gulp-rm":"^1.0.5","js-string-escape":"^1.0.1","pre-commit":"^1.2.2","run-sequence":"^2.2.0","sass-loader":"^7.0.3","srcdoc-polyfill":"^1.0.0","standard":"^11.0.1","style-loader":"^0.21.0","uglifyjs-webpack-plugin":"^1.2.7","webpack":"^4.15.1","webpack-serve":"^0.1.5"}};

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






/* harmony default export */ __webpack_exports__["default"] = (function (SrcsLookupTable) {
    var Component = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getComponent('Component');

    var MqttHandler = function (_Component) {
        _inherits(MqttHandler, _Component);

        function MqttHandler(source, tech, options, player) {
            _classCallCheck(this, MqttHandler);

            var _this = _possibleConstructorReturn(this, (MqttHandler.__proto__ || Object.getPrototypeOf(MqttHandler)).call(this, tech, options.mqtt));

            _this.playerInstance = player;
            _this.tech_ = tech;
            _this.source_ = source;
            _this.enabled = false;
            _this.playing = false;
            _this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('skyline:clsp:MqttHandler');
            return _this;
        }

        _createClass(MqttHandler, [{
            key: 'src',
            value: function src(_src) {
                if (!_src) {
                    return;
                }
                var parser = document.createElement('a');

                var useSSL = false;
                var default_port;
                var kluged_src;

                if (_src.substring(0, 5).toLowerCase() === 'clsps') {
                    useSSL = true;
                    kluged_src = _src.replace('clsps', 'https');
                    default_port = 443;
                } else {
                    // firefox/ie hack!
                    kluged_src = _src.replace('clsp', 'http');
                    default_port = 9001;
                }

                parser.href = kluged_src;
                //parser.href = "http:" + parser.pathname;

                var hostname = parser.hostname;
                var port = parser.port;
                var t = parser.pathname.split("/");
                var streamName = t[t.length - 1];

                if (port.length === 0) {
                    port = default_port;
                }

                // @ is a special address maening the server that loaded the web page.
                if (hostname === '@') {
                    hostname = window.location.hostname;
                }

                this.mqtt_player = null;
                this.port = parseInt(port);
                this.address = hostname;
                this.streamName = streamName;
                this.enabled = true;
                this.useSSL = useSSL;

                SrcsLookupTable[_src] = this;
            }
        }, {
            key: 'launchIovPlayer',
            value: function launchIovPlayer(onMqttReady) {
                var _this2 = this;

                var velm = this.player().el();

                var iov = new _iov_IOV__WEBPACK_IMPORTED_MODULE_2__["default"]({
                    port: this.port,
                    address: this.address,
                    appStart: function appStart(iov) {
                        // connected to MQTT procede to setting up callbacks
                        // debug("iov.player() called")
                        var mqtt_player = iov.player();
                        var evt = new CustomEvent("mqttReady");
                        _this2.player().el().dispatchEvent(evt);
                        onMqttReady(mqtt_player);

                        velm.addEventListener("mse-error-event", function (e) {
                            mqtt_player.restart();
                        }, false);
                    },
                    useSSL: this.useSSL,
                    videoElement: velm
                });

                iov.initialize(this.playerInstance);
            }
        }]);

        return MqttHandler;
    }(Component);

    ;

    return MqttHandler;
});

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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");





/* harmony default export */ __webpack_exports__["default"] = (function (MqttHandler) {
    var debug = debug__WEBPACK_IMPORTED_MODULE_0___default()('skyline:clsp:MqttSourceHandler');

    /*
       source handler for the source tag in html5:
       <video><source src="..." type="..."></video>
        mqttSourceHandler = {
           canPlayType: function(type) {
               // only the canned type for MediaSource entensions
               // use media source extensions to determine if
               // it can play it. MQTT/video
           },
           canHandleSource: function(source, options) {
               // check for mqtt:// .... as a protocol
           },
           handleSource : function(source, tech, options) {
           },
           dispose: function() {
               // destructor.
           }
       }
        Html5 = videojs.getTech('Html5');
       Html5.registerSourceHandler(mqttSourceHandler);
     */

    var MqttSourceHandler = function MqttSourceHandler(mode) {
        var obj = {
            canPlayType: function canPlayType(type) {
                var r = '';
                if ('MediaSource' in window) {
                    if (type === "video/mp4; codecs='avc1.42E01E'") {
                        r = 'maybe';
                    } else {
                        debug("clsp type='" + type + "' rejected");
                    }
                }
                return r;
            },
            canHandleSource: function canHandleSource(srcObj) {
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                /* This method is used to determin if the following html5 tag can be used
                   as a video source:
                    <source src="clsp://<ip addr>:<ws port>/<mqtt topic>"
                           type="video/mp4; codecs='avc1.42E01E'" />
                */
                var localOptions = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.mergeOptions(video_js__WEBPACK_IMPORTED_MODULE_1___default.a.options, options);

                if (!srcObj.src) {
                    debug("srcObj doesn't contain src");
                    debug(srcObj);
                    return false;
                }

                if (srcObj.src.startsWith("clsp") === false) {
                    debug("srcObj.src is not clsp protocol");
                    return false;
                }

                /// restrict to chrome version 52 or greater
                if (_utils__WEBPACK_IMPORTED_MODULE_2__["default"].supported() === false) {
                    debug("Browser not supported. Chrome 52+ is required.");
                    return false;
                }

                return obj.canPlayType(srcObj.type);
            },
            handleSource: function handleSource(srcObj, tech) {
                var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                var localOptions = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.mergeOptions(video_js__WEBPACK_IMPORTED_MODULE_1___default.a.options, options, { mqtt: { mode: mode } });
                // @todo - we are accessing an internal property here, which is subject
                // to change in future versions of videojs.  Is there a way for us to get
                // the ID without using this property?  Better yet, is it possible to
                // pass the player instance here rather than have to look it up through
                // videojs?
                var player = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getPlayer(tech.options_.playerId);

                tech.mqtt = new MqttHandler(srcObj, tech, localOptions, player);
                tech.mqtt.src(srcObj.src);
                return tech.mqtt;
            }
        };
        return obj;
    };

    return MqttSourceHandler;
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
var iframe_code = "/*******************************************************************************\n * Copyright (c) 2013, 2016 IBM Corp.\n *\n * All rights reserved. This program and the accompanying materials\n * are made available under the terms of the Eclipse Public License v1.0\n * and Eclipse Distribution License v1.0 which accompany this distribution.\n *\n * The Eclipse Public License is available at\n *    http://www.eclipse.org/legal/epl-v10.html\n * and the Eclipse Distribution License is available at\n *   http://www.eclipse.org/org/documents/edl-v10.php.\n *\n *******************************************************************************/\n(function(p,s){\"object\"===typeof exports&&\"object\"===typeof module?module.exports=s():\"function\"===typeof define&&define.amd?define(s):\"object\"===typeof exports?exports=s():(\"undefined\"===typeof p.Paho&&(p.Paho={}),p.Paho.MQTT=s())})(this,function(){return function(p){function s(a,b,c){b[c++]=a>>8;b[c++]=a%256;return c}function u(a,b,c,k){k=s(b,c,k);D(a,c,k);return k+b}function n(a){for(var b=0,c=0;c<a.length;c++){var k=a.charCodeAt(c);2047<k?(55296<=k&&56319>=k&&(c++,b++),b+=3):127<k?b+=2:b++}return b}\nfunction D(a,b,c){for(var k=0;k<a.length;k++){var e=a.charCodeAt(k);if(55296<=e&&56319>=e){var g=a.charCodeAt(++k);if(isNaN(g))throw Error(f(h.MALFORMED_UNICODE,[e,g]));e=(e-55296<<10)+(g-56320)+65536}127>=e?b[c++]=e:(2047>=e?b[c++]=e>>6&31|192:(65535>=e?b[c++]=e>>12&15|224:(b[c++]=e>>18&7|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b}function E(a,b,c){for(var k=\"\",e,g=b;g<b+c;){e=a[g++];if(!(128>e)){var m=a[g++]-128;if(0>m)throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),\n\"\"]));if(224>e)e=64*(e-192)+m;else{var d=a[g++]-128;if(0>d)throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),d.toString(16)]));if(240>e)e=4096*(e-224)+64*m+d;else{var l=a[g++]-128;if(0>l)throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),d.toString(16),l.toString(16)]));if(248>e)e=262144*(e-240)+4096*m+64*d+l;else throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),d.toString(16),l.toString(16)]));}}}65535<e&&(e-=65536,k+=String.fromCharCode(55296+(e>>10)),e=56320+(e&\n1023));k+=String.fromCharCode(e)}return k}var z=function(a,b){for(var c in a)if(a.hasOwnProperty(c))if(b.hasOwnProperty(c)){if(typeof a[c]!==b[c])throw Error(f(h.INVALID_TYPE,[typeof a[c],c]));}else{c=\"Unknown property, \"+c+\". Valid properties are:\";for(var k in b)b.hasOwnProperty(k)&&(c=c+\" \"+k);throw Error(c);}},v=function(a,b){return function(){return a.apply(b,arguments)}},h={OK:{code:0,text:\"AMQJSC0000I OK.\"},CONNECT_TIMEOUT:{code:1,text:\"AMQJSC0001E Connect timed out.\"},SUBSCRIBE_TIMEOUT:{code:2,\ntext:\"AMQJS0002E Subscribe timed out.\"},UNSUBSCRIBE_TIMEOUT:{code:3,text:\"AMQJS0003E Unsubscribe timed out.\"},PING_TIMEOUT:{code:4,text:\"AMQJS0004E Ping timed out.\"},INTERNAL_ERROR:{code:5,text:\"AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}\"},CONNACK_RETURNCODE:{code:6,text:\"AMQJS0006E Bad Connack return code:{0} {1}.\"},SOCKET_ERROR:{code:7,text:\"AMQJS0007E Socket error:{0}.\"},SOCKET_CLOSE:{code:8,text:\"AMQJS0008I Socket closed.\"},MALFORMED_UTF:{code:9,text:\"AMQJS0009E Malformed UTF data:{0} {1} {2}.\"},\nUNSUPPORTED:{code:10,text:\"AMQJS0010E {0} is not supported by this browser.\"},INVALID_STATE:{code:11,text:\"AMQJS0011E Invalid state {0}.\"},INVALID_TYPE:{code:12,text:\"AMQJS0012E Invalid type {0} for {1}.\"},INVALID_ARGUMENT:{code:13,text:\"AMQJS0013E Invalid argument {0} for {1}.\"},UNSUPPORTED_OPERATION:{code:14,text:\"AMQJS0014E Unsupported operation.\"},INVALID_STORED_DATA:{code:15,text:\"AMQJS0015E Invalid data in local storage key\\x3d{0} value\\x3d{1}.\"},INVALID_MQTT_MESSAGE_TYPE:{code:16,text:\"AMQJS0016E Invalid MQTT message type {0}.\"},\nMALFORMED_UNICODE:{code:17,text:\"AMQJS0017E Malformed Unicode string:{0} {1}.\"},BUFFER_FULL:{code:18,text:\"AMQJS0018E Message buffer is full, maximum buffer size: {0}.\"}},H={0:\"Connection Accepted\",1:\"Connection Refused: unacceptable protocol version\",2:\"Connection Refused: identifier rejected\",3:\"Connection Refused: server unavailable\",4:\"Connection Refused: bad user name or password\",5:\"Connection Refused: not authorized\"},f=function(a,b){var c=a.text;if(b)for(var k,e,g=0;g<b.length;g++)if(k=\"{\"+\ng+\"}\",e=c.indexOf(k),0<e)var h=c.substring(0,e),c=c.substring(e+k.length),c=h+b[g]+c;return c},A=[0,6,77,81,73,115,100,112,3],B=[0,4,77,81,84,84,4],q=function(a,b){this.type=a;for(var c in b)b.hasOwnProperty(c)&&(this[c]=b[c])};q.prototype.encode=function(){var a=(this.type&15)<<4,b=0,c=[],k=0,e;void 0!==this.messageIdentifier&&(b+=2);switch(this.type){case 1:switch(this.mqttVersion){case 3:b+=A.length+3;break;case 4:b+=B.length+3}b+=n(this.clientId)+2;void 0!==this.willMessage&&(b+=n(this.willMessage.destinationName)+\n2,e=this.willMessage.payloadBytes,e instanceof Uint8Array||(e=new Uint8Array(h)),b+=e.byteLength+2);void 0!==this.userName&&(b+=n(this.userName)+2);void 0!==this.password&&(b+=n(this.password)+2);break;case 8:for(var a=a|2,g=0;g<this.topics.length;g++)c[g]=n(this.topics[g]),b+=c[g]+2;b+=this.requestedQos.length;break;case 10:a|=2;for(g=0;g<this.topics.length;g++)c[g]=n(this.topics[g]),b+=c[g]+2;break;case 6:a|=2;break;case 3:this.payloadMessage.duplicate&&(a|=8);a=a|=this.payloadMessage.qos<<1;this.payloadMessage.retained&&\n(a|=1);var k=n(this.payloadMessage.destinationName),h=this.payloadMessage.payloadBytes,b=b+(k+2)+h.byteLength;h instanceof ArrayBuffer?h=new Uint8Array(h):h instanceof Uint8Array||(h=new Uint8Array(h.buffer))}var f=b,g=Array(1),d=0;do{var t=f%128,f=f>>7;0<f&&(t|=128);g[d++]=t}while(0<f&&4>d);f=g.length+1;b=new ArrayBuffer(b+f);d=new Uint8Array(b);d[0]=a;d.set(g,1);if(3==this.type)f=u(this.payloadMessage.destinationName,k,d,f);else if(1==this.type){switch(this.mqttVersion){case 3:d.set(A,f);f+=A.length;\nbreak;case 4:d.set(B,f),f+=B.length}a=0;this.cleanSession&&(a=2);void 0!==this.willMessage&&(a=a|4|this.willMessage.qos<<3,this.willMessage.retained&&(a|=32));void 0!==this.userName&&(a|=128);void 0!==this.password&&(a|=64);d[f++]=a;f=s(this.keepAliveInterval,d,f)}void 0!==this.messageIdentifier&&(f=s(this.messageIdentifier,d,f));switch(this.type){case 1:f=u(this.clientId,n(this.clientId),d,f);void 0!==this.willMessage&&(f=u(this.willMessage.destinationName,n(this.willMessage.destinationName),d,f),\nf=s(e.byteLength,d,f),d.set(e,f),f+=e.byteLength);void 0!==this.userName&&(f=u(this.userName,n(this.userName),d,f));void 0!==this.password&&u(this.password,n(this.password),d,f);break;case 3:d.set(h,f);break;case 8:for(g=0;g<this.topics.length;g++)f=u(this.topics[g],c[g],d,f),d[f++]=this.requestedQos[g];break;case 10:for(g=0;g<this.topics.length;g++)f=u(this.topics[g],c[g],d,f)}return b};var F=function(a,b,c){this._client=a;this._window=b;this._keepAliveInterval=1E3*c;this.isReset=!1;var k=(new q(12)).encode(),\ne=function(a){return function(){return g.apply(a)}},g=function(){this.isReset?(this.isReset=!1,this._client._trace(\"Pinger.doPing\",\"send PINGREQ\"),this._client.socket.send(k),this.timeout=this._window.setTimeout(e(this),this._keepAliveInterval)):(this._client._trace(\"Pinger.doPing\",\"Timed out\"),this._client._disconnected(h.PING_TIMEOUT.code,f(h.PING_TIMEOUT)))};this.reset=function(){this.isReset=!0;this._window.clearTimeout(this.timeout);0<this._keepAliveInterval&&(this.timeout=setTimeout(e(this),\nthis._keepAliveInterval))};this.cancel=function(){this._window.clearTimeout(this.timeout)}},w=function(a,b,c,f,e){this._window=b;c||(c=30);this.timeout=setTimeout(function(a,b,c){return function(){return a.apply(b,c)}}(f,a,e),1E3*c);this.cancel=function(){this._window.clearTimeout(this.timeout)}},d=function(a,b,c,d,e){if(!(\"WebSocket\"in p&&null!==p.WebSocket))throw Error(f(h.UNSUPPORTED,[\"WebSocket\"]));if(!(\"localStorage\"in p&&null!==p.localStorage))throw Error(f(h.UNSUPPORTED,[\"localStorage\"]));\nif(!(\"ArrayBuffer\"in p&&null!==p.ArrayBuffer))throw Error(f(h.UNSUPPORTED,[\"ArrayBuffer\"]));this._trace(\"Paho.MQTT.Client\",a,b,c,d,e);this.host=b;this.port=c;this.path=d;this.uri=a;this.clientId=e;this._wsuri=null;this._localKey=b+\":\"+c+(\"/mqtt\"!=d?\":\"+d:\"\")+\":\"+e+\":\";this._msg_queue=[];this._buffered_msg_queue=[];this._sentMessages={};this._receivedMessages={};this._notify_msg_sent={};this._message_identifier=1;this._sequence=0;for(var g in localStorage)0!==g.indexOf(\"Sent:\"+this._localKey)&&0!==\ng.indexOf(\"Received:\"+this._localKey)||this.restore(g)};d.prototype.host=null;d.prototype.port=null;d.prototype.path=null;d.prototype.uri=null;d.prototype.clientId=null;d.prototype.socket=null;d.prototype.connected=!1;d.prototype.maxMessageIdentifier=65536;d.prototype.connectOptions=null;d.prototype.hostIndex=null;d.prototype.onConnected=null;d.prototype.onConnectionLost=null;d.prototype.onMessageDelivered=null;d.prototype.onMessageArrived=null;d.prototype.traceFunction=null;d.prototype._msg_queue=\nnull;d.prototype._buffered_msg_queue=null;d.prototype._connectTimeout=null;d.prototype.sendPinger=null;d.prototype.receivePinger=null;d.prototype._reconnectInterval=1;d.prototype._reconnecting=!1;d.prototype._reconnectTimeout=null;d.prototype.disconnectedPublishing=!1;d.prototype.disconnectedBufferSize=5E3;d.prototype.receiveBuffer=null;d.prototype._traceBuffer=null;d.prototype._MAX_TRACE_ENTRIES=100;d.prototype.connect=function(a){var b=this._traceMask(a,\"password\");this._trace(\"Client.connect\",\nb,this.socket,this.connected);if(this.connected)throw Error(f(h.INVALID_STATE,[\"already connected\"]));if(this.socket)throw Error(f(h.INVALID_STATE,[\"already connected\"]));this._reconnecting&&(this._reconnectTimeout.cancel(),this._reconnectTimeout=null,this._reconnecting=!1);this.connectOptions=a;this._reconnectInterval=1;this._reconnecting=!1;a.uris?(this.hostIndex=0,this._doConnect(a.uris[0])):this._doConnect(this.uri)};d.prototype.subscribe=function(a,b){this._trace(\"Client.subscribe\",a,b);if(!this.connected)throw Error(f(h.INVALID_STATE,\n[\"not connected\"]));var c=new q(8);c.topics=[a];c.requestedQos=void 0!==b.qos?[b.qos]:[0];b.onSuccess&&(c.onSuccess=function(a){b.onSuccess({invocationContext:b.invocationContext,grantedQos:a})});b.onFailure&&(c.onFailure=function(a){b.onFailure({invocationContext:b.invocationContext,errorCode:a,errorMessage:f(a)})});b.timeout&&(c.timeOut=new w(this,window,b.timeout,b.onFailure,[{invocationContext:b.invocationContext,errorCode:h.SUBSCRIBE_TIMEOUT.code,errorMessage:f(h.SUBSCRIBE_TIMEOUT)}]));this._requires_ack(c);\nthis._schedule_message(c)};d.prototype.unsubscribe=function(a,b){this._trace(\"Client.unsubscribe\",a,b);if(!this.connected)throw Error(f(h.INVALID_STATE,[\"not connected\"]));var c=new q(10);c.topics=[a];b.onSuccess&&(c.callback=function(){b.onSuccess({invocationContext:b.invocationContext})});b.timeout&&(c.timeOut=new w(this,window,b.timeout,b.onFailure,[{invocationContext:b.invocationContext,errorCode:h.UNSUBSCRIBE_TIMEOUT.code,errorMessage:f(h.UNSUBSCRIBE_TIMEOUT)}]));this._requires_ack(c);this._schedule_message(c)};\nd.prototype.send=function(a){this._trace(\"Client.send\",a);wireMessage=new q(3);wireMessage.payloadMessage=a;if(this.connected)0<a.qos?this._requires_ack(wireMessage):this.onMessageDelivered&&(this._notify_msg_sent[wireMessage]=this.onMessageDelivered(wireMessage.payloadMessage)),this._schedule_message(wireMessage);else if(this._reconnecting&&this.disconnectedPublishing){if(Object.keys(this._sentMessages).length+this._buffered_msg_queue.length>this.disconnectedBufferSize)throw Error(f(h.BUFFER_FULL,\n[this.disconnectedBufferSize]));0<a.qos?this._requires_ack(wireMessage):(wireMessage.sequence=++this._sequence,this._buffered_msg_queue.push(wireMessage))}else throw Error(f(h.INVALID_STATE,[\"not connected\"]));};d.prototype.disconnect=function(){this._trace(\"Client.disconnect\");this._reconnecting&&(this._reconnectTimeout.cancel(),this._reconnectTimeout=null,this._reconnecting=!1);if(!this.socket)throw Error(f(h.INVALID_STATE,[\"not connecting or connected\"]));wireMessage=new q(14);this._notify_msg_sent[wireMessage]=\nv(this._disconnected,this);this._schedule_message(wireMessage)};d.prototype.getTraceLog=function(){if(null!==this._traceBuffer){this._trace(\"Client.getTraceLog\",new Date);this._trace(\"Client.getTraceLog in flight messages\",this._sentMessages.length);for(var a in this._sentMessages)this._trace(\"_sentMessages \",a,this._sentMessages[a]);for(a in this._receivedMessages)this._trace(\"_receivedMessages \",a,this._receivedMessages[a]);return this._traceBuffer}};d.prototype.startTrace=function(){null===this._traceBuffer&&\n(this._traceBuffer=[]);this._trace(\"Client.startTrace\",new Date,\"1.0.3\")};d.prototype.stopTrace=function(){delete this._traceBuffer};d.prototype._doConnect=function(a){this.connectOptions.useSSL&&(a=a.split(\":\"),a[0]=\"wss\",a=a.join(\":\"));this._wsuri=a;this.connected=!1;this.socket=4>this.connectOptions.mqttVersion?new WebSocket(a,[\"mqttv3.1\"]):new WebSocket(a,[\"mqtt\"]);this.socket.binaryType=\"arraybuffer\";this.socket.onopen=v(this._on_socket_open,this);this.socket.onmessage=v(this._on_socket_message,\nthis);this.socket.onerror=v(this._on_socket_error,this);this.socket.onclose=v(this._on_socket_close,this);this.sendPinger=new F(this,window,this.connectOptions.keepAliveInterval);this.receivePinger=new F(this,window,this.connectOptions.keepAliveInterval);this._connectTimeout&&(this._connectTimeout.cancel(),this._connectTimeout=null);this._connectTimeout=new w(this,window,this.connectOptions.timeout,this._disconnected,[h.CONNECT_TIMEOUT.code,f(h.CONNECT_TIMEOUT)])};d.prototype._schedule_message=function(a){this._msg_queue.push(a);\nthis.connected&&this._process_queue()};d.prototype.store=function(a,b){var c={type:b.type,messageIdentifier:b.messageIdentifier,version:1};switch(b.type){case 3:b.pubRecReceived&&(c.pubRecReceived=!0);c.payloadMessage={};for(var d=\"\",e=b.payloadMessage.payloadBytes,g=0;g<e.length;g++)d=15>=e[g]?d+\"0\"+e[g].toString(16):d+e[g].toString(16);c.payloadMessage.payloadHex=d;c.payloadMessage.qos=b.payloadMessage.qos;c.payloadMessage.destinationName=b.payloadMessage.destinationName;b.payloadMessage.duplicate&&\n(c.payloadMessage.duplicate=!0);b.payloadMessage.retained&&(c.payloadMessage.retained=!0);0===a.indexOf(\"Sent:\")&&(void 0===b.sequence&&(b.sequence=++this._sequence),c.sequence=b.sequence);break;default:throw Error(f(h.INVALID_STORED_DATA,[key,c]));}localStorage.setItem(a+this._localKey+b.messageIdentifier,JSON.stringify(c))};d.prototype.restore=function(a){var b=localStorage.getItem(a),c=JSON.parse(b),d=new q(c.type,c);switch(c.type){case 3:for(var b=c.payloadMessage.payloadHex,e=new ArrayBuffer(b.length/\n2),e=new Uint8Array(e),g=0;2<=b.length;){var m=parseInt(b.substring(0,2),16),b=b.substring(2,b.length);e[g++]=m}b=new Paho.MQTT.Message(e);b.qos=c.payloadMessage.qos;b.destinationName=c.payloadMessage.destinationName;c.payloadMessage.duplicate&&(b.duplicate=!0);c.payloadMessage.retained&&(b.retained=!0);d.payloadMessage=b;break;default:throw Error(f(h.INVALID_STORED_DATA,[a,b]));}0===a.indexOf(\"Sent:\"+this._localKey)?(d.payloadMessage.duplicate=!0,this._sentMessages[d.messageIdentifier]=d):0===a.indexOf(\"Received:\"+\nthis._localKey)&&(this._receivedMessages[d.messageIdentifier]=d)};d.prototype._process_queue=function(){for(var a=null,b=this._msg_queue.reverse();a=b.pop();)this._socket_send(a),this._notify_msg_sent[a]&&(this._notify_msg_sent[a](),delete this._notify_msg_sent[a])};d.prototype._requires_ack=function(a){var b=Object.keys(this._sentMessages).length;if(b>this.maxMessageIdentifier)throw Error(\"Too many messages:\"+b);for(;void 0!==this._sentMessages[this._message_identifier];)this._message_identifier++;\na.messageIdentifier=this._message_identifier;this._sentMessages[a.messageIdentifier]=a;3===a.type&&this.store(\"Sent:\",a);this._message_identifier===this.maxMessageIdentifier&&(this._message_identifier=1)};d.prototype._on_socket_open=function(){var a=new q(1,this.connectOptions);a.clientId=this.clientId;this._socket_send(a)};d.prototype._on_socket_message=function(a){this._trace(\"Client._on_socket_message\",a.data);a=this._deframeMessages(a.data);for(var b=0;b<a.length;b+=1)this._handleMessage(a[b])};\nd.prototype._deframeMessages=function(a){a=new Uint8Array(a);var b=[];if(this.receiveBuffer){var c=new Uint8Array(this.receiveBuffer.length+a.length);c.set(this.receiveBuffer);c.set(a,this.receiveBuffer.length);a=c;delete this.receiveBuffer}try{for(c=0;c<a.length;){var d;a:{var e=a,g=c,m=g,n=e[g],l=n>>4,t=n&15,g=g+1,x=void 0,C=0,p=1;do{if(g==e.length){d=[null,m];break a}x=e[g++];C+=(x&127)*p;p*=128}while(0!==(x&128));x=g+C;if(x>e.length)d=[null,m];else{var y=new q(l);switch(l){case 2:e[g++]&1&&(y.sessionPresent=\n!0);y.returnCode=e[g++];break;case 3:var m=t>>1&3,s=256*e[g]+e[g+1],g=g+2,u=E(e,g,s),g=g+s;0<m&&(y.messageIdentifier=256*e[g]+e[g+1],g+=2);var r=new Paho.MQTT.Message(e.subarray(g,x));1==(t&1)&&(r.retained=!0);8==(t&8)&&(r.duplicate=!0);r.qos=m;r.destinationName=u;y.payloadMessage=r;break;case 4:case 5:case 6:case 7:case 11:y.messageIdentifier=256*e[g]+e[g+1];break;case 9:y.messageIdentifier=256*e[g]+e[g+1],g+=2,y.returnCode=e.subarray(g,x)}d=[y,x]}}var v=d[0],c=d[1];if(null!==v)b.push(v);else break}c<\na.length&&(this.receiveBuffer=a.subarray(c))}catch(w){d=\"undefined\"==w.hasOwnProperty(\"stack\")?w.stack.toString():\"No Error Stack Available\";this._disconnected(h.INTERNAL_ERROR.code,f(h.INTERNAL_ERROR,[w.message,d]));return}return b};d.prototype._handleMessage=function(a){this._trace(\"Client._handleMessage\",a);try{switch(a.type){case 2:this._connectTimeout.cancel();this._reconnectTimeout&&this._reconnectTimeout.cancel();if(this.connectOptions.cleanSession){for(var b in this._sentMessages){var c=this._sentMessages[b];\nlocalStorage.removeItem(\"Sent:\"+this._localKey+c.messageIdentifier)}this._sentMessages={};for(b in this._receivedMessages){var d=this._receivedMessages[b];localStorage.removeItem(\"Received:\"+this._localKey+d.messageIdentifier)}this._receivedMessages={}}if(0===a.returnCode)this.connected=!0,this.connectOptions.uris&&(this.hostIndex=this.connectOptions.uris.length);else{this._disconnected(h.CONNACK_RETURNCODE.code,f(h.CONNACK_RETURNCODE,[a.returnCode,H[a.returnCode]]));break}a=[];for(var e in this._sentMessages)this._sentMessages.hasOwnProperty(e)&&\na.push(this._sentMessages[e]);if(0<this._buffered_msg_queue.length){e=null;for(var g=this._buffered_msg_queue.reverse();e=g.pop();)a.push(e),this.onMessageDelivered&&(this._notify_msg_sent[e]=this.onMessageDelivered(e.payloadMessage))}a=a.sort(function(a,b){return a.sequence-b.sequence});for(var g=0,m=a.length;g<m;g++)if(c=a[g],3==c.type&&c.pubRecReceived){var n=new q(6,{messageIdentifier:c.messageIdentifier});this._schedule_message(n)}else this._schedule_message(c);if(this.connectOptions.onSuccess)this.connectOptions.onSuccess({invocationContext:this.connectOptions.invocationContext});\nc=!1;this._reconnecting&&(c=!0,this._reconnectInterval=1,this._reconnecting=!1);this._connected(c,this._wsuri);this._process_queue();break;case 3:this._receivePublish(a);break;case 4:if(c=this._sentMessages[a.messageIdentifier])if(delete this._sentMessages[a.messageIdentifier],localStorage.removeItem(\"Sent:\"+this._localKey+a.messageIdentifier),this.onMessageDelivered)this.onMessageDelivered(c.payloadMessage);break;case 5:if(c=this._sentMessages[a.messageIdentifier])c.pubRecReceived=!0,n=new q(6,{messageIdentifier:a.messageIdentifier}),\nthis.store(\"Sent:\",c),this._schedule_message(n);break;case 6:d=this._receivedMessages[a.messageIdentifier];localStorage.removeItem(\"Received:\"+this._localKey+a.messageIdentifier);d&&(this._receiveMessage(d),delete this._receivedMessages[a.messageIdentifier]);var l=new q(7,{messageIdentifier:a.messageIdentifier});this._schedule_message(l);break;case 7:c=this._sentMessages[a.messageIdentifier];delete this._sentMessages[a.messageIdentifier];localStorage.removeItem(\"Sent:\"+this._localKey+a.messageIdentifier);\nif(this.onMessageDelivered)this.onMessageDelivered(c.payloadMessage);break;case 9:if(c=this._sentMessages[a.messageIdentifier]){c.timeOut&&c.timeOut.cancel();if(128===a.returnCode[0]){if(c.onFailure)c.onFailure(a.returnCode)}else if(c.onSuccess)c.onSuccess(a.returnCode);delete this._sentMessages[a.messageIdentifier]}break;case 11:if(c=this._sentMessages[a.messageIdentifier])c.timeOut&&c.timeOut.cancel(),c.callback&&c.callback(),delete this._sentMessages[a.messageIdentifier];break;case 13:this.sendPinger.reset();\nbreak;case 14:this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code,f(h.INVALID_MQTT_MESSAGE_TYPE,[a.type]));break;default:this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code,f(h.INVALID_MQTT_MESSAGE_TYPE,[a.type]))}}catch(t){c=\"undefined\"==t.hasOwnProperty(\"stack\")?t.stack.toString():\"No Error Stack Available\",this._disconnected(h.INTERNAL_ERROR.code,f(h.INTERNAL_ERROR,[t.message,c]))}};d.prototype._on_socket_error=function(a){this._reconnecting||this._disconnected(h.SOCKET_ERROR.code,f(h.SOCKET_ERROR,\n[a.data]))};d.prototype._on_socket_close=function(){this._reconnecting||this._disconnected(h.SOCKET_CLOSE.code,f(h.SOCKET_CLOSE))};d.prototype._socket_send=function(a){if(1==a.type){var b=this._traceMask(a,\"password\");this._trace(\"Client._socket_send\",b)}else this._trace(\"Client._socket_send\",a);this.socket.send(a.encode());this.sendPinger.reset()};d.prototype._receivePublish=function(a){switch(a.payloadMessage.qos){case \"undefined\":case 0:this._receiveMessage(a);break;case 1:var b=new q(4,{messageIdentifier:a.messageIdentifier});\nthis._schedule_message(b);this._receiveMessage(a);break;case 2:this._receivedMessages[a.messageIdentifier]=a;this.store(\"Received:\",a);a=new q(5,{messageIdentifier:a.messageIdentifier});this._schedule_message(a);break;default:throw Error(\"Invaild qos\\x3d\"+wireMmessage.payloadMessage.qos);}};d.prototype._receiveMessage=function(a){if(this.onMessageArrived)this.onMessageArrived(a.payloadMessage)};d.prototype._connected=function(a,b){if(this.onConnected)this.onConnected(a,b)};d.prototype._reconnect=\nfunction(){this._trace(\"Client._reconnect\");this.connected||(this._reconnecting=!0,this.sendPinger.cancel(),this.receivePinger.cancel(),128>this._reconnectInterval&&(this._reconnectInterval*=2),this.connectOptions.uris?(this.hostIndex=0,this._doConnect(this.connectOptions.uris[0])):this._doConnect(this.uri))};d.prototype._disconnected=function(a,b){this._trace(\"Client._disconnected\",a,b);if(void 0!==a&&this._reconnecting)this._reconnectTimeout=new w(this,window,this._reconnectInterval,this._reconnect);\nelse if(this.sendPinger.cancel(),this.receivePinger.cancel(),this._connectTimeout&&(this._connectTimeout.cancel(),this._connectTimeout=null),this._msg_queue=[],this._buffered_msg_queue=[],this._notify_msg_sent={},this.socket&&(this.socket.onopen=null,this.socket.onmessage=null,this.socket.onerror=null,this.socket.onclose=null,1===this.socket.readyState&&this.socket.close(),delete this.socket),this.connectOptions.uris&&this.hostIndex<this.connectOptions.uris.length-1)this.hostIndex++,this._doConnect(this.connectOptions.uris[this.hostIndex]);\nelse if(void 0===a&&(a=h.OK.code,b=f(h.OK)),this.connected){this.connected=!1;if(this.onConnectionLost)this.onConnectionLost({errorCode:a,errorMessage:b,reconnect:this.connectOptions.reconnect,uri:this._wsuri});a!==h.OK.code&&this.connectOptions.reconnect&&(this._reconnectInterval=1,this._reconnect())}else if(4===this.connectOptions.mqttVersion&&!1===this.connectOptions.mqttVersionExplicit)this._trace(\"Failed to connect V4, dropping back to V3\"),this.connectOptions.mqttVersion=3,this.connectOptions.uris?\n(this.hostIndex=0,this._doConnect(this.connectOptions.uris[0])):this._doConnect(this.uri);else if(this.connectOptions.onFailure)this.connectOptions.onFailure({invocationContext:this.connectOptions.invocationContext,errorCode:a,errorMessage:b})};d.prototype._trace=function(){if(this.traceFunction){for(var a in arguments)\"undefined\"!==typeof arguments[a]&&arguments.splice(a,1,JSON.stringify(arguments[a]));a=Array.prototype.slice.call(arguments).join(\"\");this.traceFunction({severity:\"Debug\",message:a})}if(null!==\nthis._traceBuffer){a=0;for(var b=arguments.length;a<b;a++)this._traceBuffer.length==this._MAX_TRACE_ENTRIES&&this._traceBuffer.shift(),0===a?this._traceBuffer.push(arguments[a]):\"undefined\"===typeof arguments[a]?this._traceBuffer.push(arguments[a]):this._traceBuffer.push(\"  \"+JSON.stringify(arguments[a]))}};d.prototype._traceMask=function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=d==b?\"******\":a[d]);return c};var G=function(a,b,c,k){var e;if(\"string\"!==typeof a)throw Error(f(h.INVALID_TYPE,\n[typeof a,\"host\"]));if(2==arguments.length){k=b;e=a;var g=e.match(/^(wss?):\\/\\/((\\[(.+)\\])|([^\\/]+?))(:(\\d+))?(\\/.*)$/);if(g)a=g[4]||g[2],b=parseInt(g[7]),c=g[8];else throw Error(f(h.INVALID_ARGUMENT,[a,\"host\"]));}else{3==arguments.length&&(k=c,c=\"/mqtt\");if(\"number\"!==typeof b||0>b)throw Error(f(h.INVALID_TYPE,[typeof b,\"port\"]));if(\"string\"!==typeof c)throw Error(f(h.INVALID_TYPE,[typeof c,\"path\"]));e=\"ws://\"+(-1!==a.indexOf(\":\")&&\"[\"!==a.slice(0,1)&&\"]\"!==a.slice(-1)?\"[\"+a+\"]\":a)+\":\"+b+c}for(var m=\ng=0;m<k.length;m++){var n=k.charCodeAt(m);55296<=n&&56319>=n&&m++;g++}if(\"string\"!==typeof k||65535<g)throw Error(f(h.INVALID_ARGUMENT,[k,\"clientId\"]));var l=new d(e,a,b,c,k);this._getHost=function(){return a};this._setHost=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getPort=function(){return b};this._setPort=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getPath=function(){return c};this._setPath=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getURI=function(){return e};\nthis._setURI=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getClientId=function(){return l.clientId};this._setClientId=function(){throw Error(f(h.UNSUPPORTED_OPERATION));};this._getOnConnected=function(){return l.onConnected};this._setOnConnected=function(a){if(\"function\"===typeof a)l.onConnected=a;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onConnected\"]));};this._getDisconnectedPublishing=function(){return l.disconnectedPublishing};this._setDisconnectedPublishing=function(a){l.disconnectedPublishing=\na};this._getDisconnectedBufferSize=function(){return l.disconnectedBufferSize};this._setDisconnectedBufferSize=function(a){l.disconnectedBufferSize=a};this._getOnConnectionLost=function(){return l.onConnectionLost};this._setOnConnectionLost=function(a){if(\"function\"===typeof a)l.onConnectionLost=a;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onConnectionLost\"]));};this._getOnMessageDelivered=function(){return l.onMessageDelivered};this._setOnMessageDelivered=function(a){if(\"function\"===typeof a)l.onMessageDelivered=\na;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onMessageDelivered\"]));};this._getOnMessageArrived=function(){return l.onMessageArrived};this._setOnMessageArrived=function(a){if(\"function\"===typeof a)l.onMessageArrived=a;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onMessageArrived\"]));};this._getTrace=function(){return l.traceFunction};this._setTrace=function(a){if(\"function\"===typeof a)l.traceFunction=a;else throw Error(f(h.INVALID_TYPE,[typeof a,\"onTrace\"]));};this.connect=function(a){a=a||{};z(a,\n{timeout:\"number\",userName:\"string\",password:\"string\",willMessage:\"object\",keepAliveInterval:\"number\",cleanSession:\"boolean\",useSSL:\"boolean\",invocationContext:\"object\",onSuccess:\"function\",onFailure:\"function\",hosts:\"object\",ports:\"object\",reconnect:\"boolean\",mqttVersion:\"number\",mqttVersionExplicit:\"boolean\",uris:\"object\"});void 0===a.keepAliveInterval&&(a.keepAliveInterval=60);if(4<a.mqttVersion||3>a.mqttVersion)throw Error(f(h.INVALID_ARGUMENT,[a.mqttVersion,\"connectOptions.mqttVersion\"]));void 0===\na.mqttVersion?(a.mqttVersionExplicit=!1,a.mqttVersion=4):a.mqttVersionExplicit=!0;if(void 0!==a.password&&void 0===a.userName)throw Error(f(h.INVALID_ARGUMENT,[a.password,\"connectOptions.password\"]));if(a.willMessage){if(!(a.willMessage instanceof r))throw Error(f(h.INVALID_TYPE,[a.willMessage,\"connectOptions.willMessage\"]));a.willMessage.stringPayload=null;if(\"undefined\"===typeof a.willMessage.destinationName)throw Error(f(h.INVALID_TYPE,[typeof a.willMessage.destinationName,\"connectOptions.willMessage.destinationName\"]));\n}\"undefined\"===typeof a.cleanSession&&(a.cleanSession=!0);if(a.hosts){if(!(a.hosts instanceof Array))throw Error(f(h.INVALID_ARGUMENT,[a.hosts,\"connectOptions.hosts\"]));if(1>a.hosts.length)throw Error(f(h.INVALID_ARGUMENT,[a.hosts,\"connectOptions.hosts\"]));for(var b=!1,d=0;d<a.hosts.length;d++){if(\"string\"!==typeof a.hosts[d])throw Error(f(h.INVALID_TYPE,[typeof a.hosts[d],\"connectOptions.hosts[\"+d+\"]\"]));if(/^(wss?):\\/\\/((\\[(.+)\\])|([^\\/]+?))(:(\\d+))?(\\/.*)$/.test(a.hosts[d]))if(0===d)b=!0;else{if(!b)throw Error(f(h.INVALID_ARGUMENT,\n[a.hosts[d],\"connectOptions.hosts[\"+d+\"]\"]));}else if(b)throw Error(f(h.INVALID_ARGUMENT,[a.hosts[d],\"connectOptions.hosts[\"+d+\"]\"]));}if(b)a.uris=a.hosts;else{if(!a.ports)throw Error(f(h.INVALID_ARGUMENT,[a.ports,\"connectOptions.ports\"]));if(!(a.ports instanceof Array))throw Error(f(h.INVALID_ARGUMENT,[a.ports,\"connectOptions.ports\"]));if(a.hosts.length!==a.ports.length)throw Error(f(h.INVALID_ARGUMENT,[a.ports,\"connectOptions.ports\"]));a.uris=[];for(d=0;d<a.hosts.length;d++){if(\"number\"!==typeof a.ports[d]||\n0>a.ports[d])throw Error(f(h.INVALID_TYPE,[typeof a.ports[d],\"connectOptions.ports[\"+d+\"]\"]));var b=a.hosts[d],g=a.ports[d];e=\"ws://\"+(-1!==b.indexOf(\":\")?\"[\"+b+\"]\":b)+\":\"+g+c;a.uris.push(e)}}}l.connect(a)};this.subscribe=function(a,b){if(\"string\"!==typeof a)throw Error(\"Invalid argument:\"+a);b=b||{};z(b,{qos:\"number\",invocationContext:\"object\",onSuccess:\"function\",onFailure:\"function\",timeout:\"number\"});if(b.timeout&&!b.onFailure)throw Error(\"subscribeOptions.timeout specified with no onFailure callback.\");\nif(\"undefined\"!==typeof b.qos&&0!==b.qos&&1!==b.qos&&2!==b.qos)throw Error(f(h.INVALID_ARGUMENT,[b.qos,\"subscribeOptions.qos\"]));l.subscribe(a,b)};this.unsubscribe=function(a,b){if(\"string\"!==typeof a)throw Error(\"Invalid argument:\"+a);b=b||{};z(b,{invocationContext:\"object\",onSuccess:\"function\",onFailure:\"function\",timeout:\"number\"});if(b.timeout&&!b.onFailure)throw Error(\"unsubscribeOptions.timeout specified with no onFailure callback.\");l.unsubscribe(a,b)};this.send=function(a,b,c,d){var e;if(0===\narguments.length)throw Error(\"Invalid argument.length\");if(1==arguments.length){if(!(a instanceof r)&&\"string\"!==typeof a)throw Error(\"Invalid argument:\"+typeof a);e=a;if(\"undefined\"===typeof e.destinationName)throw Error(f(h.INVALID_ARGUMENT,[e.destinationName,\"Message.destinationName\"]));}else e=new r(b),e.destinationName=a,3<=arguments.length&&(e.qos=c),4<=arguments.length&&(e.retained=d);l.send(e)};this.publish=function(a,b,c,d){console.log(\"Publising message to: \",a);var e;if(0===arguments.length)throw Error(\"Invalid argument.length\");\nif(1==arguments.length){if(!(a instanceof r)&&\"string\"!==typeof a)throw Error(\"Invalid argument:\"+typeof a);e=a;if(\"undefined\"===typeof e.destinationName)throw Error(f(h.INVALID_ARGUMENT,[e.destinationName,\"Message.destinationName\"]));}else e=new r(b),e.destinationName=a,3<=arguments.length&&(e.qos=c),4<=arguments.length&&(e.retained=d);l.send(e)};this.disconnect=function(){l.disconnect()};this.getTraceLog=function(){return l.getTraceLog()};this.startTrace=function(){l.startTrace()};this.stopTrace=\nfunction(){l.stopTrace()};this.isConnected=function(){return l.connected}};G.prototype={get host(){return this._getHost()},set host(a){this._setHost(a)},get port(){return this._getPort()},set port(a){this._setPort(a)},get path(){return this._getPath()},set path(a){this._setPath(a)},get clientId(){return this._getClientId()},set clientId(a){this._setClientId(a)},get onConnected(){return this._getOnConnected()},set onConnected(a){this._setOnConnected(a)},get disconnectedPublishing(){return this._getDisconnectedPublishing()},\nset disconnectedPublishing(a){this._setDisconnectedPublishing(a)},get disconnectedBufferSize(){return this._getDisconnectedBufferSize()},set disconnectedBufferSize(a){this._setDisconnectedBufferSize(a)},get onConnectionLost(){return this._getOnConnectionLost()},set onConnectionLost(a){this._setOnConnectionLost(a)},get onMessageDelivered(){return this._getOnMessageDelivered()},set onMessageDelivered(a){this._setOnMessageDelivered(a)},get onMessageArrived(){return this._getOnMessageArrived()},set onMessageArrived(a){this._setOnMessageArrived(a)},\nget trace(){return this._getTrace()},set trace(a){this._setTrace(a)}};var r=function(a){var b;if(\"string\"===typeof a||a instanceof ArrayBuffer||a instanceof Int8Array||a instanceof Uint8Array||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)b=a;else throw f(h.INVALID_ARGUMENT,[a,\"newPayload\"]);this._getPayloadString=function(){return\"string\"===typeof b?b:E(b,0,b.length)};this._getPayloadBytes=\nfunction(){if(\"string\"===typeof b){var a=new ArrayBuffer(n(b)),a=new Uint8Array(a);D(b,a,0);return a}return b};var c;this._getDestinationName=function(){return c};this._setDestinationName=function(a){if(\"string\"===typeof a)c=a;else throw Error(f(h.INVALID_ARGUMENT,[a,\"newDestinationName\"]));};var d=0;this._getQos=function(){return d};this._setQos=function(a){if(0===a||1===a||2===a)d=a;else throw Error(\"Invalid argument:\"+a);};var e=!1;this._getRetained=function(){return e};this._setRetained=function(a){if(\"boolean\"===\ntypeof a)e=a;else throw Error(f(h.INVALID_ARGUMENT,[a,\"newRetained\"]));};var g=!1;this._getDuplicate=function(){return g};this._setDuplicate=function(a){g=a}};r.prototype={get payloadString(){return this._getPayloadString()},get payloadBytes(){return this._getPayloadBytes()},get destinationName(){return this._getDestinationName()},set destinationName(a){this._setDestinationName(a)},get topic(){return this._getDestinationName()},set topic(a){this._setDestinationName(a)},get qos(){return this._getQos()},\nset qos(a){this._setQos(a)},get retained(){return this._getRetained()},set retained(a){this._setRetained(a)},get duplicate(){return this._getDuplicate()},set duplicate(a){this._setDuplicate(a)}};return{Client:G,Message:r}}(window)});\nfunction _clspRouter() {\n    function send(m){\n        // route message to parent which will in turn route to the correct\n        // player based on clientId.\n        m.clientId = MqttClientId;\n        // console.log(m);\n        window.parent.postMessage(m,\"*\");\n    }// end send\n\n\n    function routeInbound(message){\n        var pstring = \"\";\n\n        try {\n            pstring = message.payloadString;\n        } catch(e) {\n            //bogus excepton?\n        }\n\n        send({\n          event: \'data\',\n          destinationName: message.destinationName,\n          payloadString: pstring,\n          payloadBytes: message.payloadBytes || null\n        });\n    }// end route inbound\n\n\n    function eventHandler(evt){\n        var m = evt.data;\n\n        try {\n            if (m.method === \'subscribe\') {\n                MQTTClient.subscribe(m.topic);\n            } else if (m.method === \'unsubscribe\') {\n                MQTTClient.unsubscribe(m.topic);\n            } else if (m.method === \'publish\') {\n                var mqtt_payload = null;\n                try {\n                    mqtt_payload = JSON.stringify(m.data);\n                } catch( json_error ) {\n                    console.error(\"json stringify error: \" + m.data);\n                    return;\n                }\n\n                var mqtt_msg = new Paho.MQTT.Message(mqtt_payload);\n                mqtt_msg.destinationName = m.topic;\n                MQTTClient.send(mqtt_msg);\n            }\n        } catch(e) {\n            // we are dead!\n           send({\n               event: \'fail\',\n               reason: \"network failure\"\n            });\n            try {\n                MQTTClient.disconnect();\n            } catch(e) {\n                console.error(e);\n            }\n        }\n\n    }\n\n    function AppReady() {\n\n        if (window.addEventListener) {\n            window.addEventListener(\"message\", eventHandler, false);\n        } else if (window.attachEvent) {\n            window.attachEvent(\'onmessage\', eventHandler);\n        }\n\n        send({\n          event: \'ready\'\n        });\n\n        if (Reconnect !== -1)\n        {\n            clearInterval(Reconnect);\n            Reconnect = -1;\n        }\n\n    }// application ready\n\n\n    function AppFail(message) {\n      var e = \"Error code \" +\n          parseInt(message.errorCode) + \": \" + message.errorMessage;\n      send({\n        event: \'fail\',\n        reason: e\n      });\n    }\n\n    MQTTClient = new Paho.MQTT.Client(\n        MqttIp,\n        MqttPort,\n        MqttClientId\n    );\n\n    /*\n     * Hold the id of the reconnect interval task\n     */\n    var Reconnect = -1;\n\n    /*\n     * Callback which gets called when the connection is lost\n     */\n    function onConnectionLost(message){\n        send({\n            event: \'fail\',\n            reason: \"connection lost error code \" + parseInt(message.errorCode)\n        });\n        if (Reconnect === -1) {\n            Reconnect = setInterval(() => connect(), 2000);\n        }\n    }\n\n    MQTTClient.onConnectionLost = onConnectionLost;\n\n    // perhaps the busiest function in this module ;)\n    MQTTClient.onMessageArrived = function(message) {\n        // console.log(message);\n        try {\n             routeInbound(message);\n        }catch(e) {\n            if (e) {\n                console.error(e);\n            }\n        }\n    };\n\n    /**\n     * Connect to MQTT...\n     */\n    function connect()\n    {\n        // setup connection options\n        var options = {\n            timeout: 120,\n            onSuccess:  AppReady,\n            onFailure: AppFail\n        };\n        // last will message sent on disconnect\n        var willmsg = new Paho.MQTT.Message(JSON.stringify({\n            clientId: MqttClientId\n        }));\n        willmsg.destinationName = \"iov/clientDisconnect\";\n        options.willMessage = willmsg;\n\n        if (MqttUseSSL === true) {\n            options.useSSL = true;\n        }\n\n        try {\n            MQTTClient.connect(options);\n        } catch(e) {\n            console.error(\"connect failed\", e);\n            send({\n                event: \'fail\',\n                reason: \"connect failed\"\n            });\n        }\n    }\n\n    connect();\n}\n\nfunction clspRouter() {\n    try {\n        _clspRouter();\n    } catch(e) {\n        console.error(\"IFRAME error\");\n        console.error(e);\n    }\n}\n\nfunction onunload()\n{\n    if (typeof MQTTClient !== \'undefined\') {\n        MQTTClient.disconnect();\n    }\n}\n";

function pframe_client(iframe, config, onReady) {
    var self = {
        dispatch: {}
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

    // called when mqtt has connected
    self.onReady = onReady;

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

    self.transaction = function (topic, callback, obj) {
        obj.resp_topic = config.clientId + "/response/" + parseInt(Math.random() * 1000000);
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

window.mqttConduit = function (config, onReady) {
    /*
        config = {
            ip: ... mqtt ip address
            port: websocket port
        }
      }
    */
    var client = {};
    var iframe = document.createElement('iframe');
    var MqttUseSSL = config.useSSL || false ? "true" : "false";

    var markup = '<html><head>' + '<script>\n' + "var MqttIp = '" + config.wsbroker + "' ; \n" + "var MqttPort = " + config.wsport + "; \n" + "var MqttUseSSL = " + MqttUseSSL + "; \n" + "var MqttClientId = '" + config.clientId + "' ; \n" + "var Origin = '" + window.location.origin + "' ; \n" + iframe_code + '\n' + '</script>\n' + '</head><body onload="clspRouter();" onunload="onunload();"><body>' + '<div id="message"></div>' + '</body></html>';

    // inject code into iframe
    if (typeof iframe.srcdoc !== 'undefined') {
        iframe.srcdoc = markup;
    } else {
        window.srcDoc(iframe, markup);
    }

    iframe.width = 0;
    iframe.height = 0;
    iframe.setAttribute('style', 'display:none;');
    iframe.setAttribute('id', config.clientId);

    // attach hidden iframe to player
    //document.body.appendChild(iframe);
    if (config.videoElementParent !== null) {
        config.videoElementParent.appendChild(iframe);
    } else if (config.videoElement.parentNode !== null) {
        config.videoElement.parentNode.appendChild(iframe);
        config.videoElementParent = config.videoElement.parentNode;
    } else {
        var t = setInterval(function () {
            if (config.videoElement.parentNode !== null) {
                config.videoElement.parentNode.appendChild(iframe);
                config.videoElementParent = config.videoElement.parentNode;
                clearInterval(t);
            }
        }, 1000);
    }

    return pframe_client(iframe, config, onReady);
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
/* harmony import */ var _MqttConduitCollection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MqttConduitCollection */ "./src/js/iov/MqttConduitCollection.js");
/* harmony import */ var _MqttTransport__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MqttTransport */ "./src/js/iov/MqttTransport.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./player */ "./src/js/iov/player.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }









var DEBUG_PREFIX = 'skyline:clsp:iov';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

var IOV = function () {
  _createClass(IOV, null, [{
    key: 'compatibilityCheck',
    value: function compatibilityCheck() {
      // For the MAC
      var NoMediaSourceAlert = false;

      window.MediaSource = window.MediaSource || window.WebKitMediaSource;

      if (!window.MediaSource) {
        if (NoMediaSourceAlert === false) {
          alert("Media Source Extensions not supported in your browser" + ": Claris Live Streaming will not work!");
        }

        NoMediaSourceAlert = true;
      }
    }
  }]);

  function IOV(config) {
    _classCallCheck(this, IOV);

    this.id = uuid_v4__WEBPACK_IMPORTED_MODULE_1___default()();
    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':' + this.id + ':main');

    this.config = {
      // web socket address defaults to the address of the server that loaded this page.
      wsbroker: config.address,
      // default port number
      wsport: config.port,
      // default clientId
      clientId: this.id,
      // to be overriden by user.
      appStart: config.appStart,
      useSSL: config.useSSL || false,
      videoElement: config.videoElement,
      videoElementParent: null
    };

    // handle inbound messages from MQTT, including video
    // and distributes them to players.
    this.mqttTopicHandlers = new _MqttTopicHandlers__WEBPACK_IMPORTED_MODULE_2__["default"](this.id, this);
    this.mqttConduitCollection = new _MqttConduitCollection__WEBPACK_IMPORTED_MODULE_3__["default"](this.id);
    this.transport = new _MqttTransport__WEBPACK_IMPORTED_MODULE_4__["default"](this.id, this);

    this.events = {
      connection_lost: function connection_lost(responseObject) {
        //TODO close all players and display an error message
        console.error("MQTT connection lost");
        console.error(responseObject);
      },

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
    key: 'new_iov',
    value: function new_iov(config) {
      var self = {};
      self.id = 'x' + uuid_v4__WEBPACK_IMPORTED_MODULE_1___default()();

      self.config = {
        // web socket address defaults to the address of the server that loaded this page.
        wsbroker: config.address,
        // default port number
        wsport: config.port,
        // default clientId
        clientId: self.id,
        // to be overriden by user.
        appStart: config.appStart,
        useSSL: config.useSSL || false,
        videoElement: config.videoElement,
        videoElementParent: this.config.videoElementParent
      };

      // handle inbound messages from MQTT, including video
      // and distributes them to players.
      self.mqttTopicHandlers = new _MqttTopicHandlers__WEBPACK_IMPORTED_MODULE_2__["default"](self.id, self);
      self.mqttConduitCollection = this.mqttConduitCollection;
      self.transport = new _MqttTransport__WEBPACK_IMPORTED_MODULE_4__["default"](self.id, self);

      this.events = {
        connection_lost: function connection_lost(responseObject) {
          //TODO close all players and display an error message
          console.error("MQTT connection lost");
          console.error(responseObject);
        },

        // keep the same topic handler
        on_message: self.mqttTopicHandlers.msghandler,

        // generic exception handler
        exception: function exception(text, e) {
          console.error(text);
          if (typeof e !== 'undefined') {
            console.error(e.stack);
          }
        }
      };

      self.new_iov = this.new_iov;
      self.play = this.play;
      self.getAvailableStreams = this.getAvailableStreams;
      self.compatibilityCheck = this.compatibilityCheck;

      return self;
    }
  }, {
    key: 'initialize',
    value: function initialize(player) {
      var _this = this;

      IOV.compatibilityCheck();

      // route inbound data from a frame running mqtt to the appropriate player
      window.addEventListener('message', function (event) {
        _this.debug('message received', event.data);

        var clientId = event.data.clientId;

        if (!_this.mqttConduitCollection.exists(clientId)) {
          return;
        }

        var conduit = _this.mqttConduitCollection.getById(clientId);
        var eventType = event.data.event;

        switch (eventType) {
          case 'data':
            conduit.inboundHandler(event.data);
            break;
          case 'ready':
            if (_this.config.videoElement.parentNode !== null) {
              _this.config.videoElementParentId = _this.config.videoElement.parentNode.id;
            }
            conduit.onReady();
            break;
          case 'fail':
            _this.debug('network error', event.data.reason);
            player.trigger("network-error", event.data.reason);
            break;
          default:
            console.error("No match for event = " + eventType);
        }
      });
    }
  }, {
    key: 'player',
    value: function player() {
      return Object(_player__WEBPACK_IMPORTED_MODULE_5__["default"])(this);
    }

    // query remote server and get a list of all stream names

  }, {
    key: 'getAvailableStreams',
    value: function getAvailableStreams(callback) {
      this.transport.transaction('iov/video/list', callback, {});
    }
  }]);

  return IOV;
}();

/* harmony default export */ __webpack_exports__["default"] = (IOV);

/***/ }),

/***/ "./src/js/iov/MqttConduitCollection.js":
/*!*********************************************!*\
  !*** ./src/js/iov/MqttConduitCollection.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var DEBUG_PREFIX = 'skyline:clsp:iov';

var MqttConduitCollection = function () {
  function MqttConduitCollection(id) {
    _classCallCheck(this, MqttConduitCollection);

    this.id = id;
    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':' + this.id + ':MqttConduitCollection');

    this.debug('constructing...');

    this._conduits = {};
  }

  _createClass(MqttConduitCollection, [{
    key: 'set',
    value: function set(id, conduit) {
      this.debug('setting...', id, conduit);

      this._conduits[id] = conduit;

      return conduit;
    }
  }, {
    key: 'addFromIov',
    value: function addFromIov(transport, iov) {
      var _this = this;

      this.debug('adding from iov...', iov);

      return this.set(iov.config.clientId, mqttConduit(iov.config, function () {
        _this.debug('onReady...', iov.config.clientId);

        iov.config.appStart(iov);

        // the mse service will stop streaming to us if we don't send
        // a message to iov/stats within 1 minute.
        iov._statsTimer = setInterval(function () {
          iov.statsMsg.inkbps = iov.statsMsg.byteCount * 8 / 30000.0;
          iov.statsMsg.byteCount = 0;

          transport.publish('iov/stats', iov.statsMsg);

          _this.debug('iov status', iov.statsMsg);
        }, 5000);
      }));
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
        debug('No handler for ' + topic + ' - message dropped', message);

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

/***/ "./src/js/iov/MqttTransport.js":
/*!*************************************!*\
  !*** ./src/js/iov/MqttTransport.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var DEBUG_PREFIX = 'skyline:clsp:iov';

var MqttTransport = function () {
  function MqttTransport(id, iov) {
    _classCallCheck(this, MqttTransport);

    this.id = id;
    this.debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':' + this.id + ':MqttConduitCollection');

    this.debug('constructing...');

    // setup stats
    iov.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: iov.config.clientId
    };

    this.clientId = iov.config.clientId;
    this.iov = iov;

    this.debug('looking for useSSL', iov);
    this.conduit = iov.mqttConduitCollection.addFromIov(this, iov);
  }

  // create a temporary resp_topic to receive a query response
  // upon response remove the temporary topic. Assume both request
  // and response are json formateed text.


  _createClass(MqttTransport, [{
    key: 'transaction',
    value: function transaction(topic, callback, data) {
      var _this = this;

      this.debug('transaction...');

      this.conduit.transaction(topic, function (event) {
        _this.debug('transaction callback...', event);
        if (callback) {
          callback(event);
        }
      }, data);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(topic, callback) {
      var _this2 = this;

      this.debug('subscribe...');

      this.conduit.subscribe(topic, function (event) {
        _this2.debug('subscribe callback...', event);
        if (callback) {
          callback(event);
        }
      });
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(topic, callback) {
      var _this3 = this;

      this.debug('unsubscribe...');

      this.conduit.unsubscribe(topic, function (event) {
        _this3.debug('unsubscribe callback...', event);
        if (callback) {
          callback(event);
        }
      });
    }
  }, {
    key: 'publish',
    value: function publish(topic, data, callback) {
      var _this4 = this;

      this.debug('publish...');

      this.conduit.publish(topic, data, function (event) {
        _this4.debug('publish callback...', event);
        if (callback) {
          callback(event);
        }
      });
    }
  }]);

  return MqttTransport;
}();

/* harmony default export */ __webpack_exports__["default"] = (MqttTransport);

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
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_1__);



var DEBUG_PREFIX = 'skyline:clsp:iov';
var debug = debug__WEBPACK_IMPORTED_MODULE_0___default()(DEBUG_PREFIX + ':player');

window.parse_clsp_url = function (_src) {
    if (!_src) {
        return;
    }
    var parser = document.createElement('a');

    var useSSL = false;
    var default_port;
    var kluged_src;

    if (_src.substring(0, 5).toLowerCase() === 'clsps') {
        useSSL = true;
        kluged_src = _src.replace('clsps', 'https');
        default_port = 443;
    } else {
        // firefox/ie hack!
        kluged_src = _src.replace('clsp', 'http');
        default_port = 9001;
    }

    parser.href = kluged_src;
    //parser.href = "http:" + parser.pathname;

    var hostname = parser.hostname;
    var port = parser.port;
    var t = parser.pathname.split("/");
    var streamName = t[t.length - 1];

    if (port.length === 0) {
        port = default_port;
    }

    // @ is a special address maening the server that loaded the web page.
    if (hostname === '@') {
        hostname = window.location.hostname;
    }

    return {
        port: parseInt(port),
        address: hostname,
        streamName: streamName,
        useSSL: useSSL
    };
};

/**
 * Responsible for receiving stream input and routing it to the media source
 * buffer for rendering on the video tag. There is some 'light' reworking of
 * the binary data that is required.
 *
 * var player = iov.player();
 * player.play( video_element_id, stream_name );
*/
/* harmony default export */ __webpack_exports__["default"] = (function (iov) {
    var self = {};

    self.change_event = function (evt) {
        var url = evt.detail.url;

        // parse url, extract the ip of the sfs and the port as well as useSSL
        var new_cfg = parse_clsp_url(url);

        if (new_cfg.address === iov.config.wsbroker) {
            self.change(new_cfg.streamName, null);
        } else {
            var next_iov;

            new_cfg.videoElement = iov.config.videoElement;
            new_cfg.appStart = function (next_iov) {
                // conected to new mqtt
                self.change(new_cfg.streamName, next_iov);
            };

            // first create a new transport
            next_iov = iov.new_iov(new_cfg);
        }
    };

    self.change = function (newStream, next_iov) {
        var moov = null;
        var moof = null;

        var on_req_resp = function on_req_resp(resp) {
            var new_mimeCodec = resp.mimeCodec;
            var new_guid = resp.guid; // stream guid

            if ('MediaSource' in window && MediaSource.isTypeSupported(new_mimeCodec)) {
                var initseg_topic = iov.config.clientId + "/init-segment/" + parseInt(Math.random() * 1000000);

                // tranport will either be the exiting one or the new iov's tranport
                var transport = next_iov === null ? iov.transport : next_iov.transport;

                transport.subscribe(initseg_topic, function (mqtt_msg) {
                    var moov = mqtt_msg.payloadBytes; // store new MOOV atom.
                    transport.unsubscribe(initseg_topic);

                    transport.subscribe("iov/video/" + new_guid + "/live", function (moof_mqtt_msg) {
                        var moofBox = moof_mqtt_msg.payloadBytes;
                        self.vqueue.push(moofBox.slice(0));

                        // unsubscribe to existing live
                        // 1) unsubscribe to remove avoid callback
                        transport.unsubscribe("iov/video/" + new_guid + "/live");

                        // 2) unsubscribe to livee callback for the old stream
                        iov.transport.unsubscribe("iov/video/" + self.guid + "/live");

                        // 3) resubscribe with different callback
                        transport.subscribe("iov/video/" + new_guid + "/live", self._on_moof);

                        // alter object properties to reflect new stream
                        self.guid = new_guid;
                        self.moovBox = moov;
                        self.mimeCodec = new_mimeCodec;

                        // remove media source buffer, reinitialize
                        self.reinitializeMse();

                        if (next_iov !== null) {
                            if (next_iov.config.parentNodeId !== null) {
                                var iframe_elm = document.getElementById(iov.config.clientId);
                                var p = document.getElementById(next_iov.config.parentNodeId);
                                if (p) {
                                    p.removeChild(iframe_elm);
                                }

                                // remove code from iframe.
                                if (typeof iframe_elm.srcdoc !== 'undefined') {
                                    iframe_elm.srcdoc = "";
                                } else {
                                    window.srcDoc(iframe_elm, "");
                                }
                            }
                            iov = next_iov; // replace iov variable with the new one created.
                        }
                    });
                });

                var play_request_topic = "iov/video/" + new_guid + "/play";
                transport.publish(play_request_topic, {
                    initSegmentTopic: initseg_topic,
                    clientId: next_iov === null ? iov.config.clientId : next_iov.config.clientId
                });
            } else {
                // the browser does not support this video format
                self._fault("Unsupported mime codec " + self.mimeCodec);
            }
        };

        var request = { clientId: iov.config.clientId };
        var topic = "iov/video/" + window.btoa(newStream) + "/request";
        if (next_iov === null) {
            iov.transport.transaction(topic, on_req_resp, request);
        } else {
            next_iov.transport.transaction(topic, on_req_resp, request);
        }
    };

    /*
    Used for determining the size of the internal buffer hidden from the MSE
    api by recording the size and time of each chunk of video upon buffer append
    and recording the time when the updateend event is called.
      */

    self.LogSourceBuffer = false;
    self.LogSourceBufferTopic = null;
    self.state = "idle";
    self.seqnum = 1;
    self.seqnumProcessed = 1; // last sequence number processed
    self.MAX_SEQ_PROC = 2;
    self.dropCounter = 0;

    self.moovBox = null;
    self.moofBox = null;
    // -1 is forever
    self.retry_count = 3;
    self.source_buffer_ready = false;

    self._fault = function (err) {
        self.videoPlayer.errors.extend({
            PLAYER_ERR_IOV: {
                headline: 'Error Playing Stream',
                message: err
            }
        });
        self.videoPlayer.error({ code: 'PLAYER_ERR_IOV' });
        self.state = "fault";
    };

    self.reinitializeMse = function () {
        // reset counters, flags
        self.seqnum = 1;
        self.seqnumProcessed = 1; // last sequence number processed
        self.source_buffer_ready = false;
        self.dropCounter = 0;

        // free resource
        URL.revokeObjectURL(self.mediaSource);

        // reallocate, this will call media source open which will
        // append the MOOV atom.
        self.video.src = URL.createObjectURL(self.mediaSource);
    };

    self.restart = function () {
        self.stop();
        self.play(self.eid, self.streamName, self.onFirstChunk, self.onVideoRecv);
    };

    self.play = function (eid, streamName, onFirstChunk, onVideoRecv) {
        self.eid = eid;
        self.id = eid.replace('_html5_api', '');
        self.streamName = streamName;
        self.onFirstChunk = onFirstChunk;
        self.video = document.getElementById(eid);
        self.onVideoRecv = onVideoRecv;
        self.videoPlayer = video_js__WEBPACK_IMPORTED_MODULE_1___default.a.getPlayer(self.id);

        if (typeof self.video === 'undefined') {
            self._fault("Unable to match id '" + eid + "'");
            return;
        }
        var request = { clientId: iov.config.clientId };
        var topic = "iov/video/" + window.btoa(self.streamName) + "/request";
        iov.transport.transaction(topic, self._start_play, request);
    };

    self.resume = function (onFirstChunk, onVideoRecv) {
        self.onFirstChunk = onFirstChunk;
        self.onVideoRecv = onVideoRecv;

        var request = { clientId: iov.config.clientId };
        var topic = "iov/video/" + window.btoa(self.streamName) + "/request";
        iov.transport.transaction(topic, self._start_play, request);
    };

    self._appendBuffer_event = function (bytearray) {
        if (self.LogSourceBuffer === true && self.LogSourceBufferTopic !== null) {
            //debug("recording "+parseInt(bytearray.length)+" bytes of data");
            var mqtt_msg = new Paho.MQTT.Message(bytearray);
            mqtt_msg.destinationName = self.LogSourceBufferTopic;
            MQTTClient.send(mqtt_msg);
        }
        // increment bytecount stats
        iov.statsMsg.byteCount += bytearray.length;
    };

    self.stop = function () {
        // stop streaming live video
        if (typeof self.guid !== 'undefined') {
            iov.transport.unsubscribe("iov/video/" + self.guid + "/live");
        }

        self.state = "idle";

        // free resources associated with player
        self.seqnum = 1;
        self.moovBox = null;
        self.moofBox = null;

        var request = { clientId: iov.config.clientId };
        iov.transport.publish("iov/video/" + self.guid + "/stop", request);
    };

    self._start_play = function (resp) {
        self.mimeCodec = resp.mimeCodec;
        self.guid = resp.guid; // stream guid

        if ('MediaSource' in window && MediaSource.isTypeSupported(self.mimeCodec)) {
            var initseg_topic = iov.config.clientId + "/init-segment/" + parseInt(Math.random() * 1000000);

            self._async_play_loop(resp, initseg_topic);
            var play_request_topic = "iov/video/" + self.guid + "/play";
            iov.transport.publish(play_request_topic, {
                initSegmentTopic: initseg_topic,
                clientId: iov.config.clientId
            });
        } else {
            // the browser does not support this video format
            self._fault("Unsupported mime codec " + self.mimeCodec);
        }
    };

    self._async_play_loop = function (resp, initSegmentTopic) {
        // setup handlers for video
        self.vqueue = []; // used if the media source buffer is busy

        self.state = "waiting-for-moov";

        iov.transport.subscribe(initSegmentTopic, function (mqtt_msg) {

            // capture the initial segment
            self.moovBox = mqtt_msg.payloadBytes;
            //debug(typeof mqtt_msg.payloadBytes);
            //debug("received moov from server");


            self.state = "waiting-for-moof";
            // unsubscribe to this group
            iov.transport.unsubscribe(initSegmentTopic);

            // subscribe to the live video topic.
            self.state = "playing";
            iov.transport.subscribe("iov/video/" + self.guid + "/live", self._on_moof);
            // create media source buffer and start routing video traffic.


            self.onFirstChunk(); // first chunk of video received.

            self.mediaSource = new MediaSource();

            var clone = self.video.cloneNode();
            var parent = self.video.parentNode;
            if (parent !== null) {
                parent.replaceChild(clone, self.video);
                self.video = clone;
            }

            var event = document.createEvent('Event');
            event.initEvent('iov-change-src', true, true);
            self.video.addEventListener('iov-change-src', self.change_event, false);
            debug("iov-change-src on id = ", self.video.id);

            self.mediaSource.addEventListener('sourceopen', self._on_sourceopen);
            self.mediaSource.addEventListener('sourceended', self._on_sourceended);
            self.mediaSource.addEventListener('error', function (e) {
                console.error("MSE error");
                console.error(e);
            });

            // now assign media source extensions
            //debug("Disregard: The play() request was interrupted ... its not an error!");
            self.video.src = URL.createObjectURL(self.mediaSource);

            // subscribe to a sync topic that will be called if the stream that is feeding
            // the mse service dies and has to be restarted that this player should restart the stream
            var resync_topic = "iov/video/" + self.guid + "/resync";
            debug("Call " + resync_topic + " to resync stream");
            iov.transport.subscribe(resync_topic, function (mqtt_msg) {
                debug("sync received re-initialize media source buffer");
                self.reinitializeMse();
            });
        });
    };

    self._on_moof = function (mqtt_msg) {

        if (self.source_buffer_ready == false) {
            //debug("media source not yet open dropping frame");
            return;
        }

        /**
            Enqueues or sends to the media source buffer an MP4 moof atom. This contains a
            chunk of video/audio tracks.
         */
        // pace control. Allow a maximum of MAX_SEQ_PROC MOOF boxes to be held within
        // the source buffer.
        if (self.seqnum - self.seqnumProcessed > self.MAX_SEQ_PROC) {
            //debug("DROPPING FRAME DRIFT TOO HIGH, dropCounter = " + parseInt(self.dropCounter));
            return; // DROP this frame since the borwser is falling
        }

        var moofBox = mqtt_msg.payloadBytes;
        moofBox[20] = (self.seqnum & 0xFF000000) >> 24;
        moofBox[21] = (self.seqnum & 0x00FF0000) >> 16;
        moofBox[22] = (self.seqnum & 0x0000FF00) >> 8;
        moofBox[23] = self.seqnum & 0xFF;

        //debug("moof handler: data seqnum chunk ");
        //debug(self.seqnum);

        if (self.sourceBuffer.updating === false) {
            try {
                //debug(typeof moofBox);
                //debug("calling append buffer");
                self._appendBuffer_event(moofBox);
                self.sourceBuffer.appendBuffer(moofBox);
                self.seqnum += 1; // increment sequence number for next chunk
            } catch (e) {
                console.error("Excetion thrown from appendBuffer", e);
                self.videoPlayer.error({ code: 3 });
                self.reinitializeMse();
            }
        } else {
            self.vqueue.push(moofBox.slice(0));
        }
    };

    // found when stress testing many videos, it is possible for the
    // media source ready state not to be open even though
    // source open callback is being called.
    self._on_sourceopen = function () {
        if (self.mediaSource.readyState === "open") {
            self._do_on_sourceopen();
            return;
        }

        var t = setInterval(function () {
            if (self.mediaSource.readyState === "open") {
                self._do_on_sourceopen();
                clearInterval(t);
            }
        }, 1000);
    };

    self._do_on_sourceopen = function () {
        /** New media source opened. Add a buffer and append the moov MP4 video data.
        */

        // add buffer
        self.sourceBuffer = self.mediaSource.addSourceBuffer(self.mimeCodec);
        self.sourceBuffer.mode = "sequence";
        self.sourceBuffer.addEventListener('updateend', self._on_updateend);
        self.sourceBuffer.addEventListener('update', function () {
            if (self.sourceBuffer.updating === false && self.vqueue.length > 0) {
                try {
                    self._appendBuffer_event(self.vqueue[0]);
                    self.sourceBuffer.appendBuffer(self.vqueue[0]);
                    self.vqueue = self.vqueue.slice(1);
                } catch (e) {
                    console.error("Excetion thrown from appendBuffer", e);
                    self.videoPlayer.error({ code: 3 });
                    self.reinitializeMse();
                }
            }
        });

        self.sourceBuffer.addEventListener('updatestart', function () {
            //debug("On update start");
        });

        self.sourceBuffer.addEventListener('error', function (e) {
            console.error("MSE sourceBffer error");
            console.error(e);
        });

        // send ftype+moov segments of video
        //debug("sending moov atom ");

        // we are now able to process video
        self.source_buffer_ready = true;

        self._appendBuffer_event(self.moovBox);
        self.sourceBuffer.appendBuffer(self.moovBox);
    };

    self._on_sourceended = function () {
        //debug("sourceended");

        // @todo - do we need to clear the buffer manually?
        self.stop();
        self.source_buffer_ready = false;
    };

    self._on_updateend = function () {

        // identify what seqnum of the MOOF message has actually been processed.
        self.seqnumProcessed += 1;

        /*
        var logmsg =
           "_on_updateend: " +
           ((self.video.paused) ? " video is paused,": "video is playing,")   +
           " ready state = '" + self.mediaSource.readyState + "', " +
           " video queue size = " + parseInt(self.vqueue.length)
        ;
        debug(logmsg);
        */
        if (self.mediaSource.readyState === "open") {
            if (self.video.paused === true) {
                console.log("video is paused!", self.videoPlayer.id());
                try {
                    console.log("video paused calling video.play()", self.videoPlayer.id());
                    var promise = self.video.play();
                    console.log("video.play() called", self.videoPlayer.id());
                    if (typeof promise !== 'undefined') {
                        promise.then(function (_) {}).catch(function (e) {});
                    }
                } catch (ex) {
                    console.error("Exception while trying to play:" + ex.message);
                }
                //debug("setting video player from paused to play");
            }

            if (self.sourceBuffer.buffered.length > 0) {
                var start = self.sourceBuffer.buffered.start(0);
                var end = self.sourceBuffer.buffered.end(0);
                var time_buffered = end - start;
                var limit = 15.0;
                if (time_buffered > 30.0) {
                    try {
                        // observed this fail during a memry snapshot in chrome
                        // otherwise no observed failure, so ignore exception.
                        self.sourceBuffer.remove(start, start + limit);
                    } catch (e) {
                        console.log('error while removing', self.videoPlayer.id());
                        console.error(e);
                    }
                }
            }

            if (self.vqueue.length > 0) {
                self._appendBuffer_event(self.vqueue[0]);
                setTimeout(function () {
                    // deqeue next prepared moof atom
                    if (self.sourceBuffer.updating === false) {
                        try {
                            self.sourceBuffer.appendBuffer(self.vqueue[0]);
                        } catch (ex) {
                            // internal error, this has been observed to happen the tab
                            // in the browser where this video player lives is hidden
                            // then reselected. 'ex' is undefined the error is bug
                            // within the MSE C++ implementation in the browser.
                            self.reinitializeMse();
                        }
                    }
                    // regardless we must proceed to the frame.
                    self.vqueue = self.vqueue.slice(1);
                }, 0);
            }
        }
    };

    return self;
});;

/***/ }),

/***/ "./src/js/mseOverMqtt.js":
/*!*******************************!*\
  !*** ./src/js/mseOverMqtt.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");




window.iov_events = {};

/* harmony default export */ __webpack_exports__["default"] = (function (defaults, SrcsLookupTable, onPlayerReady) {
  /**
   * A video.js plugin.
   *
   * In the plugin function, the value of `this` is a video.js `Player`
   * instance. You cannot rely on the player being in a "ready" state here,
   * depending on how the plugin is invoked. This may or may not be important
   * to you; if not, remove the wait for "ready"!
   *
   * @function mseOverMqtt
   * @param    {Object} [options={}]
   *           An object of options left to the plugin author to define.
   */
  var mseOverMqtt = function mseOverMqtt(options) {
    var _this = this;

    this.errors({
      errors: {
        PLAYER_ERR_NOT_COMPAT: {
          headline: 'This browser is unsupported.',
          message: 'Chrome 52+ is required.'
        }
      },
      timeout: 120 * 1000
    });

    if (_utils__WEBPACK_IMPORTED_MODULE_1__["default"].supported() === false) {
      this.error({ code: 'PLAYER_ERR_NOT_COMPAT', dismiss: false });
      return;
    }

    this.on('changesrc', function (evt, data) {
      var velm = document.getElementById(data.eid + '_html5_api');

      var event = document.createEvent('Event');
      event.initEvent('iov-change-src', true, true);

      event.detail = data;
      velm.dispatchEvent(new CustomEvent('iov-change-src', event));
    });

    this.on('firstplay', function (e) {
      var spinner = this.player_.loadingSpinner;
      var videojs_player = this.player_;

      //TODO: This seems to screw up the video js error function.  Is this necessary?
      // work around bogus error code.
      /*var old_error = Object.assign({}, videojs_player.error());
      videojs_player.error = function (evt) {
        if (typeof evt === 'undefined') {
          return old_error;
        }
         if (evt === null) {
          return;
        }
         if (evt.code !== -2) {
          videojs_player.old_error(evt);
        }
      };*/

      var source_tag = this.currentSource();
      if (!(source_tag.src in SrcsLookupTable)) {
        console.error('src not in lookup table');
        return;
      }

      var h = SrcsLookupTable[source_tag.src];
      // setup mqtt connection, callback called when connection
      // made and a new iov_player created.
      h.launchIovPlayer(function (iov_player) {
        if (iov_player === null || iov_player.playing === true) {
          return;
        }

        iov_player.playing = true;

        // dynamically alter the control bar below the video tag.
        function setupControlBar() {
          videojs_player.controlBar.addClass('vjs-live');
          window._ThePlayer = videojs_player;

          var playToggle = videojs_player.controlBar.children_[0].el_;
          playToggle.addEventListener('click', function () {
            // @todo - is this setTimeout necessary?
            setTimeout(function () {
              if (iov_player.playing === true) {
                iov_player.stop();
                iov_player.playing = false;
                videojs_player.controlBar.playToggle.handlePause();
                return;
              }

              spinner.show();

              iov_player.resume(function () {
                // @todo - is this setTimeout necessary?
                setTimeout(function () {
                  spinner.hide();
                }, 0);
              }, function () {
                // reset the timeout monitor
                videojs_player.trigger('timeupdate');
              });

              iov_player.playing = true;
              videojs_player.controlBar.playToggle.handlePlay();
            }, 0);
          });
        }

        // start playing video
        iov_player.play(e.target.firstChild.id, h.streamName, function () {
          // @todo - is this setTimeout necessary?
          // dispose of spinner after page refresh.
          setTimeout(function () {
            // spinner.dispose();
            spinner.hide();
            // toggle play button
            videojs_player.controlBar.playToggle.handlePlay();
            // alter the control bar
            setupControlBar();
          }, 0);
        }, function () {
          // reset the timeout monitor
          videojs_player.trigger('timeupdate');
        });
      });
    });

    this.ready(function () {
      var videoTag = _this.children()[0];
      // var playButton = this.bigPlayButton;

      videoTag.addEventListener('mqttReady', function (event) {
        if (videoTag.getAttribute('autoplay') !== null) {
          // playButton.trigger('click');
          _this.trigger('play', videoTag);
        }
      });

      onPlayerReady(_this, video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mergeOptions(defaults, options));
    });
  };

  return mseOverMqtt;
});

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var MINIMUM_CHROME_VERSION = 52;

function browserIsCompatable() {
  // Chrome 1+
  var isChrome = Boolean(window.chrome) && Boolean(window.chrome.webstore);

  if (!isChrome) {
    return false;
  }

  try {
    return parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2], 10) >= MINIMUM_CHROME_VERSION;
  } catch (error) {
    return false;
  }
}

/* harmony default export */ __webpack_exports__["default"] = ({
  supported: browserIsCompatable
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
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! video.js */ "video.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(video_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var videojs_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! videojs-errors */ "./node_modules/videojs-errors/dist/videojs-errors.es.js");
/* harmony import */ var srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! srcdoc-polyfill */ "./node_modules/srcdoc-polyfill/srcdoc-polyfill.js");
/* harmony import */ var srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(srcdoc_polyfill__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _conduit_clspConduit_generated_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./conduit/clspConduit.generated.js */ "./src/js/conduit/clspConduit.generated.js");
/* harmony import */ var _conduit_clspConduit_generated_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_conduit_clspConduit_generated_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../package.json */ "./package.json");
var _package_json__WEBPACK_IMPORTED_MODULE_4___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../package.json */ "./package.json", 1);
/* harmony import */ var _MqttHandler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./MqttHandler */ "./src/js/MqttHandler.js");
/* harmony import */ var _MqttSourceHandler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./MqttSourceHandler */ "./src/js/MqttSourceHandler.js");
/* harmony import */ var _mseOverMqtt__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mseOverMqtt */ "./src/js/mseOverMqtt.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils */ "./src/js/utils.js");
/* harmony import */ var _iov_IOV__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./iov/IOV */ "./src/js/iov/IOV.js");
/* harmony import */ var _styles_videojs_mse_over_clsp_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../styles/videojs-mse-over-clsp.scss */ "./src/styles/videojs-mse-over-clsp.scss");
/* harmony import */ var _styles_videojs_mse_over_clsp_scss__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_styles_videojs_mse_over_clsp_scss__WEBPACK_IMPORTED_MODULE_10__);





// import './conduit/clspConduit.generated.min.js';









/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
var onPlayerReady = function onPlayerReady(player, options) {
  player.addClass('vjs-mse-over-mqtt');
};

function initialize() {
  var SrcsLookupTable = {};

  var mqttHandler = Object(_MqttHandler__WEBPACK_IMPORTED_MODULE_5__["default"])(SrcsLookupTable);
  var mqttSourceHandler = Object(_MqttSourceHandler__WEBPACK_IMPORTED_MODULE_6__["default"])(mqttHandler);

  video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mqttSupported = true;
  video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mqttHandler = mqttHandler;
  video_js__WEBPACK_IMPORTED_MODULE_0___default.a.mqttSourceHandler = mqttSourceHandler;
  video_js__WEBPACK_IMPORTED_MODULE_0___default.a.getTech('Html5').registerSourceHandler(mqttSourceHandler('html5'), 0);

  // Default options for the plugin.
  var defaults = {};

  var clspPlugin = Object(_mseOverMqtt__WEBPACK_IMPORTED_MODULE_7__["default"])(defaults, SrcsLookupTable, onPlayerReady);

  // Cross-compatibility for Video.js 5 and 6.
  var registerPlugin = video_js__WEBPACK_IMPORTED_MODULE_0___default.a.registerPlugin || video_js__WEBPACK_IMPORTED_MODULE_0___default.a.plugin;

  // Register the plugin with video.js.
  // @todo - this is a side effect of
  clspPlugin.clsp_IOV = _iov_IOV__WEBPACK_IMPORTED_MODULE_9__["default"];

  registerPlugin('clsp', clspPlugin);

  return clspPlugin;
}

// @todo - do not initialize the plugin by default, since that is a side
// effect.  make the caller call the initialize function.  also, is it
// possible to unregister the plugin?
var clspPlugin = initialize();

// clspPlugin.initialize = initialize;
clspPlugin.version = _package_json__WEBPACK_IMPORTED_MODULE_4__["version"];
clspPlugin.utils = _utils__WEBPACK_IMPORTED_MODULE_8__["default"];

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