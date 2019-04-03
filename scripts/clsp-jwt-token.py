#!/usr/bin/env python

import requests
import sys
import time
import base64


sfsAddr = sys.argv[1]
streamName = sys.argv[2]

expire = 15

start = int(time.time())
end = start + (expire * 60)
access_url = "clsp-jwt://"+sfsAddr+"/"+"?Start="+str(start)+"&End="+str(end)

url_create = "http://127.0.0.1:3100/create"

payload = {
    "B64url" : base64.b64encode(streamName),
    "B64accessUrl": base64.b64encode(access_url),
    "Expires": expire
}

res = requests.post(url_create, json=payload)

jwt = res.content

print "clsp-jwt://"+sfsAddr+"/"+jwt+"?Start="+str(start)+"&End="+str(end)
