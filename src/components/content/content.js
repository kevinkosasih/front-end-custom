import React from "react";
import './content.css';
import InputMessage from '../inputMessage/inputMessage';
import doc from '../../picture/doc.png';
import {
  recieveSocket,
  closeSocket
}from "../../socket/socketconnect";

export default class Content extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      isHovering: false,
      openMenu: false,
      chatlogLength : 0,
      scrollTop : null,
      scrollHeight : null
    }
  }

  componentDidMount() {
    this.scrollToBottom();
    this.setState({
      chatlogLength:this.props.chatlog.length
    })
    this.contextContainer.addEventListener('scroll',this.handleScroll,false);
  }

  componentDidUpdate(){
    if(this.state.scrollTop !== null || this.state.scrollHeight !== null){
      if(this.state.chatlogLength !== this.props.chatlog.length && this.props.myUser.username === this.props.chatlog[this.props.chatlog.length - 1].sender.username){
        this.scrollToBottom();
        this.setState({
          chatlogLength:this.props.chatlog.length
        })
      }
      else if(this.state.chatlogLength !== this.props.chatlog.length && ((this.state.scrollHeight - this.state.scrollTop) <= 285 || (this.state.scrollHeight - this.state.scrollTop) === 286)){
        this.scrollToBottom();
        this.setState({
          chatlogLength:this.props.chatlog.length
        })
      }
    }
    else {
      this.scrollToBottom();
    }
  }

  handleScroll = (event) =>{
      let scrollTop = Math.round(this.contextContainer.scrollTop);
      let scrollHeight = this.contextContainer.scrollHeight;
      let offsetHeight = this.contextContainer.offsetHeight;
      let clientHeight = this.contextContainer.clientHeight;
      let oneLastMessage =  Math.round(scrollHeight - scrollTop);
      console.log(scrollTop);
      console.log(scrollHeight);
      this.setState({
        scrollTop : scrollTop,
        scrollHeight : scrollHeight
      })
  }

  changeState = (change) =>{
    this.setState({
      enterPress : change
    })
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

  fileName = (fileName) =>{
    let name;
    if(fileName.length > 45){
      name = fileName.substring(0,45) +'. . .'
    } else {
      name = fileName
    }
    return name;
  }

  viewImage = (name) =>{
    window.open('http://localhost:3000/'+name);
  }

  downloadFile = (name) => {
    window.open('http://localhost:3000/'+name, '_top');
  }

  handleMouseHover(flag,time) {
    if(flag === 0){
      this.setState(this.toggleHoverState(true,time));
    }
    else{
      this.setState(this.toggleHoverState(false,time));
    }
  }

  toggleHoverState(state,time) {
    return {
      isHovering: state,
      openMenu : false,
      timeDiv : time
    };
  }

  MenuMessage = () =>{
    this.setState(this.toggleMenuMessage)
  }

  toggleMenuMessage(state){
    return{
      openMenu : !state.openMenu
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({behavior : "auto", block : "end"});
  }

  render(){
    const{myUser,chatID,chatList}=this.props
    console.log(this.props.chatlog);
    return(
      <div>
        <div className = "contentChat" ref={ref => {this.contextContainer = ref}}>
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
                  {chat.message.split("\n").length > 1 || chat.message.length > 58 ?
                    <div>
                      {!chat.attachment ?
                        <div className = "adminMessage">
                          <p>{chat.message}</p>
                        </div>
                        :
                        <div className = "adminMessageWithPic" onMouseEnter={() =>this.handleMouseHover(0,chat.time)}
                          onMouseLeave={() => this.handleMouseHover(1,null)}>
                          <div>
                            {chat.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                              <div className = "attachmentFileName">
                                <p>{this.fileName(chat.attachment.name)}</p>
                                <img src = {doc}/>
                                  <div>
                                    {
                                      this.state.isHovering && this.state.timeDiv === chat.time ?
                                      <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                        <div className = "hoverAttachmentFile">
                                          {this.state.openMenu ?
                                            <div className = "MenuMessage">
                                              <li onClick ={() => this.downloadFile(chat.attachment.name)}>Download</li>
                                            </div>
                                            :
                                            null
                                          }
                                        </div>
                                      </div>
                                      :
                                      null
                                    }
                                  </div>
                              </div>
                              :
                              <div className = "attachment-picture">
                                <img src = {chat.attachment.name}/>
                                  <div>
                                    {
                                      this.state.isHovering && this.state.timeDiv === chat.time ?
                                      <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                        <div className = "hoverAttachmentFile">
                                          {this.state.openMenu ?
                                            <div className = "MenuMessage">
                                              <li onClick ={() => this.viewImage(chat.attachment.name)}>View</li>
                                            </div>
                                            :
                                            null
                                          }
                                        </div>
                                      </div>
                                      :
                                      null
                                    }
                                  </div>
                              </div>
                            }
                          </div>
                          <p>{chat.message}</p>
                        </div>
                      }
                    </div>
                    :
                    <div>
                      {!chat.attachment ?
                        <div className = "adminMessage">
                          <p>{chat.message}</p>
                        </div>
                        :
                        chat.attachment && !chat.message ?
                        <div className = "adminMessagePicOnly" onMouseEnter={() =>this.handleMouseHover(0,chat.time)}
                          onMouseLeave={() => this.handleMouseHover(1,null)}>
                          <div>
                            {chat.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                              <div className = "attachmentFileName">
                                <p>{this.fileName(chat.attachment.name)}</p>
                                <img src = {doc}/>
                                  <div>
                                    {
                                      this.state.isHovering && this.state.timeDiv === chat.time ?
                                      <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                        <div className = "hoverAttachmentFile">
                                          {this.state.openMenu ?
                                            <div className = "MenuMessage">
                                              <li onClick ={() => this.downloadFile(chat.attachment.name)}>Download</li>
                                            </div>
                                            :
                                            null
                                          }
                                        </div>
                                      </div>
                                      :
                                      null
                                    }
                                  </div>
                              </div>
                              :
                              <div className = "attachment-picture">
                                <img src = {chat.attachment.name}/>
                                  <div>
                                    {
                                      this.state.isHovering && this.state.timeDiv === chat.time ?
                                      <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                        <div className = "hoverAttachmentFile">
                                          {this.state.openMenu ?
                                            <div className = "MenuMessage">
                                              <li onClick ={() => this.viewImage(chat.attachment.name)}>View</li>
                                            </div>
                                            :
                                            null
                                          }
                                        </div>
                                      </div>
                                      :
                                      null
                                    }
                                  </div>
                              </div>
                            }
                          </div>
                        </div>
                        :
                        <div className = "adminMessageWithPic" onMouseEnter={() =>this.handleMouseHover(0,chat.time)}
                          onMouseLeave={() => this.handleMouseHover(1,null)}>
                          <div>
                            {chat.attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                              <div className = "attachmentFileName">
                                <p>{this.fileName(chat.attachment.name)}</p>
                                <img src = {doc}/>
                                  <div>
                                    {
                                      this.state.isHovering && this.state.timeDiv === chat.time ?
                                      <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                        <div className = "hoverAttachmentFile">
                                          {this.state.openMenu ?
                                            <div className = "MenuMessage">
                                              <li onClick ={() => this.downloadFile(chat.attachment.name)}>Download</li>
                                            </div>
                                            :
                                            null
                                          }
                                        </div>
                                      </div>
                                      :
                                      null
                                    }
                                  </div>
                              </div>
                              :
                              <div className = "attachment-picture">
                                <img src = {chat.attachment.name}/>
                                  <div>
                                    {
                                      this.state.isHovering && this.state.timeDiv === chat.time ?
                                      <div className = "hoverAttachmentFileContainer" onClick = {() => this.MenuMessage()}>
                                        <div className = "hoverAttachmentFile">
                                          {this.state.openMenu ?
                                            <div className = "MenuMessage">
                                              <li onClick ={() => this.viewImage(chat.attachment.name)}>View</li>
                                            </div>
                                            :
                                            null
                                          }
                                        </div>
                                      </div>
                                      :
                                      null
                                    }
                                  </div>
                              </div>
                            }
                          </div>
                          <p>{chat.message}
                          </p>
                        </div>
                      }
                    </div>
                  }

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
