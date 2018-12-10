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
    this.messageOnChange =this.messageOnChange.bind(this);
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
        this.onSend(e);
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

  onSend(e){
    e.preventDefault();
    const timeNow = Date.now()
    const today = new Date(timeNow);
    const dd = (today.getDate() < 10 ? '0' : '')+today.getDate();
    const mm = ((today.getMonth()+1) < 10 ? '0' : '')+(today.getMonth()+1); //January is 0!
    const yyyy = today.getFullYear();
    const date = dd+'-'+mm+'-'+yyyy;
    const message = this.state.message.trim();
    const attachment = this.state.file;
    const attachmentName = this.state.file.name;
    const attachmentType = this.state.file.type;
    if(message || attachment){
      this.attachPhoto(attachment,attachmentName,attachmentType,message,timeNow,date);
    }
  }

  messageOnChange = (event) =>{
    const name = event.target.name

    this.setState({
      [name] : event.target.value
    })
  }

  attachPhoto = (attachment,attachmentName,attachmentType,message,today,date) =>{
    this.setState({
      error: ''
    })
    const senderUsername = this.props.senderUsername;
    const sender = this.props.sender;
    const chatId = this.props.chatId;
    const receive = this.props.recieve;
    var formData = new FormData();
    formData.append ('chatId', chatId);
    formData.append ('senderUsername', senderUsername);
    formData.append ('sender',sender);
    formData.append ('Attachment' , attachment)
    formData.append ('AttachmentName', attachmentName);
    formData.append ('AttachmentType', attachmentType);
    formData.append ('message', message);
    formData.append ('timeStamp', today);
    formData.append ('date', date);
    formData.append ('recieve',receive);

    fetch('/chat',{
      credentials : 'include',
      method : "POST",
      body: formData
    }).then(res => res.json())
    .then (response => {
      if(response.success){
        if(response.filename){
          let send = {
            reciever:this.props.recieve,
            sender:{
              username: this.props.senderUsername,
              name:this.props.sender
            },
            chatId:this.props.chatId,
            message:this.state.message.trim(),
            attachment: {
              name : response.filename,
              type : attachmentType
            },
            time : today,
            date : date
          }
          sendSocket('sendChat',send);
        } else {
          let send = {
            reciever:this.props.recieve,
            sender:{
              username: this.props.senderUsername,
              name:this.props.sender
            },
            chatId:this.props.chatId,
            message:this.state.message.trim(),
            time : today,
            date : date
          }
          sendSocket('sendChat',send);
        }
        this.setState({
          time : response.time,
          message:'',
          imagePreviewUrl :'',
          file : ''
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
