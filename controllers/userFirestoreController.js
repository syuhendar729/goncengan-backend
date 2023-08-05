const { getFirestore } = require('firebase-admin/firestore')
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
            const { name, avatar, address } = { ...user.data() }
            res.send({ name, avatar, address })
        }
    } catch (err) {
        console.error(err)
        res.status(400).json({ msg: 'Gagal mengambil data user!', err })
    }
}

const userFirestoreCreate = async (data, uid) => {
    try {
        await Users.doc(uid).set({ ...data, uid, role: "none" })
    } catch (err) {
        throw err
    }
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

const getUsersWhere = async (key, assign, value) => {
    try {
        const users = await Users.where(key, assign, value).get()
        const result = []
        users.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() })
        })
        return result
    } catch (err) {
        throw err
    }
}

const getUserById = async (id) => {
    try {
        const user = await Users.doc(id).get()
        if (!user.exists) res.status(404).json({ msg: 'User tidak ditemukan!' })
        else return user.data()
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
    getUsersWhere,
    getUserById,
}
