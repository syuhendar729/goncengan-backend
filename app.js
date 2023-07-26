require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const corsOptions = { origin: '*' }
const {
    userFirestore,
    userFirestoreDetail,
    userAnotherFirestoreDetail,
} = require('./controllers/userFirestoreController')
const {
    userAuthCreate,
    userAuthUpdate,
} = require('./controllers/userAuthController')
const createTransaction = require('./controllers/midtransController')
// const { resultDriver } = require('./controllers/driverController')
const { bookingRoomResult } = require('./controllers/bookingController')

const { userAuth } = require('./middlewares/userAuth')
const user = require('express').Router()
const pay = require('express').Router()
const book = require('express').Router()

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/user', user)
// app.use('/api/pay', pay)
app.use('/api/booking', book)

// === ROUTING ===
app.get('/', (req, res) => res.json({ message: 'Welcome to Goncengan App' }))

book.post('/', bookingRoomResult)

user.get('/', userAuth, userFirestore)
user.get('/detail', userAuth, userFirestoreDetail)
user.get('/detail/:id', userAuth, userAnotherFirestoreDetail)
user.post('/create', userAuthCreate)
user.put('/update', userAuth, userAuthUpdate)

// pay.post('/', createTransaction)

app.listen(port, (req, res) => {
    console.log(`Server started on port ${port}`)
})
