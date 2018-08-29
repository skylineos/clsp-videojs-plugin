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
import atexit
import time


# allow for dynamic determination on mime string as well as
# whether or not transcoding is needed. 

""" A small key/value database that is used to generate the 
    mime type for the video which instructs the browser on
    which codec to use as well as to make the determination
    of whether or not to transcode the video. 
"""
URL_FORMAT_CACHE_FILE = "UrlFormats.json"

class MimeDetector:
    def __init__(self):
        self.cache = {}
        if os.access(URL_FORMAT_CACHE_FILE,os.F_OK):
            self.cache = json.loads(open(URL_FORMAT_CACHE_FILE).read())

    def detectStreamFormat(self, url):
        cmd = "timeout 60 ffprobe -show_streams %s > /dev/stdout 2>&1"
        streams = []
        s ={}
        in_stream = False
        for line in os.popen(cmd % url).readlines():
            line = line[:-1] # strip newline
            if line.strip() == "[STREAM]":
                in_stream = True
            elif line.strip() == "[/STREAM]":
                in_stream = False
                streams.append(s)
                s = {}
            elif in_stream == True:
                k,v = line.split('=')
                s[k] = v
        return streams

    def getMimeTypeAndTsFlag(self, url):
        # Return a video mime type string for the video tag in the
        # browser, if transcoding is required return a mime type
        # for h264 baseline level 3.0
        codec = "avc1.42E01E"
        transcode = True

        if url not in self.cache:
            self.cache[url] = self.detectStreamFormat(url)
            open(URL_FORMAT_CACHE_FILE,"w").write(json.dumps(self.cache))


        # see http://blog.pearce.org.nz/2013/11/what-does-h264avc1-codecs-parameters.html
        # see ff_h264_profiles in the libav code. 
        profiles = {
            'Constrained Baseline': "42",
            'Baseline': "42",
            'Main': '4D',
            'High': '64'
        }
        levels = {
            "1": "0A",
            "11": "0B",
            "12": "0D",
            "20": "14",
            "21": "15",
            "22": "16",
            "30": "1E",
            "31": "1F",
            "32": "20",
            "40": "28",
            "41": "29",
            "42": "2A",
            "50": "32",
            "51": "33"
        }
        mime_fmt = 'video/mp4; codecs="%s"'
        for s in self.cache[url]:
            if s['codec_name'] == 'h264':
                level = levels.get(s['level'])
                prof = profiles.get(s['profile'])
                if level != None and prof != None:
                    # Yes we don't have to transcode!
                    codec = 'avc1.%sE0%s' % (prof,level)
                    transcode = False
                    
                    break
                else:
                    logging.info("No match for level=%s prof=%s" % (s['level'],s['profile']))
            else:
                logging.info("non h264 codec %s" % s['codec_name'] )

        return transcode, mime_fmt % codec

if 'MimeDetection' not in globals():
    globals()['MimeDetection'] = MimeDetector()


class MP4FragmentError(RuntimeError):
    pass

# execute cleanup functions, ignore exceptions.


