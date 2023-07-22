const { getAuth } = require('firebase-admin/auth')

const userAuth = async (req, res, next) => {
    const bearerToken = req.headers['authorization']

    if (bearerToken) {
        try {
			const token = bearerToken.split(' ')[1]
            const decodedToken = await getAuth().verifyIdToken(token)
            req.uid = decodedToken.uid
            next()
        } catch (err) {
            res.status(401).send({ msg: 'ID Token salah!', err })
        }
    } else res.status(401).send({ msg: 'ID Token tidak ada!' })
}

module.exports = { userAuth }
