import React from 'react';
import './welcome-page.css';
import {Button } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class WelcomePage extends React.Component{

  componentDidMount(){
    fetch('/verify',{
      credentials:'include'
    })
     .then(res => res.json())
     .then(json => {
       if(json.success){
          this.props.history.push('/ChatRoom')
       }
     })
  }

  render (){
    console.log(this.props);
    return (
      <div className = "welcomeButtonPosition">
        <Link to = '/LoginForm'>
          <Button
            id = "welcomeButton"
            size ="huge">
            Welcome to chat application website!
            Click me to login :)
          </Button>
        </Link>
      </div>
    );
  }
}

export default WelcomePage;
