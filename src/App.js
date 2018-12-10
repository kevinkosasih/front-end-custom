import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import WelcomePage from './components/welcome-page/welcome-page';


class App extends Component {
  render() {
    return (
      <div className="App">
        <center>
          <WelcomePage
            history = {this.props.history}
          />
        </center>
      </div>
    );
  }
}

export default App;
