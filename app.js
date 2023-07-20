const express = require('express')
const app = express()
const cors = require('cors')
const users = require('./controllers/usersController')
const port = process.env.PORT || 3000
const corsOptions = { origin: '*' }
const r = require('express').Router()
const { validateApiKey, apiKey } = require('./auth/authMiddleware') 

app.use(cors(corsOptions))
app.use(express.json())
app.use('/users', r)

// === ROUTING ===
app.get('/', (req, res) => res.json({ message: 'Welcome to Goncengan App' }))
app.get('/api/token', (req, res) => res.json({ apikey: apiKey }))

r.get('/', validateApiKey, users.getUsers)
r.get('/:id', validateApiKey, users.getDetailUser)
r.post('/', validateApiKey, users.addUser)
r.put('/:id', validateApiKey, users.updateUser)
r.delete('/:id', validateApiKey, users.deleteUser)

app.listen(port, (req, res) => {
    console.log(`Server started on port ${port}`)
})

