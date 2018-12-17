import React from "react";
import './header.css';

import cancel from "../../picture/cancel.png";

export default class Header extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className = "headerChatContainer">
        <div className = "headerChatContent">
          <div className = "cancelContainer">
            <img src = {cancel} onClick = {()=>this.props.closeChatUser()} className = "cancelButton"/>
          </div>
          Admin
        </div>
      </div>
    )
  }
}
