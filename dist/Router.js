!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t=n();for(var o in t)("object"==typeof exports?exports:e)[o]=t[o]}}(window,function(){return function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){e.exports=t(1)},function(e,n,t){"use strict";t.r(n),n.default=function(){return{clspRouter:function(){var e=window.parent.videojs.getPlugin("clsp").conduits.getById(window.MqttClientId).iov;function n(n){n.clientId=e.id,window.parent.postMessage(n,"*")}function t(e){var t=e.data;try{if("subscribe"===t.method)window.MQTTClient.subscribe(t.topic);else if("unsubscribe"===t.method)window.MQTTClient.unsubscribe(t.topic);else if("publish"===t.method){var o=null;try{o=JSON.stringify(t.data)}catch(e){return void console.error("json stringify error: "+t.data)}var r=new window.parent.Paho.Message(o);r.destinationName=t.topic,window.MQTTClient.send(r)}}catch(e){n({event:"fail",reason:"network failure"});try{window.MQTTClient.disconnect()}catch(e){console.error(e)}}}function o(){window.addEventListener?window.addEventListener("message",t,!1):window.attachEvent&&window.attachEvent("onmessage",t),n({event:"ready"}),-1!==a&&(clearInterval(a),a=-1)}function r(e){n({event:"fail",reason:"Error code "+parseInt(e.errorCode)+": "+e.errorMessage})}function i(){var t={timeout:120,onSuccess:o,onFailure:r},i=new window.parent.Paho.Message(JSON.stringify({clientId:e.id}));i.destinationName="iov/clientDisconnect",t.willMessage=i,!0===e.config.useSSL&&(t.useSSL=!0);try{window.MQTTClient.connect(t)}catch(e){console.error("connect failed",e),n({event:"fail",reason:"connect failed"})}}try{window.window.MQTTClient=new window.parent.Paho.Client(e.config.wsbroker,e.config.wsport,e.id);var a=-1;window.MQTTClient.onConnectionLost=function(e){n({event:"fail",reason:"connection lost error code "+parseInt(e.errorCode)}),-1===a&&(a=setInterval(()=>i(),2e3))},window.MQTTClient.onMessageArrived=function(e){try{!function(e){var t="";try{t=e.payloadString}catch(e){}n({event:"data",destinationName:e.destinationName,payloadString:t,payloadBytes:e.payloadBytes||null})}(e)}catch(e){e&&console.error(e)}},i()}catch(e){console.error("IFRAME error"),console.error(e)}},onunload:function(){void 0!==window.MQTTClient&&window.MQTTClient.disconnect()}}}}])});