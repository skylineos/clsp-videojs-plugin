import videojs from 'video.js';

import IOV from './iov/IOV';

const Component = videojs.getComponent('Component');

export default function (SrcsLookupTable) {
    class MqttHandler extends Component {

        constructor(source, tech, options) {
            super(tech,options.mqtt);
            this.tech_ = tech;
            this.source_ = source;
            this.enabled = false;
            this.playing = false;
        }

        src(_src) {
            if (!_src) {
                 return;
            }
            var parser = document.createElement('a');

            // firefox/ie hack!
            var kluged_src = _src.replace('clsp','http');


            parser.href = kluged_src;
            //parser.href = "http:" + parser.pathname;

            var hostname = parser.hostname;
            var port = parser.port;
            var t = parser.pathname.split("/");
            var streamName = t[t.length-1];

            this.useSSL = false;

            // clsp://.../name?[secure=1]
            parser.search.substr(1).split('&').forEach(function(item){
                var t = item.split('=');
                var n = t[0];
                var v = t[1];
                if ( n === 'secure' && v !== '0' )
                {
                    useSSL = true;
                }
            });


            if (port.length === 0) {
                port = "9001";
            }

            // @ is a special address maening the server that loaded the web page.
            if (hostname === '@') {
                hostname = window.location.hostname;
            }

            this.mqtt_player = null;
            this.port = parseInt(port);
            this.address = hostname;
            this.streamName = streamName;
            this.enabled = true;

            SrcsLookupTable[_src] = this;
        }


        launchIovPlayer(onMqttReady) {

            var velm = this.player().el();


            var iov = new IOV({
                port: this.port,
                address: this.address,
                appStart: (iov) => {
                    // connected to MQTT procede to setting up callbacks
                    //console.log("iov.player() called")
                    var mqtt_player = iov.player();
                    var evt = new CustomEvent("mqttReady");
                    this.player().el().dispatchEvent( evt );
                    onMqttReady(mqtt_player);

                    velm.addEventListener("mse-error-event",function(e){
                        mqtt_player.restart();
                    },false);


                },
                useSSL: this.useSSL,
                videoElement: velm
            });

            iov.initialize();
        }



    };

    return MqttHandler;
}
