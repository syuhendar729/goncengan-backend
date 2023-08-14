const express = require('express')
const { verifySignature } = require('../middlewares/payAuth')
const { userAuth } = require('../middlewares/userAuth')
const {
    createTransaction,
    finishTransaction,
    notificationTransaction,
    getStatusTransaction,
    errorTransaction,
} = require('../controllers/paymentController')

const paymentRoute = express.Router()

paymentRoute.route('/create-transaction').post(userAuth, createTransaction)
paymentRoute.route('/finish-transaction').get(finishTransaction)
paymentRoute.route('/notification-transaction').post(verifySignature, notificationTransaction)
paymentRoute.route('/check-transaction/:orderId').get(userAuth, getStatusTransaction)
paymentRoute.route('/error-transaction').get(errorTransaction)

module.exports = paymentRoute
