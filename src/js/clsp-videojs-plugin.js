'use strict';

/**
 * This file is the target of the distributable js file.  It registers the
 * CLSP plugin with videojs for you.
 *
 * If you would like to use the videojs plugin without having it registered
 * for you, you can include the `ClspPlugin` file directly (ES6 only).
 */

import ClspPlugin from '~/plugin/ClspPlugin';

const clspPlugin = ClspPlugin();

clspPlugin.register();

export default clspPlugin;
