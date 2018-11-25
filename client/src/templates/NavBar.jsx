import React, {Component} from 'react';

class NavBar extends React.Component{

  render(){

    return(

      <nav className="navigation">
        <ul className="main-nav">
          <img id = 'logo' src="../styles/images/logo.png"/>
          <a>No Hablo</a>
          <button onClick={this.getCreateRoomView} >Create Room</button>
          <button onClick={this.getJoinRoomView} >Join Room</button>
        </ul>
      </nav>

    )
  }
}


export default NavBar