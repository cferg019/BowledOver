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
                if (!user.isVerified && process.env.NODE_ENV !== 'local') {
                    console.log('not yet verified, rejecting')
                    return cb(null, false, { message: 'User is not verified yet.'})
                }
                console.log('got the user', user)
                console.log('comparing password', password)

                const isMatch = User.comparePassword(password, user.password)
                if (!isMatch) return cb(null, false)
                return cb(null, user, { message: 'Logged In Successfully' })

            })
            .catch(err => cb(err))
    }
))

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})