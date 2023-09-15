const moment = require('moment')
const Wallet = require('../instances/firestoreInstance')('wallet')
const Payout = require('../instances/firestoreInstance')('payout')
const Summary = require('../instances/firestoreInstance')('summary')
const Price = require('../instances/firestoreInstance')('price')
const { Timestamp, FieldValue } = require('firebase-admin/firestore')

const getWalletBalance = async (req, res) => {
    try {
        const walletDoc = Wallet.doc(req.uid)
        const walletData = await walletDoc.get()
        res.send({ message: 'Successfully get balance', data: { balance: walletData.data().balance } })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Failed update wallet data!', error })
    }
}

const getWalletIncome = async (req, res) => {
    try {
        const walletDoc = Wallet.doc(req.uid)
        const walletData = await walletDoc.get()
        res.send({ message: 'Successfully get income', data: { dataIncome: walletData.data().dataIncome } })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error })
    }
}

const getWalletExpense = async (req, res) => {
    try {
        const walletDoc = Wallet.doc(req.uid)
        const walletData = await walletDoc.get()
        res.send({ message: 'Successfully get income', data: { dataExpense: walletData.data().dataExpense } })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Failed update wallet data!', error })
    }
}

const getWalletAllData = async (req, res) => {
    try {
		const dataIncomeFormatted = []
		const dataExpenseFormatted = []
        const walletDoc = Wallet.doc(req.uid)
        const walletData = await walletDoc.get()
		const { dataIncome, dataExpense, ...data } = walletData.data()
		dataIncome.forEach((income) => {
			const { timeDate, ...other } = income
			// const formattedDate = moment(income.timeDate.toDate()).utcOffset(7).format('YYYY-MM-DD HH:mm:ss')
			const formattedDate = moment(income.timeDate.toDate()).format('YYYY-MM-DD HH:mm:ss')
			dataIncomeFormatted.push({ timeDate: formattedDate, ...other })
		})
		dataExpense.forEach((expense) => {
			const { timeDate, ...other } = expense
			// const formattedDate = moment(expense.timeDate.toDate()).utcOffset(7).format('YYYY-MM-DD HH:mm:ss')
			const formattedDate = moment(expense.timeDate.toDate()).format('YYYY-MM-DD HH:mm:ss')
			dataExpenseFormatted.push({ timeDate: formattedDate, ...other })
		})
        res.send({ message: 'Successfully get all data', data: { dataIncome: dataIncomeFormatted, dataExpense: dataExpenseFormatted, ...data } })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Failed update wallet data!', error })
    }
}

const updateDataWallet = async (req, res) => {
	try {
        const walletDoc = Wallet.doc(req.uid)
		await walletDoc.update({ rekening: req.body.rekening })
		res.send({ message: 'Successfully get all data', data: req.body.rekening })
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: 'Failed update wallet data!', error })
	}
}

const payoutRequest = async (req, res) => {
    try {
        const payoutDoc = Payout.doc()
		const walletDoc = Wallet.doc(req.uid)
        const walletData = await walletDoc.get()
        const amount = req.body.amount
        const balance = walletData.data().balance
        if (balance < amount)
            res.send({ message: "Your balance is less than, can't request payout", data: { balance } })
        else {
			await payoutDoc.set({
				payoutId: payoutDoc.id,
				payoutTime: Timestamp.fromDate(new Date()),
				amount,
				payoutStatus: 'pending',
				driverId: req.uid,
				rekening: req.body.rekening
			})
			await walletDoc.update({ 
				balance: FieldValue.increment(-amount), 
				dataExpense: FieldValue.arrayUnion({
					payoutId: payoutDoc.id,
					amount,
					timeDate: Timestamp.fromDate(new Date()),
				}) 
			})
            res.send({
                message: 'Successfully request payout',
                data: { amountTaken: amount, balanceBefore: balance, balanceAfter: balance - amount },
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ error })
    }
}

const calculateDiscount = async (income) => {
	try {
		const priceDecision = await Price.doc('decision').get()
		const passengerDiscount = priceDecision.data().passenger_percent_discount
		const percentAdmin = priceDecision.data().admin_percent_income
		const percentRewardDriver = priceDecision.data().driver_reward_percent_income
		console.log('KETETAPAN HARGA: ', passengerDiscount, percentAdmin, percentRewardDriver)
		console.log('CETAK LAYAR INI')

		// if (income == 4000) {}
		// else {}

		const originPrice = parseFloat((income * 100) / (100 - passengerDiscount))
		const dirverOriginIncome = parseFloat((originPrice * (100 - percentAdmin)) / 100)
		const driverIncome = Math.floor(parseFloat(dirverOriginIncome + ((dirverOriginIncome * percentRewardDriver) / 100)))
		const adminIncome = Math.floor(parseFloat(income - driverIncome))

		console.log(originPrice, driverIncome, adminIncome)
		return { adminIncome, driverIncome }
	} catch (error) {
		console.log(error)
		throw new Error('Failed to calculate price')
	}
}

const updateWalletIncome = async (walletId, income, data) => {
	try {
		// const adminIncome = parseFloat((income * 20) / 100) // origin
		// const driverIncome = parseFloat(income - adminIncome) // origin
		const { adminIncome, driverIncome } = await calculateDiscount(income)
		const walletDocDriver = Wallet.doc(walletId)
		const walletDocAdmin = Wallet.doc('ADMIN')
		await walletDocAdmin.update({ 
            balance: FieldValue.increment(adminIncome),
            totalAmountIncome: FieldValue.increment(adminIncome),
            dataIncome: FieldValue.arrayUnion({
				driverId: walletId,
                paymentId: data.paymentId,
                amount: adminIncome,
                timeDate: Timestamp.fromDate(new Date(data.transactionTime)),
            }),
		})
		await Summary.doc('total_wallet').update({ income_admin: FieldValue.increment(adminIncome) })
		await walletDocDriver.update({ 
            balance: FieldValue.increment(driverIncome),
            totalAmountIncome: FieldValue.increment(driverIncome),
            dataIncome: FieldValue.arrayUnion({
                paymentId: data.paymentId,
                amount: driverIncome,
                timeDate: Timestamp.fromDate(new Date(data.transactionTime)),
            }),
		})
		await Summary.doc('total_wallet').update({ income_all_users: FieldValue.increment(driverIncome) })
	} catch (error) {
		console.error(error)
		throw new Error('Failed to update Wallet for Driver and Admin')
	}
}

const getDetailPayout = async (req, res) => {
	try {
		const payoutData = await Payout.doc(req.body.payoutId).get()
		const { payoutTime, ...data } = payoutData.data()
		const formattedDate = moment(payoutTime.toDate()).utcOffset(7).format('YYYY-MM-DD HH:mm:ss')
		res.send({ message: 'Successfully', data: { payoutTime: formattedDate, ...data } })
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: '', error })
	}
}

module.exports = {
    getWalletBalance,
    getWalletIncome,
    getWalletExpense,
    getWalletAllData,
	updateDataWallet,
    payoutRequest,
	updateWalletIncome,
	getDetailPayout,
	calculateDiscount
}
