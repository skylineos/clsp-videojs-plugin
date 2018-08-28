/**
 * This file is the target of the distributable js file.  It registers the
 * CLSP plugin with videojs for you.
 *
 * If you would like to use the videojs plugin without having it registered
 * for you, you can include the `MseOverMqttPlugin` file directly (ES6 only).
 */

import MseOverMqttPlugin from '~/plugin/MseOverMqttPlugin';

const clspPlugin = MseOverMqttPlugin();

clspPlugin.register();

export default clspPlugin;
