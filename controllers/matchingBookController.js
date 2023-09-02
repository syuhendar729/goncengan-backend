// const moment = require('moment')
const { getUsersWhere, getUserById } = require('./userFirestoreController')
const BookingRoom = require('../instances/firestoreInstance')('booking_room')
const Users = require('../instances/firestoreInstance')('users')

const calculateDistance = (lat1, long1, lat2, long2) => {
    const radius = 6378137.0 // Radius bumi dalam meter
    const distance =
        Math.acos(
            Math.sin((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) +
                Math.cos((lat1 * Math.PI) / 180) *
                    Math.cos((lat2 * Math.PI) / 180) *
                    Math.cos(((long1 - long2) * Math.PI) / 180),
        ) * radius
    return distance // Dalam meter
}

const resultBookingRoom = async (passenger, reqPrice) => {
    try {
        const result = []

        const bookingRoomData = await BookingRoom.where('passenger', '==', null).get()
        bookingRoomData.forEach((doc) => {
            // console.log(doc.data());
            const departure = doc.data().driver.departure
            const destination = doc.data().driver.destination
            const departureDistance = calculateDistance(
                departure.latitude,
                departure.longitude,
                passenger.departure.latitude,
                passenger.departure.longitude,
            )
            const destinationDistance = calculateDistance(
                destination.latitude,
                destination.longitude,
                passenger.destination.latitude,
                passenger.destination.longitude,
            )
            // Filter by departureDate???
            // const { departureDate, price, driver, ...data } = doc.data()
            const { departureDate, price, ...data } = doc.data()
            const departureDateJS = departureDate.toDate()
			// const formattedDate = moment(departureDateJS).utcOffset(7).format('YYYY-MM-DD HH:mm:ss')
            if (departureDistance <= 3000 && destinationDistance <= 3000 && departureDateJS > new Date()) {
                // console.log({ departureDistance, destinationDistance })
                // const user = await Users.doc(driver.uid).get()
                // const { name, nim, avatar, fcmToken, uid } = user.data()
                result.push({
                    price: reqPrice,
                    departureDate: departureDateJS,
                    // departureDate: formattedDate,
                    // driver: { name, nim, avatar, fcmToken, uid, departure, destination },
                    ...data,
                })
            }
        })

        return result
    } catch (error) {
        console.log(error)
        throw new Error("Can't result driver")
    }
}

const resultLiveRoom = async (currentLocation) => {
	try {
		const result = []
		const bookingRoomData = await BookingRoom.where('passenger', '==', null).get()
		bookingRoomData.forEach((doc) => {
            const departure = doc.data().driver.departure
            const departureDistance = calculateDistance(
                departure.latitude,
                departure.longitude,
                currentLocation.latitude,
                currentLocation.longitude,
            )
            const { departureDate, price, ...data } = doc.data()
            const departureDateJS = departureDate.toDate()
			if (departureDistance <= 3000 && departureDateJS > new Date()) {
                result.push({ departureDistance, departureDate: departureDateJS, ...data })
			}
		})

        return result
	} catch (error) {
        console.log(error)
        throw new Error("Can't result driver")
	}
}

module.exports = { resultBookingRoom, resultLiveRoom }
