import React, { Component } from 'react';
import Jumbotron from './Jumbotron'
import { Link } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'

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
                <Jumbotron />
                <hr></hr>
                <div className='col-md-10 offset-md-1'>
                    <CreatableSelect
                        isMulti
                        name="colors"
                        options={alleyChoices}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        id="opponents"
                        onChange={this.handleOpponentsChange}

                    />
                </div>
                {/* <p>Where are you bowling today?</p>
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
            </div> */}
                <hr></hr>
                <Link className="new-session" to="/game">
                    <button type="button" className="btn btn-outline-dark">Start New Game</button>
                </Link>
            </div>
        )
    }
}

export default Session;