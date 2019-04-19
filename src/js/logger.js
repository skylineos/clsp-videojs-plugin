'use strict';

/* eslint no-console: off */

export default class Logger {
  static factory () {
    return new Logger();
  }

  debug (message) {
    if (window.skyline.clspPlugin.logLevel >= 3) {
      console.log(message);
    }
  }

  warn (message) {
    if (window.skyline.clspPlugin.logLevel >= 2) {
      console.warn(message);
    }
  }

  error (message) {
    if (window.skyline.clspPlugin.logLevel >= 1) {
      console.error(message);
    }
  }
}
