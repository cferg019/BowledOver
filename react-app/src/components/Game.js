import React, { Component } from 'react';
import Jumbotron from './Jumbotron'
import CreatableSelect from 'react-select/creatable'
import Frames from './Frames'

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

let self

class Game extends Component {
    state = {
        ballsUsed: [],
        opponents: [],
        frames: []
    }

    constructor(props) {
        super(props)
        self = this
    }

    setFrames(flatFrames) {
        console.log('got the frames back!', flatFrames)
        let frames = []
        let tmpFrame = {}
        let currentNumber = 1
        for (let i = 0; i < flatFrames.length; i++) {
            if (i < 18) { // If it's not the 10th frame
                if (i % 2 === 0) { // If it's the beginning of a new frame
                    tmpFrame = {
                        number: currentNumber,
                        scores: [flatFrames[i].displayValue]
                    }
                } else {
                    tmpFrame.scores.push(flatFrames[i].displayValue) // push second throw on to tmp scores
                    tmpFrame.scores = tmpFrame.scores.filter(score => score !== '') // get rid of any empty scores (off a strike)
                    frames.push(tmpFrame) //commit the frame
                    currentNumber++
                }
            }
        }

        frames.push({
            number: 10,
            scores: [
                flatFrames[18].displayValue,
                flatFrames[19].displayValue,
                flatFrames[20].displayValue
            ]
                .filter(score => score !== '')
        })

        frames = frames.filter(frame => frame.scores.length > 0)
        console.log('new frames', frames)
        self.setState({ frames })
    }

    handleBallsUsedChange(newValue, actionMeta) {
        if (actionMeta.action === 'create-option') {
            console.log('creating new ball', newValue)
        } else {
            console.log('selected existing ball', newValue)
        }
    }

    handleOpponentsChange(newValue, actionMeta) {
        if (actionMeta.action === 'create-option') {
            console.log('creating new opp', newValue)
        } else {
            console.log('selected existing opp', newValue)
        }
    }

    render() {
        return (
            <div className="container" >
                <Jumbotron />
                <hr></hr>
                <div className="row">
                    <div className="col-md-1 offset-md-1">
                        <label for="opponents">Opponents</label>
                    </div>
                    <div className="col-md-9">

                        <CreatableSelect
                            isMulti
                            name="colors"
                            options={opponentChoices}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            id="opponents"
                            onChange={this.handleOpponentsChange}

                        />
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-md-1 offset-md-1">
                        <label for="balls">Balls</label>
                    </div>
                    <div className="col-md-9">
                        <CreatableSelect
                            isMulti
                            name="colors"
                            options={ballChoices}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            id="balls"
                            onChange={this.handleBallsUsedChange}
                        />
                    </div>
                </div>
                <hr></hr>
                <Frames setFrames={this.setFrames} />
            </div>
        )
    }
}

export default Game;
