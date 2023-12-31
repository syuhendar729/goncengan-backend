const { Timestamp, Filter, FieldValue } = require('firebase-admin/firestore')
const BookingRoom = require('../instances/firestoreInstance')('booking_room')
const Summary = require('../instances/firestoreInstance')('summary')
const Price = require('../instances/firestoreInstance')('price')
const { resultBookingRoom, resultLiveRoom } = require('./matchingBookController')
const { getUserById } = require('./userFirestoreController')
const { bookingPrice } = require('./priceController')

const userSend = (user) => {
    return {
        uid: user.uid,
        name: user.name,
        nim: user.nim,
        avatar: user.avatar || null,
        fcmToken: user.fcmToken || null,
    }
}

const driverCreateRoom = async (req, res) => {
    try {
        const driver = await getUserById(req.uid)
        const resDriver = userSend(driver)
        const departure = req.body.driver.departure
        const destination = req.body.driver.destination
		// const bookingId = driver.email.split('@')[0] + '_' + BookingRoom.doc().id
        // await BookingRoom.doc(bookingId).set({
		const bookingRoomDoc = BookingRoom.doc()
		const bookingId = bookingRoomDoc.id
		await bookingRoomDoc.set({
            bookingId,
            chatRoomId: null,
            departureDate: Timestamp.fromDate(new Date(req.body.departureDate)),
            distance: null,
            driver: { ...resDriver, departure, destination },
            isArrive: false,
            isBooked: false,
            isDepart: false,
            isPayed: false,
            isPicked: false,
            passenger: null,
            paymentId: null,
            price: null,
            users: FieldValue.arrayUnion(req.uid),
        })
		await Summary.doc('total_booking').update({ count_all: FieldValue.increment(1) })
        res.send({ message: 'Successfully create booking_room!', data: { bookingId } })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed create booking_room!', error })
    }
}

const passengerCreateRoom = async (req, res) => {
    try {
        const distance = req.body.distance
        const price = await bookingPrice(distance)
        const passenger = await getUserById(req.uid)
        const resPass = userSend(passenger)
        const bookingRoomDoc = BookingRoom.doc(req.body.bookingId)
        const bookingRoomData = await bookingRoomDoc.get()
        const departure = req.body.passenger.departure
        const destination = req.body.passenger.destination

        if (bookingRoomData.data().passenger === null) {
            await bookingRoomDoc.update({
                distance,
                price,
                passenger: { ...resPass, departure, destination },
                users: FieldValue.arrayUnion(req.uid),
            })
            res.send({
                message: 'Successfully update BookingRoom for passenger!',
                data: { bookingId: req.body.bookingId, distance, price, passenger: resPass },
            })
        } else res.status(403).send({ message: 'Passenger already exist!' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed update BookingRoom!', error })
    }
}

const passengerGetRoom = async (req, res) => {
    try {
        const distance = req.body.distance
        const price = await bookingPrice(distance)
		// const priceDecision = await Price.doc('decision').passenger_percent_discount
        const bookingRooms = await resultBookingRoom(req.body.passenger, price)

        if (bookingRooms.length != 0)
            res.send({ message: 'BookingRoom found!', data: { distance, price, bookingRooms } })
        else
            res.send({
                message: 'No BookingRoom and drivers match!',
                data: { distance, price, bookingRooms },
            })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed to get BookingRoom and drivers!', error })
    }
}

const driverCancelRoom = async (req, res) => {
    try {
        const bookingId = req.params.bookingId
        const bookingRoomDoc = BookingRoom.doc(bookingId)
        await bookingRoomDoc.delete()
		await Summary.doc('total_booking').update({ count_all: FieldValue.increment(-1) })
        res.send({
            message: 'Successfully cancel dan delete BookingRoom from driver!',
            data: { bookingId, driverId: req.uid },
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed to cancel BookingRoom!', error })
    }
}

const passengerCancelRoom = async (req, res) => {
    try {
        const userId = req.uid
        const bookingId = req.body.bookingId
        const bookingRoomDoc = BookingRoom.doc(bookingId)
        const bookingRoomData = req.bookingRoomData
        const { passenger, driver } = bookingRoomData
        if (passenger === null) res.status(400).send({ message: "Passenger is null, can't cancel BookingRoom!" })
        else {
            await bookingRoomDoc.update({
                distance: null,
                isBooked: false,
                passenger: null,
                price: null,
                users: FieldValue.arrayRemove(passenger.uid),
            })
            res.send({ message: 'Successfully cancel passenger in BookingRoom!', data: { bookingId, userId } })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed to cancel BookingRoom!', error })
    }
}

const getRoomCurrentLocation = async (req, res) => {
	try {
        const bookingRooms = await resultLiveRoom(req.body.currentLocation)
        if (bookingRooms.length != 0)
            res.send({ message: 'BookingRoom found!', data: { bookingRooms } })
        else
            res.send({
                message: 'No BookingRoom and drivers match!',
                data: { bookingRooms },
            })
	} catch (error) {
		console.log(error)
        res.status(500).send({ message: 'Failed to get live BookingRoom and drivers!', error })
	}
}

const passengerGetPrice = async (req, res) => {
	try {
		const distance = req.body.distance
		const price = await bookingPrice(distance)
		/* const priceDecision = await Price.doc('decision').get()
		const percentDiscount = priceDecision.data().passenger_percent_discount
		const percentReward = priceDecision.data().driver_reward_percent_income
		const { adminIncome, driverIncome } = await calculateDiscount(price) */
		// res.send({ message: 'Successfully get price!', data: { distance, price, percentDiscount, percentReward, adminIncome, driverIncome } })
		res.send({ message: 'Successfully get price!', data: { distance, price } })
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: '', error })
	}
}

module.exports = {
    driverCreateRoom,
    passengerCreateRoom,
    passengerGetRoom,
    driverCancelRoom,
    passengerCancelRoom,
	getRoomCurrentLocation,
	passengerGetPrice
}
