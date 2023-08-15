const express = require('express')
const validator = require('../instances/validatorInstance')
const { userAuth } = require('../middlewares/userAuth')
const { userCreateSchema, userUpdateSchema, userValidator } = require('../middlewares/userValidator')
const {
    userFirestore,
    userFirestoreCreate,
    userFirestoreDetail,
    userAnotherFirestoreDetail,
} = require('../controllers/userFirestoreController')
const { userAuthUpdate } = require('../controllers/userAuthController')

const userRoute = express.Router()

userRoute.route('/').get(userAuth, userFirestore)
userRoute.route('/detail').get(userAuth, userFirestoreDetail)
userRoute.route('/detail/:id').get(userAuth, userAnotherFirestoreDetail)
userRoute.route('/create').post(userAuth, validator.body(userCreateSchema), userValidator, userFirestoreCreate)
userRoute.route('/update').patch(userAuth, validator.body(userUpdateSchema), userValidator, userAuthUpdate)

module.exports = userRoute
