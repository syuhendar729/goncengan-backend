const { Timestamp, FieldValue } = require('firebase-admin/firestore')
const axios = require('axios')
const db = require('../instances/firestoreInstance')
const Payment = db('payment')
const Wallet = db('wallet')
const BookingRoom = db('booking_room')
const Summary = db('summary')
const { snap, parameter } = require('../config/midtransConfig')
const { getUserById } = require('./userFirestoreController')
const { updateWalletIncome } = require('./walletController')
const { sendNotification } = require('./fcmController')
const { calculateDiscount } = require('./priceController')

const createTransaction = async (req, res) => {
    try {
        const bookingId = req.body.bookingId
        const bookingRoomDoc = BookingRoom.doc(bookingId)
        const bookingRoomData = await bookingRoomDoc.get()
        const { passenger, price } = bookingRoomData.data()
        const payDoc = Payment.doc(bookingId)
        await payDoc.set({
            orderId: payDoc.id,
            driverId: req.uid,
            passengerId: passenger.uid,
            bookingId,
			transactionStatus: null
        })
        const driver = await getUserById(req.uid)
        const transaction = await snap.createTransaction(parameter(payDoc.id, price, driver))
        const { token, redirect_url: redirectUrl } = transaction
        await payDoc.update({ token, redirectUrl })
        await bookingRoomDoc.update({ paymentId: payDoc.id })
        res.send({
            message: 'Successfully created transaction!',
            data: { token, redirectUrl },
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
        const { order_id: orderId } = req.query
        const roomData = await BookingRoom.doc(orderId).get()
		const { driver, passenger, price } = roomData.data()
		const { driverOriginIncome, passengerDiscount, percentRewardDriver, originPrice, adminIncome, driverIncome } = await calculateDiscount(price)
		const sendHtml = `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body {
						display: flex;
						flex-direction: column; /* Mengatur tata letak dalam kolom */
						justify-content: center;
						align-items: center;
						height: 100vh;
						margin: 0;
						text-align: center;
						background-color: #d3f7a7; /* Warna latar belakang hijau muda */
						font-family: "Comic Mono", monospace; /* Jenis font Comic Mono */
					}
					
					h3 {
						margin: 5px 0; /* Mengurangi margin atas dan bawah menjadi 5px */
						font-weight: normal; /* Menghilangkan efek bold */
					}
				</style>
			</head>
			<body>
				<h1>Pembayaran Berhasil!</h1>
				<h3>OrderID: ${orderId}</h3>
				<h3>Penerima (driver): ${driver.name}</h3>
				<h3>Pengirim (passenger): ${passenger.name}</h3>
				<h3>Diskon passenger: ${passengerDiscount}%</h3>
				<h3>Harga asli: Rp${originPrice}</h3>
				<h3>Harga diskon (70% harga asli): Rp${price}</h3>
				<h3>Biaya aplikasi (25% harga asli): Rp${parseFloat(originPrice * 25 / 100)}</h3>
				<h3>Reward driver (75% harga asli): Rp${driverOriginIncome}</h3>
				<h3>Bonus driver (30% reward): Rp${driverIncome - driverOriginIncome}</h3>
				<h3>Total pendapatan driver (reward + bonus): Rp${driverIncome}</h3>
			</body>
			</html>
		`
		res.setHeader('Content-Type', 'text/html')
		res.status(200).send(sendHtml)
        // res.send({
        //     message: 'Successfully call the API callback!',
        //     data: req.query,
        // })
    } catch (error) {
        console.error(error)
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
		if (!payData.exists) throw new Error('Payment not found!')
        const transactionStatus = payData.data().transactionStatus

        const driverId = payData.data().driverId
        const walletDoc = Wallet.doc(driverId)
        const bookingId = payData.data().bookingId
        const bookingRoomDoc = BookingRoom.doc(bookingId)

        if (!payData.exists) throw new Error(`Payment id: ${orderId} not found!`)
        else if (transactionStatus === 'expire' || transactionStatus === 'pending' || transactionStatus === null) {
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
            const bookingRoomData = await bookingRoomDoc.get()
			await updateWalletIncome(driverId, amount, { transactionTime: transaction_time, paymentId: orderId })
            await bookingRoomDoc.update({ isPayed: true })
			await Summary.doc('total_booking').update({ count_payed: FieldValue.increment(1) })
			await Summary.doc('total_payment').update({ count_all: FieldValue.increment(1) })
			await Summary.doc('total_payment').update({ count_success: FieldValue.increment(1) })
			if (transactionStatus === 'expire' && transactionStatusNew === 'settlement') {
				await Summary.doc('total_payment').update({ count_expire: FieldValue.increment(-1) })
			}
            const notifDataPassenger = {
                title: 'Status Pembayaran',
                message: `Anda berhasil membayar senilai Rp${amount} dengan ID ${orderId}!`,
            }
            const notifDataDriver = {
                title: 'Status Pembayaran',
                message: `Anda telah menerima uang sebesar Rp${amount} dengan ID ${orderId}!`,
            }
			sendNotification(
				bookingRoomData.data().passenger.uid,
				notifDataPassenger,
				bookingRoomData.data().driver.uid,
			)
			sendNotification(bookingRoomData.data().driver.uid, notifDataDriver, bookingRoomData.data().passenger.uid)
        }
    } catch (error) {
        console.error(error)
    }
}

const getStatusTransaction = async (req, res) => {
    try {
        const url = `https://api.sandbox.midtrans.com/v2/${req.body.orderId}/status`
        const config = {
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString('base64')}`,
            },
        }
        const dataStatus = await axios.get(url, config)
        res.send({ message: 'Successfully get status data', data: dataStatus.data })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Failed get status!', error })
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
            message: 'Successfully create expired transaction!',
            data: {
                newToken: transaction.token,
                newRedirectUrl: transaction.redirect_url,
                dataStatus: dataStatus.data,
            },
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Failed call Error Transaction, can't create new expire transaction", error })
    }
}

const getDetailTransaction = async (req, res) => {
    try {
        const payData = await Payment.doc(req.body.paymentId).get()
        const { transactionTime, expiredTime, ...data } = payData.data()
        res.send({
            message: 'Successfully get detail transaction!',
            data: {
                transactionTime: transactionTime.toDate(),
                expiredTime: expiredTime.toDate(),
                ...data,
            },
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed get detail transaction!', error })
    }
}

module.exports = {
    createTransaction,
    finishTransaction,
    notificationTransaction,
    getStatusTransaction,
    errorTransaction,
    getDetailTransaction,
}
