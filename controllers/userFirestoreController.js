const { getAuth } = require('firebase-admin/auth')
const { FieldValue } = require('firebase-admin/firestore')
const Users = require('../instances/firestoreInstance')('users')
const Wallet = require('../instances/firestoreInstance')('wallet')
const Summary = require('../instances/firestoreInstance')('summary')

const userFirestoreDetail = async (req, res) => {
    try {
        const user = await Users.doc(req.uid).get()
        if (!user.exists) res.status(404).json({ message: 'User not found!' })
        else res.send({ message: 'Successfully get detail user!', data: user.data() })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch user data!', error })
    }
}

const userFirestoreCreate = async (req, res) => {
    try {
        const uid = req.uid
        const data = req.body
		if (req.body.email === undefined) {
        	const userRecord = await getAuth().getUser(uid)
        	const { email } = userRecord.toJSON()
        	await Users.doc(uid).set({ uid, email, isDisabled: false, ...data })
		} else {
        	await Users.doc(uid).set({ uid, isDisabled: false, ...data })
		}
		
        await Wallet.doc(uid).set({
            userId: uid,
            balance: 0,
            dataIncome: [],
            dataExpense: [],
            totalAmountIncome: 0,
            totalAmountExpense: 0,
            rekening: null,
        })
		await Summary.doc('total_users').update({ count_all: FieldValue.increment(1) })
        res.send({ message: 'Successfully created user!', data: { uid, ...data } })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: `Failed to created user!`, error })
    }
}

const userFirestoreUpdate = async (req, res) => {
    try {
        const data = req.body
        const uid = req.uid
        const userRecord = await getAuth().updateUser(uid, { email: data.email, displayName: data.name })
        const user = Users.doc(uid)
        await user.update({ ...data })
        res.send({ message: 'Successfully updated the user!', data: { userRecord } })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed to update user!', error })
    }
}

const getUsersWhere = async (key, assign, value) => {
    try {
        const users = await Users.where(key, assign, value).get()
        const result = []
        users.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() })
        })
        if (users.length != 0) return result
        else throw new Error('User not found!')
    } catch (error) {
        console.error(error)
        throw new Error('Failed to find user data with key and value!')
    }
}

const getUserById = async (id) => {
    try {
        const user = await Users.doc(id).get()
        if (!user.exists) throw new Error('User not found!')
        return user.data()
    } catch (error) {
        console.error(error)
        throw new Error('Failed to find user data by id!')
    }
}

module.exports = {
    userFirestoreDetail,
    userFirestoreCreate,
    userFirestoreUpdate,
    getUsersWhere,
    getUserById,
}
