/*
    code with original record buttons
*/
import AudioPlayer from '../components/audioPlayer/audioPlayer.js'

import React, {Component} from 'react';
class Listener extends Component {

  render() {
     return (
       <div>
         <h1>Hi There, you are the listener, be quiet</h1>
         <AudioPlayer/>
       </div>
     )
   }


 }
 export default Listener;