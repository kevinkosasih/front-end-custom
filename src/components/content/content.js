import React from "react";
import './content.css';
import InputMessage from '../inputMessage/inputMessage';
import {
  recieveSocket,
  closeSocket
}from "../../socket/socketconnect";

export default class Content extends React.Component{

  constructor(props){
    super(props);

  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(){
    this.scrollToBottom();
  }

  getDateandTime =(timestamp,chat,index) => {
    let time  = new Date(chat[index].time)
    const options = { weekday: 'long' };
    const day = time.toLocaleDateString('en-US' , options);
    const dayName = day.substring(0,3);
    let currentDate
    if(index !== 0){
      if(chat[index].date === chat[index-1].date){
        currentDate = 1
      }
      else {
        currentDate = 2
      }
    } else {
      currentDate = 2
    }
    if( currentDate === 1){
      return null
    }
    else {
      return (
        <div className = "timeSeparator-container">
          <div className = "timeSeparator">
            {dayName+', '+chat[index].date}
          </div>
        </div>
      )
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior : "auto", block : "end"});
  }

  scrollSocket = () =>{
    recieveSocket ('changechatroom',(err,recieve) =>{
      this.scrollToBottom();
    })
  }

  render(){
    const{myUser,chatID,chatList}=this.props
    return(
      <div>
        <div className = "contentChat">
          {this.props.chatlog.map((chat,urutan)=>{
            if(chat.sender.username === myUser.username){
              return(
                <div>
                  <div className = "dateAndTime">
                    {this.getDateandTime(chat.time,this.props.chatlog,urutan)}
                  </div>
                  <div className = "senderMessageName">
                    {this.props.chatlog.length >= 0 ?
                      urutan === 0 ?
                        this.props.chatlog[urutan-1] === "undefined" ?
                          chat.sender.name !== this.props.chatlog[urutan-1].sender.name ?
                              <p>{chat.sender.name}</p>
                            :
                            null
                          :
                          <p>{chat.sender.name}</p>
                        :
                        this.props.chatlog[urutan-1] !== "undefined" ?
                          chat.sender.name !== this.props.chatlog[urutan-1].sender.name ?
                              <p>{chat.sender.name}</p>
                            :
                            null
                          :
                          null
                      :
                      null
                    }
                  </div>
                  <div className = "userMessageContainer">
                    <div className = "userMessage">
                      <p>{chat.message}</p>
                    </div>
                  </div>
                </div>
              )
            } else {
              return(
                <div className = "adminMessageContainer">
                  <div className = "adminMessage">
                    <p>{chat.message}</p>
                  </div>
                </div>
              )
            }
          })}
          <div style={{ float:"right", clear: "both"}}
            ref={(div) => { this.messagesEnd = div; }}/>
        </div>
        <InputMessage
          chatList={chatList}
          senderUsername={myUser.username}
          sender ={{
            username:myUser.username,
            name:myUser.name
          }}
          chatID={chatID}
        />
      </div>
    )
  }
}
