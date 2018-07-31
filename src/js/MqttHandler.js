import Debug from 'debug';
import videojs from 'video.js';

import IOV from './iov/IOV';
import IOVPlayer from './iov/player';

const Component = videojs.getComponent('Component');

export default function (SrcsLookupTable) {
  class MqttHandler extends Component {
    constructor (source, tech, options, player) {
      super(tech, options.mqtt);

      this.playerInstance = player;
      this.tech_ = tech;
      this.source_ = source;
      this.enabled = false;
      this.debug = Debug('skyline:clsp:MqttHandler');
    }

    src (_src) {
      const srcConfig = IOVPlayer.generateIOVConfigFromCLSPURL(_src);

      this.enabled = true;
      this.mqtt_player = null;
      this.port = srcConfig.port;
      this.address = srcConfig.address;
      this.streamName = srcConfig.streamName;
      this.useSSL = srcConfig.useSSL;

      SrcsLookupTable[_src] = this;
    }

    launchIovPlayer (player, onMqttReady) {
      var velm = this.player().el();

      var iov = new IOV({
        port: this.port,
        address: this.address,
        appStart: (iov) => {
          // connected to MQTT procede to setting up callbacks
          // debug("iov.player() called")
          var mqtt_player = iov.player();
          var evt = new window.CustomEvent("mqttReady");
          console.log(this.player())
          console.log(this.player)
          this.player().el().dispatchEvent(evt);
          onMqttReady(mqtt_player);

          velm.addEventListener("mse-error-event", function (e) {
            mqtt_player.restart();
          }, false);
        },
        useSSL: this.useSSL,
        videoElement: velm,
      });

      iov.initialize(this.playerInstance);
    }
  };

  return MqttHandler;
}
