const mongoose = require('mongoose')
const { model: User } = require('../../src/models/user.model')
const { model: Session } = require('../../src/models/session.model')
const user1 = require('./user1')
const user1Sessions = require('./user1-sessions')
const dotenv = require('dotenv')

dotenv.config()

async function run() {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useCreateIndex: true })
    console.log('connected to mongo')

    const existingUser = User.findById(user1._id)
    if (existingUser) {
        console.log('deleting existing')
        await User.deleteOne({ _id: user1._id})
    }
    const existingSession = Session.findById(user1Sessions._id)
    if (existingSession) {
        console.log('deleting existing')
        await Session.deleteMany({ userId: user1._id})
    }

    const user = await User.create(user1)
    const sessions = await Session.create(user1Sessions)
    console.log('seede successfully', user, sessions)
    await mongoose.disconnect()
}

run()