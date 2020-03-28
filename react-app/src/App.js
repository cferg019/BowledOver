import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import './App.css';
import Jumbotron from './components/Jumbotron'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'

import Session from './components/Session'
import Game from './components/Game'
import Frame from './components/Frame'
import logo from './logo.svg'

class App extends Component {
  state = {
    isAuthenticated: true
  }
  render() {
    return (
      <Router>
        <div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <PrivateRoute path="/" component={Home} isAuthenticated={this.state.isAuthenticated}/>
        </Switch>
        </div>
      </Router>
    )
  }
}

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)

export default App;
