const { Router } = require('express')
const { model: User, joiSchema: userJoiSchema } = require('../models/user.model')
const joi = require('joi')

const router = Router()

router.post('/', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, userJoiSchema)
        if (error) return res.status(400).json(error)
        const newUser = await User.create(value)
        res.json(newUser)
    } catch (err) {
        next(err)
    }
})

router.get('/', (req, res) => {
    res.send('Hello Casey')
})

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.json(user)
    } catch (err) {
        next(err)
    }
})

module.exports = router