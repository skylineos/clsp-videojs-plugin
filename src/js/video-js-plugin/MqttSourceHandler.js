'use strict';

// This is configured as an external library by webpack, so the caller must
// provide videojs on `window`
import videojs from 'video.js';

import Logger from '../utils/logger';
import MqttHandler from './MqttHandler';
import utils from '../utils';

const SUPPORTED_MIME_TYPE = "video/mp4; codecs='avc1.42E01E'";

export default function () {
  const logger = Logger(window.skyline.clspPlugin.logLevel).factory('MqttSourceHandler');

  return function (mode) {
    const obj = {
      canHandleSource: function (srcObj, options = {}) {
        logger.debug('canHandleSource');

        if (!srcObj.src) {
          logger.debug("srcObj doesn't contain src");
          return false;
        }

        if (!srcObj.src.startsWith('clsp')) {
          logger.debug('srcObj.src is not clsp protocol');
          return false;
        }

        if (!utils.supported()) {
          logger.debug('Browser not supported. Chrome 52+ is required.');
          return false;
        }

        return obj.canPlayType(srcObj.type);
      },
      handleSource: function (
        source,
        tech,
        options = {}
      ) {
        logger.debug('handleSource');

        const localOptions = videojs.mergeOptions(
          videojs.options,
          options,
          {
            mqtt: {
              mode,
            },
          }
        );

        tech.mqtt = new MqttHandler(
          source,
          tech,
          localOptions
        );

        return tech.mqtt;
      },
      canPlayType: function (type) {
        logger.debug('canPlayType');

        if (type === SUPPORTED_MIME_TYPE) {
          return 'maybe';
        }

        // eslint-disable-next-line no-console
        console.error(`clsp type='${type}' rejected`);

        return '';
      },
    };

    return obj;
  };
}
