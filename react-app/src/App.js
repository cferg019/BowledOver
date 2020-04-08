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
import Loading from './components/Loading'
import Profile from './components/Profile'
import PostSignup from './components/PostSignup'
import SessionHistory from './components/SessionHistory';

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
      return <Loading />
    }
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/login">
              <Login setGlobalUser={this.setGlobalUser} />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/verified">
              <Verified />
            </Route>
            <Route path="/postsignup">
              <PostSignup />
            </Route>
            <PrivateRoute path="/session/:sessionId/game/:gameId" user={this.state.user} component={Game} isAuthenticated={this.state.isAuthenticated} />
            <PrivateRoute path="/session/:sessionId" user={this.state.user} component={Session} isAuthenticated={this.state.isAuthenticated} />
            <PrivateRoute path="/" user={this.state.user} component={Home} isAuthenticated={this.state.isAuthenticated} />

            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/sessionhistory">
              <SessionHistory />
            </Route>
            <PrivateRoute path="/" user={this.state.user} component={Home} isAuthenticated={this.state.isAuthenticated} />

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
