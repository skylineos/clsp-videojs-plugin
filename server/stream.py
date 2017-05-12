"""
Implements the following server side protocol.

source streams to this topic
   iov/video/guid/live
      4   byte number where the segnum counter is located within the subsequent 5+n bytes of data, client must increment this number by replacing 4 bytes with 
with a seqnum counter that they are maintining. If they do this then they can send the initSegement to the media source buffer then simply append every chunk
they receive to play the video.
      5+n video data (moof+mdat) for the media source buffer 

client 
  iov/video/name/request { clientId, resp_topic }
    server sends the mimeCodec to the resp_topic
  iov/video/guid/play { clientId, resp_topic }
    server sends the initSegment (containing moov) to resp_topic
  iov/video/guid/stop { clientId }
    server decrements a reference count for this stream if configured for
    on demand stops playing.
"""

import subprocess
import struct
import paho.mqtt.client as mqtt
import os
import threading
import select
import json
import logging
import atexit
import traceback
import base64
import shlex
import config


class MP4FragmentError(RuntimeError):
    pass

# execute cleanup functions, ignore exceptions.
def excsafe( func, *args ):
    try:
        if len(args) > 0:
            func( *args )
        else:
            func()
    except:
        pass    

class VideoRouter(threading.Thread):
    """ stands between ffmpeg and mqtt and route video from the video pipe
        to clients. Save the init segement so clients can randomly subscribe
        and play live video.

        To this end the router must save the ftype+moov MP4 box as well
        as the segment number position to the client can change the segment
        numbers so they can start as segment 1 regardless of the actual segment
        number. This is essential since the video tag will not play the video
        if the segment numbers are out of order.   
    """
    EXIT_COMMAND = 'x'


    def fragmentSeek(self, s, sequence):
        # scan through mp4 containers based on the sequence array, return a position
        # in the buffer, by side affect set the position of the sequence number of a moof
        # fragment.
        logging.debug("fragmentSeek %s" % str(sequence))   
        pos = 0
        incSeqNum = False
        for seqTag in  sequence:
            if (pos + 8) > len(s):
                return -1

            len_hdr = struct.unpack(">I",s[pos:pos+4])[0]
 
            # some streams have "movie fragment random access" box were the moof is expeced.
            # This is supposed to be a live stream, its not supposed to have these.
            if s[pos+4:pos+8] == "mfra" and seqTag == "moof":
                msg = "found a mfra mp4 box where a moof was supposed to be. Attempting "
                msg += "to recover"
                logging.warning(msg)

                # try to move beyond this box and seek until 
                # we reach the expected box. This is highly error prone 
                # but this is the only alternative I can think of short of restarting the stream
                # by throwing a MP4FragmentError.
                n = s.find("moof",pos+len_hdr)
                if n == -1:
                    # not found, we will have to get more data
                    return -1

                # seek to the position 4 bytes behind the moof box
                pos = n - 4 

                # recalculate box length
                len_hdr = struct.unpack(">I",s[pos:pos+4])[0]
            

            # extract the uint32 value of the video buffer             
            if s[pos+4:pos+8] != seqTag:
                e = "Expected %s, but got %s" % (seqTag,s[pos+4:pos+8])
                raise MP4FragmentError, e                  
                    
            if seqTag == 'moof':
                if (pos + 24) < len(s):
                    # mfhd seqnum
                    self.seqNumOffset = pos + 20
                    seqnum = struct.unpack(">I",s[pos+20:pos+24])[0]  
                    # check that sequence number if correct.
                    logging.debug("MOOF sequence number %d" % seqnum)
                    if self.expectedSeqNum == seqnum:
                        incSeqNum = True
                    else:
                        # Houston ... we have a problem.
                        e = "seqence number is wrong expected %d got %d" % (
                            self.expectedSeqNum, seqnum 
                        )
                        raise MP4FragmentError, e

            # advance buffer index to next mp4 box
            pos += len_hdr 
            
        # must have enough for the next seek
        if (pos+8) > len(s):
            return -1

        # did we encounter a moof? if so we expect a sequence number increase.   
        if incSeqNum:
            self.expectedSeqNum += 1

        return pos


    def initialFragmentPosition(self, s):
        sequence = ['ftyp','moov']
        return self.fragmentSeek(s, sequence)

    def moofPosition(self, s):
        sequence = ['moof','mdat']
        return self.fragmentSeek(s, sequence)

    def reset_input(self):
        self.restartSource()
        self.seqNumOffset = -1
        self.videoBuffer = ""
        # contains the one and only moov atom. 
        self.initSegment = None 


    def __init__(self, vpr, mqttc, topic, onInitSegment, restartSource):
        threading.Thread.__init__(self)
        self.daemon = True
 
        self.restartSource = restartSource
        self.vpr = vpr
        self.mqttc = mqttc
        self.topic = topic
        self.seqNumOffset = -1
        self.videoBuffer = ""
        # contains the one and only moov atom. 
        self.initSegment = None 
        self.running = True
        self.expectedSeqNum = 1 

        self.onInitSegment = onInitSegment
        (self.cmd_r,self.cmd_w) = os.pipe()
        
     
        self.plist = select.poll()
        self.plist.register(self.cmd_r, select.POLLIN)
        self.plist.register(vpr, select.POLLIN)
        
    def handle_pipe_activity(self, fd):



        if fd == self.cmd_r:
            cmd = os.read(self.cmd_r,1)
            if cmd == self.EXIT_COMMAND:
                self.running = False

        elif fd == self.vpr:
            # read as much data as possible from ffmpeg
             
            chunk = os.read(self.vpr,0xffff)
            logging.debug("received %d bytes of data" % len(chunk))

            self.videoBuffer += chunk

            # process the init segment if we haven't already
            if not self.initSegment:
                pos = self.initialFragmentPosition(self.videoBuffer) 
                logging.debug("initialFragmentPosition %d" % pos)
                if pos > 0:
                    # initial segment encountered
                    self.initSegment = self.videoBuffer[:pos]
                    # send initSegment to any web clients that are waiting for
                    # one. This will only be the case if this is an on demand 
                    # stream.  
                    logging.debug("found moov atom")
                    self.onInitSegment()  
                    self.videoBuffer = self.videoBuffer[pos:]
                return

            while True:
                # accumulate until we have a moof+mdat box
                pos = self.moofPosition(self.videoBuffer)  
                if pos == -1:
                    break
                logging.debug("found moof atom")
                moof = self.videoBuffer[:pos]
                logging.debug("seqnum = %d" % self.expectedSeqNum)           
                #logging.debug("self.seqNumOffset = %d, moof length = %d" % (self.seqNumOffset,len(moof)))
                # <position of the sement sequence number> + video box
                #packet = struct.pack(">I",self.seqNumOffset) + moof
                # transmit to client

                """
                # We have an issue with the 'tfdt' box type, firefox seams to choke on this.
                # good its always 20 bytes in length.
                tfdt_start = struct.pack('>I',20) + 'tfdt'
                tfdt_pos = moof.find(tfdt_start)
                if tfdt_pos > 0:
                    # slice the tfdt box out of the trak
                    moof = moof[:tfdt_pos] + moof[tfdt_pos+24:]
                """

                self.mqttc.publish(self.topic,payload=bytearray(moof))
 
                # update buffer  
                self.videoBuffer = self.videoBuffer[pos:]
               

    def run(self):
        try:
            while self.running:
                # wait for a read event on either the command pipe or video
                # pipe.
                for (fd,evt) in self.plist.poll():
                    if (evt & select.POLLIN):
                        try:
                            self.handle_pipe_activity(fd)
                        except MP4FragmentError:
                            self.reset_input()  
                    else:
                        logging.info("pipe closed ... exiting")
                        self.running = False
        except OSError:
            # pipe errors caused by shutdown
            logging.info("pipe closed ... exiting")
            self.running = False 
        except:
            logging.error(traceback.format_exc())                
 

    def stop(self):
        try:
            os.write(self.cmd_w,self.EXIT_COMMAND)
        except OSError:
            pass  
        self.running = False
    
        

