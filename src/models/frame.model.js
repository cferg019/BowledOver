const { Schema, model } = require('mongoose')
const joi = require('joi')

const validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const validScores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '/', 'X']

const joiSchema = joi.object().keys({
    number: joi.number().valid(validNumbers),
    scores: joi.array().items(joi.any().valid(validScores)).max(3)
})

const frameSchema = new Schema({
    number: {type: Number, enum: validNumbers, required: true },
    scores: {type: array, items: { type: any, enum: validScores }, maxlength: 3 }
})

module.exports = {
    mongooseSchema: frameSchema,
    joiSchema
}

