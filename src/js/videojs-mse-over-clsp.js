import videojs from 'video.js';
import 'videojs-errors';

import 'srcdoc-polyfill';
import './conduit/clspConduit.generated.js';
// import './conduit/clspConduit.generated.min.js';

import {version as VERSION} from '../../package.json';
import MqttHandler from './MqttHandler';
import MqttSourceHandler from './MqttSourceHandler';
import mseOverMqtt from './mseOverMqtt';
import utils from './utils';
import IOV from './iov/IOV';
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
  player.addClass('vjs-mse-over-mqtt');
};

function initialize () {
  const SrcsLookupTable = {};

  const mqttHandler = MqttHandler(SrcsLookupTable);
  const mqttSourceHandler = MqttSourceHandler(mqttHandler);

  videojs.mqttSupported = true;
  videojs.mqttHandler = mqttHandler;
  videojs.mqttSourceHandler = mqttSourceHandler;
  videojs.getTech('Html5').registerSourceHandler(mqttSourceHandler('html5'), 0);
   

  // Default options for the plugin.
  const defaults = {};

  const clspPlugin = mseOverMqtt(defaults, SrcsLookupTable, onPlayerReady);

  // Cross-compatibility for Video.js 5 and 6.
  const registerPlugin = videojs.registerPlugin || videojs.plugin;

  // Register the plugin with video.js.
  // @todo - this is a side effect of
  clspPlugin.clsp_IOV = IOV;  
 
  registerPlugin('clsp', clspPlugin);

  return clspPlugin;
}

// @todo - do not initialize the plugin by default, since that is a side
// effect.  make the caller call the initialize function.  also, is it
// possible to unregister the plugin?
const clspPlugin = initialize();

// clspPlugin.initialize = initialize;
clspPlugin.version = VERSION;
clspPlugin.utils = utils;

export default clspPlugin;

