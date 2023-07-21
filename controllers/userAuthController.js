const { getAuth } = require('firebase-admin/auth')
const { userFirestoreCreate, userFirestoreUpdate } = require('./userFirestoreController')

const userAuthCreate = (req, res) => {
    const { name, email, password } = req.body
    if (name && email && password) {
        getAuth()
            .createUser({
                email,
                password,
                displayName: name,
            })
            .then((userRecord) => {
				const { password, ...data } = req.body
                userFirestoreCreate(data, userRecord.uid)
                res.json({ msg: 'Berhasil create user!', data })
            })
            .catch((error) => {
                res.status(500).json({ msg: `Gagal regis!`, error })
            })
    } else res.json({ msg: 'Gada data!' })
}


const userAuthUpdate = async (req, res) => {
    const idToken = req.headers['authorization']
	const decodedToken = await getAuth().verifyIdToken(idToken)
	const uid = decodedToken.uid
	const { email, name, ...data } = req.body
	try {
		const userRecord = await getAuth().updateUser(uid, { email, displayName: name })
		const result = await userFirestoreUpdate(req.body, uid)
		res.send({ msg: 'Berhasil update user!', userRecord, res: result })
	} catch (err) {
		res.send({ msg: 'Gagal update user!', err })
	}
}


module.exports = { userAuthCreate, userAuthUpdate }

