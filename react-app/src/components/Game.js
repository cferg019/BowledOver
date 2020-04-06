import React, { Component } from 'react';
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

class Game extends Component {
    state = {
        ballsUsed: [],
        opponents: [],
        frames: []
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
        this.setState({ frames })
    }

    render() {
        return (
            <div className="container" >
                <Jumbotron />
                <hr></hr>
                <div className="row">
                    <div className="col-md-1">
                        <label for="opponents">Opponents</label>
                    </div>
                    <div className="col-md-9">

                        <Select
                            isMulti
                            name="colors"
                            options={opponentChoices}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            id="opponents"
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-outline-dark" style={{ width: "100%" }}>New Opponent</button>
                    </div>
                </div>

                <hr></hr>

                <div className="row">
                    <div className="col-md-1">
                        <label for="balls">Balls</label>
                    </div>
                    <div className="col-md-9">
                        <Select
                            isMulti
                            name="colors"
                            options={ballChoices}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            id="balls"
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-outline-dark" style={{ width: "100%" }}>New Ball</button>
                    </div>
                </div>

                <hr></hr>
                <Frames setFrames={this.setFrames} />

            </div>
        )
    }
}

export default Game;

// import React, { Component } from 'react';

// import { colourOptions } from '../data';

// export default class CreatableMulti extends Component<*, State> {
//   handleChange = (newValue: any, actionMeta: any) => {
//     console.group('Value Changed');
//     console.log(newValue);
//     console.log(`action: ${actionMeta.action}`);
//     console.groupEnd();
//   };
//   render() {
//     return (
//       <CreatableSelect
//         isMulti
//         onChange={this.handleChange}
//         options={colourOptions}
//       />
//     );
//   }
// }