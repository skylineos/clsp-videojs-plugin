'use strict';

// Note that this is the code that gets duplicated in each iframe.
// Keep the contents of the exported function light and ES5 only.

export default function Router () {
  return {
    clspRouter: function clspRouter () {
      function send (m) {
        // route message to parent which will in turn route to the correct
        // player based on clientId.
        m.clientId = window.MqttClientId;
        window.parent.postMessage(m, '*');
      }

      function routeInbound (message) {
        var pstring = '';

        try {
          pstring = message.payloadString;
        }
        catch (e) {
          // bogus excepton?
        }

        send({
          event: 'data',
          destinationName: message.destinationName,
          payloadString: pstring,
          payloadBytes: message.payloadBytes || null,
        });
      }

      function disconnect () {
        var ERROR_CODE_NOT_CONNECTED = 'AMQJS0011E';

        try {
          window.MQTTClient.disconnect();
        }
        catch (e) {
          if (!e.message.startsWith(ERROR_CODE_NOT_CONNECTED)) {
            console.error(e);
          }
        }
      }

      function eventHandler (evt) {
        var m = evt.data;

        try {
          if (m.method === 'subscribe') {
            window.MQTTClient.subscribe(m.topic);
          }
          else if (m.method === 'unsubscribe') {
            window.MQTTClient.unsubscribe(m.topic);
          }
          else if (m.method === 'publish') {
            var mqtt_payload = null;

            try {
              mqtt_payload = JSON.stringify(m.data);
            }
            catch (json_error) {
              console.error('json stringify error: ' + m.data);
              return;
            }

            var mqtt_msg = new window.parent.Paho.MQTT.Message(mqtt_payload);
            mqtt_msg.destinationName = m.topic;
            window.MQTTClient.send(mqtt_msg);
          }
          else if (m.method === 'connect') {
            connect();
          }
          else if (m.method === 'disconnect') {
            disconnect();
          }
        }
        catch (e) {
          // we are dead!
          send({
            event: 'fail',
            reason: 'network failure',
          });

          disconnect();
        }
      }

      function AppReady () {
        window.removeEventListener('message', eventHandler);
        window.addEventListener(
          'message',
          eventHandler,
          false
        );

        send({
          event: 'ready',
        });

        if (Reconnect !== -1) {
          clearInterval(Reconnect);
          Reconnect = -1;
        }
      }

      function AppFail (message) {
        var e = 'Error code ' + parseInt(message.errorCode) + ': ' + message.errorMessage;
        send({
          event: 'fail',
          reason: e,
        });
      }

      /*
        * Callback which gets called when the connection is lost
        */
      function onConnectionLost (message) {
        if (message.errorCode === 0) {
          return;
        }

        send({
          event: 'fail',
          reason: 'connection lost error code ' + parseInt(message.errorCode),
        });
        if (Reconnect === -1) {
          Reconnect = setInterval(function () {
            connect();
          }, 2000);
        }
      }

      /**
       * Connect to MQTT...
       */
      function connect () {
        // setup connection options
        var options = {
          timeout: 120,
          onSuccess: AppReady,
          onFailure: AppFail,
        };
        // last will message sent on disconnect
        var willmsg = new window.parent.Paho.MQTT.Message(JSON.stringify({
          clientId: window.MqttClientId,
        }));
        willmsg.destinationName = 'iov/clientDisconnect';
        options.willMessage = willmsg;

        if (window.MqttUseSSL === true) {
          options.useSSL = true;
        }

        try {
          window.MQTTClient.connect(options);
        }
        catch (e) {
          var ERROR_CODE_ALREADY_CONNECTED = 'AMQJS0011E';

          if (!e.message.startsWith(ERROR_CODE_ALREADY_CONNECTED)) {
            console.error('connect failed', e);
            send({
              event: 'fail',
              reason: 'connect failed',
            });
          }
        }
      }

      try {
        window.MQTTClient = new window.parent.Paho.MQTT.Client(
          window.MqttIp,
          window.MqttPort,
          window.MqttClientId
        );

        /*
         * Hold the id of the reconnect interval task
         */
        var Reconnect = -1;

        window.MQTTClient.onConnectionLost = onConnectionLost;

        // perhaps the busiest function in this module ;)
        window.MQTTClient.onMessageArrived = function (message) {
          try {
            routeInbound(message);
          }
          catch (e) {
            if (e) {
              console.error(e);
            }
          }
        };

        connect();
      }
      catch (e) {
        console.error('IFRAME error');
        console.error(e);
      }
    },
    onunload: function onunload () {
      if (typeof window.MQTTClient !== 'undefined') {
        try {
          window.MQTTClient.disconnect();
        }
        catch (e) {
          if (!e.message.startsWith('AMQJS0011E')) {
            console.error(e);
          }
        }
      }
    },
  };
}
