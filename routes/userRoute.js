const express = require('express')
const { userAuth } = require('../middlewares')
const {
    userFirestore,
    userFirestoreDetail,
    userAnotherFirestoreDetail,
} = require('../controllers/userFirestoreController')
const { userAuthCreate, userAuthUpdate } = require('../controllers/userAuthController')

const userRoute = express.Router()

userRoute.route('/').get(userAuth, userFirestore)
userRoute.route('/detail').get(userAuth, userFirestoreDetail)
userRoute.route('/detail/:id').get(userAuth, userAnotherFirestoreDetail)
userRoute.route('/create').post(userAuthCreate)
userRoute.route('/update').put(userAuth, userAuthUpdate)

module.exports = userRoute
