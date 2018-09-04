import 'videojs-errors';

import 'srcdoc-polyfill';
import './conduit/clspConduit.generated.js';
// import './conduit/clspConduit.generated.min.js';

import MseOverMqttPlugin from './MseOverMqttPlugin';
import './clspWebcam';
import '../styles/videojs-mse-over-clsp.scss';

// @todo - do not initialize the plugin by default, since that is a side
// effect.  make the caller call the initialize function.  also, is it
// possible to unregister the plugin?
const clspPlugin = MseOverMqttPlugin();

clspPlugin.register();

export default clspPlugin;
