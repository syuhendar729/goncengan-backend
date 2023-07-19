const express = require('express')
const app = express()
const cors = require('cors')
const users = require('./controllers/usersController')
const port = process.env.PORT || 3000
const corsOptions = { origin: '*' }
const r = require('express').Router()

app.use(cors(corsOptions))
app.use(express.json())
app.use('/users', r)

// === ROUTING ===
app.get('/', (req, res) => res.json({ message: 'Welcome to Goncengan App' }))

r.get('/', users.getUsers)
r.get('/:id', users.getDetailUser)
r.post('/', users.addUser)
r.put('/:id', users.updateUser)
r.delete('/:id', users.deleteUser)

app.listen(port, (req, res) => {
    console.log(`Server started on port ${port}`)
})
