'use strict';

import Debug from 'debug';

export default class ListenerBaseClass {
  static DEBUG_NAME = 'skyline:clsp:utils:ListenerBaseClass';

  static EVENT_NAMES = [];

  static METRIC_TYPES = [];

  constructor (debugName) {
    this.debug = Debug(debugName);
    this.silly = Debug(`silly:${debugName}`);

    this.metrics = {};
    this.events = {};

    for (let i = 0; i < this.constructor.EVENT_NAMES.length; i++) {
      this.events[this.constructor.EVENT_NAMES[i]] = [];
    }
  }

  on (name, action) {
    this.debug(`Registering Listener for ${name} event...`);

    if (!this.constructor.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    this.events[name].push(action);
  }

  trigger (name, value) {
    if (name === 'metric') {
      this.silly(`Triggering ${name} event...`);
    }
    else {
      this.debug(`Triggering ${name} event...`);
    }

    if (!this.constructor.EVENT_NAMES.includes(name)) {
      throw new Error(`"${name}" is not a valid event."`);
    }

    for (let i = 0; i < this.events[name].length; i++) {
      this.events[name][i](value, this);
    }
  }

  metric (type, value) {
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
      case 'sourceBuffer.lastMoofSize': {
        this.metrics[type] = value;
        break;
      }
      default: {
        if (!this.metrics.hasOwnProperty(type)) {
          this.metrics[type] = 0;
        }

        this.metrics[type] += value;
      }
    }

    this.trigger('metric', {
      type,
      value: this.metrics[type],
    });
  }

  destroy () {
    this.metrics = null;
    this.events = null;
    this.debug = null;
    this.silly = null;
  }
}