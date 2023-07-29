const { getUsersWhere } = require('./userFirestoreController')

const calculateDistance = (lat1, long1, lat2, long2) => {
    const radius = 6378137.0 // Radius bumi dalam meter
    const distance =
        Math.acos(
            Math.sin((lat1 * Math.PI) / 180) *
                Math.sin((lat2 * Math.PI) / 180) +
                Math.cos((lat1 * Math.PI) / 180) *
                    Math.cos((lat2 * Math.PI) / 180) *
                    Math.cos(((long1 - long2) * Math.PI) / 180),
        ) * radius
    return distance // Dalam meter
}

const resultDriver = async (passenger) => {
    try {
        const result = []
        const drivers = await getUsersWhere('role', '==', 'driver')
        drivers.forEach((driver) => {
            const distance = calculateDistance(
                passenger.address.latitude,
                passenger.address.longitude,
                driver.address.latitude,
                driver.address.longitude,
            )
			const { name, address, avatar } = driver
            if (distance <= 2000)
                result.push({ name, avatar, address, distance })
        })
        return result
    } catch (err) {
        throw err
    }
}

module.exports = { resultDriver }
