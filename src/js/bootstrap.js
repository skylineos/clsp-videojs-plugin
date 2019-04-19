'use strict';

let areGlobalsRegistered = false;

function registerGlobals () {
  if (areGlobalsRegistered) {
    return;
  }

  // The logLevel may be set in localstorage
  // e.g. localStorage.setItem('skyline.clspPlugin.logLevel', 3), then refresh
  const logLevel = isNaN(Number(window.localStorage.getItem('skyline.clspPlugin.logLevel')))
    ? 1
    : Number(window.localStorage.getItem('skyline.clspPlugin.logLevel'));

  window.localStorage.setItem('skyline.clspPlugin.logLevel', logLevel);

  // @todo - use proper state management
  // Namespace our globals, and allow for the fact that another application may
  // be using our top level namespace
  if (!window.skyline) {
    window.skyline = {};
  }

  // We will also set the value on the window so that other parts of the plugin
  // do not need to access localstorage.
  window.skyline.clspPlugin = { logLevel };
}

registerGlobals();
