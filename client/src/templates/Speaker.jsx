/*
    code with original record buttons
*/

// wireframe: https://wireframe.cc/Ukwx24
import React, {Component} from 'react';
import Audio from '../components/browser_audio/Audio.jsx'
import TextMessages from '../components/textMessages/textMessages.js'


class Speaker extends Component {
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
      <div className='chatroom' id='speaker-view'>
        <nav>

        </nav>
        <div className='message-container'>
          <div className='room-info-container'>
          {this.state.showInfo &&
            (
            <div className='room-info'>
              <p>Speaker</p>
              <p>Room Name:{this.props.parentStates.room_name}</p>
              <p>Room ID:{this.props.parentStates.room_id}</p>
              <p>Speaker Language:{this.props.parentStates.language}</p>
            </div>
          )}
          </div>

          <div className='message-list my-message-list'>
           <TextMessages ws={this.props.parentStates.ws}/>
          </div>
        </div>
        <Audio ws={this.props.parentStates.ws} methods={this.tx}/>

      </div>
    )
  }


 }

 export default Speaker;