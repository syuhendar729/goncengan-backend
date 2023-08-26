const Wallet = require('../instances/firestoreInstance')('wallet')
const Payout = require('../instances/firestoreInstance')('payout')
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
        const walletDoc = Wallet.doc(req.uid)
        const walletData = await walletDoc.get()
        res.send({ message: 'Successfully get all data', data: walletData.data() })
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
        const walletData = await Wallet.doc(req.uid).get()
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
            })
            res.send({
                message: 'Successfully request payout',
                data: { balanceBefore: balance, balanceAfter: balance - amount },
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ error })
    }
}

const updateWalletIncome = async (walletId, income, data) => {
	try {
		const adminIncome = parseFloat((income * 20) / 100) 
		const driverIncome = parseFloat(income - adminIncome)
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
		await walletDocDriver.update({ 
            balance: FieldValue.increment(driverIncome),
            totalAmountIncome: FieldValue.increment(driverIncome),
            dataIncome: FieldValue.arrayUnion({
                paymentId: data.paymentId,
                amount: driverIncome,
                timeDate: Timestamp.fromDate(new Date(data.transactionTime)),
            }),
		})
	} catch (error) {
		console.error(error)
		throw new Error('Failed to update Wallet for Driver and Admin')
	}
}

module.exports = {
    getWalletBalance,
    getWalletIncome,
    getWalletExpense,
    getWalletAllData,
	updateDataWallet,
    payoutRequest,
	updateWalletIncome
}
