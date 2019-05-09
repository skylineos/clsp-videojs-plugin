'use strict';

/* eslint no-console: off */

export default class Logger {
  static factory (prefix = '') {
    return new Logger(prefix);
  }

  constructor (prefix) {
    this.prefix = prefix;
  }

  _constructMessage (message) {
    if (!this.prefix) {
      return message;
    }

    return `${this.prefix} ${message}`;
  }

  debug (message) {
    if (window.skyline.clspPlugin.logLevel >= 3) {
      console.log(this._constructMessage(message));
    }
  }

  warn (message) {
    if (window.skyline.clspPlugin.logLevel >= 2) {
      console.warn(this._constructMessage(message));
    }
  }

  error (message) {
    if (window.skyline.clspPlugin.logLevel >= 1) {
      console.error(this._constructMessage(message));
    }
  }
}
