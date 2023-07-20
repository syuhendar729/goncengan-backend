const { getAuth } = require('firebase-admin/auth')
const { addUser, updateUser } = require('./usersController')

const userRegis = (req, res) => {
    const { nama, email, password } = req.body
    if (nama && email && password) {
        getAuth()
            .createUser({
                email,
                password,
                displayName: nama,
            })
            .then((userRecord) => {
                const { password, ...data } = req.body
                addUser(data, userRecord.uid)
    			res.json({ msg: 'Berhasil create user!', data })
            })
            .catch((error) => {
                res.status(500).json({ msg: `Gagal regis!`, error })
            })
    } else res.json({ msg: 'Gada data!' })
}

const userAuthUpdate = (req, res) => {
    const { nama, email, password, uid } = req.body
    if (nama && email && password) {
        getAuth()
            .updateUser(uid, {
				email,
                password,
                displayName: nama
            })
            .then((userRecord) => {
				const { password, ...data } = req.body
				updateUser(data, userRecord.uid, req.params.id)
				res.json({ msg: 'Berhasil update user!', data })
            })
            .catch((error) => {
                res.status(500).json({ msg: 'Gagal update user!', error })
            })
    } else res.json({ msg: 'Gada data!' })
}

const userToken = async (req, res) => {
	const email = req.body.email

	const uid = await getAuth().getUserByEmail(email)
		.then((userRecord) => userRecord.uid)
		.catch((error) => {
			res.send({msg: 'Gagal mengambil data user', error})
		})
	getAuth()
	  .createCustomToken(uid)
	  .then((customToken) => {
		  res.send({token: customToken})
	  })
	  .catch((error) => {
		  res.send({msg: 'Gagal membuat user token!', error})
	  })
}

module.exports = { userRegis, userAuthUpdate }
