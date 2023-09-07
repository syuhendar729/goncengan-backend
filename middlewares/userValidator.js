const Joi = require('joi')

const userCreateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    nim: Joi.string().required(),
    email: Joi.string().email().regex(/@apps\.ipb\.ac\.id$/).optional(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).required(),
    address: Joi.object({
        formattedAddress: Joi.string().allow(null),
        latitude: Joi.number(),
        longitude: Joi.number(),
    }).optional(),
    fakultas: Joi.string().required(),
    avatar: Joi.string().allow(null).optional(),
    isVerified: Joi.boolean().optional(),
    fcmToken: Joi.string().allow(null).optional(),
})

const userUpdateSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    nim: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).optional(),
    address: Joi.object({
        formattedAddress: Joi.string().allow(null).optional(),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
    }).optional(),
    fakultas: Joi.string().optional(),
    avatar: Joi.string().allow(null).optional(),
})

module.exports = { userCreateSchema, userUpdateSchema }
