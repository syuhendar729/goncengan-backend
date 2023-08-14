const express = require('express')
const { userAuth, verifySignature } = require('../middlewares')
const {
    createTransaction,
    finishTransaction,
    notificationTransaction,
    getStatusTransaction,
    // paymentStatus,
    // cancelTransaction,
    errorTransaction,
} = require('../controllers/paymentController')

const paymentRoute = express.Router()

paymentRoute.route('/create-transaction').post(userAuth, createTransaction)
paymentRoute.route('/finish-transaction').get(finishTransaction)
paymentRoute.route('/notification-transaction').post(verifySignature, notificationTransaction)
paymentRoute.route('/check-transaction/:orderId').get(userAuth, getStatusTransaction)
// paymentRoute.route('/payment-status').post(paymentStatus)
// paymentRoute.route('/cancel-transaction').get(cancelTransaction)
paymentRoute.route('/error-transaction').get(errorTransaction)

module.exports = paymentRoute
