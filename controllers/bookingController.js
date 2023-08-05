const { getFirestore, Timestamp } = require('firebase-admin/firestore')
const db = getFirestore()
const BookingRoom = db.collection('booking_room')
const { resultDriver } = require('./driverController')
const { getUserById } = require('./userFirestoreController')

const userSend = (user) => {
	return {
		name: user.name,
		avatar: user.avatar,
		fcmToken: null
	}
}

const bookingPrice = (mileage) => {
    const multiple500m = Math.ceil(mileage / 500)
    const price = 2000 + (multiple500m - 1) * 2000
    return price
}

const bookingRoomResult = async (req, res) => {
    try {
    	const passenger = await getUserById(req.uid)
        const price = bookingPrice(req.body.mileage)
        const drivers = await resultDriver(passenger)
        if (drivers.length != 0) res.send({ price, drivers })
        else res.send({ drivers: 'Tidak ada driver di sekitar' })
    } catch (err) {
        res.send({ err })
    }
}

const bookingResult = async (req, res) => {
	try {
		// const { idDriver, mileage, departureLocation, destinationLocation } = req.body
		const passenger = await getUserById(req.uid)
		const driver = await getUserById(req.body.idDriver)
        const price = bookingPrice(req.body.mileage)
		const resDriver = userSend(driver)
		const resPass = userSend(passenger)
		await BookingRoom.doc().set({ 
			departureLocation: req.body.departureLocation, 
			destinationLocation: req.body.destinationLocation,
			driver: resDriver, passenger: resPass,
			isPayed: false, isBooked: false, 
			price: null, paymentId: null,
			bookingId: null, chatRoomId: null,
			departureDate: Timestamp.fromDate(new Date())
		})
		res.send({ price, passenger: resPass, driver: resDriver })
	} catch (err) {
		console.error(err)
		res.send({ err })
	}
}

module.exports = { bookingRoomResult, bookingResult }
