import React, { Component } from 'react';
import './Signup.css';
import { Link, Redirect } from 'react-router-dom'

class Signup extends Component {
    state = {
        email: '',
        password: '',
        isSubmitted: false,
        errorMessage: '',
        firstName: '',
        lastName: '',
        confirmPassword: '',
        signupSuccessful: false
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    validateForm = () => {
        let hasErrors = false;
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                errorMessage: 'Passwords must match. Please try again.'
            })
            hasErrors = true;
        }
        if (this.state.password.length < 8) {
            this.setState({
                errorMessage: 'Password must be at least 8 characters in length.'
            })
            hasErrors = true;
        }
        if (this.state.firstName.length < 3) {
            this.setState({
                errorMessage: 'First name must be between 3 and 50 characters.'
            })
            hasErrors = true;
        }
        if (this.state.lastName.length > 50 || this.state.lastName.length < 3) {
            this.setState({
                errorMessage: 'Last name must be between 3 and 50 characters.'
            })
            hasErrors = true;
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
            this.setState({
                errorMessage: 'Please enter a valid email address.'
            })
            hasErrors = true;
        }


        // if (this.state.email !== mailFormat) {
        //     this.setState({
        //         errorMessage: 'Please enter a valid email address.'
        //     })
        //     hasErrors = true;
        // }

        return hasErrors;
    }

    errorResponseIsDuplicateEmail = async response => {
        const errBody = await response.json()

        return response.status === 400 &&
            errBody.name.toLowerCase() === "mongoerror" &&
            errBody.keyValue.email &&
            errBody.code === 11000
    }

    handleLoginButtonClick = event => {
        event.preventDefault()
        const body = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }
        if (this.validateForm()) {
            return
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
            .then(res => {
                console.log('GOT this user', res)
                this.setState({
                    signupSuccessful: true
                })
            })
            .catch(async err => {
                if (await this.errorResponseIsDuplicateEmail(err)) {
                    this.setState({
                        errorMessage: 'This user already exists. Please try again.'
                    })
                }

            })
        this.setState({
            errorMessage: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: ''
        })
        // alert('signup successful.')
    }

    render() {
        if (this.state.signupSuccessful) {
            return (
                <Redirect to={'/postsignup'} />
            )
        }
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
                            <div className="form-group">
                                <Link className="login-button" to="/login">
                                    <input type="submit" className="btnSubmit" value="Login Here" />
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup
