import React, { Component } from 'react'
import Jumbotron from './Jumbotron'
import './Profile.css'

class Profile extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        opponents: [],
        balls: []
    }

    componentDidMount() {
        this.getUserInfo()
    }

    getUserInfo() {
        fetch('/api/user')
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(user => {
                console.log('this user is ', user)
                this.setState({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    opponents: user.commonOpponents,
                    balls: user.balls
                })
            })
    }

    render() {
        return (
            <div className='container'>
                <Jumbotron />
                <div className="row">
                    <div className="prof-card col-md-8 offset-md-2">
                        <form>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">First Name</label>
                                <div class="col-sm-10">
                                    <input type="text" readonly class="form-control-plaintext" id="staticFirstName" value={this.state.firstName} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Last Name</label>
                                <div class="col-sm-10">
                                    <input type="text" readonly class="form-control-plaintext" id="staticLastName" value={this.state.lastName} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
                                <div class="col-sm-10">
                                    <input type="text" readonly class="form-control-plaintext" id="staticEmail" value={this.state.email} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Opponents</label>
                                <div class="col-sm-10">
                                    {this.state.opponents.map(opponent => {
                                        return (
                                            <input type="text" readonly class="form-control-plaintext" id="staticEmail" value={opponent.name} />
                                        )
                                    })}

                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Balls</label>
                                <div class="col-sm-10">
                                    {this.state.balls.map(ball => {
                                        return (
                                            <input type="text" readonly class="form-control-plaintext" id="staticEmail" value={ball.name} />
                                        )
                                    })}
                                </div>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        )
    }
}

export default Profile
