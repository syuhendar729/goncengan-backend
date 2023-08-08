const { getAuth } = require('firebase-admin/auth')

const userAuth = async (req, res, next) => {
    const bearerToken = req.headers['authorization']

    if (bearerToken) {
        try {
            const token = bearerToken.split(' ')[1]
            const decodedToken = await getAuth().verifyIdToken(token)
            req.uid = decodedToken.uid
            next()
        } catch (error) {
            res.status(401).send({ message: 'Invalid ID token!', error })
        }
    } else res.status(401).send({ message: 'ID token does not exist!' })
}

module.exports = { userAuth }
