const { getUsersWhere, getUserById } = require('./userFirestoreController')
const BookingRoom = require('../instances/firestoreInstance')('booking_room')

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

const resultBookingRoom = async (passenger) => {
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
            if (departureDistance <= 3000 && destinationDistance <= 3000) {
                const { departureDate, ...data } = { ...doc.data() }
                result.push({ ...data, departureDate: departureDate.toDate() })
                result.push({})
            }
        })

        return result
    } catch (error) {
        console.log(error)
        throw new Error("Can't result driver")
    }
}

module.exports = { resultBookingRoom }
