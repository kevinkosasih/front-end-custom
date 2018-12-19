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
      notif: false
    }
  }

  componentDidMount(){
    this.getData();
  }

  componentWillUnmount(){
    this.recieveChatSocket();
    this.newchatlist(this.state.account.username);
    this.unsendMessageSocket(this.state.account.chatID);
    this.readChatSocket(this.state.account.chatID);
  }

  recieveChatSocket = () =>{
    const {account} = this.state
    recieveSocket(account.chatID,(err,recieve)=>{
      if(this.state.isOpen){
        this.setState({
          chatlog:this.state.chatlog.concat(recieve.message)
        })
        sendSocket('readchat',account.chatID);
        sendSocket('changechatroom');
      }
      else{
        this.setState({
          chatlog:this.state.chatlog.concat(recieve.message),
          notif: true
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
        this.unsendMessageSocket(this.state.account.chatID);
        this.readChatSocket(this.state.account.chatID);
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
            this.setState({
              notif : true
            })
            break;
          }
        }
        this.setState({
          chatlog : json.message
        })
      }
    })
  }

  openChatUser = (chat) =>{
    this.setState({
      notif: false,
      isOpen : true
    })
    sendSocket('readchat',chat);
    this.readChat()
  }

  closeChatUser = () =>{
    this.setState({
      isOpen : false
    })
  }

  unsendMessageSocket (port) {
   recieveSocket ('unsendMessage'+port, (err,recieve) =>{
       let chatlog = this.state.chatlog;
       for(var index in chatlog){
         if(new Date(chatlog[index].time).getTime() === new Date(recieve).getTime()){
           if(chatlog[index].sender.username === "ADMIN" ){
             chatlog.splice(index,1);
             if(chatlog[index-1].receiver[0].read === true){
                this.setState({
                  notif : false
                })
             }
           }
         }
         this.setState({
           chatlog : chatlog
         })
       }
   })
 }

 readChatSocket (port) {
   recieveSocket ('readchat'+port, (err,recieve) =>{
     if(this.state.chatlog.length !== 0){
       let chatlog = this.state.chatlog;
       for(var index = chatlog.length-1 ; index >= 0 ; index--){
           if(chatlog[index].receiver[0].read === false){
             chatlog.splice(index,1,
               { chatId: port,
                 date : chatlog[index].date,
                 message : chatlog[index].message,
                 attachment : chatlog[index].attachment,
                 receiver:[{username :chatlog[index].receiver[0].username, read : true}],
                 sender : {username : chatlog[index].sender.username,  name : chatlog[index].sender.name},
                 time : chatlog[index].time
               });
           } else {
             this.setState({
               chatlog : chatlog
             })
             break;
           }
       }
     }
   })
 }

  readChat = () => {
    const {account} = this.state
    fetch('/readNotif',{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token : account.chatID,
        username : account.username
      }),
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
    console.log(chatlog);
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
            />
          </div> :
          <div onClick = {() => this.openChatUser(account.chatID)} className = "chatBox">
            Click to chat with our administrator <div className = {"notif-"+this.state.notif}/>
          </div>
        }
      </div>
    )
  }
}
