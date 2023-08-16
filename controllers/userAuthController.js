const { getAuth } = require('firebase-admin/auth')
const { userFirestoreCreate, userFirestoreUpdate } = require('./userFirestoreController')

const userAuthUpdate = async (req, res) => {
    try {
        const uid = req.uid
        const userRecord = await getAuth().updateUser(uid, {
            email: req.body.email,
            displayName: req.body.name,
        })
        const result = await userFirestoreUpdate(req.body, uid)
        res.send({
            message: 'Successfully updated the user!',
            userRecord,
            result,
        })
    } catch (error) {
        res.status(500).send({ message: 'Failed to update user!', error })
    }
}

module.exports = { userAuthUpdate }
