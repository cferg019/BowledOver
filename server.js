const express = require('express')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const app = express()

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('connected to mongo'))

const userRoutes = require('./src/routes/user.routes')
const sessionRoutes = require('./src/routes/session.routes')
const frameRoutes = require('./src/routes/frame.routes')
const ballRoutes = require('./src/routes/ball.routes')
const alleyRoutes = require('./src/routes/alley.routes')
const opponentRoutes = require('./src/routes/opponent.routes')
const gameRoutes = require('./src/routes/game.routes')

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'react-app', 'build')))
app.use(bodyParser.json())

app.use('/api/user', userRoutes)
app.use('/api/user', ballRoutes)
app.use('/api/user', alleyRoutes)
app.use('/api/user', opponentRoutes)
app.use('/api/session', sessionRoutes)
app.use('/api/session', gameRoutes)
app.use('/api/session', frameRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    if (err.name === 'MongoError') {
        res.status(400).json(err)
    }
    res.status(500).send('Something broke!')
})

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log('listening on', port)
})
