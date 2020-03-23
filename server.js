const express = require('express')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('connected to mongo'))

const userRoutes = require('./src/routes/user.routes')

const app = express()

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'react-app', 'build')))
app.use(bodyParser.json())

app.use('/api/user', userRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log('listening on', port)
})
