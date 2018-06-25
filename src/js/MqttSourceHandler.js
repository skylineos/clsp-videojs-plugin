import videojs from 'video.js';

import utils from './utils';

export default function (MqttHandler) {
  /*
     source handler for the source tag in html5:
     <video><source src="..." type="..."></video>

     mqttSourceHandler = {
         canPlayType: function(type) {
             // only the canned type for MediaSource entensions
             // use media source extensions to determine if
             // it can play it. MQTT/video
         },
         canHandleSource: function(source, options) {
             // check for mqtt:// .... as a protocol
         },
         handleSource : function(source, tech, options) {
         },
         dispose: function() {
             // destructor.
         }
     }

     Html5 = videojs.getTech('Html5');
     Html5.registerSourceHandler(mqttSourceHandler);

  */

  const MqttSourceHandler = function(mode) {
      var obj = {
          canPlayType: function(type){
              var r = '';
              if ('MediaSource' in window) {
                  if (type === "video/mp4; codecs='avc1.42E01E'") {
                      r = 'maybe';
                  } else {
                      console.log("clsp type='" + type + "' rejected");
                  }
              }
              return r;
          },
          canHandleSource: function(srcObj, options={}){
              /* This method is used to determin if the following html5 tag can be used
                 as a video source:

                 <source src="clsp://<ip addr>:<ws port>/<mqtt topic>"
                         type="video/mp4; codecs='avc1.42E01E'" />
              */
              let localOptions =
                   videojs.mergeOptions(videojs.options, options);

              if (!srcObj.src) {
                  console.log("srcObj doesn't contain src");
                  console.log(srcObj);
                  return false;
              }

              

              if (srcObj.src.startsWith("clsp") === false) {
                  console.log("srcObj.src is not clsp protocol");
                  return false;
              }

              /// restrict to chrome version 52 or greater
              if (utils.supported() === false) {
                  console.log("Browser not supported. Chrome 52+ is required.");
                  return false;
              }

              return obj.canPlayType(srcObj.type);
          },
          handleSource: function(srcObj, tech, options={})  {
              let localOptions = videojs.mergeOptions(videojs.options, options, {mqtt: {mode}});

              tech.mqtt = new MqttHandler(srcObj,tech,localOptions);
              tech.mqtt.src(srcObj.src);
              return tech.mqtt;
          }
      };
      return obj;
  };

  return MqttSourceHandler;
}
