const { Router } = require('express')
const { model: User, joiSchema: userJoiSchema } = require('../models/user.model')
const { joiSchema: opponentJoiSchema } = require('../models/opponent.model')
const joi = require('joi')

const router = Router()

// Get all opponents for user
router.get('/common-opponents', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('Not Found')
        res.json(user.commonOpponents)
    } catch (err) {
        next(err)
    }
})

// Get a single opponent for a user
router.get('/common-opponents/:opponentId', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('User Not Found')
        const theOpponent = user.commonOpponents.find(opponent => opponent._id.toString() === req.params.opponentId)
        if (!theOpponent) return res.status(404).send('Opponent Not Found for User')
        res.json(theOpponent)
    } catch (err) {
        next(err)
    }
})

router.post('/common-opponents', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, opponentJoiSchema)
        if (error) return res.status(400).json(error)
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('User Not Found')
        // Get all of the current opponent ids
        const currentOpponentIds = user.commonOpponents.map(opponent => opponent._id.toString())
        // Add the new opponent and save
        user.commonOpponents.push(value)
        const updatedUser = await user.save()
        // Find the new opponent in the updated user by finding one that has a new ID
        const theNewOpponent = updatedUser.commonOpponents.find(opponent => !currentOpponentIds.includes(opponent._id.toString()))
        res.json(theNewOpponent)
    } catch (err) {
        next(err)
    }
})



router.put('/common-opponents/:opponentId', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, opponentJoiSchema)
        if (error) return res.status(400).json(error)
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.id, "commonOpponents._id": req.params.opponentId },
            {
                $set: {
                    "commonOpponents.$": value
                }
            },
            { new: true }
        )
        if (!updatedUser) return res.status(404).send('Not Found')
        const theUpdatedOpponent = updatedUser.commonOpponents.find(opponent => opponent._id.toString() === req.params.opponentId)
        res.json(theUpdatedOpponent)
    } catch (err) {
        next(err)
    }
})

router.delete('/:userId/common-opponents/:opponentId', async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('Not Found')
        if (!user.commonOpponents.find(b => b._id.toString() === req.params.opponentId)) {
            return res.status(404).send('Not found')
        }
        user.commonOpponents.pull({ _id: req.params.opponentId})
        await user.save()
        res.send('Deleted')
    } catch (err) {
        next(err)
    }
})

module.exports = router