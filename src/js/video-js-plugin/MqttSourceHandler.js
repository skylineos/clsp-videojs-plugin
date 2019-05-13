import Debug from 'debug';
import videojs from 'video.js';

import MqttHandler from './MqttHandler';
import utils from '../utils';

const DEBUG_PREFIX = 'skyline:clsp';
const SUPPORTED_MIME_TYPE = "video/mp4; codecs='avc1.42E01E'";

export default function () {
  const debug = Debug(`${DEBUG_PREFIX}:MqttSourceHandler`);

  return function (mode) {
    const obj = {
      canHandleSource: function (srcObj, options = {}) {
        debug('canHandleSource');

        if (!srcObj.src) {
          debug("srcObj doesn't contain src");
          return false;
        }

        if (!srcObj.src.startsWith('clsp')) {
          debug('srcObj.src is not clsp protocol');
          return false;
        }

        if (!utils.supported()) {
          debug('Browser not supported. Chrome 52+ is required.');
          return false;
        }

        return obj.canPlayType(srcObj.type);
      },
      handleSource: function (
        source,
        tech,
        options = {}
      ) {
        debug('handleSource');

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
        debug('canPlayType');

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
