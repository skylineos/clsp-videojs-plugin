"""
Have N number of child processes connect to 'play'  topics to
stream videos 



"""

from multiprocessing import * 
import paho.mqtt.client as mqtt
import logging
import os
import time
import sys
import uuid

class test_client:

    def __call__(self, guid):
        self.counter = 0
        self.expire = None
        self.bytecount = 0
        self.live_topic = "iov/video/%s/live" % guid
        self.guid = guid        
        self.clientId = "cid-" + uuid.uuid1().hex

        logging.basicConfig(filename="/tmp/iov-test-client.log", level=logging.DEBUG, message="%(asctime)s %(message)s")


        mqttc = mqtt.Client()
        mqttc.on_connect = self.on_connect
        mqttc.on_message = self.on_message
        mqttc.will_set("iov/video/%s/stop" % self.guid, payload=json.dumps({
            "clientId": self.clientId
        }))
        
        mqttc.connect("localhost", 1883, 60)
        mqttc.loop_forever()


    def on_message(self, client, userdata, message):
        self.counter += 1
        self.bytecount += len(message.payload)
        
        now = time.time()
        if not self.expire:
            self.expire = now + 5.0
        elif now > self.expire:
            bitrate = (self.bytecount / (now - self.expire)) * 8 
            logging.info("client-%d msgcount=%d bitrate=%f" % (os.getpid(),self.counter,bitrate))
            self.expire = now
            self.bytecount = 0


    def on_connect(self, client, userdata, flags, rc):
        client.subscribe(self.live_topic)
        client.publish("iov/video/%s/play" % self.guid, payload=json.dumps({
            "initSegmentTopic" : self.live_topic,
            "clientId": self.clientId
        }))


def proc( guid ):
    t = test_client()
    t( guid  )







import json
st = json.loads(open("/tmp/StreamTable.json").read())
guids = [s['guid']  for s in st.values()]

import logging, sys

logging.basicConfig(stream=sys.stdout,  format="%(asctime)s %(message)s", level=logging.DEBUG)


if __name__ == '__main__':
    fake_clients = []    
    N = 750 
    for i in range(0,N):
        g = guids[i % len(guids)]
        p = Process(target=proc, args=(g,) )
        p.daemon = True
        p.start()
        fake_clients.append(p)
        time.sleep(5)
        loadFactor = os.popen("uptime").read().split(':')[-1][:-1]
        logging.info( "number of streams %d  loadFactor: %s" % (i,loadFactor) )
        

     
    raw_input("press any key to exit")    
    for p in fake_clients:
        p.terminate()

     

