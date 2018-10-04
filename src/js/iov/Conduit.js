'use strict';

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a single video. This is basically an in-browser micro service which
 * uses cross-document communication to route data to and from the iframe.
 */

import ListenerBaseClass from '~/utils/ListenerBaseClass';

// We want the minified file so that we minimize the size of each iframe
import iframeCode from '~root/dist/Router';

// @todo - this needs to be an event listener
export default class Conduit extends ListenerBaseClass {
  static DEFAULT_OPTIONS = {
    iframeTimeout: 9 * 1000,
  };

  static METRIC_TYPES = [
    'iovConduit.instances',
    'iovConduit.clientId',
    'iovConduit.guid',
    'iovConduit.mimeCodec',
  ];

  static factory (iov, options = {}) {
    return new Conduit(iov, options);
  }

  constructor (iov, options) {
    super(options);

    this.iov = iov;
    this.clientId = iov.id;

    this.handlers = {};
    this.iframe = this.generateIframe();
    this.attachIframe();
  }

  onFirstMetricListenerRegistered () {
    super.onFirstMetricListenerRegistered();

    this.metric('iovConduit.instances', 1);
    this.metric('iovConduit.clientId', this.clientId);
  }

  generateIframe () {
    this.debug('generating iframe...');

    const iframe = document.createElement('iframe');

    iframe.setAttribute('style', 'display:none;');
    iframe.setAttribute('id', this.clientId);

    iframe.width = 0;
    iframe.height = 0;

    iframe.srcdoc = `
      <html>
        <head>
          <script type="text/javascript">
            window.MqttClientId = "${this.clientId}";
            window.iframeCode = ${iframeCode.toString()}();
          </script>
        </head>
        <body
          onload="window.iframeCode.clspRouter();"
          onunload="window.iframeCode.onunload();"
        >
          <div id="message"></div>
        </body>
      </html>
    `;

    return iframe;
  }

  attachIframe () {
    this.debug('attaching iframe...');

    // attach hidden iframe to player
    // document.body.appendChild(iframe);
    if (this.iov.config.videoElementParent) {
      this.iov.config.videoElementParent.appendChild(this.iframe);
      return;
    }

    if (this.iov.videoElement.parentNode) {
      this.iov.videoElement.parentNode.appendChild(this.iframe);
      this.iov.config.videoElementParent = this.iov.videoElement.parentNode;
      return;
    }

    const interval = setInterval(() => {
      if (this.iov.videoElement.parentNode !== null) {
        try {
          this.iov.videoElement.parentNode.appendChild(this.iframe);
          this.iov.config.videoElementParent = this.iov.videoElement.parentNode;
        }
        catch (error) {
          console.error(error);
        }

        clearInterval(interval);
      }
    }, 1000);
  }

  // primitive function that routes message to iframe
  command (message) {
    this.debug('posting message from iframe...');

    if (this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(message, '*');
      return;
    }

    const interval = setInterval(() => {
      if (this.iframe.contentWindow !== null) {
        try {
          this.iframe.contentWindow.postMessage(message, '*');
        }
        catch (error) {
          console.error(error);
        }

        clearInterval(interval);
      }
    }, 1000);
  }

  getTopicHandler (topic) {
    this.debug(`getting topic handler for ${topic}...`);

    const handler = this.handlers[topic];

    if (!handler) {
      throw new Error(`No handler for ${topic}`);
    }

    return handler;
  }

  subscribe (topic, callback) {
    this.debug(`subscribing to ${topic}...`);

    this.handlers[topic] = callback;

    this.command({
      method: 'subscribe',
      topic,
    });
  }

  unsubscribe (topic) {
    this.debug(`unsubscribing from ${topic}...`);

    if (topic in this.handlers) {
      delete this.handlers[topic];
    }

    this.command({
      method: 'unsubscribe',
      topic,
    });
  }

  publish (topic, data) {
    this.debug(`publishing to ${topic}...`);

    this.command({
      method: 'publish',
      topic,
      data,
    });
  }

