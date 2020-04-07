import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import './NavBar.css'

class NavBar extends Component {
    state = {
        redirect: null
    }
    logout = (e) => {
        const self = this
        e.preventDefault()
        fetch('/auth/logout')
            .then(res => {
                if (!res.ok) throw res
                self.setState({ redirect: '/login' })
            })
            .catch(err => {
                console.error(err)
            })
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <nav className="navbar navbar-light bg-light justify-content-between navbar-expand-md">
                <Link className="navbar-brand" to="/home">Bowled Over</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarNavDropdown">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {`${this.props.firstName} ${this.props.lastName}`}
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <a className="dropdown-item" href="/profile">Profile</a>
                                <a className="dropdown-item" href="#" onClick={this.logout}>Logout</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default NavBar