class Streamer:
    """ Streams MP4 fragmented video to an MQTT topic
    """
    def onInitSegment(self):
        for c in self.clients.values(): 
            if c['waitingOnInitSeg']:
                # send to waiting client the moov atom so they can begin streaming
                self.mqtt_thread.publish(c['initSegmentTopic'],payload=bytearray(self.vr.initSegment))
                c['waitingOnInitSeg'] = False

    def _vr_restart_stream(self):
        if self.proc:
            if not self.proc.poll():
                self.proc.kill()
        cmd = self.cmdfmt % vars(self)
        logging.debug(cmd)
        self.proc = subprocess.Popen(shlex.split(cmd),shell=False)
        

    def play(self):
        "Play video, start the ffmpeg process and video router to inject MP4 boxes into an MQTT topic"
        logging.info("playing stream %s" % self.name)
        if self.proc:
            if not self.proc.poll():
                self.proc.kill()
        cmd = self.cmdfmt % vars(self)
        logging.debug(cmd)
        self.proc = subprocess.Popen(shlex.split(cmd),shell=False)
        if self.vr and self.vr.running:
            self.vr.stop()
        self.vr = VideoRouter(self.vpr, self.mqtt_thread, self.live_topic, self.onInitSegment, self._vr_restart_stream )
        self.vr.start()

    def stop(self):
        logging.info("stream %s stopped" % self.name)
        if self.proc:
            if not self.proc.poll():
                self.proc.kill()
        if self.vr.running:
            self.vr.stop()

    def stop_msg_handler(self, cid):                          
        if cid in self.clients:
            del self.clients[cid]
            if len(self.clients) == 0 and self.onDemand:
                self.stop() 
    
    def on_message(self, client, userdata, message):
        try:
            self._on_message(client, userdata, message)
        except:
            logging.error(traceback.format_exc())

    def _on_message(self, client, userdata, message):
        logging.debug("stream.on_message: %s %s" % (message.topic,message.payload))
        # inbound message from client
        req = json.loads(message.payload.decode())     
        if message.topic == self.request_topic:
            logging.debug("request for stream '%s', routing response to %s" % (
                self.name, req['resp_topic'] ))

            #TODO: validate clientId, probably use an api key in the future
            client.publish(req['resp_topic'],payload=json.dumps({
                #"mimeCodec": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                "mimeCodec": 'video/mp4; codecs="avc1.42E01E"',
                "error":"" ,
                "guid": self.guid
            }))

        elif message.topic == self.play_topic:
            if self.onDemand and len(self.clients) == 0:
                # first client results in a play
                self.play()    

            c = {
                'waitingOnInitSeg': True,
                'initSegmentTopic': req['initSegmentTopic']
            }

            # init segment already present in video router
            # send it back to client immediately 
            if self.vr.initSegment:
                c['waitingOnInitSeg'] = False
                # deliver moov atom
                self.mqtt_thread.publish(c['initSegmentTopic'],payload=bytearray(self.vr.initSegment))

            # else: otherwise the client will have to wait delivered when self.vr called onInitSegment 
            self.clients[ req['clientId'] ] = c    

        elif message.topic == self.stop_topic:
            cid = req['clientId']
            self.stop_msg_handler(cid)


    def on_connect(self, client, userdata, flags, rc):
        # if we are no doing on demand streaming stream now continurously.  
        if not self.onDemand:
            self.play()

        # subscribe to topics specific to this stream guid.
        logging.info("subscribing to " +  self.request_topic);
        logging.info("subscribing to " +  self.play_topic);
        logging.info("subscribing to " +  self.stop_topic);
        client.subscribe(self.request_topic)
        client.subscribe(self.play_topic)
        client.subscribe(self.stop_topic)

        

    def cleanup(self):
        # free resources, exceptions are allowed since we have no gurantee that we
        # are exiting due to a system crash or stream reconfiguration.
        excsafe( self.vr.stop ) 
        excsafe( self.proc.kill )
        excsafe( os.close, self.vpw  )
        excsafe( os.close, self.vpr  )
        excsafe( self.mqtt_thread.disconnect )
        excsafe( self.mqtt_thread.loop_stop ) 

    def __del__(self):
        self.cleanup()

    def format_ffmpeg_command(self):
        # create the shell command which leverages ffmpeg to do the work
        # of connecting, trascoding and distributing the video.

        (self.w,self.h) = self.config.get('scale',(352,240))
        self.keyint = self.config.get('keyint',30)
        self.bitrate = self.config.get('bitrate',192)
        self.url = self.config['url'] 
        (self.vpr,self.vpw) = os.pipe()
        # clientId -> {
        #     initSegmentTopic: ....
        #     videoSegmentTopic: ....
        # }   
        self.clients = {
        }
        

        # prestine
        #                       
        moovflags = "-movflags  empty_moov+default_base_moof+frag_keyframe -frag_duration 2000000 "
        if self.url == "testsrc":
            self.cmdfmt = config.FFMPEG_PATH + " -nostdin -y -loglevel -8 "+\
                         " -re -f lavfi -i testsrc=size=%(w)dx%(h)d:rate=15 "+\
                         "  -c:v libx264 -x264-params "+\
                      " keyint=%(keyint)d:no-scenecut "+\
                      "  -preset medium  -tune zerolatency -b:v "+\
                      " %(bitrate)dk "+moovflags+" -f mp4 pipe:%(vpw)d "
        else:
            self.cmdfmt = config.FFMPEG_PATH + " -nostdin -y -loglevel -8 -i %(url)s -vf "+\
                      " scale=%(w)d:%(h)d -c:v libx264 "+\
                      " -profile:v  "+\
                      " baseline -level 3.0  -tune zerolatency -b:v "+\
                      " %(bitrate)dk "+moovflags+" -an  -f mp4 pipe:%(vpw)d "

        


    def __init__(self, name, cfg):
        self.config = cfg
 

        # extract configuration data. 
        self.guid = cfg['guid']
        self.name = name
        self.onDemand = self.config.get('onDemand',False)

        self.format_ffmpeg_command()
        
        self.proc = None
        self.vr = None


        # opic serviced by this object.
        self.live_topic    = "iov/video/%s/live" % self.guid
        self.request_topic = "iov/video/%s/request" % base64.b64encode(self.name)
        self.play_topic = "iov/video/%s/play" % self.guid
        self.stop_topic = "iov/video/%s/stop" % self.guid

 
        self.mqtt_thread = mqtt.Client()
        self.mqtt_thread.on_connect = self.on_connect
        self.mqtt_thread.on_message = self.on_message
        self.mqtt_thread.will_set("iov/video/%s/streamer-down" % self.guid, payload=json.dumps({
            "url": self.url
        })) 
        self.mqtt_thread.connect("localhost", 1883, 60)
        self.mqtt_thread.loop_start()  
 
        


