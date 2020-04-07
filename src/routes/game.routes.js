const { Router } = require('express')
const { model: Session, joiSchema: sessionJoiSchema } = require('../models/session.model')
const { joiSchema: gameJoiSchema } = require('../models/game.model')
const joi = require('joi')

const router = Router()

// Get all games for session
router.get('/:sessionId/game', async (req, res, next) => {
    try {
        const session = await Session.findOne({ _id: req.params.sessionId, userId: req.user.id })
        if (!session) return res.status(404).send('Not Found')
        res.json(session.games)
    } catch (err) {
        next(err)
    }
})

// Get a single game for a session
router.get('/:sessionId/game/:gameId', async (req, res, next) => {
    try {
        const session = await Session.findOne({ _id: req.params.sessionId, userId: req.user.id })
        if (!session) return res.status(404).send('Session Not Found')
        const theGame = session.games.find(game => game._id.toString() === req.params.gameId)
        if (!theGame) return res.status(404).send('Game Not Found for Session')
        res.json(theGame)
    } catch (err) {
        next(err)
    }
})

router.post('/:sessionId/game', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, gameJoiSchema)
        if (error) return res.status(400).json(error)
        const session = await Session.findOne({ _id: req.params.sessionId, userId: req.user.id })
        if (!session) return res.status(404).send('Session Not Found')
        // Get all of the current game ids
        const currentGameIds = session.games.map(game => game._id.toString())
        // Add the new game and save
        session.games.push(value)
        const updatedSession = await session.save()
        // Find the new game in the updated session by finding one that has a new ID
        const theNewGame = updatedSession.games.find(game => !currentGameIds.includes(game._id.toString()))
        res.json(theNewGame)
    } catch (err) {
        next(err)
    }
})



router.put('/:sessionId/game/:gameId', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, gameJoiSchema)
        if (error) return res.status(400).json(error)
        const updatedSession = await Session.findOneAndUpdate(
            { userId: req.user.id, _id: req.params.sessionId, "games._id": req.params.gameId },
            {
                $set: {
                    "games.$": value
                }
            },
            { new: true }
        )
        if (!value._id) value._id = req.params.gameId
        if (!updatedSession) return res.status(404).send('Not Found')
        const theUpdatedGame = updatedSession.games.find(game => game._id.toString() === req.params.gameId)
        console.log('the pudated game', theUpdatedGame)
        res.json(theUpdatedGame)
    } catch (err) {
        next(err)
    }
})

router.delete('/:sessionId/game/:gameId', async (req, res, next) => {
    try {
        const session = await Session.findOne({ _id: req.params.sessionId, userId: req.user.id })
        if (!session) return res.status(404).send('Not Found')
        if (!session.games.find(b => b._id.toString() === req.params.gameId)) {
            return res.status(404).send('Not found')
        }
        session.games.pull({ _id: req.params.gameId})
        await session.save()
        res.send('Deleted')
    } catch (err) {
        next(err)
    }
})

module.exports = router