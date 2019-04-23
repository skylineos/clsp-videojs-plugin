import Debug from 'debug';
import uuidv4 from 'uuid/v4';

import Conduit from '../conduit/Conduit';
import MqttTopicHandlers from './MqttTopicHandlers';
import IOVPlayer from './player';
import utils from '../utils';

const DEBUG_PREFIX = 'skyline:clsp:iov';

/**
 * Internet of Video client. This module uses the MediaSource API to
 * deliver video content streamed through MQTT from distributed sources.
 */

export default class IOV {
  static CHANGE_SOURCE_MAX_WAIT = 5000;

  static compatibilityCheck () {
    // @todo - shouldn't this be done in the utils function?
    // @todo - does this need to throw an error?
    // For the MAC
    var NoMediaSourceAlert = false;

    window.MediaSource = window.MediaSource || window.WebKitMediaSource;

    if (!window.MediaSource) {
      if (NoMediaSourceAlert === false) {
        window.alert('Media Source Extensions not supported in your browser: Claris Live Streaming will not work!');
      }

      NoMediaSourceAlert = true;
    }
  }

  static generateConfigFromUrl (url) {
    if (!url) {
      throw new Error('No source was given to be parsed!');
    }

    // We use an anchor tag here beacuse, when an href is added to
    // an anchor dom Element, the parsing is done for you by the
    // browser.
    const parser = document.createElement('a');

    let useSSL;
    let default_port;
    let jwtUrl = false;
    let b64_jwt_access_url ="";
    let jwt_validation_url ="";
    let jwt = "";

    // Chrome is the only browser that allows non-http protocols in
    // the anchor tag's href, so change them all to http here so we
    // get the benefits of the anchor tag's parsing
    if (url.substring(0, 9).toLowerCase() === 'clsps-jwt') {
      useSSL = true;
      parser.href = url.replace('clsps-jwt', 'https');
      default_port = 443;
      jwtUrl = true;
    }
    else if (url.substring(0, 8).toLowerCase() === 'clsp-jwt') {
      useSSL = false;
      parser.href = url.replace('clsp-jwt', 'http');
      default_port = 9001;
      jwtUrl = true;
    }
    else if (url.substring(0, 5).toLowerCase() === 'clsps') {
      useSSL = true;
      parser.href = url.replace('clsps', 'https');
      default_port = 443;
    }
    else if (url.substring(0, 4).toLowerCase() === 'clsp') {
      useSSL = false;
      parser.href = url.replace('clsp', 'http');
      default_port = 9001;
    }
    else {
      throw new Error('The given source is not a clsp url, and therefore cannot be parsed.');
    }

    const paths = parser.pathname.split('/');
    const streamName = paths[paths.length - 1];

    let hostname = parser.hostname;
    let port = parser.port;

    if (port.length === 0) {
      port = default_port;
    }

    // @ is a special address meaning the server that loaded the web page.
    if (hostname === '@') {
      hostname = window.location.hostname;
    }

    // if jwt extract required url parameters.
    if (jwtUrl === true) {

         //Url: clsp[s]-jwt://<sfs addr>[:9001]/<jwt>?Start=...&End=...
        var qp_offset = url.indexOf(parser.pathname)+parser.pathname.length

        var i = 0;
        var qr_args = url.substr(qp_offset).split('?')[1];
        var query = {
        };

        var pairs = qr_args.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }

        if (typeof query.Start === 'undefined') {
           throw new Error("Required 'Start' query parameter not defined for a clsp[s]-jwt");
        }
        if (typeof query.End === 'undefined') {
           throw new Error("Required 'End' query parameter not defined for a clsp[s]-jwt");
        }


        b64_jwt_access_url = window.btoa(
            (useSSL === true) ? "clsps-jwt://": "clsp-jwt://"
            + hostname + ":" + parseInt(port) + "/jwt"
            + "?Start="+query.Start
            + "&End="+query.End
        );
        jwt = query.token;



    } // end if jwt



