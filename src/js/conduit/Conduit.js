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
    function pframe_client(iframe, iov) {
        var self = {
            dispatch: {},
            iov: iov
        };


        // primitive function that routes message to iframe
        function command(m) {
            if (iframe.contentWindow !== null) {
                iframe.contentWindow.postMessage(m,"*");
                return;
            }

            var t = setInterval(function(){
                if (iframe.contentWindow !== null) {
                    iframe.contentWindow.postMessage(m,"*");
                    clearInterval(t);
                }
            },1000);
        }

        /* message from mqttRouter routeInbound go handler which associates this
           client with the clientId. It then calls self.inboundHandler handler to
           process the message from the iframe.
        */
        self.inboundHandler = function(message) {
            var handler = self.dispatch[message.destinationName];
            if ( typeof handler !== 'undefined'){
                 try {
                    handler(message);
                 } catch( e ) {
                    console.error( e );
                 }
            } else {
                console.error("No handler for " + message.destinationName);
            }
        };

        self.subscribe = function(topic, callback) {
            self.dispatch[topic] = callback;
            command({
                method: "subscribe",
                topic: topic
            });
        };

        self.unsubscribe = function(topic) {
            if ( topic in self.dispatch ){
                delete self.dispatch[topic];
            }
            command({
                method: "unsubscribe",
                topic: topic
            });
        };

        self.publish = function(topic, data){
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

        self.transaction = function( topic, callback, obj ) {
            obj.resp_topic = iov.config.clientId + "/response/"+parseInt(Math.random()*1000000);
            self.subscribe(obj.resp_topic,function(mqtt_resp){
                //call user specified callback to handle response from remote process
                var resp = JSON.parse(mqtt_resp.payloadString);
                // call user specified callback to handle response
                callback(resp);
                // cleanup.
                self.unsubscribe(obj.resp_topic);
            });

            // start transaction
            //MQTTClient.send(mqtt_msg);
            self.publish(topic, obj );
        };

        // return client for video player.
        return self;
    }

    function attachIframe (iframe, iov) {
      // attach hidden iframe to player
      if (iov.config.videoElementParent !== null) {
        iov.config.videoElementParent.appendChild(iframe);
        return;
      }

      if (iov.videoElement.parentNode !== null) {
        iov.videoElement.parentNode.appendChild(iframe);
        iov.config.videoElementParent = iov.videoElement.parentNode;
      }

      let counter = 100;

      var iframeAttachInterval = setInterval(() => {
        if (iov.videoElement.parentNode !== null) {
          iov.videoElement.parentNode.appendChild(iframe);
          iov.config.videoElementParent = iov.videoElement.parentNode;
          clearInterval(iframeAttachInterval);
        }

        if (counter-- > 0) {
          clearInterval(iframeAttachInterval);
        }
      }, 1000);
    }

    window.mqttConduit = function (iov) {
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

      attachIframe(iframe, iov);

      return pframe_client(iframe, iov);
    };
  },
};
