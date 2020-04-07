
const getTotalScore = frames => {
    const sortedFrames = frames
        .sort((a, b) => (a.number > b.number) ? 1 : -1)
    const allScores = []
    for (const frame of sortedFrames) {
        for (const score of frame.scores) {
            allScores.push({
                number: frame.number,
                score
            })
        }
    }
    return calculateScores(allScores)
}

function calculateScores(scores) {
    let totalScore = 0
    let scoreMultiplier = []
    for (let i = 0; i < scores.length; i++) {
        let numberOfPins = scores[i].score
        let scoreMultiplierToAdd = 0
        if (scores[i].score === '/') {
            // The previous should always be a number
            numberOfPins = 10 - scores[i - 1].score
            scoreMultiplierToAdd = 1
        }
        if (scores[i].score === 'X') {
            numberOfPins = 10
            scoreMultiplierToAdd = 2
            // console.log('its a strike multiplier is', scoreMultiplier)
        }
        // console.log('frame number, ', scores[i].number, 'score,', scores[i].score, 'number of pins', numberOfPins)
        totalScore += numberOfPins
        for (let j = 0; j < scoreMultiplier.length; j++) {
            if (scoreMultiplier[j] > 0) {
                totalScore += numberOfPins
                scoreMultiplier[j]--
            }
        }
        if (scores[i].number < 10) {
            scoreMultiplier.push(scoreMultiplierToAdd)
        }
    }
    return totalScore
}

const getHighScore = sessions => {
    if (!sessions) return 0
    // console.log('sessions', sessions)
    const allGames = sessions.reduce((accum, session) => {
        return [...accum, ...session.games]
    }, [])
        .map(game => game.toObject()) // so we get the total score
    const sorted = allGames.sort((a, b) => (b.totalScore > a.totalScore) ? 1 : -1)
    return sorted[0].totalScore
}

const getLowestScore = sessions => {
    if (!sessions) return 0
    // console.log('sessions', sessions)
    const allGames = sessions.reduce((accum, session) => {
        return [...accum, ...session.games]
    }, [])
        .map(game => game.toObject()) // so we get the total score
    const sorted = allGames.sort((a, b) => (a.totalScore > b.totalScore) ? 1 : -1)
    return sorted[0].totalScore
}

const getAverageScore = sessions => {
    if (!sessions) return 0
    // console.log('sessions', sessions)
    const allGames = sessions.reduce((accum, session) => {
        return [...accum, ...session.games]
    }, [])
        .map(game => game.toObject()) // so we get the total score
    const totalOfAllScores = allGames.reduce((accum, game) => {
        return accum + game.totalScore
    }, 0)
    return parseFloat((totalOfAllScores / allGames.length).toFixed(2))
}

const getPlayerYouDoTheBestAgainst = (sessions, opponents) => {
    if (!sessions || !opponents) return 'N/A'
    const allGames = sessions.reduce((accum, session) => {
        return [...accum, ...session.games]
    }, [])
        .map(game => game.toObject()) // so we get the total score
    // Hold all of the opponents in a map
    const opponentMap = opponents.reduce((accum, opp) => {
        const newObj = {
            ...accum,
            [opp._id.toString()]: {
                ...opp.toObject(),
                allScores: []
            }
        }
        return newObj
    }, {})
    for (const game of allGames) {
        for (const oppId of game.players) {
            if (opponentMap[oppId.toString()]) {
                opponentMap[oppId.toString()].allScores.push(game.totalScore)
            }
        }
    }
    let bestScore = -1
    let bestPlayer = 'N/A'
    for (const oppId of Object.keys(opponentMap)) {
        const totalScores = opponentMap[oppId].allScores.reduce((accum, score) => accum + score, 0)
        const average = parseFloat((totalScores / opponentMap[oppId].allScores.length).toFixed(2))
        console.log(opponentMap[oppId].name, 'has average of', average)
        if (bestScore < average) {
            bestPlayer = opponentMap[oppId].name
            bestScore = average
        }
    }
    return bestPlayer
}

const getPlayerYouDoTheWorstAgainst = (sessions, opponents) => {
    if (!sessions || !opponents) return 'N/A'
    const allGames = sessions.reduce((accum, session) => {
        return [...accum, ...session.games]
    }, [])
        .map(game => game.toObject()) // so we get the total score
    // Hold all of the opponents in a map
    const opponentMap = opponents.reduce((accum, opp) => {
        const newObj = {
            ...accum,
            [opp._id.toString()]: {
                ...opp.toObject(),
                allScores: []
            }
        }
        return newObj
    }, {})
    for (const game of allGames) {
        for (const opp of game.players) {
            console.log('player', opp, opp.toString())
            if (opponentMap[opp.toString()]) {
                console.log('we found it')
                opponentMap[opp.toString()].allScores.push(game.totalScore)
            }
        }
    }
    let worstScore = 301;
    let bestPlayer = 'N/A'
    for (const oppId of Object.keys(opponentMap)) {
        const totalScores = opponentMap[oppId].allScores.reduce((accum, score) => accum + score, 0)
        const average = parseFloat((totalScores / opponentMap[oppId].allScores.length).toFixed(2))
        console.log(opponentMap[oppId].name, 'has average of', average)
        if (worstScore > average) {
            bestPlayer = opponentMap[oppId].name
            worstScore = average
        }
    }
    return bestPlayer
}

const getMostCommonOpponent = (sessions, opponents) => {
    if (!sessions || !opponents) return 'N/A'
    const allGames = sessions.reduce((accum, session) => {
        return [...accum, ...session.games]
    }, [])
        .map(game => game.toObject()) // so we get the total score
    const opponentMap = opponents.reduce((accum, opp) => {
        const newObj = {
            ...accum,
            [opp._id.toString()]: {
                ...opp.toObject(),
                gamesPlayed: 0
            }
        }
        return newObj
    }, {})
    for (const game of allGames) {
        for (const oppId of game.players) {
            if (opponentMap[oppId.toString()]) {
                opponentMap[oppId.toString()].gamesPlayed = opponentMap[oppId.toString()].gamesPlayed + 1
            }
        }
    }
    let mostGamesPlayed = -1;
    let mostCommonPlayer = 'N/A'
    for (const oppId of Object.keys(opponentMap)) {
        const gamesPlayed = opponentMap[oppId].gamesPlayed
        if (mostGamesPlayed < gamesPlayed) {
            mostCommonPlayer = opponentMap[oppId].name
            mostGamesPlayed = gamesPlayed
        }
    }
    return mostCommonPlayer
}

module.exports = {
    getTotalScore,
    getHighScore,
    getLowestScore,
    getAverageScore,
    getPlayerYouDoTheBestAgainst,
    getPlayerYouDoTheWorstAgainst,
    getMostCommonOpponent
}