def excsafe(func, *args):
    try:
        if len(args) > 0:
            func(*args)
        else:
            func()
    except BaseException:
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
        for seqTag in sequence:
            if (pos + 8) > len(s):
                return -1

            len_hdr = struct.unpack(">I", s[pos:pos + 4])[0]

            # some streams have "movie fragment random access" box were the moof is expeced.
            # This is supposed to be a live stream, its not supposed to have
            # these.
            if s[pos + 4:pos + 8] == "mfra" and seqTag == "moof":
                msg = "found a mfra mp4 box where a moof was supposed to be. Attempting "
                msg += "to recover"
                logging.warning(msg)

                # try to move beyond this box and seek until
                # we reach the expected box. This is highly error prone
                # but this is the only alternative I can think of short of restarting the stream
                # by throwing a MP4FragmentError.
                n = s.find("moof", pos + len_hdr)
                if n == -1:
                    # not found, we will have to get more data
                    return -1

                # seek to the position 4 bytes behind the moof box
                pos = n - 4

                # recalculate box length
                len_hdr = struct.unpack(">I", s[pos:pos + 4])[0]

            # extract the uint32 value of the video buffer
            if s[pos + 4:pos + 8] != seqTag:
                e = "Expected %s, but got %s" % (seqTag, s[pos + 4:pos + 8])
                raise MP4FragmentError(e)

            if seqTag == 'moof':
                if (pos + 24) < len(s):
                    # mfhd seqnum
                    self.seqNumOffset = pos + 20
                    seqnum = struct.unpack(">I", s[pos + 20:pos + 24])[0]
                    # check that sequence number if correct.
                    logging.debug("MOOF sequence number %d" % seqnum)
                    if self.expectedSeqNum == seqnum:
                        incSeqNum = True
                    else:
                        # Houston ... we have a problem.
                        e = "seqence number is wrong expected %d got %d" % (
                            self.expectedSeqNum, seqnum
                        )
                        raise MP4FragmentError(e)

            # advance buffer index to next mp4 box
            pos += len_hdr

        # must have enough for the next seek
        if (pos + 8) > len(s):
            return -1

        # did we encounter a moof? if so we expect a sequence number increase.
        if incSeqNum:
            self.expectedSeqNum += 1

        return pos

    def initialFragmentPosition(self, s):
        sequence = ['ftyp', 'moov']
        return self.fragmentSeek(s, sequence)

    def moofPosition(self, s):
        sequence = ['moof', 'mdat']
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
        (self.cmd_r, self.cmd_w) = os.pipe()

        self.plist = select.poll()
        self.plist.register(self.cmd_r, select.POLLIN)
        self.plist.register(vpr, select.POLLIN)

        atexit.register(self.stop)


    def handle_pipe_activity(self, fd):

        if fd == self.cmd_r:
            cmd = os.read(self.cmd_r, 1)
            if cmd == self.EXIT_COMMAND:
                logging.info("video pipe router stop command")
                self.running = False
            else:
                logging.error("Unknown command sent to video pipe router")

        elif fd == self.vpr:
            # read as much data as possible from ffmpeg

            chunk = os.read(self.vpr, 0xffff)
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

                # route to mqtt which will multicast to all interested clients.
                self.mqttc.publish(self.topic, payload=bytearray(moof))

                # update buffer
                self.videoBuffer = self.videoBuffer[pos:]

    def run(self):
        try:
            while self.running:
                # wait for a read event on either the command pipe or video
                # pipe.
                for (fd, evt) in self.plist.poll():
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
        except BaseException:
            logging.error(traceback.format_exc())
        
        os.close(self.cmd_w)
        os.close(self.cmd_r)  


    def stop(self):
        try:
            os.write(self.cmd_w, self.EXIT_COMMAND)
        except OSError:
            pass
        self.running = False
        


