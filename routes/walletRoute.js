const express = require('express')
const Joi = require('joi')
const validator = require('../instances/validatorInstance')
const { joiErrorHandling } = require('../middlewares/joiError')
const { userAuth } = require('../middlewares/userAuth')
const {
    getWalletBalance,
    getWalletIncome,
    getWalletExpense,
    getWalletAllData,
	updateDataWallet,
    payoutRequest,
} = require('../controllers/walletController')
const { payoutRequestSchema } = require('../middlewares/payValidator')

const walletRoute = express.Router()

walletRoute.route('/get-balance').get(userAuth, getWalletBalance)
walletRoute.route('/get-income').get(userAuth, getWalletIncome)
walletRoute.route('/get-expense').get(userAuth, getWalletExpense)
walletRoute.route('/get-alldata').get(userAuth, getWalletAllData)
walletRoute.route('/update-wallet').patch(userAuth, updateDataWallet)
walletRoute.route('/payout-request').post(
	userAuth, 
	validator.body(payoutRequestSchema), 
	joiErrorHandling,
	payoutRequest
)

module.exports = walletRoute
