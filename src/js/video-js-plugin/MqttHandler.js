import Debug from 'debug';
import videojs from 'video.js';
import uuidv4 from 'uuid/v4';

import IovCollection from '../iov/collection';

const Component = videojs.getComponent('Component');

const DEBUG_PREFIX = 'skyline:clsp';

export default class MqttHandler extends Component {
  constructor (source, tech, options) {
    super(tech, options.mqtt);

    this.debug = Debug(`${DEBUG_PREFIX}:MqttHandler`);
    this.debug('constructor');

    this.tech_ = tech;
    this.source_ = source;

    // @todo - is there a better way to do this where we don't pollute the
    // top level namespace?
    this.iov = null;
    this.player = null;
  }

  onChangeSource = (event, { url }) => {
    this.debug(`changeSource on player "${this.id}""`);

    if (!url) {
      throw new Error('Unable to change source because there is no url!');
    }

    const clone = this.iov.cloneFromUrl(url);

    clone.initialize();

    // When the tab is not in focus, chrome doesn't handle things the same
    // way as when the tab is in focus, and it seems that the result of that
    // is that the "firstFrameShown" event never fires.  Having the IOV be
    // updated on a delay in case the "firstFrameShown" takes too long will
    // ensure that the old IOVs are destroyed, ensuring that unnecessary
    // socket connections, etc. are not being used, as this can cause the
    // browser to crash.
    // Note that if there is a better way to do this, it would likely reduce
    // the number of try/catch blocks and null checks in the IOVPlayer and
    // MSEWrapper, but I don't think that is likely to happen until the MSE
    // is standardized, and even then, we may be subject to non-intuitive
    // behavior based on tab switching, etc.
    setTimeout(() => {
      this.updateIOV(clone);
    }, clone.config.changeSourceMaxWait);

    // Under normal circumstances, meaning when the tab is in focus, we want
    // to respond by switching the IOV when the new IOV Player has something
    // to display
    clone.player.on('firstFrameShown', () => {
      this.updateIOV(clone);
    });
  };

  createIOV (player) {
    this.debug('createIOV');

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

    const iov = IovCollection.asSingleton().create(this.source_.src, videoElement);

    this.player.on('ready', () => {
      if (this.onReadyAlreadyCalled) {
        console.warn('tried to use this player more than once...');
        return;
      }

      this.onReadyAlreadyCalled = true;

      const videoTag = this.player.children()[0];

      // @todo - there must be a better way to determine autoplay...
      if (videoTag.getAttribute('autoplay') !== null) {
        // playButton.trigger('click');
        this.player.trigger('play', videoTag);
      }

      iov.player.on('firstFrameShown', () => {
        this.player.trigger('firstFrameShown');
        this.player.loadingSpinner.hide();

        videoTag.style.display = 'none';
      });

      iov.player.on('videoReceived', () => {
        // reset the timeout monitor from videojs-errors
        this.player.trigger('timeupdate');
      });

      iov.player.on('videoInfoReceived', () => {
        // reset the timeout monitor from videojs-errors
        this.player.trigger('timeupdate');
      });

      this.player.on('changesrc', this.onChangeSource);
    });

    this.updateIOV(iov);
  }

  updateIOV (iov) {
    this.debug('updateIOV');

    if (this.iov) {
      // If the IOV is the same, do nothing
      if (this.iov.id === iov.id) {
        return;
      }

      IovCollection.asSingleton()
        .remove(this.iov.id)
        .add(iov.id, iov);
    }

    this.iov = iov;
  }

  destroy () {
    this.debug('destroy');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    if (this.onReadyAlreadyCalled) {
      this.player.off('changesrc', this.onChangeSource);
    }

    this.iov = null;
    this.player = null;
  }
}
