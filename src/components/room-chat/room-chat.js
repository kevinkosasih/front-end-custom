import React from 'react';
import './room-chat.css';
import { Button } from 'semantic-ui-react';
import Header from "../header/header";
import Content from "../content/content";
import {
  recieveSocket,
  sendSocket
}from "../../socket/socketconnect";

export default class RoomChat extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      message:'',
      account:[],
      isOpen : false,
      isLoading:true,
      chatList:[],
      chatlog:[],
      notif:0
    }
  }
  componentDidMount(){
    this.getData();
  }
  componentWillUnmount(){
    this.recieveChatSocket();
    this.newchatlist(this.state.account.username)
  }

  recieveChatSocket = () =>{
    const {account} = this.state
    recieveSocket(account.chatID,(err,recieve)=>{
      console.log(recieve);
      if(this.state.isOpen){
        this.setState({
          chatlog:this.state.chatlog.concat(recieve.message)
        })
      }
      else{
        this.setState({
          notif:this.state.notif+1
        })
      }
    })
  }
  newchatlist = (username) => {
    recieveSocket('chatlist'+username,(err,recieve)=>{
      this.setState({
        chatList:this.state.chatList.concat(recieve)
      })
    })
  }

  getData = () =>{
    fetch('/getdata',{
      credentials:'include'
    }).then(res => res.json())
    .then(json =>{
      if(!json.success){
        this.props.history.push('/');
      }
      else{
        this.setState({
          account:json.akun,
          chatList:json.akun.chatList,
          isLoading:false
        })
        this.recieveChatSocket();
        if(json.akun.chatList.length === 0){
          this.newchatlist(json.akun.username);
        }
        else{
          this.getChat(json.akun.chatID)
        }
      }
    })
  }

  getChat = (chatID) =>{
    fetch('/getchat',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token : chatID
      }),
    }).then(res => res.json())
    .then(json=>{
      if(json.success){
        let notif = 0
        for(var read in json.message){
          if(json.message[read].sender.username !== this.state.account.username && !json.message[read].receiver[0].read){
            notif++
          }
        }
        this.setState({
          chatlog : json.message,
          notif : notif
        })
      }
    })
  }

  openChatUser = () =>{
    this.setState({
      notif:0,
      isOpen : true
    })
  }

  closeChatUser = () =>{
    this.setState({
      isOpen : false
    })
  }

  logout = (e) => {
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
    const {
      isLoading,
      account,
      chatList,
      notif,
      chatlog
    } = this.state
    if(isLoading){
      return(
        <div>Loading.....</div>
      )
    }
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
            <Content
              chatList={chatList}
              chatlog={chatlog}
              myUser={account}
              chatID={account.chatID}
              chatlog={this.state.chatlog}
            />
          </div> :
          <div onClick = {this.openChatUser} className = "chatBox">
            Click to chat with our administrator {notif}
          </div>
        }

      </div>
    )
  }
}
