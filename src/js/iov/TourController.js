import StreamConfiguration from './StreamConfiguration';

const DEFAULT_TOUR_INTERVAL_DURATION = 10;

export default class TourController {
  static factory (iovCollection, videoElementId, options) {
    return new TourController(iovCollection, videoElementId, options);
  }

  constructor (iovCollection, videoElementId, options = {}) {
    this.iovCollection = iovCollection;

    this.destroyed = false;
    this.startTime = null;
    this.streamConfigurations = [];
    this.iov = null;
    this.currentIndex = 0;
    this.interval = null;
    this.videoElementId = videoElementId;

    this.options = {
      intervalDuration: options.intervalDuration || DEFAULT_TOUR_INTERVAL_DURATION,
      onChange: options.onChange || (() => {}),
      onChangeError: options.onChangeError || (() => {}),
    };
  }

  addUrls (urls) {
    if (!Array.isArray(urls)) {
      urls = [urls];
    }

    for (let i = 0; i < urls.length; i++) {
      this.streamConfigurations.push(StreamConfiguration.fromUrl(urls[i]));
    }
  }

  async next (resetTimer = false) {
    // Start the tour list over again once the end of the stream list is reached
    if (this.currentIndex === this.streamConfigurations.length) {
      this.currentIndex = 0;
    }

    const streamConfiguration = this.streamConfigurations[this.currentIndex];

    this.currentIndex++;

    try {
      await this.iov.changeSrc(streamConfiguration);

      this.options.onChange(this.currentIndex, streamConfiguration);
    }
    catch (error) {
      this.options.onChangeError(error, this.currentIndex, streamConfiguration);
    }

    if (resetTimer) {
      clearInterval(this.interval);

      await this.resume(true);
    }
  }

  async previous () {
    if (this.currentIndex === 0) {
      this.currentIndex = urls.length - 2;
    }
    else if (this.currentIndex === 1) {
      this.currentIndex = urls.length - 1;
    }
    else {
      this.currentIndex -= 2;
    }

    await this.next(true);
  }

  async resume (force = false, wait = true) {
    if (!force && this.interval) {
      return;
    }

    if (!wait) {
      await this.next();
    }

    this.pause();

    this.interval = setInterval(async () => {
      await this.next();
    }, this.options.intervalDuration * 1000);
  }

  async start () {
    this.iov = await this.iovCollection.create(this.videoElementId);

    await this.resume(true, false);
  }

  pause () {
    if (!this.interval) {
      return;
    }

    clearInterval(this.interval);
    this.interval = null;
  }

  stop () {
    this.pause();

    this.currentIndex = 0;
  }

  async reset () {
    this.stop();

    await this.resume(true);
  }

  fullscreen () {
    if (!this.iov) {
      return;
    }

    this.iov.toggleFullscreen();
  }

  destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.pause();

    for (let i = 0; i < this.streamConfigurations.length; i++) {
      this.streamConfigurations[i].destroy();
    }

    this.streamConfigurations = null;

    if (this.iov) {
      this.iovCollection.remove(this.iov.id);
      this.iov = null;
    }

    this.iovCollection = null;
    this.videoElementId = null;
  }
}
