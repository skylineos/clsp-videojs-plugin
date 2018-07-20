import Debug from 'debug';
import videojs from 'video.js';

import IOV from './iov/IOV';

export default function (SrcsLookupTable) {
    const Component = videojs.getComponent('Component');

    class MqttHandler extends Component {

        constructor(source, tech, options) {
            super(tech,options.mqtt);
            this.tech_ = tech;
            this.source_ = source;
            this.enabled = false;
            this.playing = false;
            this.debug = Debug('skyline:clsp:MqttHandler');
        }

        src(_src) {
            if (!_src) {
                 return;
            }
            var parser = document.createElement('a');

            var useSSL = false;
            var default_port;
            var kluged_src;

            if (_src.substring(0,5).toLowerCase() === 'clsps') {
                useSSL = true;
                kluged_src = _src.replace('clsps','https');
                default_port = 443;
            } else {
                // firefox/ie hack!
                kluged_src = _src.replace('clsp','http');
                default_port = 9001;
            }

            parser.href = kluged_src;
            //parser.href = "http:" + parser.pathname;

            var hostname = parser.hostname;
            var port = parser.port;
            var t = parser.pathname.split("/");
            var streamName = t[t.length-1];

            if (port.length === 0) {
                port = default_port;
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
            this.useSSL = useSSL;

            SrcsLookupTable[_src] = this;
        }


        launchIovPlayer(onMqttReady) {

            var velm = this.player().el();


            var iov = new IOV({
                port: this.port,
                address: this.address,
                appStart: (iov) => {
                    // connected to MQTT procede to setting up callbacks
                    // debug("iov.player() called")
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

            // @todo - we are accessing an internal property here, which is subject
            // to change in future versions of videojs.  Is there a way for us to get
            // the ID without using this property?  Better yet, is it possible to
            // pass the player instance here rather than have to look it up through
            // videojs?
            const player = videojs.getPlayer(this.player().options_.playerId);

            iov.initialize(player);
        }



    };

    return MqttHandler;
}
