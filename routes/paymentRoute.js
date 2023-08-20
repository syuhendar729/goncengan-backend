const express = require('express')
const Joi = require('joi')
const validator = require('../instances/validatorInstance')
const { joiErrorHandling } = require('../middlewares/joiError')

const { verifySignature } = require('../middlewares/payAuth')
const { userAuth } = require('../middlewares/userAuth')
const { isValidDriver, isValidPassenger } = require('../middlewares/roleAuth')
const { createTransactionSchema } = require('../middlewares/payValidator')
const {
    createTransaction,
    finishTransaction,
    notificationTransaction,
    getStatusTransaction,
    errorTransaction,
	getDetailTransaction
} = require('../controllers/paymentController')

const paymentRoute = express.Router()

paymentRoute.route('/create-transaction').post(userAuth, isValidDriver, validator.body(createTransactionSchema), joiErrorHandling, createTransaction)
paymentRoute.route('/finish-transaction').get(finishTransaction)
paymentRoute.route('/notification-transaction').post(verifySignature, notificationTransaction)
paymentRoute.route('/check-transaction').get(userAuth, getStatusTransaction)
paymentRoute.route('/error-transaction').get(errorTransaction)

paymentRoute.route('/get-detail-transaction').get(getDetailTransaction)

module.exports = paymentRoute
