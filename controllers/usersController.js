const {
    initializeApp,
    applicationDefault,
    cert,
} = require('firebase-admin/app')
const {
    getFirestore,
    Timestamp,
    FieldValue,
    Filter,
} = require('firebase-admin/firestore')

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
        // console.log(doc.id, '=>', doc.data().nama)
    })
    res.send(result)
}

const getDetailUser = async (req, res) => {
    const user = Users.doc(req.params.id)
    const doc = await user.get()
    if (!doc.exists) res.send({ message: 'User tidak ditemukan!' })
    else res.send(doc.data())
}

const addUser = async (req, res) => {
    const { nama, nim, email, paySync, verified, alamat, file } = req.body
    const user = await Users.add({
        nama,
        nim,
        email,
        paySync,
        verified,
        alamat,
        file,
    }).catch((err) => res.status(500).send({ message: 'Gagal tambah data!' }))
    res.send({ message: 'Berhasil tambah data!', user })
}

const deleteUser = async (req, res) => {
    const id = req.params.id.toString()
    await Users.doc(id)
        .delete()
        .then(() => res.send({ message: 'Berhasil Delete!' }))
        .catch((err) => res.status(500).send({ message: 'GAGAL!' }))
}

const updateUser = async (req, res) => {
    const { nama, nim, email, paySync, verified, alamat, file } = req.body
    const user = Users.doc(req.params.id)
    await user
        .update({ nama, nim, email, paySync, verified, alamat, file })
        .then(() => res.send({ message: 'Berhasil Update!' }))
        .catch((err) => res.status(500).send({ message: 'GAGAL!' }))
}

module.exports = { getUsers, getDetailUser, addUser, deleteUser, updateUser }
