const Users = require('../instances/firestoreInstance')('users')

const userFirestore = async (req, res) => {
    try {
        const result = []
        const users = await Users.get()
        users.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() })
        })
        res.send(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch data users!', error })
    }
}

const userFirestoreDetail = async (req, res) => {
    try {
        const user = await Users.doc(req.uid).get()
        if (!user.exists) res.status(404).json({ message: 'User not found!' })
        else res.send(user.data())
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch user data!', error })
    }
}

const userAnotherFirestoreDetail = async (req, res) => {
    try {
        const user = await Users.doc(req.params.id).get()
        if (!user.exists) res.status(404).json({ message: 'User not found!' })
        else {
            const { name, avatar, address } = { ...user.data() }
            res.send({ name, avatar, address })
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: 'Failed to fetch user data!', error })
    }
}

const userFirestoreCreate = async (data, uid) => {
    try {
        await Users.doc(uid).set({ ...data, uid, role: 'none' })
    } catch (error) {
        console.error(error)
        throw new Error('Failed to create user!')
    }
}

const userFirestoreUpdate = async (data, uid) => {
    try {
        const user = Users.doc(uid)
        const result = await user.update({ ...data, uid })
        return result
    } catch (error) {
        console.error(error)
        throw new Error('Failed to update user data!')
    }
}

const getUsersWhere = async (key, assign, value) => {
    try {
        const users = await Users.where(key, assign, value).get()
        const result = []
        users.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() })
        })
        if (users.length != 0) return result
        else throw new Error('User not found!')
    } catch (error) {
        console.error(error)
        throw new Error('Failed to find user data with key and value!')
    }
}

const getUserById = async (id) => {
    try {
        const user = await Users.doc(id).get()
        if (!user.exists) throw new Error('User not found!')
        return user.data()
    } catch (error) {
        console.error(error)
        throw new Error('Failed to find user data by id!')
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
