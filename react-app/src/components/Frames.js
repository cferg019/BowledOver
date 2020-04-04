import React, { Component } from 'react'
import './Frames.css'

const frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const frameThrows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

class Frames extends Component {
    state = {
        selected: 0
    }

    selectScore(index) {
        console.log('clicked')
        this.setState({ selected: index })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <tr>
                                {frames.map(frame => (<th colspan="2">Frame {frame}</th>))}
                            </tr>
                            <tr className="throwsRow">
                                {frameThrows.map((frame, i) => {
                                    const classes = this.state.selected === i ?
                                        'throw selected' :
                                        'throw'
                                    return (<td onClick={() => this.selectScore(i)} className={classes}>{frame}</td>)
                                })}
                            </tr>
                            <tr className="scoreRow">
                                {frames.map(frame => (<td className="score" colspan="2">Score {frame}</td>))}
                            </tr>

                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col btn-col">
                        <button type="button" className="btn btn-lg btn-outline-secondary">0</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">1</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">2</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">3</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">4</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">5</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">6</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">7</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">8</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">9</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary">X</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Frames