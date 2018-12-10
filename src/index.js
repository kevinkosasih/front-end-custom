import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginPage from './components/login/login-page';
import RegisterPage from './components/register/register-page';
import RoomChat from './components/room-chat/room-chat';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path = "/" component = {App}/>
      <Route exact path = "/loginForm" component = {LoginPage} />
      <Route exact path = "/RegisterForm" component = {RegisterPage}/>
      <Route exact path = "/ChatRoom" component={RoomChat}/>
    </Switch>
  </BrowserRouter>, document.getElementById('root'));

serviceWorker.register();
