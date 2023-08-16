const express = require('express')
const { userAuth } = require('../middlewares/userAuth')
const {
    driverCreateRoom,
    passengerCreateRoom,
    passengerGetDriver,
    driverCancelRoom,
} = require('../controllers/bookingController')
const orderRoute = express.Router()

orderRoute.route('/driver-bookingroom').post(userAuth, driverCreateRoom)
orderRoute.route('/passenger-get-bookingroom').post(userAuth, passengerGetDriver)
orderRoute.route('/passenger-bookingroom').post(userAuth, passengerCreateRoom)
orderRoute.route('/cancel-bookingroom/:bookingId').delete(userAuth, driverCancelRoom)

module.exports = orderRoute
