const { Router } = require('express')
const { model: User, joiSchema: userJoiSchema } = require('../models/user.model')
const { joiSchema: alleyJoiSchema } = require('../models/alley.model')
const joi = require('joi')

const router = Router()

// Get all alleys for user
router.get('/alleys', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('Not Found')
        res.json(user.alleys)
    } catch (err) {
        next(err)
    }
})

// Get a single alley for a user
router.get('/alleys/:alleyId', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('User Not Found')
        const theAlley = user.alleys.find(alley => alley._id.toString() === req.params.alleyId)
        if (!theAlley) return res.status(404).send('Alley Not Found for User')
        res.json(theAlley)
    } catch (err) {
        next(err)
    }
})

router.post('/alleys', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, alleyJoiSchema)
        if (error) return res.status(400).json(error)
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('User Not Found')
        // Get all of the current alley ids
        const currentAlleyIds = user.alleys.map(alley => alley._id.toString())
        // Add the new alley and save
        user.alleys.push(value)
        const updatedUser = await user.save()
        // Find the new alley in the updated user by finding one that has a new ID
        const theNewAlley = updatedUser.alleys.find(alley => !currentAlleyIds.includes(alley._id.toString()))
        res.json(theNewAlley)
    } catch (err) {
        next(err)
    }
})



router.put('/alleys/:alleyId', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, alleyJoiSchema)
        if (error) return res.status(400).json(error)
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user.id, "alleys._id": req.params.alleyId },
            {
                $set: {
                    "alleys.$": value
                }
            },
            { new: true }
        )
        if (!updatedUser) return res.status(404).send('Not Found')
        const theUpdatedAlley = updatedUser.alleys.find(alley => alley._id.toString() === req.params.alleyId)
        res.json(theUpdatedAlley)
    } catch (err) {
        next(err)
    }
})

router.delete('/alleys/:alleyId', async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send('Not Found')
        if (!user.alleys.find(b => b._id.toString() === req.params.alleyId)) {
            return res.status(404).send('Not found')
        }
        user.alleys.pull({ _id: req.params.alleyId})
        await user.save()
        res.send('Deleted')
    } catch (err) {
        next(err)
    }
})

module.exports = router