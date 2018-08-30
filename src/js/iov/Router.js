export default function () {
  return {
    clspRouter: function clspRouter () {
      var iov = window.parent.videojs.getPlugin('clsp').conduits.getById(window.MqttClientId).iov;

      function send (m) {
        // route message to parent which will in turn route to the correct
        // player based on clientId.
        m.clientId = iov.id;

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

            var mqtt_msg = new window.parent.Paho.Message(mqtt_payload);
            mqtt_msg.destinationName = m.topic;
            window.MQTTClient.send(mqtt_msg);
          }
        }
        catch (e) {
          // we are dead!
          send({
            event: 'fail',
            reason: 'network failure',
          });

          try {
            window.MQTTClient.disconnect();
          }
          catch (e) {
            console.error(e);
          }
        }
      }

      function AppReady () {
        if (window.addEventListener) {
          window.addEventListener('message', eventHandler, false);
        }
        else if (window.attachEvent) {
          window.attachEvent('onmessage', eventHandler);
        }

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

      function onConnectionLost (message) {
        send({
          event: 'fail',
          reason: 'connection lost error code ' + parseInt(message.errorCode)
        });
        if (Reconnect === -1) {
          Reconnect = setInterval(() => connect(), 2000);
        }
      }

      function connect () {
        // setup connection options
        var options = {
          timeout: 120,
          onSuccess: AppReady,
          onFailure: AppFail,
        };
        // last will message sent on disconnect
        var willmsg = new window.parent.Paho.Message(JSON.stringify({
          clientId: iov.id,
        }));
        willmsg.destinationName = 'iov/clientDisconnect';
        options.willMessage = willmsg;

        if (iov.config.useSSL === true) {
          options.useSSL = true;
        }

        try {
          window.MQTTClient.connect(options);
        } catch (e) {
          console.error('connect failed', e);
          send({
            event: 'fail',
            reason: 'connect failed',
          });
        }
      }

      try {
        window.window.MQTTClient = new window.parent.Paho.Client(
          iov.config.wsbroker,
          iov.config.wsport,
          iov.id,
        );

        // Hold the id of the reconnect interval task
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
      catch (error) {
        console.error('IFRAME error');
        console.error(error);
      }
    },

    onunload: function onunload () {
      if (typeof window.MQTTClient !== 'undefined') {
        window.MQTTClient.disconnect();
      }
    },
  };
};
