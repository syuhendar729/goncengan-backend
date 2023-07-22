const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const corsOptions = { origin: '*' }
const {
    userFirestore,
    userFirestoreDetail,
} = require('./controllers/userFirestoreController')
const {
    userAuthCreate,
    userAuthUpdate,
} = require('./controllers/userAuthController')

const { userAuth } = require('./middlewares/userAuth')
const user = require('express').Router()
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/user', user)

// === ROUTING ===
app.get('/', (req, res) => res.json({ message: 'Welcome to Goncengan App' }))

user.get('/', userFirestore)
user.post('/create', userAuthCreate)
user.get('/:id', userAuth, userFirestoreDetail)
user.put('/update', userAuth, userAuthUpdate)

app.listen(port, (req, res) => {
    console.log(`Server started on port ${port}`)
})
