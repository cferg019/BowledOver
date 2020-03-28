const { Schema, model } = require('mongoose')
const { mongooseSchema: BallSchema, joiSchema: ballJoiSchema } = require('./ball.model')
const { mongooseSchema: AlleySchema, joiSchema: alleyJoiSchema } = require('./alley.model')
const { mongooseSchema: OpponentSchema, joiSchema: opponentJoiSchema } = require('./ball.model')
const joi = require('joi')
const bcrypt = require('bcrypt')

const joiSchema = joi.object().keys({
    _id: joi.string().length(24),
    email: joi.string().email().required(),
    firstName: joi.string().min(3).max(50).required(),
    lastName: joi.string().min(3).max(50).required(),
    password: joi.string().min(8).max(255).required(),
    balls: joi.array().items(ballJoiSchema),
    alleys: joi.array().items(alleyJoiSchema),
    commonOpponents: joi.array().items(opponentJoiSchema)
})

const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, select: false },
    balls: [BallSchema],
    alleys: [AlleySchema],
    commonOpponents: [OpponentSchema]
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    try {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
      return next()
    } catch (err) {
      return next(err)
    }
})

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

module.exports = {
    model: model('User', userSchema),
    joiSchema
}