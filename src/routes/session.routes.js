const { Router } = require('express')
const { model: Session, joiSchema: sessionJoiSchema } = require('../models/session.model')
const joi = require('joi')
// const ballRoutes = require('./ball.routes')
// const alleyRoutes = require('./alley.routes')
// const opponentRoutes = require('./opponent.routes')
const { model: User } = require('../models/user.model')
const gameRoutes = require('./game.routes')

const router = Router()

// Create a new session
router.post('/', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, sessionJoiSchema)
        if (error) return res.status(400).json(error)
        const newSession = await Session.create(value)
        res.json(newSession)
    } catch (err) {
        next(err)
    }
})

// Delete me
router.get('/', (req, res) => {
    res.send('Hello Casey')
})

// Get session by id
router.get('/:id', async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.id)
        if (!session) return res.status(404).send('Not Found')
        res.json(session)
    } catch (err) {
        next(err)
    }
})

// Get the user that the session belongs to 
router.get('/:id/user', async (req, res, next) => {
    const session = await Session.findById(req.params.id)
    if (!session) return res.status(404).send('Not Found')
    const user = await User.findById(session.userId)
    if (!user) return res.status(404).send('This user does not exist.')
    res.json(user)
})

// Modify session
router.put('/:id', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, sessionJoiSchema)
        if (error) return res.status(400).json(error)
        const updatedSession = await Session.findOneAndUpdate({ _id: req.params.id }, value, { new: true })
        if (!updatedSession) return res.status(404).send('Not Found')
        res.json(updatedSession)
    } catch (err) {
        next(err)
    }
})
// Delete session
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedSession = await Session.findOneAndDelete({ _id: req.params.id })
        if (!deletedSession) return res.status(404).send('Not Found')
        res.send('Deleted')
    } catch (err) {
        next(err)
    }
})

module.exports = router