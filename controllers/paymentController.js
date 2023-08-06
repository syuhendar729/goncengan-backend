/* const { getFirestore } = require('firebase-admin/firestore')
const db = getFirestore()
const Payment = db.collection('payment') */
const snap = require('../config/midtransConfig')
const { getUserById } = require('./userFirestoreController')

const parameter = (data, user) => {
	return {
		transaction_details: {
			order_id: "testing_id_1234",
			gross_amount: data.price
		},
		item_details: [
			{
				id: 'item_id_123',
				price: data.price,
				quantity: 1,
				name: 'Goncengan Payment',
				brand: 'Goncengan',
				category: 'Motorcycle Taxi',
				merchant_name: 'Midtrans'
			},
		],
		customer_details: {
			first_name: user.name.split(' ')[0],
			last_name: user.name.split(' ')[1],
			email: user.email
		},
		enabled_payments: ['other_qris'],
		callbacks: {
			finish: "https://demo.midtrans.com"
		}
	}
}

module.exports = async (req, res) => {
    try {
		console.log("Awal");
		const user = await getUserById(req.uid)
		const transaction = await snap.createTransaction(parameter(req.body, user))
        // const transaction = await snap.createTransaction(parameter)
        const { token, redirect_url } = transaction
		console.log("Akhir");
        res.send({ msg: 'Berhasil transaksi!', token, redirect_url })
    } catch (err) {
		console.error(err);
        // res.send({ msg: 'Gagal transaksi!', err })
    }
}
