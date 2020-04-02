const { Schema, model } = require('mongoose')
const { mongooseSchema: FrameSchema, joiSchema: frameJoiSchema} = require('./frame.model')
const joi = require('joi')
const { getTotalScore } = require('../services/bowling-service')

const joiSchema = joi.object().keys({
    _id: joi.string().length(24),
    timePlayed: joi.date().default(() => new Date(), 'The time the game was played'),
    ballsUsed: joi.array().items(joi.string().length(24)), //Object Id
    players: joi.array().items(joi.string().length(24)), //Object id
    frames: joi.array().items(frameJoiSchema).max(10).required()
})

const gameSchema = new Schema({
    timePlayed: { type: Date },
    ballsUsed: [{ type: Schema.Types.ObjectId }],
    players: [{ type: Schema.Types.ObjectId }],
    frames: [FrameSchema]
})

gameSchema.virtual('totalScore').get(function() {
    console.log('got to the virtual', getTotalScore(this.frames))
    return getTotalScore(this.frames)
})

gameSchema.set('toJSON', {virtuals: true})

module.exports = {
    mongooseSchema: gameSchema,
    joiSchema
}