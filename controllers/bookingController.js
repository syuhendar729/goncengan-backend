const BookingRoom = require('../instances/firestoreInstance')('booking_room')
const { Timestamp } = require('firebase-admin/firestore')
const { resultBookingRoom } = require('./driverController')
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
    const multiple500m = Math.ceil(distance / 500)
    const price = 2000 + (multiple500m - 1) * 2000
    return price
}

const driverCreateRoom = async (req, res) => {
    try {
        const bookingRoomDoc = BookingRoom.doc()
        const bookingId = bookingRoomDoc.id
        const driver = await getUserById(req.uid)
        const resDriver = userSend(driver)
        const departure = req.body.driver.departure
        const destination = req.body.driver.destination
        await bookingRoomDoc.set({
            bookingId,
            chatRoomId: null,
            departureDate: Timestamp.fromDate(new Date()),
            driver: { ...resDriver, departure, destination },
            isBooked: false,
            isPayed: false,
            passenger: null,
            paymentId: null,
            price: null,
        })
        res.send({ message: 'Successfully create booking_room!', bookingId })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed create booking_room!', error })
    }
}

const passengerCreateRoom = async (req, res) => {
    try {
        const uid = req.uid
        const passenger = await getUserById(uid)
        const resPass = userSend(passenger)
        const bookingRoomDoc = BookingRoom.doc(req.body.bookingId)
        const bookingRoomData = await bookingRoomDoc.get()
        const departure = req.body.passenger.departure
        const destination = req.body.passenger.destination
        const price = bookingPrice(req.body.distance)

        if (bookingRoomData.data().passenger === null) {
            await bookingRoomDoc.update({ passenger: { ...resPass, departure, destination }, isBooked: true, price })
            res.send({ message: 'Successfully update BookingRoom!', price, passenger: resPass })
        } else res.status(400).send({ message: 'Passenger already exist!' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed update BookingRoom!', error })
    }
}

const passengerGetDriver = async (req, res) => {
    try {
        const distance = req.body.distance
        const bookingRooms = await resultBookingRoom(req.body.passenger)
        const price = bookingPrice(distance)
        if (bookingRooms.length != 0) res.send({ message: 'BookingRoom found!', distance, price, bookingRooms })
        else res.status(404).send({ drivers: 'No BookingRoom and drivers match!' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed to get BookingRoom and drivers!', error })
    }
}

const driverCancelRoom = async (req, res) => {
    try {
        const uid = req.uid
        const bookingRoomDoc = BookingRoom.doc(req.params.bookingId)
        const bookingRoomData = await bookingRoomDoc.get()
        if (!bookingRoomData.exists) res.status(404).send({ message: "BookingRoom doesn't exist!" })
        else if (bookingRoomData.data().driver.uid === uid) {
            const response = await bookingRoomDoc.delete()
            res.send({ message: 'Successfully delete or cancel BookingRoom!', response })
        } else res.status(401).send({ message: 'Unautorizhed cancel bookingroom!' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed to delete or cancel BookingRoom!', error })
    }
}

module.exports = {
    driverCreateRoom,
    passengerCreateRoom,
    passengerGetDriver,
    driverCancelRoom,
}
