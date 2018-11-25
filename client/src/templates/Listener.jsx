/*
    code with original record buttons
*/
// wireframe: https://wireframe.cc/jdpSn6
// https://codepen.io/fgnass/pen/LWeKNq
import AudioPlayer from '../components/audioPlayer/audioPlayer.js'
import TextMessages from '../components/textMessages/textMessages.js'

import React, {Component} from 'react';
class Listener extends Component {
  constructor(){
    super();
    this.state={
      showInfo:false
    }

    this.tx={
      toggleInfo:() =>{
        let status = this.state.showInfo
        this.setState({
          showInfo:!status
        })
      }
    }
  }

  render() {
    return (
      <div className='chatroom' id='listener-view'>
        <div className='message-container'>
          <div className='top-bar'>
            <div className='chatroom-logo'/>
            <div className='roomname-container'>
              <h2>Room Pin: {this.props.parentStates.room_id}</h2>
            </div>
            <div className='connection-container'></div>
          </div>

          <div className='message-list their-message-list'>
           <TextMessages ws={this.props.parentStates.ws}/>
          </div>

          <div className='room-info-container'>
          {this.state.showInfo &&
            (
            <div className='room-info'>
              <p>Speaker</p>
              <p>Room Name:{this.props.parentStates.room_name}</p>
              <p>Room ID:{this.props.parentStates.room_id}</p>
              <p>Your Language:{this.props.parentStates.language}</p>
            </div>
          )}
          </div>

        </div>
        <AudioPlayer ws={this.props.parentStates.ws} methods={this.tx}/>
      </div>
    )
  }


}
export default Listener;