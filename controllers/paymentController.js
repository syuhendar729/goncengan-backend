const db = require('../instances/firestoreInstance')
const Payment = db('payment')
const Booking = db('booking')
const snap = require('../config/midtransConfig')
const { getUserById } = require('./userFirestoreController')
const { Timestamp } = require('firebase-admin/firestore')
const axios = require('axios')
const crypto = require('crypto')

const verifySignature = ({
    order_id,
    status_code,
    gross_amount,
    signature_key,
}) => {
    const dataToHash =
        order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY
    const hash = crypto.createHash('sha512')
    const calculatedHash = hash.update(dataToHash, 'utf8').digest('hex')
    return calculatedHash === signature_key
}

const parameter = (data, user, orderId) => {
    return {
        transaction_details: {
            order_id: orderId,
            gross_amount: data.price,
        },
        item_details: [
            {
                id: 'item_1',
                price: data.price,
                quantity: 1,
                name: 'Goncengan Payment',
                brand: 'Goncengan',
                category: 'Motorcycle Taxi',
                merchant_name: 'Midtrans',
            },
        ],
        customer_details: {
            first_name: user.name.split(' ')[0],
            last_name: user.name.split(' ')[1],
            email: user.email,
        },
        enabled_payments: ['other_qris'],
        callbacks: {
            finish: process.env.MIDTRANS_CALLBACK,
        },
    }
}

const createTransaction = async (req, res) => {
    try {
        const docRef = Booking.doc()
        await docRef.set({ orderId: docRef.id })
        const user = await getUserById(req.uid)
        const transaction = await snap.createTransaction(
            parameter(req.body, user, docRef.id),
        )
        const { token, redirect_url } = transaction
        await docRef.update({ token, redirectUrl: redirect_url })
        res.send({ msg: 'Berhasil transaksi!', token, redirect_url })
    } catch (err) {
        console.error(err)
        res.status(500).send({ msg: 'Gagal transaksi!', err })
    }
}

const callbackTransaction = async (req, res) => {
    try {
        const { order_id, transaction_status } = req.query
        const docRef = Booking.doc(order_id)
        await docRef.update({ transactionStatus: transaction_status })
        console.log(req.query)
        res.send({ ...req.query })
    } catch (err) {
        console.error(err)
        res.status(500).send({ msg: 'Callback gagal!', err })
    }
}

const notificationTransaction = async (req, res) => {
    console.log(req.body)
    try {
        const {
            order_id,
            transaction_time,
            transaction_status,
            transaction_id,
            gross_amount,
            expiry_time,
            signature_key,
        } = req.body
        if (verifySignature(req.body)) {
            const docRef = Booking.doc(order_id)
            await docRef.update({
                price: parseFloat(gross_amount),
                transactionId: transaction_id,
                transactionStatus: transaction_status,
                transactionTime: Timestamp.fromDate(new Date(transaction_time)),
                expiredTime: Timestamp.fromDate(new Date(expiry_time)),
            })
        } else throw new Error('Gagal verifikasi data!')
    } catch (err) {
        console.error(err)
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
    } catch (err) {
        console.error(err)
        res.status(500).send({ msg: 'Get status gagal!', err })
    }
}

module.exports = {
    createTransaction,
    callbackTransaction,
    notificationTransaction,
    getStatusTransaction,
}
