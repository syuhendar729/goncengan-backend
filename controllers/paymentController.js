const db = require('../instances/firestoreInstance')
const Payment = db('payment')
const Wallet = db('wallet')
const { snap, parameter } = require('../config/midtransConfig')
const { getUserById } = require('./userFirestoreController')
const { Timestamp, FieldValue } = require('firebase-admin/firestore')
const axios = require('axios')

const createTransaction = async (req, res) => {
    try {
        const { price, passengerId } = req.body
        const payDoc = Payment.doc()
        await payDoc.set({
            orderId: payDoc.id,
            driverId: req.uid,
            passengerId,
        })
        const driver = await getUserById(req.uid)
        const transaction = await snap.createTransaction(parameter(payDoc.id, price, driver))
        const { token, redirect_url: redirectUrl } = transaction
        await payDoc.update({ token, redirectUrl })
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
        const payDoc = Payment.doc(orderId)
        const payData = await payDoc.get()
        const driver = await getUserById(payData.data().driverId)
        const transaction = await snap.createTransaction(parameter(orderId, price, driver))
        await payDoc.update({
            token: transaction.token,
            redirectUrl: transaction.redirect_url,
        })
        return transaction
    } catch (error) {
        console.error(error)
    }
}

const finishTransaction = async (req, res) => {
    console.log('Finish Transaction: ', req.query)
    try {
        const { order_id, transaction_status: transactionStatus } = req.query
        const payDoc = Payment.doc(order_id)
        await payDoc.update({ transactionStatus })
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
    try {
        const {
            order_id: orderId,
            transaction_time,
            transaction_status: transactionStatusNew,
            transaction_id,
            gross_amount,
            expiry_time,
        } = req.body
        const amount = parseFloat(gross_amount)
        const payDoc = Payment.doc(orderId)
        const payData = await payDoc.get()
        const transactionStatus = payData.data().transactionStatus

        const driverId = payData.data().driverId
        const walletDoc = Wallet.doc(driverId)

        if (!payData.exists) throw new Error(`Payment id: ${orderId} not found!`)
        else if (transactionStatus === 'expire' || transactionStatus === 'pending' || transactionStatus == undefined) {
            console.log('Update transaction: ', req.body, new Date())
            await payDoc.update({
                price: amount,
                transactionId: transaction_id,
                transactionStatus: transactionStatusNew,
                transactionTime: Timestamp.fromDate(new Date(transaction_time)),
                expiredTime: Timestamp.fromDate(new Date(expiry_time)),
            })
        }

        if (
            (transactionStatus === 'expire' || transactionStatus === 'pending') &&
            transactionStatusNew === 'settlement'
        ) {
            console.log('Wallet update: ', { orderId, amount, timeDate: new Date() })
            await walletDoc.update({
                balance: FieldValue.increment(amount),
                dataIncome: FieldValue.arrayUnion({
                    orderId,
                    amount,
                    timeDate: Timestamp.fromDate(new Date(transaction_time)),
                }),
            })
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
                Authorization: `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString('base64')}`,
            },
        }
        const dataStatus = await axios.get(url, config)
        res.send(dataStatus.data)
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Get status gagal!', error })
    }
}

const errorTransaction = async (req, res) => {
    try {
        console.log('Error Transaction: ', req.query)
        const orderId = req.query.order_id
        const url = `https://api.sandbox.midtrans.com/v2/${orderId}/status`
        const config = {
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString('base64')}`,
            },
        }
        const dataStatus = await axios.get(url, config)
        const transaction = await createExpireTransaction(orderId, dataStatus.data)
        res.send({
            newToken: transaction.token,
            newRedirectUrl: transaction.redirect_url,
            data: dataStatus.data,
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Failed call Error Transaction, can't create new expire transaction", error })
    }
}

module.exports = {
    createTransaction,
    finishTransaction,
    notificationTransaction,
    getStatusTransaction,
    errorTransaction,
}
