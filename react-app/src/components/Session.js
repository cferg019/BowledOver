import React, { Component } from 'react';
import Jumbotron from './Jumbotron'
import { Link } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import Loading from './Loading'
import Breadcrumbs from './Breadcrumbs'
import './Session.css'

const alleyChoices = [
    { value: 'Brookfield Lanes', label: 'Brookfield Lanes' },
    { value: "Lori's Lanes", label: "Lori's Lanes" }
]


class Session extends Component {
    state = {
        isNew: false,
        session: {
            alley: {},
            games: []
        },
        alleys: [],
        opponents: [],
        selectedAlley: {},
        isLoading: true,
        successMessage: '',
        errorMessage: ''
    }

    componentDidMount() {
        console.log(this.props.match.params.sessionId)
        if (this.props.match.params.sessionId === 'new') {
            this.setState({ isNew: true })
            fetch('/api/user/alleys')
                .then(res => {
                    if (!res.ok) throw res
                    return res.json()
                })
                .then(alleys => {
                    console.log('got the alleys', alleys)
                    this.setState({ alleys, isLoading: false })
                })
                .catch(err => console.error(err))
        } else {
            this.getSession(this.props.match.params.sessionId)
        }
    }

    getSession(sessionId) {
        let tmpAlleys;
        fetch('/api/user/alleys')
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(alleys => {
                tmpAlleys = alleys
                console.log('got the alleys', alleys)
                this.setState({ alleys })
                return fetch('/api/user/common-opponents')
            })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(opponents => {
                this.setState({ opponents })
                return fetch(`/api/session/${sessionId}`)
            })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(session => {
                session.alley = tmpAlleys.find(alley => alley._id === session.alleyId)
                console.log('got session', session)

                this.setState({
                    session,
                    selectedAlley: session.alley,
                    isLoading: false
                })
            })
            .catch(err => console.error(err))
    }



    handleAlleysChange(newValue, actionMeta) {
        if (actionMeta.action === 'create-option') {
            this.createNewAlley(newValue.value)
            console.log('creating new alley', newValue)
        } else {
            if (newValue) {
                this.setState({ selectedAlley: this.state.alleys.find(alley => alley._id === newValue.value) })
            } else {
                this.setState({ selectedAlley: {} })
            }
        }
    }

    createNewAlley(name) {
        const newAlley = {
            name
        }
        fetch('/api/user/alleys', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(newAlley)
        })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(createdAlley => {
                console.log('created alley', createdAlley)
                const newAlleys = [...this.state.alleys, createdAlley]
                this.setState({
                    alleys: newAlleys,
                    selectedAlley: createdAlley
                })
            })
            .catch(err => {
                this.setState({ errorMessage: 'Sorry, something went wrong' })
                console.error(err)
            })
    }

    saveSession() {
        this.setState({
            successMessage: '',
            errorMessage: ''
        })
        if (this.state.isNew && this.state.selectedAlley) {
            const alleyId = this.state.selectedAlley._id
            const newSession = {
                alleyId
            }
            console.log('posting new session', newSession)
            fetch('/api/session', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify(newSession)
            })
                .then(res => {
                    if (!res.ok) throw res
                    return res.json()
                })
                .then(createdSession => {
                    console.log('created session', createdSession)
                    this.setState({
                        isNew: false,
                        successMessage: 'Session created successfully',
                        session: createdSession
                    })
                })
                .catch(err => {
                    this.setState({ errorMessage: 'Sorry, something went wrong' })
                    console.error(err)
                })
        }
        else if (this.state.session && this.state.selectedAlley) {
            const alleyId = this.state.selectedAlley._id
            const newSession = {
                ...this.state.session,
                alleyId,
                alley: undefined // get rid of this
            }
            console.log('updating session', newSession)
            fetch(`/api/session/${this.state.session._id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'put',
                body: JSON.stringify(newSession)
            })
                .then(res => {
                    if (!res.ok) throw res
                    return res.json()
                })
                .then(createdSession => {
                    this.getSession(createdSession._id)
                    this.setState({ successMessage: 'Session saved' })
                })
                .catch(err => console.error(err))
        }
    }

    render() {
        if (this.state.isLoading) {
            return <Loading />
        }
        return (
            <div className="container">
                <Breadcrumbs
                    links={[
                        { name: 'Home', address: '/' },
                    ]}
                    currentPage="Session"
                />
                <hr></hr>
                <div className="row">
                    <div className="col-sm-8 offset-md-1">
                        <div>
                            <h4>Pick an Alley</h4>
                            <p>Select an alley from the drop down below, or type to add a new one</p>
                        </div>
                    </div>
                    <div className="col-sm-2 float-sm-right">
                        <button type="button" onClick={this.saveSession.bind(this)} className="btn btn-outline-dark btn-lg float-right">Save</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-10 offset-md-1">
                        {this.state.successMessage ? (<div className="alert alert-success" role="alert">
                            {this.state.successMessage}
                        </div>) : null}
                        {this.state.errorMessage ? (<div className="alert alert-success" role="alert">
                            {this.state.errorMessage}
                        </div>) : null}
                    </div>
                </div>
                <div className="row">
                    <div className='col-md-10 offset-md-1'>
                        <CreatableSelect
                            isClearable
                            name="colors"
                            options={this.state.alleys.map(alley => ({ label: alley.name, value: alley._id }))}
                            classNamePrefix="select"
                            id="alleys"
                            onChange={this.handleAlleysChange.bind(this)}
                            value={{ label: this.state.selectedAlley.name, value: this.state.selectedAlley._id }}
                        />
                    </div>
                </div>
                <hr />
                {this.state.isNew ? null : (
                    <div>
                        <div className="row">
                            <div className='col-md-10 offset-md-1'>
                                <h4>Games</h4>
                                <table className="table">
                                    <tbody>
                                        {this.state.session.games.map(game => {
                                            const date = new Date(game.timePlayed).toLocaleTimeString()
                                            return (
                                                <tr key={`game-${game._id}`}>
                                                    <td>{date}</td>
                                                    <td>vs. {game.players.map(playerId => this.state.opponents.find(opp => opp._id === playerId).name).join(', ')}</td>
                                                    <td>Score: {game.totalScore}</td>
                                                    <td>
                                                        <Link className="new-session" to={`/session/${this.state.session._id}/game/${game._id}`}>
                                                            <button type="button" className="btn btn-light">Edit</button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className='col-md-10 offset-md-1'>
                                <Link className="new-session" to={`/session/${this.state.session._id}/game/new`}>
                                    <button type="button" className="btn btn-outline-dark">Start New Game</button>
                                </Link>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                )}
            </div>
        )
    }
}

export default Session;