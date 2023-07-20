const { getAuth } = require('firebase-admin/auth')

const userAuth = async (req, res, next) => {
    const idToken = req.headers['authorization']
    if (idToken) {
        getAuth().verifyIdToken(idToken)
            .then((decodedToken) => {
                const uid = decodedToken.uid
                next()
            })
            .catch((err) => {
                res.status(403).send({ msg: 'ID Token salah!', err })
            })
    } else res.send({ msg: 'ID Token tidak ada!' })
}

module.exports = { userAuth }
