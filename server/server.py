import logging
import sys
import paho.mqtt.client as mqtt
import json
import uuid

#logging.basicConfig(filename="/var/log/iov-server.log", 
logging.basicConfig( stream=sys.stdout,
    level=logging.DEBUG,
    format="%(asctime)s %(message)s" 
)

import stream
import config

for (name,cfg) in config.streamTable.items():
    config.streamTable[name]['_streamer'] = stream.Streamer(name,cfg)
 

def on_message(client, userdata, message):
    logging.debug("server.on_message: %s %s" % (message.topic,message.payload))

    req = json.loads(message.payload.decode())
    if message.topic == "iov/video/list":
        client.publish(req['resp_topic'],payload=json.dumps({
            "names": config.streamTable.keys()
        }))        
    elif message.topic == "iov/video/publish":
        name = req['name']
        if name not in config.streamTable:
            cfg = {
                "url": req['url'],
                "guid": uuid.uuid1().hex,
                "scale": req.get('scale', [352,240]),
                "keyint": req.get('keyint', 30),
                "bitrate": req.get('bitrate', 192),
                "onDemand": req.get('onDemand', True)   
            } 
            res = json.dumps({
                "guid": cfg['guid'],
            }) 
            client.publish(req['resp_topic'],payload=res)        
            config.streamTable[name]['_streamer'] = stream.Streamer(name,cfg)

    elif message.topic == "iov/clientDisconnect":
        # handle list will message of client, call stop on its behalf to
        # any active streamer.
        cid = req['clientId']
        for s in config.streamTable.values():
            if '_streamer' in s:   
                s['_streamer'].stop_msg_handler(cid)        
        
      

def on_connect(client, userdata, flags, rc):
    client.subscribe("iov/video/list")
    client.subscribe("iov/video/publish")






if __name__ == '__main__':
    def on_log(client, userdata, level, buf):
        logging.debug("mqtt: %s" % str(buf))

    mqtt = mqtt.Client()
    mqtt.on_connect = on_connect
    mqtt.on_message = on_message
    mqtt.on_log = on_log
    mqtt.connect("localhost", 1883, 60)
    mqtt.loop_forever()  

