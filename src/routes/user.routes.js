const { Router } = require('express')
const { model: User, joiSchema: userJoiSchema } = require('../models/user.model')
const joi = require('joi')

const router = Router()

// Delete me
// router.get('/', (req, res) => {
//     res.send('Hello Casey')
// })

// Get user by id
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId)
        if (!user) return res.status(404).send('Not Found')
        res.json(user)
    } catch (err) {
        next(err)
    }
})

// Modify user
router.put('/:id', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, userJoiSchema)
        if (error) return res.status(400).json(error)
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, value, { new: true })
        if (!updatedUser) return res.status(404).send('Not Found')
        res.json(updatedUser)
    } catch (err) {
        next(err)
    }
})
// Delete user
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedUser = await User.findOneAndDelete({ _id: req.params.id })
        if (!deletedUser) return res.status(404).send('Not Found')
        res.send('Deleted')
    } catch (err) {
        next(err)
    }
})

module.exports = router
