import React from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import logo from '../../picture/logo2.png';
import './login.css';

class LoginForm extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      loginUsername:'',
      loginPassword:'',
      isLoading:true,
      signInError:''
    }
    this.ChangeHandler = this.ChangeHandler.bind(this)
    this.onLogin = this.onLogin.bind(this)

  }

  componentDidMount(){
   fetch('/verify',{
     credentials:'include'
   })
    .then(res => res.json())
    .then(json => {
      if(json.success){
         this.props.history.push('/ChatRoom')
      }
      else{
        this.setState({
          isLoading:false
        })
      }
    })
  }

  ChangeHandler(e){
    const inputname = e.target.name;
    this.setState({
      [inputname]:e.target.value
    })
  }

  onLogin(e) {
      e.preventDefault()
       // Grab state
       const {
         loginUsername,
         loginPassword,
       } = this.state;
       this.setState({
         isLoading:true
       })
       // Post request to backend
       fetch('/login', {
         credentials:'include',
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           username: loginUsername,
           password: loginPassword
         }),
       }).then(res => res.json())
         .then(json => {
           if (json.success) {
             this.setState({
               isLoading: false,
               loginUsername: '',
               loginPassword: '',
               token: json.token,
             });
             this.props.history.push("/ChatRoom")
           } else {
             this.setState({
               signInError: json.message,
               isLoading: false,
             });
           }
         });
     }

  render(){
    const{
      loginUsername,
      loginPassword,
      isLoading,
      signInError
    } = this.state;
    if(isLoading){
      return(
        <div><p>Loading</p></div>
      )
    }
    return(
      <div className = "background-top">
        <div className = "formLogin">
          <Form className = "formModal">
            <div className = "logo-position">
              <img src = {logo} className = "logo" alt=""/>
            </div>
            <div className = "login-position">
              <h3><b>Hoo Hoo</b></h3>
            </div>
            <Form.Field>
              <label> Username </label>
              <input placeholder='Username' type ="text" name="loginUsername" value={loginUsername} onChange={this.ChangeHandler}/>
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input placeholder ="Password" type='password' name ="loginPassword"value={loginPassword} onChange={this.ChangeHandler}/>
            </Form.Field>
            <Form.Field>
              <Checkbox label='Remember Me' />
            </Form.Field>
            {!signInError ?
                null
              :
                <div className = "login-error">
                  <p>
                    {signInError}
                  </p>
                </div>
            }
            <Button
              id = "loginButtonForm"
              type='submit'
              onClick={this.onLogin}
            >
              LOG IN
            </Button>
            <p>


              {"Need an account? "}
              <Link to = '/RegisterForm'>Register!</Link>
            </p>
          </Form>
        </div>
      </div>
    );
  }
}

export default LoginForm
