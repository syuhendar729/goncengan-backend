const { resultDriver } = require('./driverController')

const bookingPrice = (mileage) => {
    const multiple500m = Math.ceil(mileage / 500)
    const price = 2000 + (multiple500m - 1) * 2000
    // res.json({ price });
    return price
}

const bookingRoomResult = async (req, res) => {
    try {
        const price = bookingPrice(req.body.mileage)
        const drivers = await resultDriver(
            req.body.maxDistance,
            req.body.passenger,
        )
        if (drivers.length != 0) res.send({ price, drivers })
        else res.send({ drivers: 'Tidak ada driver di sekitar' })
    } catch (err) {
        res.send({ err })
    }
}

module.exports = { bookingRoomResult }
