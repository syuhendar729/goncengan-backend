const BookingRoom = require('../instances/firestoreInstance')('booking_room')
const { Filter } = require('firebase-admin/firestore')
const { getUserById, userFirestoreUpdate } = require('../controllers/userFirestoreController')

const getActiveBookingRoom = async (userId) => {
    try {
        const totalRooms = await BookingRoom.where('isPayed', '==', false)
			.where(
				Filter.or(
					Filter.where('driver.uid', '==', userId),
					Filter.where('passenger.uid', '==', userId)
				)
			).count().get()
		return totalRooms.data().count
    } catch (error) {
        console.error(error)
        throw new Error('Failed to filter BookingRoom by uid!')
    }
}

const isActiveRoom = async (req, res, next) => {
	try {
		const result = await getActiveBookingRoom(req.uid)
		if (result === 0) next()
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
			if (roomData.data().driver.uid === req.uid) next()
			else res.status(403).send({ message: 'You are not a valid driver!' })
		}
		else res.status(404).send({ message: "BookingRoom doesn't exist!" })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Failed to validating driverId in BookingRoom!', error })
    }
}

const isActivePassenger = async (req, res, next) => {
    try {
        const roomData = await BookingRoom.doc(req.body.bookingId).get()
		if (roomData.exists) {
			if (roomData.data().passenger.uid === req.uid) next()
			else res.status(403).send({ message: 'You are not a valid passenger!' })
		} else res.status(404).send({ message: "BookingRoom doesn't exist!" })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Failed to validating driverId in BookingRoom!', error })
    }
}

module.exports = { isActiveRoom, isActiveDriver, isActivePassenger }





/* const passengerAuth = async (err, req, res, next) => {
	try {
		const user = await getUserById(req.uid)
		if (user.role === null || user.role === undefined) {
			const result = await userFirestoreUpdate({ role: 'passenger' }, req.uid)
			req.user = user
			next()
		} else if (user.role === 'passenger') {
			const result = await getActiveBookingRoom(req.uid)
			if (result.length !== 1) res.status(401).send({ message: `You are now in active BookingRoom!` })
		} else res.status(401).send({ message: `You are now the ${user.role}!` })
	} catch (error) {
		res.status(401).send({ message: 'Failed to detect your role!', error })
	}
} */
