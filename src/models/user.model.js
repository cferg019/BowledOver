const { Schema, model } = require('mongoose')
const joi = require('joi')

const joiSchema = joi.object().keys({
    email: joi.string().email().required(),
    firstName: joi.string().min(3).max(50).required(),
    lastName: joi.string().min(3).max(50).required()
})

const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
})

module.exports = {
    model: model('User', userSchema),
    joiSchema
}