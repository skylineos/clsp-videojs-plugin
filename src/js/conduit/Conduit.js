'use strict';

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a single video. This is basically an in-browser micro service which
 * uses cross-document communication to route data to and from the iframe.
 *
 * This code is a layer of abstraction on top of the mqtt router, and the
 * controller of the iframe that contains the router.
 */

import Router from './Router';
import Logger from '../logger';

import Paho from 'paho-mqtt';

// Even though the export of paho-mqtt is { Client, Message }, there is an
// internal reference that the library makes to itself, and it expects
// itself to exist at Paho.MQTT.  FIRED!
window.Paho = {
  MQTT: Paho,
};

export default class Conduit {
  static factory (
    clientId,
    wsbroker,
    wsport,
    useSSL,
    b64_jwt_access_url,
    jwt
  ) {
    return new Conduit(
      clientId,
      wsbroker,
      wsport,
      useSSL,
      b64_jwt_access_url,
      jwt
    );
  }

  constructor (
    clientId,
    wsbroker,
    wsport,
    useSSL,
    b64_jwt_access_url,
    jwt
  ) {
    this.clientId = clientId;
    this.wsbroker = wsbroker;
    this.wsport = wsport;
    this.useSSL = useSSL;
    this.b64_jwt_access_url = b64_jwt_access_url;
    this.jwt = jwt;

    this.iframe = this._generateIframe();

    this.handlers = {};
  }

  /**
   * @private
   *
   * Generate an iframe with an embedded mqtt router.  The router will be what
   * this Conduit instance communicates with in subsequent commands.
   *
   * @returns Element
   */
  _generateIframe () {
    const iframe = document.createElement('iframe');

    iframe.setAttribute('id', this.clientId);

    // This iframe should be invisible
    iframe.width = 0;
    iframe.height = 0;
    iframe.setAttribute('style', 'display:none;');

    iframe.srcdoc = `
      <html>
        <head>
          <script type="text/javascript">
            window.mqttRouterConfig = {
              clientId: '${this.clientId}',
              ip: '${this.wsbroker}',
              port: ${this.wsport},
              useSSL: ${this.useSSL},
            };
            window.iframeEventHandlers = ${Router.toString()}();
          </script>
        </head>
        <body
          onload="window.iframeEventHandlers.onload();"
          onunload="window.iframeEventHandlers.onunload();"
          ononline="window.iframeEventHandlers.ononline();"
          onoffline="window.iframeEventHandlers.onoffline();"
        >
          <div id="message"></div>
        </body>
      </html>
    `;

    return iframe;
  }

  /**
   * Pass an mqtt command to the iframe.
   *
   * @param {Object} message
   */
  command (message) {
    this.iframe.contentWindow.postMessage(message, '*');

    // if (iframe.contentWindow !== null) {
    //   iframe.contentWindow.postMessage(message, '*');
    //   return;
    // }

    // var t = setInterval(function () {
    //   if (iframe.contentWindow !== null) {
    //     iframe.contentWindow.postMessage(message, '*');
    //     clearInterval(t);
    //   }
    // }, 1000);
  }

  inboundHandler (message) {
    const handler = this.handlers[message.destinationName];

    if (!handler) {
      throw new Error(`No handler for ${message.destinationName}`);
    }

    handler(message);
  }

  subscribe (topic, handler) {
    this.handlers[topic] = handler;

    this.command({
      method: 'subscribe',
      topic,
    });
  }

  unsubscribe (topic) {
    delete this.handlers[topic];

    this.command({
      method: 'unsubscribe',
      topic,
    });
  }

  publish (topic, data) {
    this.command({
      method: 'publish',
      topic,
      data,
    });
  }

  connect () {
    this.command({
      method: 'connect',
    });
  }

  disconnect () {
    this.command({
      method: 'disconnect',
    });
  }

  directSend (topic, byteArray) {
    this.command({
      method: 'send',
      topic,
      byteArray,
    });
  }

  transaction (
    topic,
    messageData = {},
    onSubscribe = () => {}
  ) {
    messageData.resp_topic = `${this.clientId}/response/${parseInt(Math.random() * 1000000)}`;

    this.subscribe(messageData.resp_topic, (response) => {
      onSubscribe(JSON.parse(response.payloadString));

      this.unsubscribe(messageData.resp_topic);
    });

    this.publish(topic, messageData);
  }

  validateJwt (callback) {
    this.transaction(
      'iov/jwtValidate',
      {
        b64_access_url: this.b64_jwt_access_url,
        token: this.jwt,
      },
      callback
    );
  }

  /**
   * Get the `guid` and `mimeCodec` for the stream
   *
   * @todo - should this be renamed "play"?
   *
   * @param {string} streamName - the name of the stream
   *
   * @returns {void}
   */
  requestStream (streamName, cb) {
    this.transaction(
      `iov/video/${window.btoa(streamName)}/request`,
      {
        clientId: this.clientId,
      },
      cb
    );
  }

  /**
   * Get the list of available CLSP streams from the SFS
   *
   * @param {Conduit-getStreamListCallback} cb
   *
   * @returns {void}
   */
  getStreamList (cb) {
    this.transaction(
      'iov/video/list',
      {},
      cb
    );
  }

  /**
   * @callback Conduit-getStreamListCallback
   * @param {any} - the list of available CLSP streams on the SFS
   */

  /**
   * Clean up and dereference the necessary properties.  Will also disconnect
   * and destroy the iframe.
   *
   * @returns {void}
   */
  destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.disconnect();

    this.clientId = null;
    this.wsbroker = null;
    this.wsport = null;
    this.useSSL = null;
    this.b64_jwt_access_url = null;
    this.jwt = null;

    this.iframe.parentNode.removeChild(this.iframe);
    // this.iframe.remove();
    this.iframe.srcdoc = '';
    this.iframe = null;

    this.handlers = null;
  }
}
