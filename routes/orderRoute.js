const express = require('express')
const Joi = require('joi')
const validator = require('../instances/validatorInstance')

const {
    driverCreateRoom,
    passengerCreateRoom,
    passengerGetRoom,
    driverCancelRoom,
    passengerCancelRoom,
} = require('../controllers/bookingController')
const { userAuth } = require('../middlewares/userAuth')
const {
    driverCreateRoomSchema,
    passengerCreateRoomSchema,
    passengerGetRoomSchema,
} = require('../middlewares/bookingValidator')
const { joiErrorHandling } = require('../middlewares/joiError')
const { isActiveRoom } = require('../middlewares/roleAuth')

const orderRoute = express.Router()
orderRoute
    .route('/driver-bookingroom')
    .post(userAuth, isActiveRoom, validator.body(driverCreateRoomSchema), joiErrorHandling, driverCreateRoom)
orderRoute
    .route('/passenger-bookingroom')
    .post(userAuth, isActiveRoom, validator.body(passengerCreateRoomSchema), joiErrorHandling, passengerCreateRoom)
orderRoute
    .route('/passenger-getroom')
    .post(userAuth, isActiveRoom, validator.body(passengerGetRoomSchema), joiErrorHandling, passengerGetRoom)
orderRoute
	.route('/driver-cancelroom/:bookingId')
	.delete(userAuth, driverCancelRoom)
orderRoute
	.route('/passenger-cancelroom')
	.patch(userAuth, validator.body(Joi.object({ bookingId: Joi.string().required() })), joiErrorHandling, passengerCancelRoom)


module.exports = orderRoute
