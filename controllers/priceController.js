const Price = require('../instances/firestoreInstance')('price')

const bookingPrice = async (distance) => {
	try {
		const priceDecision = await Price.doc('decision').get()
		const tarifPer2KM = priceDecision.data().tarif_increase_per2km
		const tarifStart = priceDecision.data().tarif_start
		if (distance <= 2000) {
			const discountPrice = parseFloat(tarifStart - ((tarifStart * 30) / 100))
			return discountPrice
			// return tarifStart
		} else {
			const multiple2000m = Math.ceil(distance / 2000)
			const price = tarifStart + (multiple2000m - 1) * tarifPer2KM
			const discountPrice = parseFloat(price - ((price * 30) / 100))
			return discountPrice
			// return price
		}
	} catch (error) {
		console.log(error)
		throw new Error('Failed calculate price!')
	}
}

const calculateDiscount = async (income) => {
	try {
		const priceDecision = await Price.doc('decision').get()
		const passengerDiscount = priceDecision.data().passenger_percent_discount
		const percentAdmin = priceDecision.data().admin_percent_income
		const percentRewardDriver = priceDecision.data().driver_reward_percent_income
		console.log('KETETAPAN HARGA: ', passengerDiscount, percentAdmin, percentRewardDriver)

		// if (income == 4000) {}
		// else {}

		const originPrice = parseFloat((income * 100) / (100 - passengerDiscount))
		const driverOriginIncome = parseFloat((originPrice * (100 - percentAdmin)) / 100)
		const driverIncome = Math.floor(parseFloat(driverOriginIncome + ((driverOriginIncome * percentRewardDriver) / 100)))
		const adminIncome = Math.floor(parseFloat(income - driverIncome))

		console.log(originPrice, driverIncome, adminIncome)
		return { driverOriginIncome, passengerDiscount, percentRewardDriver, originPrice, adminIncome, driverIncome }
	} catch (error) {
		console.log(error)
		throw new Error('Failed to calculate price')
	}
}


module.exports = { bookingPrice, calculateDiscount }
