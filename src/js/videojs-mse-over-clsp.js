import videojs from 'video.js';
import 'videojs-errors';

import 'srcdoc-polyfill';
import './conduit/clspConduit.generated.js';
// import './conduit/clspConduit.generated.min.js';

import MqttHandler from './MqttHandler';
import MqttSourceHandler from './MqttSourceHandler';
import mseOverMqtt from './mseOverMqtt';
import '../styles/videojs-mse-over-clsp.scss';

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  player.addClass();
};

function initialize () {
  // Default options for the plugin.
  const defaults = {
    customClass: 'vjs-mse-over-mqtt',
  };
  const SrcsLookupTable = {};

  const mqttHandler = MqttHandler(SrcsLookupTable);
  const mqttSourceHandler = MqttSourceHandler(mqttHandler);
  const clspPlugin = mseOverMqtt(defaults, SrcsLookupTable, onPlayerReady);

  videojs.getTech('Html5').registerSourceHandler(mqttSourceHandler('html5'), 0);
  videojs.registerPlugin(clspPlugin.pluginName, clspPlugin);

  return clspPlugin;
}

// @todo - do not initialize the plugin by default, since that is a side
// effect.  make the caller call the initialize function.  also, is it
// possible to unregister the plugin?
export default initialize();
