'use strict';

// @todo - changes here are not applied when the dev server rebuilds!
// changes you make to this file require you to restart the dev server

// @see - http://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html

// Note that this is the code that gets duplicated in each iframe.
// Keep the contents of the exported function light and ES5 only.

export default function () {
  return {
    clspRouter: function clspRouter () {
      var iov = window.parent.videojs.getPlugin('clsp').conduits.getById(window.MqttClientId).iov;
      var Reconnect = -1;

      function logError (message, error) {
        console.warn('Error for ' + iov.id + ':');
        console.warn(message);

        if (error) {
          console.error(error);
        }
      }

      /**
       * Send a message from this iframe to the main window, which will then delegate
       * the task back down to this iframe.
       */
      function postMessage (message) {
        try {
          // route message to parent which will in turn route to the correct
          // player based on clientId.
          message.clientId = iov.id;

          window.parent.postMessage(message, '*');
        }
        catch (error) {
          logError('Error while executing "postMessage"...', error);
        }
      }

      /**
       * Send a message via this iframe's MQTTClient instance
       */
      function sendMessage (topic, message) {
        try {
          var mqtt_msg = new window.parent.Paho.Message(message);

          mqtt_msg.destinationName = topic;

          window.MQTTClient.send(mqtt_msg);
        }
        catch (error) {
          logError('Error while sending mqtt message...', error);
        }
      }

      function disconnect () {
        if (window.MQTTClient) {
          try {
            window.MQTTClient.disconnect();
          }
          catch (error) {
            logError('Error while trying to disconnect...', error);
          }
        }
      }

      function onMessageArrived (message) {
        var payloadString = '';

        try {
          // Note that simply accessing this payloadString property can
          // have unintended consequences (such as causing streams to fail
          // completely!), so be careful
          payloadString = message.payloadString;
        }
        catch (error) {
          // @todo - bogus excepton?
          // logError('Error while getting payloadString from message...', error);
        }

        postMessage({
          event: 'data',
          destinationName: message.destinationName,
          payloadString: payloadString,
          payloadBytes: message.payloadBytes || null,
        });
      }

      function onMessage (event) {
        var message = event.data;

        try {
          switch (message.method) {
            case 'destroy': {
              disconnect();
              break;
            }
            case 'subscribe': {
              window.MQTTClient.subscribe(message.topic);
              break;
            }
            case 'unsubscribe': {
              window.MQTTClient.unsubscribe(message.topic);
              break;
            }
            case 'publish': {
              try {
                sendMessage(message.topic, JSON.stringify(message.data));
              }
              catch (json_error) {
                // @todo - this error is never truly handled - can it be handled?
                // Other errors in this function end up posting a network failure
                // message.  Should this do something similar?
                logError('Unable to parse message data...');
                logError(message.data);
                return;
              }

              break;
            }
            default: {
              logError('Unknown message method "' + message.method + '" received...');
            }
          }
        }
        catch (error) {
          logError('Unknown onMessage error...', error);

          // we are dead!
          postMessage({
            event: 'fail',
            reason: 'network failure',
          });

          disconnect();
        }
      }

      function startTryingToReconnect () {
        try {
          disconnect();
        }
        catch (error) {
          // if the connection hasn't been made yet, that's ok
        }

        if (Reconnect === -1) {
          Reconnect = setInterval(() => {
            connect();
          }, 2000);
        }
      }

      function stopTryingToReconnect () {
        if (Reconnect !== -1) {
          clearInterval(Reconnect);
          Reconnect = -1;
        }
      }

      function onConnectSuccess () {
        if (window.addEventListener) {
          window.addEventListener('message', onMessage, false);
        }
        else if (window.attachEvent) {
          window.attachEvent('onmessage', onMessage);
        }

        postMessage({
          event: 'ready',
        });

        stopTryingToReconnect();
      }

      function onConnectFailure (message) {
        var failureMessage = 'Failed to connect: Error code ' + parseInt(message.errorCode) + ': ' + message.errorMessage;

        logError(failureMessage);

        postMessage({
          event: 'fail',
          reason: failureMessage,
        });

        // @todo - should we try to reconnect here?
        startTryingToReconnect();
      }

      function onConnectionLost (message) {
        // We disconnected properly
        if (message.errorCode === 0) {
          return;
        }

        var failureMessage = 'Lost connection: Error code ' + parseInt(message.errorCode) + ': ' + message.errorMessage;

        logError(failureMessage);

        postMessage({
          event: 'fail',
          reason: failureMessage,
        });

        startTryingToReconnect();
      }

      function connect () {
        // last will message sent on disconnect
        var willMessage = new window.parent.Paho.Message(JSON.stringify({
          clientId: iov.id,
        }));

        willMessage.destinationName = 'iov/clientDisconnect';

        // setup connection options
        var options = {
          timeout: 120,
          onSuccess: onConnectSuccess,
          onFailure: onConnectFailure,
          willMessage: willMessage,
        };

        if (iov.config.useSSL === true) {
          options.useSSL = true;
        }

        try {
          window.MQTTClient.connect(options);
        }
        catch (error) {
          logError('Unknown connection failure...', error);

          postMessage({
            event: 'fail',
            reason: 'connect failed',
          });
        }
      }

      function main () {
        try {
          window.MQTTClient = new window.parent.Paho.Client(
            iov.config.wsbroker,
            iov.config.wsport,
            iov.id,
          );

          window.MQTTClient.onConnectionLost = onConnectionLost;
          window.MQTTClient.onMessageArrived = onMessageArrived;

          connect();
        }
        catch (error) {
          console.error('IFRAME error');
          console.error(error);
        }
      }

      main();
    },

    onunload: function onunload () {
      if (window.MQTTClient) {
        window.MQTTClient.disconnect();
      }
    },
  };
};
