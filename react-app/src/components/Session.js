import React from 'react';
import Jumbotron from './Jumbotron'
import { Link } from 'react-router-dom'

function Session() {
    return (
        <div className="container">
            <Jumbotron />
            <hr></hr>
            <p>Where are you bowling today?</p>
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <hr></hr>
            <Link className="new-session" to="/game">
                <button type="button" className="btn btn-outline-dark">Start New Game</button>
            </Link>
        </div>
    )
}

export default Session;