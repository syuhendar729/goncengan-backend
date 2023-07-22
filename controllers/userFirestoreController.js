const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore, GeoPoint } = require('firebase-admin/firestore')

const serviceAccount =
    process.env.FIREBASE_SECRET || require('../.cred/ServiceAccount.json')
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()
const Users = db.collection('users')

// === CRUD ===

const userFirestore = async (req, res) => {
    const result = []
    const users = await Users.get()
    users.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() })
    })
    res.send(result)
}

const userFirestoreDetail = async (req, res) => {
    const user = Users.doc(req.params.id)
    await user
        .get()
        .then((doc) => res.send(doc.data()))
        .catch((err) => res.send({ msg: 'User tidak ditemukan!' }))
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
    userFirestoreCreate,
    userFirestoreUpdate,
}
