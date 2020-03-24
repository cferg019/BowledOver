const { Schema, model } = require('mongoose')
const { mongooseSchema: BallSchema, joiSchema: ballJoiSchema} = require('./ball.model')
const { mongooseSchema: AlleySchema, joiSchema: alleyJoiSchema} = require('./alley.model')
const { mongooseSchema: OpponentSchema, joiSchema: opponentJoiSchema} = require('./ball.model')
const joi = require('joi')

const joiSchema = joi.object().keys({
    email: joi.string().email().required(),
    firstName: joi.string().min(3).max(50).required(),
    lastName: joi.string().min(3).max(50).required(),
    balls: joi.array().items(ballJoiSchema),
    alleys: joi.array().items(alleyJoiSchema),
    commonOpponents: joi.array().items(opponentJoiSchema)
})

const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    balls: [BallSchema],
    alleys: [AlleySchema],
    commonOpponents: [OpponentSchema]
})

module.exports = {
    model: model('User', userSchema),
    joiSchema
}