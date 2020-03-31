import React, { Component } from 'react';
import './Login.css';


class Login extends Component {
    state = {
        email: '',
        password: '',
        isSubmitted: false,
        errorMessage: ''
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
            password: this.state.password
        }
        fetch(`/auth/login`, {
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
            alert('login successful')
    }

    render() {
        return (
            < div className="container">
                <div className="row">
                    <div className="col-md-6 login-form-1 offset-md-3">
                        <h2>Log In</h2>
                        <form>
                            <div className="form-group">
                                <input onChange={this.handleInputChange} name="email" type="text" className="form-control" placeholder="Your Email *" value={this.state.email} />
                            </div>
                            <div className="form-group">
                                <input onChange={this.handleInputChange} type="password" className="form-control" name="password" placeholder="Your Password *" value={this.state.password} />
                            </div>
                            <p>{this.state.errorMessage}</p>
                            <div className="form-group">
                                <input onClick={this.handleLoginButtonClick} type="submit" className="btnSubmit" value="Login" />
                            </div>
                            <div className="form-group">
                                <a href="#" className="ForgetPwd">Forget Password?</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login