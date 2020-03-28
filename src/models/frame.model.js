const { Schema, model } = require('mongoose')
const joi = require('joi')

const validFrameNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const validScores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '/', 'X']

const joiSchema = joi.object().keys({
    _id: joi.string().length(24),
    number: joi.number().valid(validFrameNumbers).required(),
    scores: joi.array().items(joi.any().valid(validScores)).max(3).required()
})

const frameSchema = new Schema({
    number: {type: Number, enum: validFrameNumbers, required: true },
    scores: {type: Array, items: { type: Schema.Types.Mixed, enum: validScores }, maxlength: 3 }
})

module.exports = {
    mongooseSchema: frameSchema,
    joiSchema
}

