import React from 'react';
import Jumbotron from './Jumbotron'
import { Link } from 'react-router-dom'

const Verified = () => {
    return (
        <div className='container'>
            <Jumbotron/>
            <div className='col-md-4 offset-md-4'>
                Great! Thanks for verifying your email!
                <br></br>
                <Link className="" to="/login">
                <button type="button" className="btn btn-outline-dark">Take Me To The Login Page</button>
            </Link>
            </div>
        </div>
    )
}

export default Verified