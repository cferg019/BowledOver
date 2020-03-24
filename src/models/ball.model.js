const { Schema, model } = require('mongoose')
const joi = require('joi')

const joiSchema = joi.object().keys({
    name: joi.string().min(3).max(50).required(),
    weight: joi.number()
})

const ballSchema = new Schema({
    name: { type: String, minlength: 3, maxlength: 50, required: true },
    weight: { type: Number }
})

module.exports = {
    mongooseSchema: ballSchema,
    joiSchema
}