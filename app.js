const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const corsOptions = { origin: '*' }
// == Authentication ==
const { userAuth } = require('./auth/userAuth')
// == Controller ==
const {
    getUsers,
    getDetailUser,
    updateUser,
    deleteUser,
} = require('./controllers/usersController')
const { userRegis, userToken } = require('./controllers/authController')

const r = require('express').Router()
app.use(cors(corsOptions))
app.use(express.json())
app.use('/users', r)

// === ROUTING ===
app.get('/', (req, res) => res.json({ message: 'Welcome to Goncengan App' }))

r.get('/', getUsers)
r.get('/:id', userAuth, getDetailUser)
r.post('/', userRegis)
r.put('/:id', userAuth, updateUser)
r.delete('/:id', userAuth, deleteUser)

app.listen(port, (req, res) => {
    console.log(`Server started on port ${port}`)
})
