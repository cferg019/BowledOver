import React, { Component } from 'react';
import Jumbotron from './Jumbotron'
import { Link } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import Navbar from './NavBar'

const alleyChoices = [
    { value: 'Brookfield Lanes', label: 'Brookfield Lanes' },
    { value: "Lori's Lanes", label: "Lori's Lanes" }
]


class Session extends Component {
    handleAlleysChange(newValue, actionMeta) {
        if (actionMeta.action === 'create-option') {
            console.log('creating new alley', newValue)
        } else {
            console.log('selected existing alley', newValue)
        }
    }

    render() {
        return (
            <div className="container">
                <Navbar />
                <Jumbotron />
                <hr></hr>
                <div className='col-md-10 offset-md-1'>
                    <h4>Where are you bowling today?</h4>
                    <div>Select from the drop down below, or type to add a new location.</div>
                    <CreatableSelect
                        isClearable
                        name="colors"
                        options={alleyChoices}
                        classNamePrefix="select"
                        id="alleys"
                        onChange={this.handleOpponentsChange}
                    />
                </div>
                <hr></hr>
                <div className='col-md-10 offset-md-1'>
                    <Link className="new-session" to="/game">
                        <button type="button" className="btn btn-outline-dark">Start New Game</button>
                    </Link>
                    <Link className="new-session" to="/home">
                        <button type="button" className="btn btn-outline-dark">Return Home</button>
                    </Link>
                </div>
                <hr></hr>
            </div>
        )
    }
}

export default Session;