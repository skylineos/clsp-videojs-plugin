'use strict';

import 'srcdoc-polyfill';

import Collection from './Collection';
import Source from './Source';
import IOV from './IOV';
import Player from './Player';

// @todo - this is deprecated and should be removed
window.IovCollection = Collection;

window.skylineIov = {
  Source,
  IOV,
  Player,
  Collection,
};

export default Collection;
