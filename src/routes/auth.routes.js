const { Router } = require('express')
const { model: User, joiSchema: userJoiSchema } = require('../models/user.model')
const passport = require('passport')
const randomstring = require('randomstring')
const emailService = require('../services/email-service')
const joi = require('joi')

const router = Router()

router.post("/login", passport.authenticate("local"), function (req, res) {
    console.log('logging in', req.user)
    res.json(req.user)
})

router.post("/signup", async (req, res, next) => {
    try {
        const { error, value } = joi.validate(req.body, userJoiSchema)
        if (error) return res.status(400).json(error)
        value.isVerified = false
        value.verificationToken = randomstring.generate(64)
        await User.create(value)
        emailService.sendVerificationEmail(value.email, value.verificationToken)
        res.redirect('/verify')
    } catch (err) {
        next(err)
    }
})

router.get('/verify/email/:emailAddress/token/:token', async (req, res, next) => {
    const user = await User.findOne({ email: req.params.emailAddress })
    if (!user) return res.status(404).send('User not found')
    if (user.verificationToken !== req.params.token) {
        return res.status(401).send('Invalid Token')
    }
    user.isVerified = true
    await user.save()
    res.redirect(`${process.env.BASE_APP_URL}/login`)
})

// Route for logging user out
router.post("/logout", function (req, res) {
    req.logout()
    res.redirect(`${process.env.BASE_APP_URL}/login`)
})

module.exports = router