const Joi = require('joi')

const createTransactionSchema = Joi.object({
	bookingId: Joi.string().required(),
	// passengerId: Joi.string().required(),
	// price: Joi.number().required()
})

module.exports = { createTransactionSchema }
