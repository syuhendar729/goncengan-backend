const BookingRoom = require('../instances/firestoreInstance')('booking_room')
const { Filter } = require('firebase-admin/firestore')
const { getUserById, userFirestoreUpdate } = require('../controllers/userFirestoreController')

const isActiveRoom = async (req, res, next) => {
	try {
		const uid = req.uid
        const totalRooms = await BookingRoom.where('isPayed', '==', false)
			.where(
				Filter.or(
					Filter.where('driver.uid', '==', uid),
					Filter.where('passenger.uid', '==', uid)
				)
			).count().get()
		if (totalRooms.data().count === 0) next()
		else res.status(403).send({ message: 'You are now in active room!' })
	} catch (error) {
        console.error(error)
		res.status(500).send({ message: 'Failed to get active room!', error })
	}
}

const isActiveDriver = async (req, res, next) => {
    try {
		const bookingId = req.body.bookingId || req.params.bookingId
        const roomData = await BookingRoom.doc(bookingId).get()
		if (roomData.exists) {
			req.bookingRoomData = roomData.data()
			if (roomData.data().driver.uid === req.uid) next()
			else res.status(403).send({ message: 'You are not a valid driver!' })
		} else res.status(404).send({ message: "BookingRoom doesn't exist!" })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Failed to check isActive driver in BookingRoom!', error })
    }
}

const isActivePassenger = async (req, res, next) => {
    try {
        const roomData = await BookingRoom.doc(req.body.bookingId).get()
		if (roomData.exists) {
			req.bookingRoomData = roomData.data()
			if (roomData.data().passenger.uid === req.uid) next()
			else res.status(403).send({ message: 'You are not a valid passenger!' })
		} else res.status(404).send({ message: "BookingRoom doesn't exist!" })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Failed to check isActive passenger in BookingRoom!', error })
    }
}

module.exports = { isActiveRoom, isActiveDriver, isActivePassenger }



