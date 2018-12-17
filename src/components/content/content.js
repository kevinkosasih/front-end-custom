import React from "react";
import './content.css';
import InputMessage from '../inputMessage/inputMessage';


export default class Content extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    const{myUser,chatID,chatList}=this.props
    console.log(this.props);
    return(
      <div>
        <div className = "contentChat">
          {this.props.chatlog.map((chat,urutan)=>(
            <div>
              {chat.message}
            </div>
          ))}
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
