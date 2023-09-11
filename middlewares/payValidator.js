const Payment = require('../instances/firestoreInstance')('payment')
const Joi = require('joi')

const createTransactionSchema = Joi.object({
    bookingId: Joi.string().required(),
})

const payoutRequestSchema = Joi.object({ 
	// amount: Joi.number().min(21000).required(),
	amount: Joi.alternatives().conditional('rekening.type', { is: 'E-Wallet', then: Joi.number().min(21000), otherwise: Joi.number().min(22500) }).required(),
	rekening: Joi.object({
		type: Joi.string().valid('Bank', 'E-Wallet').required(),
		provider: Joi.string().required(),
		number: Joi.string().pattern(/^[0-9]+$/).required(),
	}) 
})

const isValidBooking = async (req, res, next) => {
    try {
        const bookingId = req.body.bookingId
        const payData = await Payment.doc(bookingId).get()
        if (!payData.exists) next()
		else res.send({ message: "Transaction has been create, can't create a new transaction!", data: {
			token: payData.data().token,
			redirectUrl: payData.data().redirectUrl
		} })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed check exist transaction!' })
    }
}

module.exports = { createTransactionSchema, payoutRequestSchema, isValidBooking }
