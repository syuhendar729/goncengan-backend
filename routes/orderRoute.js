const express = require('express')
const { userAuth } = require('../middlewares/userAuth')
const { bookingRoomResult, bookingResult } = require('../controllers/bookingController')
const orderRoute = express.Router()

orderRoute.route('/driver').post(userAuth, bookingRoomResult)
orderRoute.route('/pickdriver').post(userAuth, bookingResult)

module.exports = orderRoute
