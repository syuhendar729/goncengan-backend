const express = require('express')
const { userAuth } = require('../middlewares/userAuth')
const {
    createTransaction,
    callbackTransaction,
    notificationTransaction,
    getStatusTransaction,
} = require('../controllers/paymentController')

const paymentRoute = express.Router()

paymentRoute.route('/create-transaction').post(userAuth, createTransaction)
paymentRoute.route('/callback-transaction').get(callbackTransaction)
paymentRoute.route('/notification-transaction').post(notificationTransaction)
paymentRoute.route('/check-transaction/:orderId').get(getStatusTransaction)

module.exports = paymentRoute
