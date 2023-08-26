const { Timestamp, Filter, FieldValue } = require('firebase-admin/firestore')

const BookingRoom = require('../instances/firestoreInstance')('booking_room')

const { resultBookingRoom, resultLiveRoom } = require('./matchingBookController')
const { getUserById } = require('./userFirestoreController')

const userSend = (user) => {
    return {
        uid: user.uid,
        name: user.name,
        nim: user.nim,
        avatar: user.avatar,
        fcmToken: user.fcmToken || null,
    }
}

const bookingPrice = (distance) => {
    const multiple1000m = Math.ceil(distance / 1000)
    const price = 2000 + (multiple1000m - 1) * 2000
    return price
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
        res.send({ message: 'Successfully create booking_room!', data: { bookingId } })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed create booking_room!', error })
    }
}

const passengerCreateRoom = async (req, res) => {
    try {
        const distance = req.body.distance
        const price = bookingPrice(distance)
        const passenger = await getUserById(req.uid)
        const resPass = userSend(passenger)
        const bookingRoomDoc = BookingRoom.doc(req.body.bookingId)
        const bookingRoomData = await bookingRoomDoc.get()
        const departure = req.body.passenger.departure
        const destination = req.body.passenger.destination

        // testing
        // await BookingRoom.doc('check_distance').update({ createRoom: distance })

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
        const price = bookingPrice(distance)
        const bookingRooms = await resultBookingRoom(req.body.passenger, price)

        // testing
        // await BookingRoom.doc('check_distance').update({ getRoom: distance })

        if (bookingRooms.length != 0)
            res.send({ message: 'BookingRoom found!', data: { distance, price, bookingRooms } })
        else
            res.status(404).send({
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
        // const bookingRoomData = await bookingRoomDoc.get()
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
        // const price = bookingPrice(distance)
        const bookingRooms = await resultLiveRoom(req.body.currentLocation)
        if (bookingRooms.length != 0)
            res.send({ message: 'BookingRoom found!', data: { bookingRooms } })
        else
            res.status(404).send({
                message: 'No BookingRoom and drivers match!',
                data: { bookingRooms },
            })
	} catch (error) {
		console.log(error)
        res.status(500).send({ message: 'Failed to get live BookingRoom and drivers!', error })
	}
}

module.exports = {
    driverCreateRoom,
    passengerCreateRoom,
    passengerGetRoom,
    driverCancelRoom,
    passengerCancelRoom,
	getRoomCurrentLocation
}
