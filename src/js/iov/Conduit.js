'use strict';

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a single video. This is basically an in-browser micro service which
 * uses cross-document communication to route data to and from the iframe.
 */

import Debug from 'debug';

// We want the minified file so that we minimize the size of each iframe
import iframeCode from '~root/dist/Router.min';

// @todo - this needs to be an event listener
export default class Conduit {
  static DEBUG_NAME = 'skyline:clsp:iov:conduit';

  static factory (iov) {
    return new Conduit(iov);
  }

  constructor (iov) {
    this.iov = iov;
    this.clientId = iov.config.clientId;

    this.debug = Debug(`${Conduit.DEBUG_NAME}:${this.clientId}`);

    this.debug('Constructing...');

    this.destroyed = false;
    this.handlers = {};
    this.iframe = this.generateIframe();
    this.attachIframe();
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
        <body onload="window.iframeCode.clspRouter();" onunload="window.iframeCode.onunload();">
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
    if (this.iov.config.videoElementParent !== null) {
      this.iov.config.videoElementParent.appendChild(this.iframe);
    }
    else if (this.iov.videoElement.parentNode !== null) {
      this.iov.videoElement.parentNode.appendChild(this.iframe);
      this.iov.config.videoElementParent = this.iov.videoElement.parentNode;
    }
    else {
      const interval = setInterval(() => {
        if (this.iov.videoElement.parentNode !== null) {
          this.iov.videoElement.parentNode.appendChild(this.iframe);
          this.iov.config.videoElementParent = this.iov.videoElement.parentNode;
          clearInterval(interval);
        }
      }, 1000);
    }
  }

  // primitive function that routes message to iframe
  command (message) {
    this.debug('posting message from iframe...');

    if (this.iframe.contentWindow !== null) {
      this.iframe.contentWindow.postMessage(message, '*');
      return;
    }

    const interval = setInterval(() => {
      if (this.iframe.contentWindow !== null) {
        this.iframe.contentWindow.postMessage(message, '*');
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
      throw new Error('The Conduit must be started before it can stop.');
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
      this.unsubscribe(this.handlers[registeredTopics[i]]);
    }

    this.handlers = {};
  }

  destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.debug('destroying...');

    this.clearHandlers();

    this.iov = null;
    this.clientId = null;
    this.handlers = null;
    this.iframe = null;
  }
}
