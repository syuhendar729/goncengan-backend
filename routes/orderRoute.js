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
const { isActiveRoom, isActiveDriver, isActivePassenger } = require('../middlewares/roleActive')

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
orderRoute.route('/driver-cancelroom/:bookingId').delete(userAuth, isActiveDriver, driverCancelRoom)
orderRoute
    .route('/passenger-cancelroom')
    .patch(
        userAuth,
        isActivePassenger,
        validator.body(Joi.object({ bookingId: Joi.string().required() })),
        joiErrorHandling,
        passengerCancelRoom,
    )
orderRoute
    .route('/driver-cancelroom')
    .patch(
        userAuth,
        isActiveDriver,
        validator.body(Joi.object({ bookingId: Joi.string().required() })),
        joiErrorHandling,
        passengerCancelRoom,
    )

module.exports = orderRoute
