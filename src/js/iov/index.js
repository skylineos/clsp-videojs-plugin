'use strict';

import 'srcdoc-polyfill';

import IovCollection from './collection';
import Source from './Source';
import IOV from './IOV';
import Player from './player';

// @todo - this is deprecated and should be removed
window.IovCollection = IovCollection;

window.skylineIov = {
  Source,
  IOV,
  Player,
  Collection: IovCollection,
}

export default IovCollection;
