import React, { Component } from 'react';
import Jumbotron from './Jumbotron'
import { Link } from 'react-router-dom'
import Loading from './Loading'

class Home extends Component {
    state = {
        topScore: 0,
        lowestScore: 0,
        averageScore: 0,
        playerYouDoTheBestAgainst: "N/A",
        playerYouDoTheWorstAgainst: "N/A",
        mostCommonOpponent: "N/A",
        sessions: [],
        alleys: [],
        isLoading: true
    }

    componentWillMount() {
        fetch('/api/user/stats')
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(stats => {
                console.log('got stats', stats)
                this.setState({
                    ...stats
                })
            })
            .catch(err => console.error(err))
        let tmpAlleys;
        fetch('/api/user/alleys')
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(alleys => {
                tmpAlleys = alleys
                return fetch('/api/session')
            })
            .then(res => {
                if (!res.ok) throw res
                return res.json()
            })
            .then(sessions => {
                console.log('got sessions', sessions)
                sessions.forEach(session => {
                    session.alley = tmpAlleys.find(alley => alley._id === session.alleyId)
                })
                this.setState({
                    sessions,
                    isLoading: false
                })
            })
            .catch(err => console.error(err))
    }

    render() {
        if (this.state.isLoading) {
            return <Loading />
        }
        return (
            <div className='container'>
                <Jumbotron />
                <h3>Stats</h3>
                <table className="table">
                    <tbody>
                        <tr>
                            <td>High Score</td>
                            <td>{this.state.topScore}</td>
                        </tr>
                        <tr>
                            <td>Average Score</td>
                            <td>{this.state.averageScore}</td>
                        </tr>
                        <tr>
                            <td>Low Score</td>
                            <td>{this.state.lowestScore}</td>
                        </tr>
                        <tr>
                            <td>Most Common Opponent</td>
                            <td>{this.state.mostCommonOpponent}</td>
                        </tr>
                        <tr>
                            <td>Opponent You Play Best Against</td>
                            <td>{this.state.playerYouDoTheBestAgainst}</td>
                        </tr>
                        <tr>
                            <td>Opponent You Play Worst Again</td>
                            <td>{this.state.playerYouDoTheWorstAgainst}</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Sessions</h3>
                <table className="table">
                    <tbody>
                        {this.state.sessions.map(session => {
                            if (!session.alley) return null
                            const date = (session.games.length > 0) ?
                                new Date(session.games[0].timePlayed).toLocaleDateString() :
                                'Date not available'
                            return (
                                <tr>
                                    <td>{session.alley.name}</td>
                                    <td>{date}</td>
                                    <td>{session.games.length} Games played</td>
                                    <td>
                                        <Link className="new-session" to={`/session/${session._id}`}>
                                            <button type="button" class="btn btn-light">Edit</button>
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <hr></hr>
                <Link className="new-session" to="/session/new">
                    <button type="button" className="btn btn-outline-dark">Start New Session</button>
                </Link>

            </div>
        );
    }
}

export default Home;
// export default Home