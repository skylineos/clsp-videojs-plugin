function _clspRouter() {
    function send(m){
        // route message to parent which will in turn route to the correct
        // player based on clientId.
        m.clientId = MqttClientId;
        // console.log(m);
        window.parent.postMessage(m,"*");
    }// end send


    function routeInbound(message){
        var pstring = "";

        try {
            pstring = message.payloadString;
        } catch(e) {
            //bogus excepton?
        }

        send({
          event: 'data',
          destinationName: message.destinationName,
          payloadString: pstring,
          payloadBytes: message.payloadBytes || null
        });
    }// end route inbound


    function eventHandler(evt){
        var m = evt.data;

        try {
            if (m.method === 'subscribe') {
                MQTTClient.subscribe(m.topic);
            } else if (m.method === 'unsubscribe') {
                MQTTClient.unsubscribe(m.topic);
            } else if (m.method === 'publish') {
                var mqtt_payload = null;
                try {
                    mqtt_payload = JSON.stringify(m.data);
                } catch( json_error ) {
                    console.log("json stringify error: " + m.data);
                    return;
                }

                var mqtt_msg = new Paho.MQTT.Message(mqtt_payload);
                mqtt_msg.destinationName = m.topic;
                MQTTClient.send(mqtt_msg);
            }
        } catch(e) {
            console.log("mqtt fatal error");
            console.log(e);
            // we are dead!
            MQTTClient.disconnect();
        }
    }

    function AppReady() {
        if (window.addEventListener) {
            window.addEventListener("message", eventHandler, false);
        } else if (window.attachEvent) {
            window.attachEvent('onmessage', eventHandler);
        }

        send({
          event: 'ready'
        });
    }// application ready


    function AppFail(message) {
      var e = "Error code " +
          parseInt(message.errorCode) + ": " + message.errorMessage;
      send({
        event: 'fail',
        reason: e
      });
    }

    MQTTClient = new Paho.MQTT.Client(
        MqttIp,
        MqttPort,
        MqttClientId
    );

    // perhaps the busiest function in this module ;)
    MQTTClient.onMessageArrived = function(message) {
        //// console.log(message);
        try {
             routeInbound(message);
        }catch(e) {
            if (e) {
                // console.log("Exception");
                console.log(e);
            }
        }
    };

    // setup connection options
    var options = {
        timeout: 60,
        onSuccess:  AppReady,
        onFailure: AppFail
    };
    // last will message sent on disconnect
    var willmsg = new Paho.MQTT.Message(JSON.stringify({
        clientId: MqttClientId
    }));
    willmsg.destinationName = "iov/clientDisconnect";
    options.willMessage = willmsg;

    if (MqttUseSSL === true) {
        options.useSSL = true;
    }


    MQTTClient.connect(options);
}

function clspRouter() {
    try {
        _clspRouter();
    } catch(e) {
        console.log("IFRAME error");
        console.log(e);
    }
}

function onunload()
{
    if (typeof MQTTClient !== 'undefined') {
        MQTTClient.disconnect();
    }
}
