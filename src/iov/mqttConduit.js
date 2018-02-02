// These need to be injected as text into the iframe markup
import mqttLibrary from '!raw-loader!../../node_modules/paho-mqtt/mqttws31-min.js'
import clspRouterLibrary from '!raw-loader!./clspRouter.js'

/*
Creates a hidden iframe that is used to establish a dedicated mqtt websocket
for a single video. This is basically an in browser micro service which
uses cross document communication to route data to and from the iframe.
*/

function pframe_client(iframe, config, onReady) {
    var self = {
        dispatch: {}
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


    // called when mqtt has connected
    self.onReady = onReady;

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
                console.log( e );
             }
        } else {
            console.log("No handler for " + message.destinationName);
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


    self.transaction = function( topic, callback, obj ) {
        obj.resp_topic = config.clientId + "/response/"+parseInt(Math.random()*1000000);
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

export default function (config, onReady) {
    /*
        config = {
            ip: ... mqtt ip address
            port: websocket port
        }
      }
    */
    var client = {};
    var iframe = document.createElement('iframe');

    // @todo - there is a way to use webpack to import this...
    var markup =
        '<html><head>'+
        '<script>\n' +
            "var MqttIp = '" + config.wsbroker + "' ; \n" +
            "var MqttPort = " + config.wsport + "; \n" +
            "var MqttUseSSL = " + ((config.useSSL || false) ? 'true' : 'false') + "; \n" +
            "var MqttClientId = '" + config.clientId + "' ; \n" +
            "var Origin = '" + window.location.origin + "' ; \n" +
        '</script>\n' +
        '<script>\n' +
            mqttLibrary + '\n' +
            clspRouterLibrary + '\n' +
        '</script>\n' +
        '</head><body onload="clspRouter();" onunload="onunload();"><body>'+
        '<div id="message"></div>'+
        '</body></html>'
    ;

    // inject code into iframe
    if (typeof iframe.srcdoc !== 'undefined' ) {
        iframe.srcdoc = markup;
    } else {
        window.srcDoc( iframe, markup );
    }

    iframe.width = 0;
    iframe.height = 0;
    iframe.setAttribute('style','display:none;');
    iframe.setAttribute('id',config.clientId);

    // attach hidden iframe to player
    //document.body.appendChild(iframe);
    if (config.videoElement.parentNode !== null) {
        config.videoElement.parentNode.appendChild(iframe);
    } else {
        var t = setInterval(function(){
            if (config.videoElement.parentNode !== null) {
                config.videoElement.parentNode.appendChild(iframe);
                clearInterval(t);
            }
        },1000);
    }

    return pframe_client(iframe,config,onReady);
};