class Streamer:
    """ Streams MP4 fragmented video to an MQTT topic
    """

    def onInitSegment(self):
        for c in self.clients.values():
            if c['waitingOnInitSeg']:
                # send to waiting client the moov atom so they can begin
                # streaming
                self.mqtt_thread.publish(
                    c['initSegmentTopic'], payload=bytearray(
                        self.vr.initSegment))
                c['waitingOnInitSeg'] = False

    def _kill_proc(self):
        if self.proc:
            if not self.proc.poll():
                #self.proc.kill()
                os.kill(self.proc.pid,9)
                self.proc.communicate(b'')
                self.proc.wait()
            self.proc = None  

    def _vr_restart_stream(self):
        self._kill_proc()
 
        cmd = self.cmdfmt % vars(self)
        logging.info(cmd)
        self.proc = subprocess.Popen(shlex.split(cmd), shell=False)

    def play(self):
        "Play video, start the ffmpeg process and video router to inject MP4 boxes into an MQTT topic"
        logging.info("playing stream %s" % self.name)

        self._kill_proc()
        cmd = self.cmdfmt % vars(self)

        logging.info(cmd)
        self.proc = subprocess.Popen(shlex.split(cmd), shell=False)
        if self.vr and self.vr.running:
            self.vr.stop()
        self.vr = VideoRouter(
            self.vpr,
            self.mqtt_thread,
            self.live_topic,
            self.onInitSegment,
            self._vr_restart_stream)
        self.vr.start()
        atexit.register(self.stop)

    def stop(self):
        logging.info("stream %s stopped" % self.name)
        self._kill_proc()

        if self.vr and self.vr.running:
            self.vr.stop()
            self.vr = None


    def stop_msg_handler(self, cid):
        if cid in self.clients:
            del self.clients[cid]
            if len(self.clients) == 0 and self.onDemand:
                self.stop()

    on_message_lock = threading.Lock()
    def on_message(self, client, userdata, message):
        try:
            self.on_message_lock.acquire()
            self._on_message(client, userdata, message)
            self.on_message_lock.release()
        except BaseException:
            logging.error(traceback.format_exc())

    

    def _on_message(self, client, userdata, message):
        logging.info(
            "stream.on_message: %s %s" %
            (message.topic, message.payload))


        # inbound message from client
        req = json.loads(message.payload.decode())
        if message.topic == self.request_topic:
            logging.info("request for stream '%s', routing response to %s" % (
                self.name, req['resp_topic']))

            logging.info("Returning codec %s to client" % self.mimeTypeString)

            # TODO: validate clientId, probably use an api key in the future
            client.publish(req['resp_topic'], payload=json.dumps({
                #"mimeCodec": 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                #"mimeCodec": 'video/mp4; codecs="avc1.42E01E"',
                "mimeCodec": self.mimeTypeString,
                "error": "",
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
                self.mqtt_thread.publish(
                    c['initSegmentTopic'], payload=bytearray(
                        self.vr.initSegment))

            # else: otherwise the client will have to wait delivered when
            # self.vr called onInitSegment
            self.clients[req['clientId']] = c

        elif message.topic == self.stop_topic:
            cid = req['clientId']
            self.stop_msg_handler(cid)

    def on_connect(self, client, userdata, flags, rc):
        # if we are no doing on demand streaming stream now continurously.
        if not self.onDemand:
            self.play()

        # subscribe to topics specific to this stream guid.
        logging.info("subscribing to " + self.request_topic)
        logging.info("subscribing to " + self.play_topic)
        logging.info("subscribing to " + self.stop_topic)
        client.subscribe(self.request_topic)
        client.subscribe(self.play_topic)
        client.subscribe(self.stop_topic)

    def cleanup(self):
        # free resources, exceptions are allowed since we have no gurantee that we
        # are exiting due to a system crash or stream reconfiguration.
        if hasattr(self,'vr') and self.vr != None: 
            excsafe(self.vr.stop)

        if self.proc:
            excsafe(self.proc.kill)

        if hasattr(self,'vpw'):
            excsafe(os.close, self.vpw)
        if hasattr(self,'vpr'):
            excsafe(os.close, self.vpr)
        if hasattr(self,'mqtt_thread'):
            excsafe(self.mqtt_thread.disconnect)
            excsafe(self.mqtt_thread.loop_stop)

    def __del__(self):
        self.cleanup()

    def format_ffmpeg_command(self):
        # create the shell command which leverages ffmpeg to do the work
        # of connecting, trascoding and distributing the video.

        (self.w, self.h) = self.config.get('scale', (352, 240))
        self.keyint = self.config.get('keyint', 30)


        self.bitrate = self.config.get('bitrate', 192)
        self.url = self.config['url']
        # clientId -> {
        #     initSegmentTopic: ....
        #     videoSegmentTopic: ....
        # }
        self.clients = {
        }

        self.re = ""

        # refactor url for file, if not an sdp and a file set re flag
        file_proto = "file:/"
        if self.url.startswith(file_proto):
            self.url = self.url[len(file_proto):]
            if self.url[-4:] != '.sdp': 
                self.re = " -re "

        # use ffprobe to detect the video mime and determine if we have to transode
        # this is done only once for every new url that the system has not encountered.
        #TODO: need to periodically update the cache *SLOWLY* in the background
        #WARNING: this may block to upto 60 seconds.
        self.config['transcode'] = True  
        if self.url == "testsrc":
            self.mimeTypeString = 'video/mp4; codecs="avc1.42E01E"'
        else:
            self.config['transcode'], self.mimeTypeString = MimeDetection.getMimeTypeAndTsFlag(self.url)        

        if not self.config['transcode']: 
            logging.info("TRANSCODING AVOIDED! for %s" % self.url)
          

        if self.config['transcode']:
            scale = " -vf scale=%(w)d:%(h)d "
        else:
            scale = " "         

        # setup fragmentation
        moovflags = "-movflags  empty_moov+default_base_moof+frag_keyframe -frag_duration 250000"
        if not self.config['transcode']:
            # witout control of the frame rate we make a moof fragment on each iframe.
            moovflags = "-movflags  empty_moov+default_base_moof+frag_keyframe "
            

        self._P = '%'  # python having issues with a '%' in a string thinking its a formatting character

        vfilter = ""
        if self.config.get('timestampOverlay',False):  
            scale = ""
            vfilter =\
                ' -vf "scale=%(w)d:%(h)d,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:' +\
                'text=\'%(_P)s{localtime}\':fontcolor=#10FF10@0.8:x=7:y=7"  '

        transcode = ""
        if self.config.get('transcode',False):
            transcode = " -c:v libx264 -profile:v baseline -level 3.0 -x264-params keyint=%(keyint)d:no-scenecut "
            transcode += " -tune zerolatency -b:v %(bitrate)dk "
        else:
            # copy stream
            transcode = " -c:v copy  "


        # setup ffmpeg command line  
        if self.url == "testsrc":
            self.cmdfmt = config.FFMPEG_PATH + "  -nostdin -y -loglevel -8 " +\
                " -re -f lavfi -i testsrc=size=%(w)dx%(h)d:rate=15 -pix_fmt yuv420p  " +\
                vfilter +\
                "  -c:v libx264 -profile:v baseline -level 3.0 -x264-params " +\
                " keyint=%(keyint)d:no-scenecut " +\
                "   -tune zerolatency -b:v " +\
                " %(bitrate)dk " + moovflags + " -g 15  -f mp4 pipe:%(vpw)d "
        elif self.config['transcode']:
            self.cmdfmt = config.FFMPEG_PATH +  " -stream_loop -1 -nostdin -y  -loglevel -8 %(re)s  -i %(url)s "
            self.cmdfmt += scale
            self.cmdfmt += vfilter + " -pix_fmt yuv420p  " 
            self.cmdfmt += transcode
            self.cmdfmt += moovflags + " -an -g 15 -f mp4 pipe:%(vpw)d "
        else:
            self.cmdfmt = config.FFMPEG_PATH +  " -stream_loop -1 -nostdin -y  -loglevel -8 %(re)s  -i %(url)s "
            self.cmdfmt += moovflags + " -c:v copy -f mp4 pipe:%(vpw)d "
    

    def __init__(self, name, cfg):
        self.config = cfg

        # extract configuration data.
        self.guid = cfg['guid']
        self.name = name
        self.onDemand = self.config.get('onDemand', False)
        (self.vpr, self.vpw) = os.pipe()

        self.format_ffmpeg_command()

        self.proc = None
        self.vr = None

        # opic serviced by this object.
        self.live_topic = "iov/video/%s/live" % self.guid
        self.request_topic = "iov/video/%s/request" % base64.b64encode(
            self.name)
        self.play_topic = "iov/video/%s/play" % self.guid
        self.stop_topic = "iov/video/%s/stop" % self.guid

        self.mqtt_thread = mqtt.Client()
        self.mqtt_thread.on_connect = self.on_connect
        self.mqtt_thread.on_message = self.on_message
        self.mqtt_thread.will_set("iov/video/%s/streamer-down" %
                                  self.guid, payload=json.dumps({"url": self.url}))
        self.mqtt_thread.connect("localhost", 1884, 60)
        self.mqtt_thread.loop_start()
