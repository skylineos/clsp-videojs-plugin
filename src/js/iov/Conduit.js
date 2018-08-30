'use strict';

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a single video. This is basically an in browser micro service which
 * uses cross document communication to route data to and from the iframe.
 */

// We want the minified file to minimize the size of each iframe
import iframeCode from '~root/dist/Router.min';

export default class Conduit {
  static factory (iov) {
    return new Conduit(iov);
  }

  constructor (iov) {
    this.iov = iov;
    this.clientId = iov.config.clientId;
    this.dispatch = {};

    this.iframe = this.generateIframe();

    this.attachIframe();

    this.destroyed = false;
  }

  generateIframe () {
    const iframe = document.createElement('iframe');

    const markup = `
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

    iframe.srcdoc = markup;

    iframe.width = 0;
    iframe.height = 0;
    iframe.setAttribute('style', 'display:none;');
    iframe.setAttribute('id', this.clientId);

    return iframe;
  }

  attachIframe () {
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

  /* message from mqttRouter routeInbound go handler which associates this
    client with the clientId. It then calls self.inboundHandler handler to
    process the message from the iframe.
  */
  inboundHandler (message) {
    const handler = this.dispatch[message.destinationName];

    if (typeof handler !== 'undefined') {
      try {
        handler(message);
      }
      catch (e) {
        console.error(e);
      }
    }
    else {
      console.error(`No handler for ${message.destinationName}`);
    }
  }

  subscribe (topic, callback) {
    this.dispatch[topic] = callback;

    this.command({
      method: 'subscribe',
      topic,
    });
  }

  unsubscribe (topic) {
    if (topic in this.dispatch) {
      delete this.dispatch[topic];
    }

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
  };

  transaction (topic, callback, data) {
    data.resp_topic = `${this.clientId}/response/${parseInt(Math.random() * 1000000)}`;

    this.subscribe(data.resp_topic, (mqtt_resp) => {
      // call user specified callback to handle response from remote process
      const resp = JSON.parse(mqtt_resp.payloadString);
      // call user specified callback to handle response
      callback(resp);
      // cleanup.
      this.unsubscribe(data.resp_topic);
    });

    // start transaction
    // MQTTClient.send(mqtt_msg);
    this.publish(topic, data);
  };

  destroy () {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    this.iov.destroy();

    this.iov = null;
    this.clientId = null;
    this.dispatch = null;
    this.iframe = null;
  }
}
