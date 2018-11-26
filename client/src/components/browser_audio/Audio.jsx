import React, {Component} from 'react';
// import {startRecording, stopRecording} from './helper.js'
// import recorder from './recorder.js'
import * as dat from 'dat.gui';

class Audio extends Component {

  constructor(){
    super();
    this.state={
      RecordedAudio: new Blob([], { type: 'audio/wav' })
    }

    /*helper variables*/
    this.gumStream; //stream from getUserMedia()
    this.rec; //Recorder.js object
    this.input; //MediaStreamAudioSourceNode we'll be recording
    // shim for AudioContext when it's not avb.
    this.AudioContext;
    this.audioContext; //new audio context to help us record
    // this.startRecording = this.startRecording.bind(this);
    // this.stopRecording = this.stopRecording.bind(this);
    // this.getWavAudio = this.getWavAudio.bind(this);
    this.analyser;



    /***************
      Audio Display
    ****************/
    // the canvas size
    this.WIDTH = 1000;
    this.HEIGHT = 400;



    // options to tweak the look
    this.opts = {
      smoothing: 0.6,
      fft: 5,
      minDecibels: -70,
      scale: 0.2,
      glow: 10,
      color1: [203, 36, 128],
      color2: [41, 200, 192],
      color3: [24, 137, 218],
      fillOpacity: 0.6,
      lineWidth: 1,
      blend: "screen",
      shift: 50,
      width: 60,
      amp: 1
    };


    // shuffle frequencies so that neighbors are not too similar
    this.shuffle = [1, 3, 0, 4, 2];

  }

  componentDidMount() {
    this.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext; //new audio context to help us recordß
    this.ctx = canvas.getContext("2d");
    this.analyser = this.audioContext.createAnalyser();
    // Interactive dat.GUI controls
    this.gui = new dat.GUI();

    // hide them by default
    this.gui.close();

    // connect gui to opts
    this.gui.addColor(this.opts, "color1");
    this.gui.addColor(this.opts, "color2");
    this.gui.addColor(this.opts, "color3");
    this.gui.add(this.opts, "fillOpacity", 0, 1);
    this.gui.add(this.opts, "lineWidth", 0, 10).step(1);
    this.gui.add(this.opts, "glow", 0, 100);
    this.gui.add(this.opts, "blend", [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "lighten",
      "difference"
    ]);
    this.gui.add(this.opts, "smoothing", 0, 1);
    this.gui.add(this.opts, "minDecibels", -100, 0);
    this.gui.add(this.opts, "amp", 0, 5);
    this.gui.add(this.opts, "width", 0, 60);
    this.gui.add(this.opts, "shift", 0, 200);


  }

  render(){
    return (
      <div>
        <canvas id="canvas"></canvas>
        <button onClick= {this.startRecording} id="recordButton">Record</button>
        <button onClick= {this.stopRecording} id="stopButton" >Stop</button>
      </div>
    )
  }

  startRecording = () => {
    console.log("recordButton clicked in Audio file");


    recordButton.disabled = true;
    stopButton.disabled = false;



    // var constraints = { audio: true, video:false }
    //   navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
    //       console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

    //       /* assign to gumStream for later use */
    //       this.gumStream = stream;
    //        // use the stream
    //       this.input = this.audioContext.createMediaStreamSource(stream);
    //       //numChannels:1 mono recording
    //       this.rec = new Recorder(this.input,{numChannels:1})
    //       //start the recording process
    //       this.rec.record()
    //       console.log("Recording started");

    //   }).catch(function(err) {
    //       //enable the record button if getUserMedia() fails
    //       console.log(err);
    //       recordButton.disabled = false;
    //       stopButton.disabled = true;
    //   });
    // }


    var displayConstraints = {
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
          },
        "optional": []
      }
    }

    navigator.mediaDevices
      .getUserMedia(displayConstraints)
      .then((stream) => {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        /* assign to gumStream for later use */
        this.gumStream = stream;
         // use the stream
        this.input = this.audioContext.createMediaStreamSource(stream);
        //numChannels:1 mono recording
        this.rec = new Recorder(this.input,{numChannels:1})
        //start the recording process
        this.rec.record()

        console.log("Recording started");
        //***********************
        //    For Display Audio
        //***********************
        this.gotStream(stream);
      })
      .catch(function(err) {
        //enable the record button if getUserMedia() fails
        console.log(err);
        recordButton.disabled = false;
        stopButton.disabled = true;
      });
  }




  stopRecording = () => {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;

    //tell the recorder to stop the recording
    this.rec.stop();

    //stop microphone access
    this.gumStream.getAudioTracks()[0].stop();

    //create the wav blob and save blob data to RecordAudio
    this.rec.exportWAV(this.getWavAudio)

    /*
        create the client socket and send RecordedAudio to server
        and
        after successfully send, active  start button
    */
    // var host = 'ws://localhost:5000/binary-endpoint';
    // var client = new BinaryClient(host);
    // console.log(this.RecordedAudio);
    // setTimeout(function(){ client.send(this.RecordedAudio); }, 3000);

  }


  // call back function for exportWAV method in recorder.js
  getWavAudio = blob => {
    this.RecordedAudio = blob;
    this.props.ws.send(this.RecordedAudio);
  }



  gotStream = stream => {
    // Create an AudioNode from the stream.
    // mediaStreamSource = this.audioContext.createMediaStreamSource(stream);


    // Array to hold the analyzed frequencies
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
    this.input.connect(this.analyser);
    requestAnimationFrame(this.visualize);
    requestAnimationFrame(this.visualize);

  }


  visualize=()=>{

  // set analysert props in the loop react on dat.gui changes
  this.analyser.smoothingTimeConstant = this.opts.smoothing;
  this.analyser.fftSize = Math.pow(2, this.opts.fft);
  this.analyser.minDecibels = this.opts.minDecibels;
  this.analyser.maxDecibels = 0;
  this.analyser.getByteFrequencyData(this.freqs);

  // set size to clear the canvas on each frame
  canvas.width = this.WIDTH;
  canvas.height = this.HEIGHT;

  // draw three curves (R/G/B)
  this.path(0);
  this.path(1);
  this.path(2);

  // schedule next paint
  requestAnimationFrame(this.visualize);
}


