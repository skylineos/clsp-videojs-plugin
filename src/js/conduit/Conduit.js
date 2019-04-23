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

  _generateResponseTopic () {
    return `${this.clientId}/response/${parseInt(Math.random() * 1000000)}`;
  }

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

  transaction (
    topic,
    messageData = {},
    onSubscribe = () => {}
  ) {
    messageData.resp_topic = this._generateResponseTopic();

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
   * @todo - should this be renamed "play"?
   */
  requestStream (streamName, callback) {
    this.transaction(
      `iov/video/${window.btoa(streamName)}/request`,
      {
        clientId: this.clientId,
      },
      callback
    );
  }

  /**
   * Get the list of available streams from the SFS
   *
   * @param {Function} callback
   */
  getStreamList (callback) {
    this.transaction(
      'iov/video/list',
      {},
      callback
    );
  }

  destroy () {
    // @todo
  }
}
