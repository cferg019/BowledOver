const { Router } = require('express')
const { model: User, joiSchema: userJoiSchema } = require('../models/user.model')
const { joiSchema: ballJoiSchema } = require('../models/ball.model')
const joi = require('joi')

const router = Router()

// Get all balls for user
router.get('/balls', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('Not Found')
        res.json(user.balls)
    } catch (err) {
        next(err)
    }
})

// Get a single ball for a user
router.get('/balls/:ballId', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('User Not Found')
        const theBall = user.balls.find(ball => ball._id.toString() === req.params.ballId)
        if (!theBall) return res.status(404).send('Ball Not Found for User')
        res.json(theBall)
    } catch (err) {
        next(err)
    }
})

router.post('/balls', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, ballJoiSchema)
        if (error) return res.status(400).json(error)
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('User Not Found')
        // Get all of the current ball ids
        const currentBallIds = user.balls.map(ball => ball._id.toString())
        // Add the new ball and save
        user.balls.push(value)
        const updatedUser = await user.save()
        // Find the new ball in the updated user by finding one that has a new ID
        const theNewBall = updatedUser.balls.find(ball => !currentBallIds.includes(ball._id.toString()))
        res.json(theNewBall)
    } catch (err) {
        next(err)
    }
})



router.put('/balls/:ballId', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, ballJoiSchema)
        if (error) return res.status(400).json(error)
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.id, "balls._id": req.params.ballId },
            {
                $set: {
                    "balls.$": value
                }
            },
            { new: true }
        )
        if (!updatedUser) return res.status(404).send('Not Found')
        const theUpdatedBall = updatedUser.balls.find(ball => ball._id.toString() === req.params.ballId)
        res.json(theUpdatedBall)
    } catch (err) {
        next(err)
    }
})

router.delete('/balls/:ballId', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('Not Found')
        if (!user.balls.find(b => b._id.toString() === req.params.ballId)) {
            return res.status(404).send('Not found')
        }
        user.balls.pull({ _id: req.params.ballId})
        await user.save()
        res.send('Deleted')
    } catch (err) {
        next(err)
    }
})

module.exports = router