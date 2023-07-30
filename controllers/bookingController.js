const { resultDriver } = require('./driverController')
const { getUserById } = require('./userFirestoreController')

const userSend = (user) => {
	return {
		name: user.name,
		avatar: user.avatar,
		address: user.address
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
		const passenger = await getUserById(req.uid)
		const driver = await getUserById(req.body.idDriver)
        const price = bookingPrice(req.body.mileage)
		const resDriver = userSend(driver)
		const resPass = userSend(passenger)
		res.send({ price, passenger: resPass, driver: resDriver })
	} catch (err) {
		console.error(err)
		res.send({ err })
	}
}

module.exports = { bookingRoomResult, bookingResult }
