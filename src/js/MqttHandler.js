import Debug from 'debug';
import videojs from 'video.js';

import IOVPlayer from './iov/player';

const Component = videojs.getComponent('Component');

export default function () {
  class MqttHandler extends Component {
    constructor (source, tech, options) {
      super(tech, options.mqtt);

      this.tech_ = tech;
      this.source_ = source;
      this.debug = Debug('skyline:clsp:MqttHandler');
    }

    /**
     * called when player.src gets called, handle a new source
     *
     * @param {Object} src the source object to handle
     */
    src (src) {
      const srcConfig = IOVPlayer.generateIOVConfigFromCLSPURL(src);

      this.port = srcConfig.port;
      this.address = srcConfig.address;
      this.streamName = srcConfig.streamName;
      this.useSSL = srcConfig.useSSL;
    }
  };

  return MqttHandler;
}
