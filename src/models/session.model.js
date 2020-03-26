const { Schema, model } = require('mongoose')
const { mongooseSchema: GameSchema, joiSchema: gameJoiSchema} = require('./game.model')
const joi = require('joi')

const joiSchema = joi.object().keys({
    _id: joi.string().length(24),
    userId: joi.string().length(24).required(),
    alleyId: joi.string().length(24),
    games: joi.array().items(gameJoiSchema)
})

const sessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    alleyId: { type: Schema.Types.ObjectId },
    games: [GameSchema]
})

module.exports = {
    model: model('Session', sessionSchema),
    joiSchema
}