import paho.mqtt.client as mqtt
import sys

topic = sys.argv[1]
outfile = open(sys.argv[2],'wb')




# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe(topic)

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print msg
    if msg.topic == topic:
        outfile.write(msg.payload)
        outfile.flush()
        print "wrote ",len(msg.payload)," bytes." 

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_start()

raw_input("press any key to exit")

client.disconnect();