path=(channel)=> {

  // Read color1, color2, color2 from the opts
  const color = this.opts[`color${channel + 1}`].map(Math.floor);

  // turn the [r,g,b] array into a rgba() css color
  this.ctx.fillStyle = `rgba(${color}, ${this.opts.fillOpacity})`;

  // set stroke and shadow the same solid rgb() color
  this.ctx.strokeStyle = this.ctx.shadowColor = `rgb(${color})`;

  this.ctx.lineWidth = this.opts.lineWidth;
  this.ctx.shadowBlur = this.opts.glow;
  this.ctx.globalCompositeOperation = this.opts.blend;

  const m = this.HEIGHT / 2; // the vertical middle of the canvas

  // for the curve with 5 peaks we need 15 control points

  // calculate how much space is left around it
  const offset = (this.WIDTH - 15 * this.opts.width) / 2;

  // calculate the 15 x-offsets
  const x = this.range(15).map(
    i => offset + channel * this.opts.shift + i * this.opts.width
  );

  // pick some frequencies to calculate the y values
  // scale based on position so that the center is always bigger
  const y = this.range(5).map(i =>
    Math.max(0, m - this.scale(i) * this.freq(channel, i))
  );

  const h = 2 * m;

  this.ctx.beginPath();
  this.ctx.moveTo(0, m); // start in the middle of the left side
  this.ctx.lineTo(x[0], m + 1); // straight line to the start of the first peak

  this.ctx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0]); // curve to 1st value
  this.ctx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1]); // 2nd value
  this.ctx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2]); // 3rd value
  this.ctx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3]); // 4th value
  this.ctx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4]); // 5th value

  this.ctx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m); // curve back down to the middle

  this.ctx.lineTo(1000, m + 1); // straight line to the right edge
  this.ctx.lineTo(x[13], m - 1); // and back to the end of the last peak

  // now the same in reverse for the lower half of out shape

  this.ctx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4]);
  this.ctx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3]);
  this.ctx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2]);
  this.ctx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1]);
  this.ctx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0]);
  this.ctx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m);

  this.ctx.lineTo(0, m); // close the path by going back to the start

  this.ctx.fill();
  this.ctx.stroke();

}

/**
 * Utility function to create a number range
 */
range=(i)=>{
  return Array.from(Array(i).keys());
}

freq=(channel, i)=>{
  const band = 2 * channel + this.shuffle[i] * 6;
  return this.freqs[band];
}

/**
 * Returns the scale factor fot the given value index.
 * The index goes from 0 to 4 (curve with 5 peaks)
 */
scale=(i)=>{
  const x = Math.abs(2 - i); // 2,1,0,1,2
  const s = 3 - x;           // 1,2,3,2,1
  return s / 3 * this.opts.amp;
}



}

export default Audio


/*                      TO DO: add audio analyser display


https://stackoverflow.com/questions/46302362/record-audio-from-browser-and-visualize-in-real-time


*/
