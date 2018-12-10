import React from 'react';
import './room-chat.css';

import { Button } from 'semantic-ui-react';
import Header from "../header/header";
import Content from "../content/content";

export default class RoomChat extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      message:'',
      isOpen : false
    }

    this.logout = this.logout.bind(this)
  }

  openChatUser = () =>{
    this.setState({
      isOpen : true
    })
  }

  closeChatUser = () =>{
    this.setState({
      isOpen : false
    })
  }

  logout(e) {
   e.preventDefault()
      // Verify token
      fetch('/logout',{
        credentials:'include'
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.props.history.push('/LoginForm')
          }
         }
       );
  }

  render(){
    return(
      <div>
        <div>
          <Button onClick = {this.logout}>
            logout
          </Button>
        </div>
        {this.state.isOpen ?
          <div className = "chatRoom">
            <Header
              closeChatUser = {this.closeChatUser}
            />
            <Content/>
          </div> :
          <div onClick = {this.openChatUser} className = "chatBox">
            Click to chat with our administrator
          </div>
        }

      </div>
    )
  }
}
