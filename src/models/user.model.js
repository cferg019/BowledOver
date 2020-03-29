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
    isVerified: joi.bool(),
    verificationToken: joi.string(),
    balls: joi.array().items(ballJoiSchema),
    alleys: joi.array().items(alleyJoiSchema),
    commonOpponents: joi.array().items(opponentJoiSchema)
})

const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    balls: [BallSchema],
    alleys: [AlleySchema],
    commonOpponents: [OpponentSchema]
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next()
    try {
      const salt = bcrypt.genSaltSync(10)
      this.password = bcrypt.hashSync(this.password, salt)
      return next()
    } catch (err) {
      return next(err)
    }
})

userSchema.statics.comparePassword = function(candidatePassword, existingPassword) {
    return bcrypt.compareSync(candidatePassword, existingPassword)
}

// userSchema.methods.comparePassword = function(candidatePassword) {
//     console.log('comparing hashes', this.password, candidatePassword)
//     return bcrypt.compareSync(candidatePassword, this.password)
// }

module.exports = {
    model: model('User', userSchema),
    joiSchema
}