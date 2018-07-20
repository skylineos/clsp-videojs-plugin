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
                    console.error("json stringify error: " + m.data);
                    return;
                }

                var mqtt_msg = new Paho.MQTT.Message(mqtt_payload);
                mqtt_msg.destinationName = m.topic;
                MQTTClient.send(mqtt_msg);
            }
        } catch(e) {
            // we are dead!
           send({
               event: 'fail',
               reason: "network failure"
            });
            try {
                MQTTClient.disconnect();
            } catch(e) {
                console.error(e);
            }
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

        if (Reconnect !== -1)
        {
            clearInterval(Reconnect);
            Reconnect = -1;
        }

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

    /*
     * Hold the id of the reconnect interval task
     */
    var Reconnect = -1;

    /*
     * Callback which gets called when the connection is lost
     */
    function onConnectionLost(message){
        send({
            event: 'fail',
            reason: "connection lost error code " + parseInt(message.errorCode)
        });
        if (Reconnect === -1) {
            Reconnect = setInterval(() => connect(), 2000);
        }
    }

    MQTTClient.onConnectionLost = onConnectionLost;

    // perhaps the busiest function in this module ;)
    MQTTClient.onMessageArrived = function(message) {
        // console.log(message);
        try {
             routeInbound(message);
        }catch(e) {
            if (e) {
                console.error(e);
            }
        }
    };

    /**
     * Connect to MQTT...
     */
    function connect()
    {
        // setup connection options
        var options = {
            timeout: 120,
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

        try {
            MQTTClient.connect(options);
        } catch(e) {
            console.error("connect failed", e);
            send({
                event: 'fail',
                reason: "connect failed"
            });
        }
    }

    connect();
}

function clspRouter() {
    try {
        _clspRouter();
    } catch(e) {
        console.error("IFRAME error");
        console.error(e);
    }
}

function onunload()
{
    if (typeof MQTTClient !== 'undefined') {
        MQTTClient.disconnect();
    }
}
