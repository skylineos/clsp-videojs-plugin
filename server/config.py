import requests
import uuid
import logging
import json
import os

USE_VLC_TEST_FEEDS=False
USE_SKYLINE_FEEDS=True
USE_DEMO_FEEDS=False

FFMPEG_PATH=os.popen('which ffmpeg').read()[:-1]


if __name__ == '__main__':
    import sys 
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)



streamTable = {
    "bigBuckBunny" : {
        "url": "rtsp://mpv.cdn3.bigCDN.com:554/bigCDN/definst/mp4:bigbuckbunnyiphone_400.mp4" ,
        "guid": uuid.uuid1().hex,
        "scale": [352,240],
        "keyint": 30,
        "bitrate": 192,
        "onDemand": True # these are test feeds be courteous   
    },
    "DevCohu" : {
        "url": "rtsp://172.28.12.70/stream1",
        "guid": uuid.uuid1().hex,
        "scale": [352,240],
        "keyint": 30,
        "bitrate": 192,
        "onDemand": True # these are test feeds be courteous   
    }, 
    "color-bars-and-counter" : {
        "url": "testsrc" ,
        "guid": "test",
        "scale": [352,240],
        "keyint": 30,
        "bitrate": 192,
        "onDemand": True # these are test feeds be courteous   
    }       
}

if USE_DEMO_FEEDS:
    streamTable["vwall1"] ={
        "url": "http://115.84.245.76:9000/mjpg/video.mjpg?COUNTER", 
        "scale": [352,240],
        "keyint": 1,
        "bitrate": 192,
        "guid": "wall1",
        "onDemand": False
    }
    streamTable["vwall2"] = {
        "url": "http://122.52.148.206:50001/cgi-bin/camera?resolution=640&amp;amp;quality=1&amp;amp;Language=0&amp;amp;1508788247",
        "scale": [352,240],
        "keyint": 1,
        "bitrate": 192,
        "guid": "wvall2",
        "onDemand": False
    }
    streamTable["pennDot1"] = {
        "url": "http://pa511wmedia101.ilchost.com/live/CAM-08-033.stream/playlist.m3u8?wmsAuthSign=c2VydmVyX3RpbWU9MTAvMjMvMjAxNyAxMTozMjozNSBQTSZoYXNoX3ZhbHVlPUdVaVJ4Y1htekVNSW4wZTIyTkJlZmc9PSZ2YWxpZG1pbnV0ZXM9MjAmaWQ9OTYuMjQ0LjI1MC42MQ==",
        "scale": [352,240],
        "keyint": 1,
        "bitrate": 192,
        "guid": "pennDot1",
        "onDemand": False
    }
    streamTable["vwall3"] = {
        "url": "http://112.199.71.168:80/cgi-bin/viewer/video.jpg?r=1508788417",
        "scale": [352,240],
        "keyint": 1,
        "bitrate": 192,
        "guid": "wvall3",
        "onDemand": False
    }



#
# extract video from vlc test page
#
if USE_VLC_TEST_FEEDS:
    page = "http://www.vlc.eu.pn/"
    working_url_delim='<strong><span style=" font-size:10px; color:#06C">'
    resp = requests.get(page)
    
    if resp.status_code == 200:
      
        count = 0
        for line in resp.content.split("\n"):
            s = line.find(working_url_delim)
            if s > -1:
                s += len(working_url_delim) 
                e = line.find("</span>",s)
                url = line[s:e]
                name = "vlctestfeed-"+str(count)
                count += 1
                streamTable[name] = {
                    "url": url,
                    "guid": uuid.uuid1().hex,
                    "scale": [352,240],
                    "keyint": 30,
                    "bitrate": 192,
                    "onDemand": True # these are test feeds be courteous   
                }
    else:
        print "status code ", resp.status_code


if USE_SKYLINE_FEEDS:
    entry = {}
    descList = """Aviation Entryway
Aviation Cubes
Aviation Entryway
Aviation Cubes
Aviation Entryway/Water Fountains
Aviation Copier
Aviation Entryway
Aviation Lobby
Aviation MSC
Aviation Hallway
Aviation Hallway
Aviation Main Entrance
Aviation Main Entrance
Aviation Cubes
Aviation Warehouse
Aviation Hallway
Aviation Cubes
Aviation Hallway
Aviation Lab Test
ExpansionGreatRoom
Chesapeake Reception Entrance (PTZ)
Parking Lot - Rear of Building (Panoramic)
Aviation Parking Lot
Aviation Parking Lot
Aviation Parking Lot
Aviation Parking Lot
Aviation Parking Lot
Aviation Parking Lot""".split('\n')
    urlList="""rtsp://admin:robot@172.28.137.101/media/video1
rtsp://admin:robot@172.28.137.102/media/video1
rtsp://admin:robot@172.28.137.103/media/video1
rtsp://admin:robot@172.28.137.104/media/video1
rtsp://admin:robot@172.28.137.105/media/video1
rtsp://admin:robot@172.28.137.106/media/video1
rtsp://admin:robot@172.28.137.107/media/video1
rtsp://172.28.137.108/media/video1
rtsp://admin:robot@172.28.137.109/media/video1
rtsp://172.28.137.110/media/video1
rtsp://172.28.137.111/media/video1
rtsp://admin:robot@172.28.137.112/media/video1
rtsp://admin:robot@172.28.137.113/media/video1
rtsp://admin:robot@172.28.137.114/media/video1
rtsp://root:robot@172.28.137.115/axis-media/media.amp
rtsp://admin:robot@172.28.137.116/media/video1
rtsp://root:robot@172.28.137.117/axis-media/media.amp
rtsp://172.28.137.119/video1
rtsp://root:robot@172.28.12.186/axis-media/media.amp
rtsp://root:robot@172.28.137.128/axis-media/media.amp
rtsp://root:robot@172.28.137.129/axis-media/media.amp
rtsp://root:robot@172.28.137.130/axis-media/media.amp
rtsp://root:robot@172.28.137.201/axis-media/media.amp
rtsp://root:robot@172.28.137.202/axis-media/media.amp
rtsp://root:robot@172.28.137.203/axis-media/media.amp
rtsp://root:robot@172.28.137.204/axis-media/media.amp
rtsp://root:robot@172.28.137.205/axis-media/media.amp
rtsp://root:robot@172.28.137.206/axis-media/media.amp""".split("\n")
    for (i,url) in enumerate(urlList):
        name = descList[i]
        streamTable[name] = {
            "url": url,
            "guid": uuid.uuid1().hex,
            "scale": [352,240],
            "keyint": 30,
            "bitrate": 192,
            "onDemand": True
        }


#
# log streamTable contents
#
formatted_text = json.dumps(streamTable,sort_keys=True,indent=4)
logging.info("streamTable = "+formatted_text)

open("/tmp/StreamTable.json","w").write(formatted_text)


