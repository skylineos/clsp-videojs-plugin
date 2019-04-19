'use strict';

/**
 * Creates a hidden iframe that is used to establish a dedicated mqtt websocket
 * for a single video. This is basically an in-browser micro service which
 * uses cross-document communication to route data to and from the iframe.
 */

import Router from './Router';
import Logger from '../logger';

export default {
  attachIframe: (iov) => {
    class Conduit {
      constructor (iov) {
        this.iov = iov;
        this.iframe = this._generateIframe();
      }

      _generateIframe () {
        const iframe = document.createElement('iframe');

        iframe.width = 0;
        iframe.height = 0;
        iframe.setAttribute('style', 'display:none;');
        iframe.setAttribute('id', iov.config.clientId);

        iframe.srcdoc = `
          <html>
            <head>
              <script type="text/javascript">
                window.mqttRouterConfig = {
                  clientId: '${iov.config.clientId}',
                  ip: '${iov.config.wsbroker}',
                  port: ${iov.config.wsport},
                  useSSL: ${iov.config.useSSL},
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
      }

      _attachIframe () {
        // attach hidden iframe to player
        if (this.iov.config.videoElementParent !== null) {
          this.iov.config.videoElementParent.appendChild(this.iframe);
          return;
        }

        if (this.iov.videoElement.parentNode !== null) {
          this.iov.videoElement.parentNode.appendChild(this.iframe);
          this.iov.config.videoElementParent = this.iov.videoElement.parentNode;
          return;
        }

        let counter = 100;

        var iframeAttachInterval = setInterval(() => {
          if (this.iov.videoElement.parentNode !== null) {
            this.iov.videoElement.parentNode.appendChild(this.iframe);
            this.iov.config.videoElementParent = this.iov.videoElement.parentNode;
            clearInterval(iframeAttachInterval);
          }

          if (counter-- > 0) {
            clearInterval(iframeAttachInterval);
          }
        }, 1000);
      }

      initialize (iov) {
        this._attachIframe();

        return this;
      }

      // primitive function that routes message to iframe

      function command(m) {
        if (iframe.contentWindow !== null) {
          iframe.contentWindow.postMessage(m, "*");
          return;
        }

        var t = setInterval(function () {
          if (iframe.contentWindow !== null) {
            iframe.contentWindow.postMessage(m, "*");
            clearInterval(t);
          }
        }, 1000);
      }

      /* message from mqttRouter routeInbound go handler which associates this
         client with the clientId. It then calls self.inboundHandler handler to
         process the message from the iframe.
      */
      self.inboundHandler = function (message) {
        var handler = self.dispatch[message.destinationName];
        if (typeof handler !== 'undefined') {
          try {
            handler(message);
          } catch (e) {
            console.error(e);
          }
        } else {
          console.error("No handler for " + message.destinationName);
        }
      };

      self.subscribe = function (topic, callback) {
        self.dispatch[topic] = callback;
        command({
          method: "subscribe",
          topic: topic
        });
      };

      self.unsubscribe = function (topic) {
        if (topic in self.dispatch) {
          delete self.dispatch[topic];
        }
        command({
          method: "unsubscribe",
          topic: topic
        });
      };

      self.publish = function (topic, data) {
        command({
          method: "publish",
          topic: topic,
          data: data
        });
      };

      self.connect = function () {
        command({
          method: "connect"
        });
      };

      self.disconnect = function () {
        command({
          method: "disconnect"
        });
      };

      self.transaction = function (topic, callback, obj) {
        obj.resp_topic = iov.config.clientId + "/response/" + parseInt(Math.random() * 1000000);
        self.subscribe(obj.resp_topic, function (mqtt_resp) {
          //call user specified callback to handle response from remote process
          var resp = JSON.parse(mqtt_resp.payloadString);
          // call user specified callback to handle response
          callback(resp);
          // cleanup.
          self.unsubscribe(obj.resp_topic);
        });

        // start transaction
        //MQTTClient.send(mqtt_msg);
        self.publish(topic, obj);
      };
    }
  },
};
