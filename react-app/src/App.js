import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import './App.css';
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Verified from './components/Verified'
import Session from './components/Session'
import Game from './components/Game'
import NavBar from './components/NavBar'
import CheckingAuth from './components/CheckingAuth'
import Profile from './components/Profile'
import PostSignup from './components/PostSignup'

let self = null

class App extends Component {
  state = {
    isAuthenticated: false,
    user: null,
    isCheckingAuth: true
  }

  constructor(props) {
    super(props)
    self = this
    fetch('/api/user')
      .then(res => {
        if (res.status === 401) {
          self.setState({ isAuthenticated: false, isCheckingAuth: false })
          throw res
        }
        console.log('got the res', res)
        return res.json()
      })
      .then(user => {
        console.log('got the logged in user', user)
        self.setState({
          isAuthenticated: true,
          isCheckingAuth: false,
          user
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  setGlobalUser(user) {
    console.log('setting user', user)
    self.setState({ user, isAuthenticated: true })
  }

  render() {
    if (this.state.isCheckingAuth) {
      return <CheckingAuth/>
    }
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/login">
              <Login setGlobalUser={this.setGlobalUser}/>
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/session">
              <Session />
            </Route>
            <Route path="/game">
              <Game />
            </Route>
            <PrivateRoute path="/" user={this.state.user} component={Home} isAuthenticated={this.state.isAuthenticated} />
            <Route path="/verified">
              <Verified />
            </Route>
            <Route path="/postsignup">
              <PostSignup />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

const PrivateRoute = ({ component: Component, isAuthenticated, user, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated === true
      ? <div><NavBar firstName={user.firstName} lastName={user.lastName}></NavBar><Component {...props} /></div>
      : <Redirect to='/login' />
  )} />
)

export default App;
