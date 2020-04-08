const { Router } = require('express')
const bowlingService = require('../services/bowling-service')

const router = Router()

router.post('/totalScore', async (req, res, next) => {
    res.json({
        totalScore: bowlingService.getTotalScore(req.body.frames)
    })
})

module.exports = router