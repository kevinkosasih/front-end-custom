import React from "react";
import './inputMessage.css';
import TextareaAutosize from 'react-autosize-textarea';

import {
  sendSocket
}from "../../socket/socketconnect";

export default class inputMessage extends React.Component{
  constructor (props){
    super(props);

    this.state = {
      message : "",
      enterPressed : false
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.onEnterPress, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.onEnterPress, false);
  }

  onEnterPress = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      if(!this.state.enterPressed){
        if(this.props.chatList.length === 0 ){
          this.createChatroom(e,this.props.chatID)
        }
        else{
          this.onSend(e);
        }
      }
      this.setState({
        enterPressed : true
      })
      setTimeout(function(){
        this.setState({
          enterPressed : false
        })
      }.bind(this), 0.00000001);
    }
  }

  createChatroom = (e,chatID) => {
    const {sender} = this.props
    fetch('/addchatroom',{
      credentials:'include',
      method:'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatid:chatID,
        user:'ADMIN'
      }),
    }).then(res => res.json())
    .then(json =>{
      let socketChatlist = {
        myusername:sender.username,
        myname:sender.name,
        otherusername:"ADMIN",
        othername:'Admin',
        chatId:json.chatId
      }
      sendSocket('newchatlist',socketChatlist);
      this.onSend(e)
    })
  }

  onSend(e){
    e.preventDefault();
    const timeNow = Date.now()
    const today = new Date(timeNow);
    const dd = (today.getDate() < 10 ? '0' : '')+today.getDate();
    const mm = ((today.getMonth()+1) < 10 ? '0' : '')+(today.getMonth()+1); //January is 0!
    const yyyy = today.getFullYear();
    const date = dd+'-'+mm+'-'+yyyy;
    const message = this.state.message.trim();
    if(message){
      this.sendMassage(message,timeNow,date);
    }
  }

  messageOnChange = (event) =>{
    const name = event.target.name

    this.setState({
      [name] : event.target.value
    })
  }

  sendMassage = (message,today,date) =>{
    this.setState({
      error: ''
    })
    const {senderUsername,sender,chatID} = this.props;
    const receive = this.props.recieve;

    var formData = new FormData();
    formData.append ('chatId', chatID);
    formData.append ('senderUsername', senderUsername);
    formData.append ('sender',sender);
    formData.append ('message', message);
    formData.append ('timeStamp', today);
    formData.append ('date', date);
    formData.append ('recieve','ADMIN');

    fetch('/chat',{
      credentials : 'include',
      method : "POST",
      body: formData
    }).then(res => res.json())
    .then (response => {
      if(response.success){
        let send = {
          reciever:this.props.recieve,
          sender:{
            username: senderUsername,
            name:this.props.sender.name
          },
          chatId:chatID,
          message:this.state.message.trim(),
          time : today,
          date : date
        }
        sendSocket('sendChat',send);
        this.setState({
          time : response.time,
          message:''
        })
      }
      else{
        this.setState({
          success: false,
          error: response.message
        })
      }
    })

  }

  render(){
    return(
      <div className = "footer-app">
        <div className = "textInputChat">
          <form onSubmit = {this.onEnterPress}>
            <TextareaAutosize
              style={{maxHeight : "55px"}}
              className = "message"
              rows = "4"
              name = "message"
              placeholder= "type a message . . ."
              value = {this.state.message}
              onChange = {this.messageOnChange}
            />
          </form>
        </div>
      </div>
    )
  }
}
