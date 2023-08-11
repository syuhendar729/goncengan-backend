const express = require('express')
const userRoute = require('./userRoute')
const orderRoute = require('./orderRoute')
const paymentRoute = require('./paymentRoute')
const walletRoute = require('./walletRoute')

const mainRoute = express.Router()

mainRoute.use('/api/user', userRoute)
mainRoute.use('/api/order', orderRoute)
mainRoute.use('/api/pay', paymentRoute)
mainRoute.use('/api/wallet', walletRoute)

module.exports = mainRoute
