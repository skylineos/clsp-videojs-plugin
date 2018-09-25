'use strict';

import Debug from 'debug';
import videojs from 'video.js';

import IOV from '~/iov/IOV';

const Component = videojs.getComponent('Component');

export default class MqttHandler extends Component {
  constructor (source, tech, conduits, options) {
    super(tech, options.mqtt);

    this.debug = Debug('skyline:clsp:plugin:MqttHandler');
    this.debug('constructor');

    this.destroyed = false;

    this.tech_ = tech;
    this.source_ = source;

    // @todo - is there a better way to do this where we don't pollute the
    // top level namespace?  does it matter?
    this.iov = null;
    this.conduits = conduits;

    // We must detect and then respond to chrome performing "background tab performance
    // stuff", because it can cause instability with the video players over extended
    // periods of time, such as 20 minutes.  When we detect that the tab has been put
    // in the background (or any other performance stuff that chrome does that causes
    // the video to be paused), we will immediately stop it to help prevent instability.
    // It is possible that there is a more efficent or proper way to do this, but for
    // now, this works.
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  metric (metric) {
    // @todo
    // if (this.options.enableMetrics) {
    this.trigger('metric', { metric });
    // }
  }

  onVisibilityChange = () => {
    const hidden = document.hidden;

    this.debug(`detected tab visibility change.  tab is now ${hidden ? 'hidden' : 'visible'}`);

    if (hidden) {
      this.destroyIOV();
    }
    else {
      this.recreateIOV();
    }
  }

  createIOV (player, iovOptions) {
    this.debug('createIOV');

    this.updateIOV(IOV.fromUrl(
      this.source_.src,
      this.conduits,
      player,
      {},
      iovOptions,
    ));

    this.iov.initialize();
  }

  updateIOV (iov) {
    this.debug('updateIOV');

    const updated = Boolean(this.iov);
    let destroyed = false;

    if (this.iov) {
      // If the IOV is the same, do nothing
      if (this.iov.id === iov.id) {
        return;
      }

      this.iov.destroy();

      destroyed = true;
    }

    this.iov = iov;

    // If the existing IOV was destroyed, or if there was not an
    // existing IOV that was updated, register new listeners
    if (destroyed || !updated) {
      // @todo - this is an imprecise fix.  I don't know why the player is
      // receiving "onReady" multiple times...
      this.iov.on('onReadyCalledMultipleTimes', () => {
        this.destroyIOV();
        this.recreateIOV();
      });

      this.iov.on('metric', (metric) => {
        // @see - https://docs.videojs.com/tutorial-plugins.html#events
        // Note that I originally tried to trigger this event on the player
        // rather than the tech, but that causes the video not to play...
        this.metric(metric);
      });

      this.iov.on('criticalError', (error) => {
        console.error(error);

        this.destroyIOV();

        this.trigger('error');
      });
    }
  }

  destroyIOV () {
    this._oldIovPlayerInstance = this.iov.playerInstance;
    this._oldIovOptions = this.iov.options;
    this.iov.destroy();
  }

  recreateIOV () {
    this.createIOV(this._oldIovPlayerInstance, this._oldIovOptions);
    this._oldIovPlayerInstance = null;
    this._oldIovOptions = null;
  }

  destroy () {
    console.log('destroy', this.constructor.name, this.destroyed);

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.debug('destroying...');

    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    this._oldIovPlayerInstance = null;
    this._oldIovOptions = null;
    this.iov.destroy();
    this.iov = null;
    // @todo - do we need to destroy conduits?

    this.dispose();

    this.debug = null;
    this.tech_ = null;
    this.source_ = null;
    this.conduits = null;
  }
};
