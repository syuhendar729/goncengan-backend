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
const { bookingRoomResult, bookingResult} = require('./controllers/bookingController')

const { userAuth } = require('./middlewares/userAuth')
const user = require('express').Router()
const pay = require('express').Router()
const order = require('express').Router()

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/user', user)
app.use('/api/pay', pay)
app.use('/api/order', order)

// === ROUTING ===
app.get('/', (req, res) => res.json({ message: 'Welcome to Goncengan App' }))

order.post('/driver', userAuth, bookingRoomResult)
order.post('/pickdriver', userAuth, bookingResult)
// order.post('/offering', userAuth, offeringRoom)

user.get('/', userAuth, userFirestore)
user.get('/detail', userAuth, userFirestoreDetail)
user.get('/detail/:id', userAuth, userAnotherFirestoreDetail)
user.post('/create', userAuthCreate)
user.put('/update', userAuth, userAuthUpdate)

pay.post('/', createTransaction)

// == Error Handling ==
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' })
})
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Internal Server Error' })
})

app.listen(port, (req, res) => {
    console.log(`Server started on port ${port}`)
})
