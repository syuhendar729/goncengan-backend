const db = require('../instances/firestoreInstance')
const Transaction = db('transaction')
const Wallet = db('wallet')
const { snap, parameter } = require('../config/midtransConfig')
const { getUserById } = require('./userFirestoreController')
const { Timestamp, FieldValue } = require('firebase-admin/firestore')
const axios = require('axios')

const createTransaction = async (req, res) => {
    try {
		const { price, passengerId } = req.body
        const transDoc = Transaction.doc()
        await transDoc.set({ orderId: transDoc.id, driverId: req.uid, passengerId })
        const driver = await getUserById(req.uid)
        const transaction = await snap.createTransaction(
            parameter(transDoc.id, price, driver),
        )
        const { token, redirect_url: redirectUrl } = transaction
        await transDoc.update({ token, redirectUrl })
        res.send({
            message: 'Successfully created transaction!',
            token,
            redirectUrl,
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            message: 'Failed to create transaction!',
            error,
        })
    }
}


const createExpireTransaction = async (orderId, data) => {
	try {
		const { gross_amount: price } = data
		const transDoc = Transaction.doc(orderId)
		const transData = await transDoc.get()
		const driver = await getUserById(transData.data().driverId)
		const transaction = await snap.createTransaction(
			parameter(orderId, price, driver),
		)
		await transDoc.update({ token: transaction.token, redirectUrl: transaction.redirect_url })
		return transaction
	} catch (error) {
        console.error(error)
	}
}

const finishTransaction = async (req, res) => {
    console.log('Finish Transaction: ', req.query)
    try {
        const { order_id, transaction_status: transactionStatus } = req.query
        const docRef = Transaction.doc(order_id)
        await docRef.update({ transactionStatus })
        res.send({
            message: 'Successfully call the API callback!',
            data: req.query,
        })
    } catch (error) {
        console.error(err)
        res.status(500).send({
            message: 'Failed to call the API callback!',
            error,
        })
    }
}

const notificationTransaction = async (req, res) => {
	console.log('Notification Transaction: ', req.body, new Date())
    try {
        const {
			order_id: orderId,
            transaction_time,
            transaction_status,
            transaction_id,
            gross_amount,
            expiry_time,
            signature_key,
        } = req.body
		const transDoc = Transaction.doc(orderId)
		const transData = await transDoc.get()
		const transactionStatus = transData.data().transactionStatus
		if (!transData.exists) throw new Error(`Transaction id: ${orderId} not found!`)
		else if (transactionStatus !== 'settlement') {
			await transDoc.update({
				price: parseFloat(gross_amount),
				transactionId: transaction_id,
				transactionStatus: transaction_status,
				transactionTime: Timestamp.fromDate(new Date(transaction_time)),
				expiredTime: Timestamp.fromDate(new Date(expiry_time)),
			})
		}
		const driverId = transData.data().driverId
		const walletDoc = Wallet.doc(driverId)
		const walletData = await walletDoc.get()

		if (transaction_status === 'settlement') {
			if (!walletData.exists) await walletDoc.set({ driverId, balance: 0, dataIncome: [], dataExpense: [] })
			await walletDoc.update({
				dataIncome: FieldValue.arrayUnion({ 
					orderId,
					amount: parseFloat(gross_amount), 
					timeDate: Timestamp.fromDate(new Date(transaction_time)) 
				}),
			})
			const walletDataNew = await walletDoc.get()
			let balance = walletDataNew.data().dataIncome.reduce((total, item) => total + item.amount, 0)
			await walletDoc.update({ balance })
		}

    } catch (error) {
        console.error(error)
    }
}


const getStatusTransaction = async (req, res) => {
    try {
        const url = `https://api.sandbox.midtrans.com/v2/${req.params.orderId}/status`
        const config = {
            headers: {
                Authorization: `Basic ${Buffer.from(
                    process.env.MIDTRANS_SERVER_KEY,
                ).toString('base64')}`,
            },
        }
        const dataStatus = await axios.get(url, config)
        res.send(dataStatus.data)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Get status gagal!', error })
    }
}

const paymentStatus = async (req, res) => {
	console.log('Payment Status: ', req.body);
}


const cancelTransaction = async (req, res) => {
	console.log('Cancel Transaction: ', req.query);
	res.send({ ...req.query })
}

const errorTransaction = async (req, res) => {
	try {
		console.log('Error Transaction: ', req.query)
		const orderId = req.query.order_id
        const url = `https://api.sandbox.midtrans.com/v2/${orderId}/status`
        const config = {
            headers: {
                Authorization: `Basic ${Buffer.from(
                    process.env.MIDTRANS_SERVER_KEY,
                ).toString('base64')}`,
            },
        }
        const dataStatus = await axios.get(url, config)
		// res.send(dataStatus.data)
		const transaction = await createExpireTransaction(orderId, dataStatus.data)
		res.send({ newToken: transaction.token, newRedirectUrl: transaction.redirect_url, data: dataStatus.data })
	} catch (error) {
		console.error(error)
	}
}

module.exports = {
    createTransaction,
    finishTransaction,
    notificationTransaction,
    getStatusTransaction,
	paymentStatus,
	cancelTransaction,
	errorTransaction
}
