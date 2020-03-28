const { Router } = require('express')
const { model: Session, joiSchema: gameJoiSchema } = require('../models/session.model')
const { joiSchema: frameJoiSchema } = require('../models/frame.model')
const joi = require('joi')

const router = Router()

// Get all frames for game
router.get('/:sessionId/game/:gameId/frame', async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.sessionId)
        if (!session) return res.status(404).send('Session Not Found')
        const game = session.games.find(game => game._id.toString() === req.params.gameId)
        if (!game) return res.status(404).send('Game Not Found')
        res.json(game.frames)
    } catch (err) {
        next(err)
    }
})

// Get a single frame for a game
router.get('/:sessionId/game/:gameId/frame/:frameId', async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.sessionId)
        if (!session) return res.status(404).send('Session Not Found')
        const game = session.games.find(game => game._id.toString() === req.params.gameId)
        if (!game) return res.status(404).send('Game Not Found')
        const theFrame = game.frames.find(frame => frame._id.toString() === req.params.frameId)
        if (!theFrame) return res.status(404).send('Frame Not Found')
        res.json(theFrame)
    } catch (err) {
        next(err)
    }
})

router.post('/:sessionId/game/:gameId/frame', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, frameJoiSchema)
        if (error) return res.status(400).json(error)
        const session = await Session.findById(req.params.sessionId)
        if (!session) return res.status(404).send('Session Not Found')
        const game = session.games.find(game => game._id.toString() === req.params.gameId)
        if (!game) return res.status(404).send('Game Not Found')
        // Make sure we can't put in the same frame twice.
        if (game.frames.find(frame => frame.number === value.number))
            return res.status(400).send('That frame already exists')
        // Get all of the current frame ids
        const currentFrameIds = game.frames.map(frame => frame._id.toString())
        // Add the new frame and save
        game.frames.push(value)
        const updatedSession = await session.save()
        // Find the new frame in the updated game by finding one that has a new ID
        const theUpdatedGame = updatedSession.games.find(game => game._id.toString() === req.params.gameId)
        console.log('the updated game', updatedSession)
        const theNewFrame = theUpdatedGame.frames.find(frame => !currentFrameIds.includes(frame._id.toString()))
        res.json(theNewFrame)
    } catch (err) {
        next(err)
    }
})



router.put('/:sessionId/game/:gameId/frame/:frameId', async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, frameJoiSchema)
        if (error) return res.status(400).json(error)
        if (!value._id) value._id = req.params.frameId
        const updatedSession = await Session.findOneAndUpdate(
            { _id: req.params.sessionId },
            {
                $set: {
                    "games.$[gameElem].frames.$[frameElem]": value
                }
            },
            { 
                arrayFilters: [
                    { 'gameElem._id': req.params.gameId },
                    { 'frameElem._id': req.params.frameId}
                ],
                new: true 
            }
        )
        if (!updatedSession) return res.status(404).send('Not Found')
        const theUpdatedGame = updatedSession.games.find(game => game._id.toString() === req.params.gameId)
        console.log('the updated game', theUpdatedGame, req.params.frameId)
        const theUpdatedFrame = theUpdatedGame.frames.find(frame => frame._id.toString() === req.params.frameId)
        res.json(theUpdatedFrame)
    } catch (err) {
        next(err)
    }
})

router.delete('/:sessionId/game/:gameId/frame/:frameId', async (req, res, next) => {
    try {
        const updatedSession = await Session.findOneAndUpdate(
            { _id: req.params.sessionId },
            {
                $pull: {
                    "games.$[gameElem].frames": { _id: req.params.frameId}
                }
            },
            { 
                arrayFilters: [
                    { 'gameElem._id': req.params.gameId }
                ],
                new: true 
            }
        )
        if (!updatedSession) return res.status(404).send('Not Found')
        res.send('Deleted')
    } catch (err) {
        next(err)
    }
})

module.exports = router