//passport conig will go here
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { model: User } = require('../models/user.model')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, cb) {

        return User.findOne({ email })
            .then(user => {
                if (!user) {
                    return cb(null, false, { message: 'Incorrect email.' })
                }

                user.comparePassword(password, (err, isMatch) => {
                    if (err) return cb(err)
                    if (!isMatch) return cb(null, false)
                    return cb(null, user, { message: 'Logged In Successfully' })
                })
            })
            .catch(err => cb(err))
    }
))