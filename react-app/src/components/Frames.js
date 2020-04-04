import React, { Component } from 'react'
import './Frames.css'

const frames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const frameThrows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

class Frames extends Component {
    state = {
        selected: 0,
        pinsDown: 0,
        currentThrow: 1
    }

    selectScore(index) {
        console.log('clicked')
        this.setState({ selected: index })
    }

    handleClick = (button) => {
        console.log('you got ', button)
        this.setState({pinsDown: button})
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
                                    return (<td onClick={() => this.selectScore(i)} className={classes}>{this.state.pinsDown}</td>)
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
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="0" 
                            onClick={() => this.handleClick(0)}>0</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="1"
                            onClick={() => this.handleClick(1)}>1</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="2"
                            onClick={() => this.handleClick(2)}>2</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="3"
                            onClick={() => this.handleClick(3)}>3</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="4"
                            onClick={() => this.handleClick(4)}>4</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="5"
                            onClick={() => this.handleClick(5)}>5</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="6"
                            onClick={() => this.handleClick(6)}>6</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="7"
                            onClick={() => this.handleClick(7)}>7</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="8"
                            onClick={() => this.handleClick(8)}>8</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="9"
                            onClick={() => this.handleClick(9)}>9</button>
                        <button type="button" className="btn btn-lg btn-outline-secondary" value="X"
                            onClick={() => this.handleClick('X')}>X</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Frames