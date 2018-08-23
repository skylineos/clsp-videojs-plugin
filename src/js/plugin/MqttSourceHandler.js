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

import Debug from 'debug';
import videojs from 'video.js';

import MqttHandler from './MqttHandler';
import utils from '../utils';

export default class MqttSourceHandler {
  static factory (mode, conduits) {
    return new MqttSourceHandler(mode, conduits);
  }

  constructor (mode, conduits) {
    this.debug = Debug('skyline:clsp:MqttSourceHandler');
    this.debug('constructor');

    this.name = utils.name;
    this.VERSION = utils.version;

    this.mode = mode;
    this.conduits = conduits;
    this.defaultLocalOptions = { mqtt: { mode: this.mode } };
  }

  canHandleSource (srcObj, options = {}) {
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

    if (!utils.supported()) {
      this.debug('Browser not supported. Chrome 52+ is required.');
      return false;
    }

    return this.canPlayType(srcObj.type);
  }

  handleSource (source, tech, options = {}) {
    this.debug('handleSource');

    const localOptions = videojs.mergeOptions(videojs.options, options, this.defaultLocalOptions);

    tech.mqtt = new MqttHandler(
      source,
      tech,
      this.conduits,
      localOptions
    );

    return tech.mqtt;
  }

  canPlayType (type) {
    this.debug('canPlayType');

    if (utils.isSupportedMimeType(type)) {
      this.debug('found supported mime type');
      return 'maybe';
    }

    this.debug('mime type not supported');

    return '';
  }

  destroy () {
    this.debug = null;
    this.name = null;
    this.VERSION = null;
    this.mode = null;
    this.conduits = null;
    this.defaultLocalOptions = null;
  }
};
