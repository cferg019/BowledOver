import React from 'react';
import Jumbotron from './Jumbotron'
import { Link } from 'react-router-dom'
import './Verified.css'

const Verified = () => {
    return (
        <div className='container'>
            <Jumbotron/>

            <div className='col-md-4 offset-md-4 verified'>
                Great! Thanks for verifying your email!
                <br></br>
                <br></br>
                <Link className="" to="/login">
                <button type="button" className="btn btn-outline-dark btn-sm">Take Me To The Login Page</button>
                </Link>
            </div>
        </div>
    )
}

export default Verified