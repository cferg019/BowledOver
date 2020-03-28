import React, { Component } from 'react';
import './Signup.css';


class Signup extends Component {
    state = {
        email: '',
        password: '',
        isSubmitted: false,
        errorMessage: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''

    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleLoginButtonClick = event => {
        event.preventDefault()
        const body = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }
        fetch(`/auth/signup`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) { throw response }
                return response.json()  //we only get here if there is no error
            })
            .then(user => console.log('GOT this user', user))
            .catch(err => {
                if (err.status === 401) {
                    this.setState({
                        errorMessage: 'Login failed. Please try again.'
                    })
                }
                console.log('sorry, got an error', err)
            })
    }

    render() {
        return (
            < div className="container">
                <div className="row">
                    <div className="col-md-6 login-form-1 offset-md-3">
                        <h2>Sign Up</h2>
                        <form>
                            <div className="form-group">
                                <input onChange={this.handleInputChange} name="firstName" type="text" className="form-control" placeholder="First Name *" value={this.state.firstName} />
                            </div>
                            <div className="form-group">
                                <input onChange={this.handleInputChange} name="lastName" type="text" className="form-control" placeholder="Last Name *" value={this.state.lastName} />
                            </div>
                            <div className="form-group">
                                <input onChange={this.handleInputChange} name="email" type="text" className="form-control" placeholder="Your Email *" value={this.state.email} />
                            </div>
                            <div className="form-group">
                                <input onChange={this.handleInputChange} type="password" className="form-control" name="password" placeholder="Your Password *" value={this.state.password} />
                            </div>
                            <div className="form-group">
                                <input onChange={this.handleInputChange} type="password" className="form-control" name="confirmPassword" placeholder="Retype Password *" value={this.state.confirmPassword} />
                            </div>
                            <p>{this.state.errorMessage}</p>
                            <div className="form-group">
                                <input onClick={this.handleLoginButtonClick} type="submit" className="btnSubmit" value="Sign Up" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup