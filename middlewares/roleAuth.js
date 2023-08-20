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

const isValidDriver = async (req, res, next) => {
    try {
        const roomData = await BookingRoom.doc(req.body.bookingId).get()
		if (roomData.data().driver.uid === req.uid) next()
		else res.status(403).send({ message: 'You are not a valid driver!' })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Failed to match driverId in BookingRoom!' })
    }
}

const isValidPassenger = async (req, res, next) => {
}

module.exports = { isActiveRoom, isValidDriver, isValidPassenger }





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
