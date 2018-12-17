import React from 'react'
import './register.css';
import { Button, Form } from 'semantic-ui-react';
import {Link} from "react-router-dom";
import logo from '../../picture/logo2.png';
import {
  sendSocket
}from "../../socket/socketconnect";

class RegisterForm extends React.Component{
  constructor(props){
    super (props);

    this.state = {
      user : {
        username : '',
        email:'',
        password:'',
        retypePassword:''
      },
      success : true,
      usernameIsValid : true,
      firstNameIsValid : true,
      lastNameIsValid : true,
      emailIsValid : true,
      passwordIsValid : true,
      retypeIsValid : true
    }
  }

  usernameValidation = (username,regex) => {
    if(username.length < 6){
      this.setState({
        usernameIsValid : false,
        messageUsername : "Username must at least 6 characters"
      });
      return false
    }
    else if (username.match(regex)){
      this.setState({
        usernameIsValid : false,
        messageUsername : "Username can not contain space character"
      });
      return false
    }
    else if (username !== '' && username.length >= 5){
      this.setState({
        usernameIsValid : true,
        messageUsername : ''
      });
      return true
    }
  }

  nameValidation = (firstName,lastName) => {
    if(!firstName){
      this.setState ({
        firstNameIsValid : false,
        messageFirstName : "this field is required"
      })
    }
    else if (firstName !== ''){
      this.setState({
        firstNameIsValid : true,
        messageFirstName : ''
      })
    }
    if(!lastName){
      this.setState ({
        lastNameIsValid : false,
        messageLastName : "this field is required"
      })
      return false
    }
    else if (lastName){
      this.setState({
        lastNameIsValid : true,
        messageLastName : ''
      })
      return true
    }
  }

  emailValidation = (email,regex) =>{
    if(!regex.test(email)){
      this.setState({
        emailIsValid : false,
        messageEmail : "Email invalid"
      });
      return false
    }
    else if (email !== '' || regex.text(email)){
      this.setState({
        emailIsValid : true,
        messageEmail : ''
      });
      return true
    }
  }

  passwordValidation = (password,retypePassword) =>{
    if (!password){
      this.setState({
        passwordIsValid : false,
        messagePass : "This field is required"
      })
      return false
    }
    if(password.length < 6){
      this.setState({
        passwordIsValid : false,
        messagePass : "Password must at least 6 characters"
      })
      return false
    }
    else if (password !== "" && password.length >= 6) {
      this.setState({
        passwordIsValid : true,
        messagePass : ''
      });
    }
    if (!retypePassword){
      this.setState({
        retypeIsValid : false,
        messageRetype : "This field is required"
      })
      return false
    }
    else if(password !== retypePassword){
      this.setState({
        retypeIsValid : false,
        messageRetype : "Password did not match"
      });
      return false
    }
    else if (retypePassword !== '' && password === retypePassword){
      this.setState({
        retypeIsValid: true,
        messageRetype : ''
      })
      return true
    }
  }

  handleUserData = (event) =>{
    event.preventDefault();
    let username = this.refs.username.value;
    let email = this.refs.email.value;
    let password = this.refs.password.value;
    let retypePassword = this.refs.retypePassword.value;
    let firstName = this.refs.firstName.value;
    let lastName = this.refs.lastName.value;
    let regexEmail = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
    let regexUsername = /\s/g;

    this.usernameValidation(username,regexUsername)
    this.nameValidation(firstName,lastName)
    this.emailValidation(email,regexEmail)
    this.passwordValidation(password,retypePassword)

    if(this.usernameValidation(username,regexUsername) && this.nameValidation(firstName,lastName) && this.emailValidation(email,regexEmail) && this.passwordValidation(password,retypePassword)){
      // this.RegisUser(username,email,password,retypePassword,firstName,lastName);
      console.log('masuk regis bck');
    }
  }

  RegisUser(username,email,password,retypePassword,firstName,lastName){
    let name = firstName +" "+lastName
    this.setState({
      success : true
    })
    fetch('/regisnew',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
        name:name,
        email:email,
      }),
    }).then(res => res.json())
      .then(json =>{
        console.log(json);
        if(json.success){
          console.log(json);
          this.props.history.push('/LoginForm')
          sendSocket("newfriend",json.newUser)
        }
        else{
          this.setState({
            success : json.success,
            message : "Username or Email is already taken!",
            usernameIsValid : false,
            emailIsValid : false
          })
        }
    })
  }

  render(){
    return(
      <div className = "background-top">
        {!this.state.success ?
          <center>
            <div className = "EmailUsernameErrorMessage">
              <b>{this.state.message}</b>
            </div>
          </center> :
        null}
        <div className ="formRegister">
          <Form className = "formModal">
            <div className = "logo-position" >
              <img src = {logo} className = "logo" alt=''/>
            </div>
            <div className = "login-position">
              <h3><b>Hoo Hoo</b></h3>
            </div>
            <Form.Field className = {this.state.usernameIsValid ? "" : "error"} required>
              <label>Username</label>
              <input
                placeholder='Username'
                type ='text'
                name = 'username'
                value = {this.state.userName}
                ref = 'username'
              />
            <div className = "errorMessage">{this.state.messageUsername}</div>
            </Form.Field>
            <Form.Field className = {this.state.firstNameIsValid ? "" : "error"} required>
              <label>First Name</label>
              <input
                placeholder='First Name'
                type = 'text'
                ref = 'firstName' />
              <div className = "errorMessage">{this.state.messageFirstName}</div>
            </Form.Field>
            <Form.Field className = {this.state.lastNameIsValid ? "" : "error"} required>
              <label>Last Name</label>
              <input
                placeholder='Last Name'
                type = 'text'
                ref = 'lastName'/>
              <div className = "errorMessage">{this.state.messageLastName}</div>
            </Form.Field>
            <Form.Field className = {this.state.emailIsValid ? "" : "error"} required>
              <label>Email</label>
              <input
                placeholder = "Input Email"
                type ='email'
                name = 'email'
                value = {this.state.email}
                ref = 'email'
              />
            <div className = "errorMessage">{this.state.messageEmail}</div>
            </Form.Field>
            <Form.Field className = {this.state.passwordIsValid ? "" : "error"} required>
              <label>Password</label>
              <input
                placeholder = "Password"
                type ='password'
                name = 'password'
                value = {this.state.password}
                ref = 'password'
              />
            <div className = "errorMessage">{this.state.messagePass}</div>
            </Form.Field>
            <Form.Field className = { this.state.retypeIsValid ? "" : "error"} required>
              <label>Re-type Password</label>
              <input
                placeholder ="Re-type Password"
                type = 'password'
                name = 'retypePassword'
                value = {this.state.retypePassword}
                ref = 'retypePassword'
              />
            <div className = "errorMessage">{this.state.messageRetype}</div>
            </Form.Field>
            <Form.Field>
              <p>By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy. You may receive SMS notifications from us and can opt out at any time.</p>
            </Form.Field>
            <Button
            id = "registerButtonForm"
            type='submit'
            onClick = {this.handleUserData}
            >REGISTER
            </Button>
            <p>
              <Link to = '/LoginForm' className = "colorClickHere">{"Already have an account ?"}</Link>
            </p>
          </Form>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
