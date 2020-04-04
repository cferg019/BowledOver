import React from 'react';
import Jumbotron from './Jumbotron'
import Select from 'react-select';
import Frames from './Frames'
// import { colourOptions } from '../data';

const opponentChoices = [
    { value: 'doug', label: 'Doug' },
    { value: 'kenny', label: 'Kenny' },
    { value: 'sean', label: 'Sean' }
]

const ballChoices = [
    { value: 'squatch', label: 'Squatch' },
    { value: 'absolute inferno', label: 'Absolute Inferno' },
    { value: 'the hammer', label: 'The Hammer' }
]

function Game() {
    return (
        <div className="container">
            <Jumbotron />
            <hr></hr>
            <div className="row">
                <div className="col-md-10">
                    <Select
                        isMulti
                        name="colors"
                        options={opponentChoices}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>
                <div className="col-md-2">
                    <button type="button" className="btn btn-outline-dark" style={{width: "100%"}}>New Opponent</button>
                </div>
            </div>

            <hr></hr>

            <div className="row">
                <div className="col-md-10">
                    <Select
                        isMulti
                        name="colors"
                        options={ballChoices}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>
                <div className="col-md-2">
                    <button type="button" className="btn btn-outline-dark" style={{width: "100%"}}>New Ball</button>
                </div>
            </div>

            <hr></hr>
            <Frames/>

        </div>
    )
}

export default Game;
