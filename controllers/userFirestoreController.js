const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

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

const userFirestoreCreate = (data, uid) => {
    Users.doc(uid).set({ ...data, uid })
}

const userFirestoreUpdate = async (data, uid) => {
	const user = Users.doc(uid)
	try {
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



