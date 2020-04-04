import React from 'react';
import Jumbotron from './Jumbotron'

const PostSignup = () => {
    return (
        <div className='container'>
            <Jumbotron />
            <div className='row'>
                <div className='col-md-8 offset-md-2 signup'>
                    <p>Thanks for signing up for Bowled Over!</p>
                    <p>Please check your email for a verification link.</p>
                </div>
            </div>

        </div>
    )
}

export default PostSignup