    return {
      // url,
      wsbroker: hostname,
      wsport: parseInt(port),
      streamName,
      useSSL,
      b64_jwt_access_url,
      jwt
    };

  }

  static factory (player, config = {}) {
    return new IOV(player, config);
  }

  static fromUrl (url, player, config = {}) {
    console.log('from url')
    return IOV.factory(player, {
      ...config,
      ...IOV.generateConfigFromUrl(url),
    });
  }

  constructor (player, config) {
    IOV.compatibilityCheck();

    this.id = uuidv4();

    this.debug = Debug(`${DEBUG_PREFIX}:${this.id}:main`);
    this.debug('constructor');

    this.destroyed = false;
    this.onReadyAlreadyCalled = false;
    this.playerInstance = player;
    this.videoElement = this.playerInstance.el();

    this.config = {
      clientId: this.id,
      wsbroker: config.wsbroker,
      wsport: config.wsport,
      useSSL: config.useSSL,
      streamName: config.streamName,
      appStart: config.appStart,
      changeSourceMaxWait: config.changeSourceMaxWait || IOV.CHANGE_SOURCE_MAX_WAIT,
      jwt: config.jwt,
      b64_jwt_access_url: config.b64_jwt_access_url,
    };

    this.statsMsg = {
      byteCount: 0,
      inkbps: 0,
      host: document.location.host,
      clientId: this.config.clientId,
    };

    // handle inbound messages from MQTT, including video
    // and distributes them to players.
    this.mqttTopicHandlers = new MqttTopicHandlers(this.id, this);

    this.events = {
      connection_lost: (responseObject) => {
        // @todo - close all players and display an error message
        console.error('MQTT connection lost');
        console.error(responseObject);
      },

      // @todo - does this ever get fired?
      on_message: this.mqttTopicHandlers.msghandler,

      // generic exception handler
      exception: (text, e) => {
        console.error(text);
        if (typeof e !== 'undefined') {
          console.error(e.stack);
        }
      },
    };

    window.addEventListener('message', (event) => {
      this.debug('window on message');

      const clientId = event.data.clientId;

      // @todo - this listener was originally centralized, meaning that there
      // was only ever one listener.  Should this be moved to some centralized
      // location?
      // @todo - does the check for a non-existent client id need to be reimplemented?
      //
      // if (!this.exists(clientId)) {
      //   // When the mqtt connection is interupted due to a listener being removed,
      //   // a fail event is always sent.  It is not necessary to log this as an error
      //   // in the console, because it is not an error.
      //   if (!event.data.event === 'fail') {
      //     console.error(`No conduit with id "${clientId}" exists!`);
      //   }

      //   return;
      // }

      if (this.id !== clientId) {
        return;
      }

      // If the document is hidden, don't execute the onMessage handler.  If the
      // handler is executed, for some reason, the conduit will continue to
      // request/receive data from the server, which will eventually result in
      // unconstrained resource utilization, and ultimately a browser crash
      if (document.hidden) {
        return;
      }

      this.onMessage(event);
    });

    const {
      visibilityChangeEventName,
    } = utils.windowStateNames;

    if (visibilityChangeEventName) {
      document.addEventListener(
        visibilityChangeEventName,
        this.onVisibilityChange,
        false
      );
    }
  }

  onVisibilityChange = () => {
    const {
      hiddenStateName,
    } = utils.windowStateNames;

    if (document[hiddenStateName]) {
      // Stop playing when tab is hidden or window is minimized
      this.visibilityChangeTimeout = setTimeout(async () => {
        await this.player.stop();
      }, 1000);

      // Continue to update the time, which will prevent videojs-errors from
      // issuing a timeout error
      this.visibilityChangeInterval = setInterval(async () => {
        this.playerInstance.trigger('timeupdate');
      }, 2000);

      return;
    }

    if (this.visibilityChangeTimeout) {
      clearTimeout(this.visibilityChangeTimeout);
    }

    if (this.visibilityChangeInterval) {
      clearInterval(this.visibilityChangeInterval);
    }

    if (this.player.stopped) {
      this.player.play();
    }
  };

  initialize () {
    this.conduit = Conduit.factory(
      this.config.clientId,
      this.config.wsbroker,
      this.config.wsport,
      this.config.useSSL,
      this.config.b64_jwt_access_url,
      this.config.jwt
    );

    this.eid = this.playerInstance.el().firstChild.id;
    this.videoJsVideoElement = document.getElementById(this.eid);
    console.log(this.videoJsVideoElement)

    if (!this.videoJsVideoElement) {
      throw new Error(`Unable to find an element in the DOM with id "${this.eid}".`);
    }

    const videoId = `clsp-video-${this._id}`;

    // when videojs initializes the video element (or something like that),
    // it creates events and listeners on that element that it uses, however
    // these events interfere with our ability to play clsp streams.  Cloning
    // the element like this and reinserting it is a blunt instrument to remove
    // all of the videojs events so that we are in control of the player.
    // this.videoElement = this.videoJsVideoElement.cloneNode();
    this.videoElement = this.videoJsVideoElement.cloneNode();
    this.videoElement.setAttribute('id', videoId);
    this.videoElement.classList.add('clsp-video');

    this.videoElementParent = this.videoJsVideoElement.parentNode;
    console.log(this.videoElementParent)

    this.player = IOVPlayer.factory(this, this.videoElement);

    this.player.on('firstFrameShown', () => {
      // @todo - this may be overkill given the IOV changeSourceMaxWait...
      // When the video is ready to be displayed, swap out the video player if
      // the source has changed.  This is what allows tours to switch to the next
      if (this.videoElementParent !== null) {
        try {
          this.videoElementParent.insertBefore(this.videoElement, this.videoJsVideoElement);

          let videos = this.videoElementParent.getElementsByTagName('video');

          for (let i = 0; i < videos.length; i++) {
            let video = videos[i];
            const id = video.getAttribute('id');

            if (id !== this.eid && id !== videoId) {
              // video.pause();
              // video.removeAttribute('src');
              // video.load();
              // video.style.display = 'none';
              this.videoElementParent.removeChild(video);
              video.remove();
              video = null;
              videos = null;
              break;
            }
          }

          // this.videoElementParent.replaceChild(this.videoElement, this.videoJsVideoElement);
          // is there still a reference to this element?
          // this.videoJsVideoElement = null;
        }
        catch (e) {
          console.error(e);
        }
      }
    });

    if (!this.player.videoElementParent) {
      throw new Error('There is no iframe container element to attach the iframe to!');
    }

    this.player.videoElementParent.appendChild(this.conduit.iframe);
  }

  clone (config) {
    this.debug('clone');

    const clonedConfig = {
      ...config,
    };

    // @todo - is it possible to reuse the iov player?
    return IOV.factory(
      this.playerInstance,
      clonedConfig
    );
  }

  cloneFromUrl (url, config = {}) {
    this.debug('cloneFromUrl');

    return this.clone({
      ...IOV.generateConfigFromUrl(url),
      ...config,
    });
  }

  // query remote server and get a list of all stream names
  getAvailableStreams (callback) {
    this.debug('getAvailableStreams');

    this.conduit.getStreamList(callback);
  }

  onChangeSource (url) {
    this.debug(`changeSource on player "${this.id}""`);

    if (!url) {
      throw new Error('Unable to change source because there is no url!');
    }

    const clone = this.cloneFromUrl(url);

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
      clone.playerInstance.tech(true).mqtt.updateIOV(clone);
    }, clone.config.changeSourceMaxWait);

    // Under normal circumstances, meaning when the tab is in focus, we want
    // to respond by switching the IOV when the new IOV Player has something
    // to display
    clone.player.on('firstFrameShown', () => {
      clone.playerInstance.tech(true).mqtt.updateIOV(clone);
    });
  }

  onReady (event) {
    this.debug('onReady');

    // @todo - why is this necessary?
    if (this.videoElement.parentNode !== null) {
      this.config.videoElementParentId = this.videoElement.parentNode.id;
    }

    const videoTag = this.playerInstance.children()[0];

    // @todo - there must be a better way to determine autoplay...
    if (videoTag.getAttribute('autoplay') !== null) {
      // playButton.trigger('click');
      this.playerInstance.trigger('play', videoTag);
    }

    if (this.onReadyAlreadyCalled) {
      console.warn('tried to use this player more than once...');
      return;
    }

    this.onReadyAlreadyCalled = true;

    this.player.on('firstFrameShown', () => {
      this.playerInstance.trigger('firstFrameShown');
      this.playerInstance.loadingSpinner.hide();

      videoTag.style.display = 'none';
    });

    this.player.on('videoReceived', () => {
      // reset the timeout monitor from videojs-errors
      this.playerInstance.trigger('timeupdate');
    });

    this.player.on('videoInfoReceived', () => {
      // reset the timeout monitor from videojs-errors
      this.playerInstance.trigger('timeupdate');
    });

    this.playerInstanceEventListeners = {
      changesrc: (event, { url }) => this.onChangeSource(url),
    };

    this.playerInstance.on('changesrc', this.playerInstanceEventListeners.changesrc);

    if (!document.hidden) {
      this.player.play();
    }

    this.videoElement.addEventListener('mse-error-event', async (e) => {
      await this.player.restart();
    }, false);

    // the mse service will stop streaming to us if we don't send
    // a message to iov/stats within 1 minute.
    this._statsTimer = setInterval(() => {
      this.statsMsg.inkbps = (this.statsMsg.byteCount * 8) / 30000.0;
      this.statsMsg.byteCount = 0;

      this.conduit.publish('iov/stats', this.statsMsg);

      this.debug('iov status', this.statsMsg);
    }, 5000);
  }

  onFail (event) {
    this.debug('onFail');

    // when a stream fails, it no longer needs to send stats to the
    // server, and it may not even be connected to the server
    clearInterval(this._statsTimer);

    this.debug('network error', event.data.reason);
    this.playerInstance.trigger('network-error', event.data.reason);
  }

  onData (event) {
    this.debug('onData');

    this.conduit.inboundHandler(event.data);
  }

  onMessage (event) {
    const eventType = event.data.event;

    this.debug('onMessage', eventType);

    switch (eventType) {
      case 'ready': {
        this.onReady(event);
        break;
      }
      case 'fail': {
        this.onFail(event);
        break;
      }
      case 'data': {
        this.onData(event);
        break;
      }
      default: {
        console.error(`No match for event: ${eventType}`);
      }
    }
  }

  play () {
    console.log('iov play')
    return new Promise((resolve, reject) => {
      // @todo - why doesn't this play/stop connect/disconnect work?
      // this.conduit.connect();

      if (this.config.jwt.length === 0) {
        this.conduit.requestStream(this.config.streamName, resolve);
        return;
      }

      // start transaction, decrypt token
      this.conduit.validateJwt((response) => {
        //response ->  {"status": 200, "target_url": "clsp://sfs1/fakestream", "error": null}

        if (response.status !== 200) {
          if (response.status === 403) {
            return reject(new Error('JwtUnAuthorized'));
          }

          return reject(new Error('JwtInvalid'));
        }

        //TODO, figure out how to handle a change in the sfs url from the
        // clsp-jwt from the target url returned from decrypting the jwt
        // token.
        // Example:
        //    user enters 'clsp-jwt://sfs1/jwt?Start=0&End=...' for source
        //    clspUrl = 'clsp://SFS2/streamOnDifferentSfs
        // --- due to the videojs architecture i don't see a clean way of doing this.
        // ==============================================================================
        //    The only way I can see doing this cleanly is to change videojs itself to
        //    allow the 'canHandleSource' function in MqttSourceHandler to return a
        //    promise not a value, then ascychronously find out if it can play this
        //    source after making the call to decrypt the jwt token.22
        // =============================================================================
        // Note: this could go away in architecture 2.0 if MQTT was a cluster in this
        // case what is now the sfs ip address in clsp url will always be the same it will
        // be the public ip of cluster gateway.
        var t = response.target_url.split('/');

        // get the actual stream name
        var streamName = t[t.length - 1];

        this.conduit.requestStream(streamName, resolve);
      });
    });
  }

  stop (guid) {
    // Stop listening for moofs
    this.conduit.unsubscribe(`iov/video/${guid}/live`);

    // Stop listening for resync events
    this.conduit.unsubscribe(`iov/video/${guid}/resync`);

    // Tell the server we've stopped
    this.conduit.publish(`iov/video/${guid}/stop`, {
      clientId: this.config.clientId,
    });

    // @todo - why doesn't this play/stop connect/disconnect work?
    // this.iov.conduit.disconnect();
  }

  resyncStream (mimeCodec) {
    // subscribe to a sync topic that will be called if the stream that is feeding
    // the mse service dies and has to be restarted that this player should restart the stream
    this.conduit.subscribe(`iov/video/${this.guid}/resync`, async () => {
      // console.log('sync received re-initialize media source buffer');
      await this.player.reinitializeMseWrapper(mimeCodec);
    });
  }

  onAppendStart (byteArray) {
    if ((this.LogSourceBuffer === true) && (this.LogSourceBufferTopic !== null)) {
      // console.log(`Recording ${parseInt(byteArray.length)} bytes of data.`);

      this.conduit.directSend({
        method: 'send',
        topic: this.LogSourceBufferTopic,
        byteArray,
      });
    }

    this.iov.statsMsg.byteCount += byteArray.length;
  }

  destroy () {
    this.debug('destroy');

    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    clearInterval(this._statsTimer);

    const {
      visibilityChangeEventName,
    } = utils.windowStateNames;

    if (visibilityChangeEventName) {
      document.removeEventListener(visibilityChangeEventName, this.onVisibilityChange);
    }

    // this.playerInstanceEventListeners will not be defined if the iov is
    // destroyed too early
    if (this.playerInstanceEventListeners) {
      this.playerInstance.off('changesrc', this.playerInstanceEventListeners.changesrc);
    }

    this.player.destroy();

    this.playerInstance = null;
    this.player = null;

    this.conduit.destroy();
    this.conduit = null;

    const iframe = document.getElementById(this.config.clientId);
    iframe.parentNode.removeChild(iframe);
    iframe.srcdoc = '';
  }
}