  /**
   * Before we can set up a listener for the moofs, we must first set up a few
   * initialization listeners, one for the stream request, and one for the moov.
   *
   * This method is what is executed when we first request a stream.  This should only
   * ever be executed once per stream request.  Once this is executed, it unregisters
   * itself as a listener, and registers an init-segment listener, which also
   * only runs once, then unregisters itself.  The init-segment payload is the
   * moov.  Once we receive the moov, the caller can start listening for moofs.
   *
   */
  start (cb) {
    this.debug('starting...');

    const responseTopic = `${this.clientId}'/response/'${parseInt(Math.random() * 1000000)}`;
    const initSegmentTopic = `${this.clientId}/init-segment/${parseInt(Math.random() * 1000000)}`;

    this.subscribe(responseTopic, (mqtt_resp) => {
      this.debug(`received response for ${responseTopic}...`);

      // call user specified callback to handle response from remote process
      const response = JSON.parse(mqtt_resp.payloadString);

      this.metric('iovConduit.guid', response.guid);
      this.metric('iovConduit.mimeCodec', response.mimeCodec);

      this.debug('onIovPlayTransaction');

      this.guid = response.guid;

      // Ask the server for the moov
      this.subscribe(initSegmentTopic, async ({ payloadBytes }) => {
        this.debug(`received response for ${initSegmentTopic}...`);

        // Now that we have the moov, we no longer need to listen for it
        this.unsubscribe(initSegmentTopic);

        cb(response.mimeCodec, payloadBytes);
      });

      // Tell the server we're ready to play
      this.publish(`iov/video/${this.guid}/play`, {
        initSegmentTopic,
        clientId: this.clientId,
      });

      // cleanup.
      this.unsubscribe(responseTopic);
    });

    // start transaction
    // MQTTClient.send(mqtt_msg);
    this.publish(`iov/video/${window.btoa(this.iov.config.streamName)}/request`, {
      clientId: this.clientId,
      resp_topic: responseTopic,
    });
  }

  stream (cb) {
    this.debug('streaming...');

    if (!this.guid) {
      throw new Error('The Conduit must be started before it can stream.');
    }

    // Listen for moofs
    // The listener for moofs runs indefinitely, until it is commanded to stop.
    this.subscribe(`iov/video/${this.guid}/live`, (mqtt_msg) => {
      cb(mqtt_msg.payloadBytes);
    });
  }

  onResync (cb) {
    this.debug('registering listener for resync event...');

    // When the server says we need to resync...
    this.subscribe(`iov/video/${this.guid}/resync`, () => {
      this.debug('resyncing...');

      cb();
    });
  }

  stop () {
    this.debug('stopping...');

    if (!this.guid) {
      // throw new Error('The Conduit must be started before it can stop.');
      return;
    }

    // Stop listening for moofs
    this.unsubscribe(`iov/video/${this.guid}/live`);

    // Stop listening for resync events
    this.unsubscribe(`iov/video/${this.guid}/resync`);

    // Tell the server we've stopped
    this.publish(
      `iov/video/${this.guid}/stop`,
      { clientId: this.clientId }
    );

    // @todo - should we also call clearHandlers here?
  }

  clearHandlers () {
    const registeredTopics = Object.keys(this.handlers);
    const registeredTopicCount = registeredTopics.length;

    this.debug(`clearing ${registeredTopicCount} handlers...`);

    for (let i = 0; i < registeredTopicCount; i++) {
      const topic = registeredTopics[i];

      this.unsubscribe(topic);
    }

    this.handlers = {};
  }

  destroy () {
    if (this.destroyed) {
      return;
    }

    console.log('destroying conduit...')

    this.destroyed = true;

    this.debug('destroying...');

    this.clearHandlers();

    this.iov = null;
    this.clientId = null;
    this.handlers = null;

    try {
      this.command({
        method: 'destroy',
        topic: 'iov/video/grand_cam_037/resync',
      });
    }
    catch (error) {
      console.error(error);
      console.warn('Failed when issuing "destroy" command to iframe.');
    }

    // As part of the destroy process, we have to terminate all connections
    // to the server, then perform a true disconnect.  Currently, we do not
    // know when these disconnections are finished.  Until this is implemented,
    // we will simply wait a little while, then destroy the iframe.  If we
    // destroy the iframe before the disconnections occur, there will be
    // nothing to hear the posted messages, and the SFS may retain open
    // connections unecessarily.
    // @todo - implement a way in the Router to know when actions finish.
    setTimeout(() => {
      this.iframe.parentNode.removeChild(this.iframe);
      this.iframe.srcdoc = '';
      this.iframe = null;

      super.destroy();
    }, this.options.iframeTimeout);
  }
}
