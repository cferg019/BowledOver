import React from 'react';
import Jumbotron from './Jumbotron'
import './PostSignup.css'

const PostSignup = () => {
    return (
        <div className='container'>
            <Jumbotron />
            <div className='row'>
                <div className='signup col-md-8 offset-md-2'>
                    <p>Thanks for signing up for Bowled Over!</p>
                    <p>Please check your email for a verification link.</p>
                </div>
            </div>

        </div>
    )
}

export default PostSignup