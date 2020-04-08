import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable'
import Frames from './Frames'
import Breadcrumbs from './Breadcrumbs'
import Loading from './Loading'
import DateTimePicker from 'react-datetime-picker';
import './Game.css'

let self

class Game extends Component {
    state = {
        game: {
            frames: [],
            ballsUsed: [],
            players: []
        },
        opponents: [],
        balls: [],
        isLoading: true,
        successMessage: '',
        errorMessage: '',
        selectedBalls: [],
        selectedPlayers: [],
        timePlayed: new Date(),
        totalScore: 0
    }

    constructor(props) {
        super(props)
        self = this
    }

    componentDidMount() {
        console.log(this.props.match.params.sessionId)
        if (this.props.match.params.gameId === 'new') {
            this.setState({ isNew: true })
            this.getBallsAndOpponents()
        } else {
            this.getGame(this.props.match.params.gameId)
        }
    }

    getBallsAndOpponents() {
        fetch('/api/user/balls')
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(balls => {
                console.log('got the balls', balls)
                this.setState({ balls })
                return fetch('/api/user/common-opponents')
            })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(opponents => {
                console.log('got the opponents', opponents)
                this.setState({ opponents, isLoading: false })
            })
            .catch(err => console.error(err))
    }

    getTotalScoreForFrames(frames) {
        fetch('/api/calc/totalscore', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify({
                frames
            })
        })
        .then(res => {
            if (!res.ok) throw res
            return res.json()
        })
        .then(response => {
            this.setState({
                totalScore: response.totalScore
            })
        })
        .catch(err => console.error(err))
    }

    getGame(gameId) {
        let tmpBalls;
        let tmpPlayers;
        fetch('/api/user/balls')
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(balls => {
                console.log('got the balls', balls)
                this.setState({ balls })
                tmpBalls = balls
                return fetch('/api/user/common-opponents')
            })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(opponents => {
                console.log('got the opponents', opponents)
                this.setState({ opponents })
                tmpPlayers = opponents
                return fetch(`/api/session/${this.props.match.params.sessionId}/game/${gameId}`)
            })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(game => {
                console.log('got game', game)
                const newState = {
                    game,
                    selectedPlayers: game.players.map(playerId => tmpPlayers.find(player => playerId === player._id)),
                    selectedBalls: game.ballsUsed.map(ballId => tmpBalls.find(ball => ballId === ball._id)),
                    timePlayed: new Date(game.timePlayed),
                    isLoading: false,
                    totalScore: game.totalScore
                }
                console.log('setting new state', newState)
                this.setState(newState)
            })
            .catch(err => console.error(err))

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
                    tmpFrame.scores = tmpFrame.scores.filter(score => score !== '' && score !== null && score !== undefined) // get rid of any empty scores (off a strike)
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
        const newGame = {
            ...self.state.game,
            frames
        }
        self.getTotalScoreForFrames(frames)
        self.setState({ game: newGame })
    }

    handleBallsUsedChange(newValues, actionMeta) {
        if (actionMeta.action === 'create-option') {
            const newOne = newValues.find(nv => nv.__isNew__ === true)
            this.createNewBall(newOne.value)
            console.log('creating new ball', newValues)
        } else {
            if (newValues) {
                console.log('this.state.balls', this.state.balls)
                let newSelectedBalls = []
                for (const newValue of newValues) {
                    newSelectedBalls.push(this.state.balls.find(ball => ball._id === newValue.value))
                }
                console.log('new selected balls', newSelectedBalls)
                this.setState({ selectedBalls: newSelectedBalls })
            } else {
                this.setState({ selectedBalls: [] })
            }
        }
    }

    handleOpponentsChange(newValues, actionMeta) {
        if (actionMeta.action === 'create-option') {
            const newOne = newValues.find(nv => nv.__isNew__ === true)
            this.createNewOpponent(newOne.value)
            console.log('creating new alley', newValues)
        } else {
            if (newValues) {
                let newSelectedPlayers = []
                for (const newValue of newValues) {
                    newSelectedPlayers.push(this.state.opponents.find(opp => opp._id === newValue.value))
                }
                console.log('new selected players', newSelectedPlayers)
                this.setState({ selectedPlayers: newSelectedPlayers })
            } else {
                this.setState({ selectedPlayers: [] })
            }
        }
    }

    createNewOpponent(name) {
        const newOpponent = {
            name
        }
        fetch('/api/user/common-opponents', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(newOpponent)
        })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(createdOpponent => {
                console.log('created opp', createdOpponent)
                const newOpponents = [...this.state.opponents, createdOpponent]
                const newSelectedOpponents = [...this.state.selectedPlayers, createdOpponent]
                this.setState({
                    opponents: newOpponents,
                    selectedPlayers: newSelectedOpponents
                })
            })
            .catch(err => {
                this.setState({ errorMessage: 'Sorry, something went wrong' })
                console.error(err)
            })
    }

    createNewBall(name) {
        const newBall = {
            name
        }
        fetch('/api/user/balls', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(newBall)
        })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(createdBall => {
                console.log('created ball', createdBall, this.state.selectedBalls)
                const newBalls = [...this.state.balls, createdBall]
                const newSelectedBalls = [...this.state.selectedBalls, createdBall]
                console.log('new selected balls', newSelectedBalls)
                this.setState({
                    balls: newBalls,
                    selectedBalls: newSelectedBalls
                })
            })
            .catch(err => {
                this.setState({ errorMessage: 'Sorry, something went wrong' })
                console.error(err)
            })
    }

    handleTimePlayedChange(newTime) {
        console.log('new time changed', newTime)
        this.setState({
            timePlayed: newTime
        })
    }

    saveGame() {
        this.setState({
            successMessage: '',
            errorMessage: ''
        })
        if (this.state.isNew) {
            const ballIds = this.state.selectedBalls.map(ball => ball._id)
            const playerIds = this.state.selectedPlayers.map(player => player._id)
            const newGame = {
                ...this.state.game,
                timePlayed: this.state.timePlayed,
                ballsUsed: ballIds,
                players: playerIds
            }
            console.log('posting new game', newGame)
            fetch(`/api/session/${this.props.match.params.sessionId}/game`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify(newGame)
            })
                .then(res => {
                    if (!res.ok) throw res
                    return res.json()
                })
                .then(createdGame => {
                    console.log('created game', createdGame)
                    this.setState({
                        isNew: false,
                        successMessage: 'Game created successfully',
                        game: createdGame
                    })
                })
                .catch(err => {
                    this.setState({ errorMessage: 'Sorry, something went wrong' })
                    console.error(err)
                })
        }
        else if (this.state.game) {
            const ballIds = this.state.selectedBalls.map(ball => ball._id)
            const playerIds = this.state.selectedPlayers.map(player => player._id)
            const newGame = {
                ...this.state.game,
                timePlayed: this.state.timePlayed,
                ballsUsed: ballIds,
                players: playerIds
            }
            console.log('updating game', newGame)
            fetch(`/api/session/${this.props.match.params.sessionId}/game/${this.state.game._id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'put',
                body: JSON.stringify(newGame)
            })
                .then(res => {
                    if (!res.ok) throw res
                    return res.json()
                })
                .then(createdGame => {
                    this.getGame(createdGame._id)
                    this.setState({ successMessage: 'Game saved' })
                })
                .catch(err => console.error(err))
        }
    }

    render() {
        if (this.state.isLoading) {
            return <Loading />
        }
        return (
            <div className="container" >
                <Breadcrumbs
                    links={[
                        { name: 'Home', address: '/' },
                        { name: 'Session', address: `/session/${this.props.match.params.sessionId}` }
                    ]}
                    currentPage="Game"
                />
                <hr></hr>
                <div className="row">
                    <div className="col-sm-10">
                        <div>
                            <h4>Game</h4>

                            <p>Setup the game how it was played</p>
                        </div>
                    </div>
                    <div className="col-sm-2 float-sm-right">
                        <button type="button" onClick={this.saveGame.bind(this)} className="btn btn-outline-dark btn-lg float-right">Save</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        {this.state.successMessage ? (<div className="alert alert-success" role="alert">
                            {this.state.successMessage}
                        </div>) : null}
                        {this.state.errorMessage ? (<div className="alert alert-success" role="alert">
                            {this.state.errorMessage}
                        </div>) : null}
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div style={{ height: "100%", verticalAlign: 'center' }} className="col-md-2">
                        <label>Time Played</label>
                    </div>
                    <div className="col-md-10">
                        <DateTimePicker
                            className="datetime"
                            onChange={this.handleTimePlayedChange.bind(this)}
                            value={this.state.timePlayed}
                        />
                    </div>
                </div>
                <hr />
                <div className="row">

                    <div className="col-md-2">
                        <label for="opponents">Opponents</label>
                    </div>
                    <div className="col-md-10">

                        <CreatableSelect
                            isMulti
                            name="colors"
                            options={this.state.opponents.map(opp => ({ label: opp.name, value: opp._id }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            id="opponents"
                            onChange={this.handleOpponentsChange.bind(this)}
                            value={this.state.selectedPlayers.map(player => ({ label: player.name, value: player._id }))}

                        />
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-md-2">
                        <label for="balls">Balls</label>
                    </div>
                    <div className="col-md-10">
                        <CreatableSelect
                            isMulti
                            name="colors"
                            options={this.state.balls.map(ball => ({ label: ball.name, value: ball._id }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            id="balls"
                            onChange={this.handleBallsUsedChange.bind(this)}
                            value={this.state.selectedBalls.map(ball => ({ label: ball.name, value: ball._id }))}

                        />
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col text-center">
                        <h3>Total Score: {this.state.totalScore}</h3>
                    </div>
                </div>
                <Frames setFrames={this.setFrames} frames={this.state.game.frames}/>
            </div>
        )
    }
}

export default Game;
