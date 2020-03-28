import React, { Component } from 'react';
import './App.css';
import Jumbotron from './components/Jumbotron'
import Home from './components/Home'
import Login from './components/Login'
import Session from './components/Session'
import Game from './components/Game'
import Frame from './components/Frame'
import logo from './logo.svg'



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fakeAPIData: ''
    }
    fetch(`/api/user`)
      .then(response => response.text())
      .then(state => this.setState({ fakeAPIData: state }));
  }
  render() {
    return (
      // <Jumbotron />
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload!
        </p>
          <p>
            {this.state.fakeAPIData}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
      </div>
    );
  }
}

export default App;
