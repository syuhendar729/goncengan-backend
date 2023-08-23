const express = require('express')
const { userAuth } = require('../middlewares/userAuth')
const {
    getWalletBalance,
    getWalletIncome,
    getWalletExpense,
    getWalletAllData,
    payoutRequest,
} = require('../controllers/walletController')

const walletRoute = express.Router()

walletRoute.route('/get-balance').get(userAuth, getWalletBalance)
walletRoute.route('/get-income').get(userAuth, getWalletIncome)
walletRoute.route('/get-expense').get(userAuth, getWalletExpense)
walletRoute.route('/get-alldata').get(userAuth, getWalletAllData)
walletRoute.route('/payout-request').post(userAuth, payoutRequest)

module.exports = walletRoute
