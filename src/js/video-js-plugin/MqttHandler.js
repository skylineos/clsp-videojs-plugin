'use strict';

// This is configured as an external library by webpack, so the caller must
// provide videojs on `window`
import videojs from 'video.js';
import uuidv4 from 'uuid/v4';

import IovCollection from '../iov/collection';
import Logger from '../utils/logger';

const Component = videojs.getComponent('Component');

export default class MqttHandler extends Component {
  constructor (
    source,
    tech,
    options = {}
  ) {
    super(tech, options.mqtt);

    this.logger = Logger().factory('MqttHandler');

    this.logger.debug('constructor');

    this.tech_ = tech;
    this.source_ = source;

    this.iovId = null;
    this.player = null;
  }

  getIov () {
    return IovCollection.asSingleton().get(this.iovId);
  }

  onChangeSource = (event, { url }) => {
    this.logger.debug(`changeSource on player "${this.id}""`);

    if (!url) {
      throw new Error('Unable to change source because there is no url!');
    }

    IovCollection.asSingleton().changeSource(this.iovId, url);
  };

  async createIOV (player, options = {}) {
    this.logger.debug('createIOV');

    this.player = player;

    const videoId = `clsp-video-${uuidv4()}`;
    const videoJsVideoElement = this.player.el().firstChild;
    const videoElementParent = videoJsVideoElement.parentNode;

    // when videojs initializes the video element (or something like that),
    // it creates events and listeners on that element that it uses, however
    // these events interfere with our ability to play clsp streams.  Cloning
    // the element like this and reinserting it is a blunt instrument to remove
    // all of the videojs events so that we are in control of the player.
    const videoElement = videoJsVideoElement.cloneNode();
    videoElement.setAttribute('id', videoId);

    videoElementParent.insertBefore(videoElement, videoJsVideoElement);

    const iov = await IovCollection.asSingleton().createFromUrl(this.source_.src, videoElement);

    this.player.on('ready', () => {
      if (this.onReadyAlreadyCalled) {
        this.logger.warn('tried to use this player more than once...');
        return;
      }

      this.onReadyAlreadyCalled = true;

      const videoTag = this.player.children()[0];

      // @todo - there must be a better way to determine autoplay...
      if (videoTag.getAttribute('autoplay') !== null) {
        // playButton.trigger('click');
        this.player.trigger('play', videoTag);
      }

      iov.on('firstFrameShown', () => {
        this.player.trigger('firstFrameShown');

        videoTag.style.display = 'none';
      });

      iov.on('videoReceived', () => {
        // reset the timeout monitor from videojs-errors
        this.player.trigger('timeupdate');
      });

      iov.on('videoInfoReceived', () => {
        // reset the timeout monitor from videojs-errors
        this.player.trigger('timeupdate');
      });

      this.player.on('changesrc', this.onChangeSource);
    });

    this.iovId = iov.id;

    // iov.player.on('unsupportedMimeCodec', (error) => {
    //   this.videoPlayer.errors.extend({
    //     PLAYER_ERR_IOV: {
    //       headline: 'Error Playing Stream',
    //       message: error,
    //     },
    //   });

    //   this.videoPlayer.error({
    //     code: 'PLAYER_ERR_IOV',
    //   });
    // });
  }

  destroy () {
    this.logger.debug('destroy');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    if (this.onReadyAlreadyCalled) {
      this.player.off('changesrc', this.onChangeSource);
    }

    IovCollection.asSingleton().remove(this.iovId);

    this.iovId = null;
    this.player = null;
  }
}
