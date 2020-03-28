const { Router } = require('express')
const { model: User, joiSchema: userJoiSchema } = require('../models/user.model')
const passport = require('passport')
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
        const newUser = await User.create(value)
        res.redirect(307, '/auth/login')
    } catch (err) {
        next(err)
    }
})

// Route for logging user out
router.post("/logout", function (req, res) {
    req.logout()
    res.redirect("/login")
})

module.exports = router