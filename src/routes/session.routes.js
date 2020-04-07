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
        // force the user id to be the right user id
        value.userId = req.user.id
        const newSession = await Session.create(value)
        res.json(newSession)
    } catch (err) {
        next(err)
    }
})

// Delete me
router.get('/', async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user.id })
        if (!sessions) return res.status(404).send('Not Found')
        res.json(sessions)
    } catch (err) {
        next(err)
    } 
})

// Get session by id
router.get('/:id', async (req, res, next) => {
    try {
        console.log('finding with use rid', req.user.id)
        const session = await Session.findOne({ _id: req.params.id, userId: req.user.id })
        if (!session) return res.status(404).send('Not Found')
        res.json(session)
    } catch (err) {
        next(err)
    }
})

// Modify session
router.put('/:id', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, sessionJoiSchema)
        if (error) return res.status(400).json(error)
        const updatedSession = await Session.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, value, { new: true })
        if (!updatedSession) return res.status(404).send('Not Found')
        res.json(updatedSession)
    } catch (err) {
        next(err)
    }
})
// Delete session
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedSession = await Session.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
        if (!deletedSession) return res.status(404).send('Not Found')
        res.send('Deleted')
    } catch (err) {
        next(err)
    }
})

module.exports = router