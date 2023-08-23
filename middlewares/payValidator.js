const Payment = require('../instances/firestoreInstance')('payment')
const Joi = require('joi')

const createTransactionSchema = Joi.object({
    bookingId: Joi.string().required(),
    // passengerId: Joi.string().required(),
    // price: Joi.number().required()
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

module.exports = { createTransactionSchema, isValidBooking }
