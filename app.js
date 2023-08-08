require('dotenv').config()
require('./config/firebaseConfig')
const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const corsOptions = { origin: '*' }

const mainRoute = require('./routes')

app.use(cors(corsOptions))
app.use(express.json())

// === ROUTING ===
app.get('/', (req, res) => res.json({ message: 'Welcome to Goncengan App' }))
app.use(mainRoute)

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
