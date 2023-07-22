const { getFirestore, GeoPoint } = require('firebase-admin/firestore')
const configFirebase = require('../config/configFirebase')
const app = configFirebase()

const db = getFirestore()
const Users = db.collection('users')

// === CRUD ===

const userFirestore = async (req, res) => {
	try {
		const result = []
		const users = await Users.get()
		users.forEach((doc) => {
			result.push({ id: doc.id, ...doc.data() })
		})
		res.send(result)
	} catch (err) {
		res.status(500).json({ msg: 'Gagal mengambil data users!', err })
	}
}

const userFirestoreDetail = async (req, res) => {
	try {
		const user = await Users.doc(req.uid).get()
		if (!user.exists) res.status(404).json({ msg: 'User tidak ditemukan!' })
		else res.send(user.data())
	} catch (err) {
		res.status(500).json({ msg: 'Gagal mengambil data user!', err })
	}
 }

const userAnotherFirestoreDetail = async (req, res) => {
	try {
		const user = await Users.doc(req.params.id).get()
		if (!user.exists) res.status(404).json({ msg: 'User tidak ditemukan!' })
		else {
			const {name, urlToAvatar, formattedLocation} = { ...user.data() }
			res.send({name, urlToAvatar, formattedLocation})
		} 
	} catch (err) {
		console.error(err);;
		res.status(500).json({ msg: 'Gagal mengambil data user!', err })
	}
}

const userFirestoreCreate = async (data, uid) => {
	try {
		data.geolocation = new GeoPoint(data.geolocation.lat, data.geolocation.long)
		await Users.doc(uid).set({ ...data, uid })
	} catch (err) {
		throw err
	}
}

const userFirestoreUpdate = async (data, uid) => {
    const user = Users.doc(uid)
    try {
		data.geolocation = new GeoPoint(data.geolocation.lat, data.geolocation.long)
        const res = await user.update({ ...data, uid })
        return res
    } catch (err) {
        throw err
    }
}

module.exports = {
    userFirestore,
    userFirestoreDetail,
	userAnotherFirestoreDetail,
    userFirestoreCreate,
    userFirestoreUpdate,
}
