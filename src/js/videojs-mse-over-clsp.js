import videojs from 'video.js';
import videojsErrors from 'videojs-errors';

// Needed to ensure the clsp conduit can do its job
import './srcdoc-polyfill';

import MqttSourceHandler from './MqttSourceHandler';
import ClspPlugin from './mseOverMqtt';

// static assets that need to be built by webpack
import clspConduit from './conduit/clspConduit.generated.js';
import '../styles/videojs-mse-over-clsp.scss';


// Default options for the plugin.
const defaults = {};

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
function onPlayerReady (player, options) {
  player.addClass('vjs-mse-over-mqtt');
}

const SrcsLookupTable = {};
const MqttConduitLookup = {};

// Initialize the plugin components
const clspPlugin = ClspPlugin(defaults, SrcsLookupTable, onPlayerReady);
const mqttSourceHandler = MqttSourceHandler(SrcsLookupTable, MqttConduitLookup);

// Expose the version and utils
window.clspPlugin = clspPlugin;

// Register the source handler
videojs.getTech('Html5').registerSourceHandler(mqttSourceHandler('html5'), 0);

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;

// Register the plugin with video.js.
registerPlugin('clsp', clspPlugin);

export default clspPlugin;
