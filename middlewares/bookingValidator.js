const Joi = require('joi')

const driverCreateRoomSchema = Joi.object({
    departureDate: Joi.string().required(),
    driver: Joi.object({
        departure: Joi.object({
            formattedAddress: Joi.string().allow(null).required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
        }),
        destination: Joi.object({
            formattedAddress: Joi.string().allow(null).required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
        }),
    }).required(),
})

const passengerCreateRoomSchema = Joi.object({
    bookingId: Joi.string().required(),
    distance: Joi.number().required(),
    passenger: Joi.object({
        departure: Joi.object({
            formattedAddress: Joi.string().allow(null).required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
        }),
        destination: Joi.object({
            formattedAddress: Joi.string().allow(null).required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
        }),
    }).required(),
})

const passengerGetRoomSchema = Joi.object({
    distance: Joi.number().required(),
    passenger: Joi.object({
        departure: Joi.object({
            formattedAddress: Joi.string().allow(null).required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
        }),
        destination: Joi.object({
            formattedAddress: Joi.string().allow(null).required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
        }),
    }).required(),
})

module.exports = {
    driverCreateRoomSchema,
    passengerCreateRoomSchema,
    passengerGetRoomSchema,
}
