import React from 'react'
import Jumbotron from './Jumbotron'

const Profile = () => {
    return (
        <div className='container'>
            <Jumbotron/>
            <div className='profile-details'>
                <div className='name'>
                    Name: 
                </div>
                <div className='email'>
                    Email:
                </div>
                <div className='opponents'>
                    Opponents:
                </div>
                <div className='balls'>
                    Balls: 
                </div>

            </div>
        </div>
    )
}

export default Profile