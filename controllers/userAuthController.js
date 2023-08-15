const { getAuth } = require('firebase-admin/auth')
const { userFirestoreCreate, userFirestoreUpdate } = require('./userFirestoreController')

const userAuthCreate = async (req, res) => {
    try {
        /* const userRecord = await getAuth().createUser({
            email,
            password,
            displayName: name,
        })
        delete data.password */
        const data = { ...req.body }
        await userFirestoreCreate(data, userRecord.uid)
        res.json({ message: 'Successfully created user!', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: `Failed to created user!`, error })
    }
    res.status(400).json({
        message: 'Failed to create user because there is no data!',
    })
}

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
