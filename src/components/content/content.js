import React from "react";
import './content.css';
import InputMessage from '../inputMessage/inputMessage';

export default class Content extends React.Component{

  constructor(props){
    super(props);

  }

  render(){
    return(
      <div>
        <div className = "contentChat">
          content
        </div>
        <InputMessage/>
      </div>
    )
  }
}
