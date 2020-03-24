const { Schema, model } = require('mongoose')
const { mongooseSchema: FrameSchema, joiSchema: gameJoiSchema} = require('./frame.model')
const joi = require('joi')

const joiSchema = joi.object().keys({
    timePlayed: joi.date(),
    ballsUsed: joi.array().items(joi.string().length(24)), //Object Id
    players: joi.array().items(joi.string().length(24)), //Object id
    frames: joi.array().items(gameJoiSchema).max(10)
})

const gameSchema = new Schema({
    timePlayed: { type: Date },
    ballsUsed: [{ type: Schema.Types.ObjectId }],
    players: [{ type: Schema.Types.ObjectId }],
    frame: [FrameSchema]
})

module.exports = {
    mongooseSchema: gameSchema,
    joiSchema
}