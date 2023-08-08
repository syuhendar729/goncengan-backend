const express = require('express')
const userRoute = require('./userRoute')
const orderRoute = require('./orderRoute')
const paymentRoute = require('./paymentRoute')

const mainRoute = express.Router()

mainRoute.use('/api/user', userRoute)
mainRoute.use('/api/order', orderRoute)
mainRoute.use('/api/pay', paymentRoute)

module.exports = mainRoute
