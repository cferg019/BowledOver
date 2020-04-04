
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
            console.log('its a strike multiplier is', scoreMultiplier)
        }
        console.log('frame number, ', scores[i].number, 'score,', scores[i].score, 'number of pins', numberOfPins)
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

module.exports = {
    getTotalScore
}