import Debug from 'debug';
import videojs from 'video.js';

import _MqttHandler from './MqttHandler';
import utils from './utils';

export default function () {
  const debug = Debug('skyline:clsp:MqttSourceHandler');
  const MqttHandler = _MqttHandler();

  return function (mode) {
    var obj = {
      canHandleSource: function (srcObj, options = {}) {
        if (!srcObj.src) {
          console.error('srcObj doesn\'t contain src');
          debug(srcObj);
          return false;
        }

        if (!srcObj.src.startsWith('clsp')) {
          console.error('srcObj.src is not clsp protocol');
          return false;
        }

        if (!utils.supported()) {
          debug('Browser not supported. Chrome 52+ is required.');
          return false;
        }

        return obj.canPlayType(srcObj.type);
      },
      handleSource: function (source, tech, options = {}) {
        const localOptions = videojs.mergeOptions(videojs.options, options, { mqtt: { mode } });

        tech.mqtt = new MqttHandler(source, tech, localOptions);

        tech.mqtt.src(source.src);

        return tech.mqtt;
      },
      canPlayType: function (type) {
        if (type === "video/mp4; codecs='avc1.42E01E'") {
          return 'maybe';
        }

        console.error(`clsp type='${type}' rejected`);

        return '';
      },
    };

    return obj;
  };
}
