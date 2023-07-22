const { getAuth } = require('firebase-admin/auth')
const {
    userFirestoreCreate,
    userFirestoreUpdate,
} = require('./userFirestoreController')

const userAuthCreate = async (req, res) => {
    const { name, email, password } = req.body
    if (name && email && password) {
		getAuth().createUser({ email, password, displayName: name })
			.then(userRecord => {
				const { password, ...data } = req.body
				userFirestoreCreate(data, userRecord.uid)
					.then(() => res.send({ msg: 'Berhasil create user!', uid: userRecord.uid }))
			})
			.catch(err => res.send({ msg: 'Gagal create user!', err }))
		/* try {
			const userRecord = await getAuth().createUser({ email, password, displayName: name })
			const { password, ...data } = req.body
			await userFirestoreCreate(data, userRecord.uid)
			res.json({ msg: 'Berhasil create user!', data })

		} catch (err) {
			res.status(500).json({ msg: `Gagal create user!`, err })
		} */
    } else res.json({ msg: 'Gagal tidak ada data!' })
}

const userAuthUpdate = async (req, res) => {
    // const idToken = req.headers['authorization']
    // const decodedToken = await getAuth().verifyIdToken(idToken)
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
