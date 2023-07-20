const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const serviceAccount =
    process.env.FIREBASE_SECRET || require('../.cred/ServiceAccount.json')
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()
const Users = db.collection('users')

// === CRUD ===

const getUsers = async (req, res) => {
    const result = []
    const users = await Users.get()
    users.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() })
    })
    res.send(result)
}

const getDetailUser = async (req, res) => {
    const user = Users.doc(req.params.id)
    const doc = await user.get()
    if (!doc.exists) res.send({ msg: 'User tidak ditemukan!' })
    else res.send(doc.data())
}

const addUser = (data, uid) => {
    Users.add({ ...data, uid })
}

const deleteUser = async (req, res) => {
    const id = req.params.id.toString()
    await Users.doc(id)
        .delete()
        .then(() => res.send({ message: 'Berhasil Delete!' }))
        .catch((err) => res.status(500).send({ message: 'GAGAL!' }))
}

const updateUser = async (data, uid, id) => {
    const user = Users.doc(id)
    await user.update({...data, uid})
}

module.exports = { getUsers, getDetailUser, addUser, deleteUser, updateUser }
