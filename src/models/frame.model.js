const { Schema, model } = require('mongoose')
const joi = require('joi')

const validFrameNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const validScores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '/', 'X']

const joiSchema = joi.object().keys({
    _id: joi.string().length(24),
    number: joi.number().valid(validFrameNumbers).required(),
    scores: joi.array().items(joi.any().valid(validScores)).max(3).required()
})

const frameSchema = new Schema({
    number: { type: Number, enum: validFrameNumbers, required: true },
    scores: { type: Array, items: { type: Schema.Types.Mixed, enum: validScores }, maxlength: 3 }
})

const allScoresAreNumbers = (scores) => {
    console.log('looking for scores', scores)
    return !scores.find(score => isNaN(score))
}

const combinedScores = (scores) => {
    return scores
        .reduce((accum, score) => {
            let newScore = score
            if (score === 'X') newScore = 10
            if (score === '/') newScore = 10 - accum
            return accum + Number(newScore)
        }, 0)
}

const atLeastOneScoreIsAStrike = scores => {
    return scores.find(score => score === 'X')
}

const hasAnyRepeatingSpares = scores => {
    let prevScore = 0
    for (const score of scores) {
        if (score === '/' && prevScore === '/') {
            return true
        } 
        prevScore = score
    }
    return false
}

frameSchema.pre('validate', function (next) {
    const err = new Error('Invalid scores ' + this.scores + ' for frame ' + this.number)
    if (this.number !== 10) {
        if (this.scores.length > 2) {
            return next(err)
        }
        if (this.scores[0] === '/') {
            return next(err)
        }
        if (atLeastOneScoreIsAStrike(this.scores) && this.scores.length > 1) {
            return next(err)
        }
        if (allScoresAreNumbers(this.scores) && combinedScores(this.scores) > 9) {
            return next(err)
        }
        if (combinedScores(this.scores) > 10) {
            return next(err)
        }
        if (hasAnyRepeatingSpares(this.scores)) {
            return next(err)
        }
    }
    if (this.number === 10) {
        if (allScoresAreNumbers(this.scores) && this.scores.length > 2) {
            console.log('No good, too many numbers')
            return next(err)
        }
        if (this.scores[0] === '/') {
            return next(err)
        }
        if (this.scores.length === 1) {
            console.log('too few scores')
            return next(err)
        }
        if (this.scores.length === 2) {
            if (!allScoresAreNumbers(this.scores)) {
                console.log('unfinished')
                return next(err)
            }
            if (allScoresAreNumbers(this.scores) && combinedScores(this.scores) > 9) {
                console.log('too high score')
                return next(err)
            }
        }
        if (hasAnyRepeatingSpares(this.scores)) {
            return next(err)
        }
    }
    next()
})

module.exports = {
    mongooseSchema: frameSchema,
    joiSchema
}

