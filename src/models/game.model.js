const { Schema, model } = require('mongoose')
const { mongooseSchema: FrameSchema, joiSchema: frameJoiSchema} = require('./frame.model')
const joi = require('joi')

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

module.exports = {
    mongooseSchema: gameSchema,
    joiSchema
}