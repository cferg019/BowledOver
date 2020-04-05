import React, { Component } from 'react'
import './Frames.css'

const frames = [...Array(10).keys()].map(key => key + 1) // 1 - 10
const frameThrowSections = [...Array(21).keys()] // 0 - 20

class Frames extends Component {
    state = {
        selected: 0,
        currentThrow: 1,
        frameThrows: [...Array(21).keys()].map(() => ({
            disabled: true,
            displayValue: '',
            value: ''
        })),
        buttons: [...Array(11).keys()].map(key => ({
            disabled: false,
            value: key,
            displayValue: (key === 10) ? 'X' : key
        }))
    }

    selectScore(index) {
        console.log('clicked', index)
        if (!this.state.frameThrows[index].disabled) {
            const prevButtonValue = (this.state.frameThrows[index - 1]) ? this.state.frameThrows[index - 1].value : null
            let newButtons = this.getButtonsForThrow(prevButtonValue, index)
            this.setState({ selected: index, buttons: newButtons })
        }
    }

    handleScoreButtonClicked = (button) => {
        console.log('you got ', button)
        let newSelected = this.state.selected
        // make a copy
        const frameThrowsCopy = [...this.state.frameThrows]
        // Set the score for the button that clicked and the selected frame
        frameThrowsCopy[this.state.selected] = {
            disabled: false,
            displayValue: button.displayValue,
            value: button.value
        }
        // Make the next frame enabled in case you need to go back before complete
        if (frameThrowsCopy[this.state.selected + 1]) {
            frameThrowsCopy[this.state.selected + 1].disabled = false
        }
        // Increment the selected frame by 1 so it moves over after the score is input
        newSelected++
        // Handle if it's a strike (skip the next throw in frame)
        if (button.displayValue === 'X') {
            // Not the 10th frame
            if (this.state.selected < 18) {
                frameThrowsCopy[this.state.selected + 1] = {
                    disabled: true,
                    value: '',
                    displayValue: ''
                }
                newSelected++;
            }
        }
        if (this.state.selected % 2 === 0 && this.state.frameThrows[this.state.selected + 1]) {
            this.state.frameThrows[this.state.selected + 1].value = ''
            this.state.frameThrows[this.state.selected + 1].displayValue = ''
            // If we're in the middle of entering, and the user goes back to the previous frames first throw, 
            // and changes it, that wipes out the second throw, so we want to disable the first throw of the next frame until
            // they enter the value for the second throw of the previous frame
            if (this.state.frameThrows[this.state.selected + 2] && this.state.frameThrows[this.state.selected + 2].value === '') {
                frameThrowsCopy[this.state.selected + 2].disabled = true
            }
        }
        let newButtons = this.getButtonsForThrow(button.value, newSelected)

        this.setState({ frameThrows: frameThrowsCopy, selected: newSelected, buttons: newButtons })
    }

    getButtonsForThrow(buttonValue, selected) {

        console.log('button value', buttonValue, 'selected', selected)
        const buttonsCopy = [...Array(11).keys()].map(key => ({
            disabled: false,
            value: key,
            displayValue: (key === 10) ? 'X' : key
        })) 

        // Tenth frame
        if (this.state.selected > 17) {
            
        }
        // It's a strike, so return all possible values for the next throw
        if (selected % 2 === 0) {
            console.log('it should reset')
            return buttonsCopy
        } 
        else if (buttonValue === 0) {
            buttonsCopy[10].displayValue = '/'
        }
        else {
            buttonsCopy.forEach((button, i) => {
                if (i === (10 - buttonValue)) {
                    button.displayValue = '/'
                }
                if (i > (10 - buttonValue)) {
                    button.disabled = true
                }
            })
        }
        return buttonsCopy
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <tr>
                                {frames.map(frame => {
                                    const colspan = (frame === 10) ? '3' : '2'
                                    return (<th colspan={colspan}>Frame {frame}</th>)
                                })}
                            </tr>
                            <tr className="throwsRow">
                                {frameThrowSections.map((frame, i) => {
                                    let classes = this.state.selected === i ?
                                        'throw selected' :
                                        'throw';
                                    if (this.state.frameThrows[i].disabled)
                                        classes += ' disabled'
                                    return (<td onClick={() => this.selectScore(i)} className={classes}>{this.state.frameThrows[i].displayValue}</td>)
                                })}
                            </tr>
                            <tr className="scoreRow">
                                {frames.map(frame => {
                                    const colspan = (frame === 10) ? '3' : '2'
                                    return (<td className="score" colspan={colspan}>Score {frame}</td>)
                                })}
                            </tr>

                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col btn-col">
                        {this.state.buttons
                            .filter(button => !button.disabled)
                            .map(button => (
                            <button
                                type="button"
                                className="btn btn-lg btn-outline-secondary"
                                value={button.displayValue}
                                onClick={() => this.handleScoreButtonClicked(button)}
                            >
                                {button.displayValue}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Frames