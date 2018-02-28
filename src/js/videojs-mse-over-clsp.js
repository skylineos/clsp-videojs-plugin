import videojs from 'video.js';
import videojsErrors from 'videojs-errors';

import './srcdoc-polyfill';
import clspConduit from './conduit/clspConduit.generated.js';
// import clspConduit from './conduit/clspConduit.generated.min.js';

import {version as VERSION} from '../../package.json';
import MqttHandler from './MqttHandler';
import MqttSourceHandler from './MqttSourceHandler';
import mseOverMqtt from './mseOverMqtt';

import '../styles/videojs-mse-over-clsp.scss';

const SrcsLookupTable = {};

const mqttHandler = MqttHandler(SrcsLookupTable);
const mqttSourceHandler = MqttSourceHandler(mqttHandler)

videojs.mqttSupported = true;
videojs.mqttHandler =  mqttHandler;
videojs.mqttSourceHandler = mqttSourceHandler;
videojs.getTech('Html5').registerSourceHandler(mqttSourceHandler('html5'), 0);

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
const onPlayerReady = (player, options) => {
  player.addClass('vjs-mse-over-mqtt');
};

// Handle the multiple play() calls for the same HTML dom element.
const play_in_progress = {};

const clspPlugin = mseOverMqtt(defaults, SrcsLookupTable, play_in_progress, onPlayerReady);

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;

// Register the plugin with video.js.
registerPlugin('clsp', clspPlugin);

// Include the version number.
clspPlugin.VERSION = VERSION;

export default clspPlugin;
