const { getAuth } = require('firebase-admin/auth')
const {
    userFirestoreCreate,
    userFirestoreUpdate,
} = require('./userFirestoreController')

const userAuthCreate = async (req, res) => {
    const { name, email, password } = req.body
    if (name && email && password) {
        try {
            const userRecord = await getAuth().createUser({
                email,
                password,
                displayName: name,
            })
            const data = { ...req.body }
            delete data.password
            await userFirestoreCreate(data, userRecord.uid)
            res.json({ msg: 'Berhasil create user!', data })
        } catch (err) {
            console.error(err)
            res.status(500).json({ msg: `Gagal create user!`, err })
        }
    } else res.status(400).json({ msg: 'Gagal tidak ada data!' })
}

const userAuthUpdate = async (req, res) => {
    const uid = req.uid
    const { email, name, ...data } = req.body
    try {
        const userRecord = await getAuth().updateUser(uid, {
            email,
            displayName: name,
        })
        const result = await userFirestoreUpdate(req.body, uid)
        res.send({ msg: 'Berhasil update user!', userRecord, res: result })
    } catch (err) {
        res.send({ msg: 'Gagal update user!', err })
    }
}

module.exports = { userAuthCreate, userAuthUpdate }
