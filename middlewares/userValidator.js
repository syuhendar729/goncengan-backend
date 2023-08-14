const Joi = require('joi')

const userCreateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    nim: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    address: Joi.object({
        formattedAddress: Joi.string(),
        latitude: Joi.number(),
        longitude: Joi.number(),
    }).required(),
    urlToStudentCard: Joi.string().uri().required(),
    avatar: Joi.string(),
    // isDisabled: Joi.boolean().required(),
    // isVerified: Joi.boolean().required(),
})

const userUpdateSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    nim: Joi.string().optional(),
    email: Joi.string().email().optional(),
    address: Joi.object({
        formattedAddress: Joi.string().optional(),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
    }).optional(),
    urlToStudentCard: Joi.string().uri().optional(),
    avatar: Joi.string().optional(),
})

const userValidator = (err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        res.status(400).json({
            type: err.type,
            message: err.error.toString(),
        })
    } else {
        next(err)
    }
}

module.exports = { userCreateSchema, userUpdateSchema, userValidator }
