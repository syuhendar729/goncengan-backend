const express = require('express')
const validator = require('../instances/validatorInstance')
const { userAuth } = require('../middlewares/userAuth')
const { userCreateSchema, userUpdateSchema } = require('../middlewares/userValidator')
const { joiErrorHandling } = require('../middlewares/joiError')
const {
    userFirestoreDetail,
    userFirestoreCreate,
    userFirestoreUpdate,
} = require('../controllers/userFirestoreController')

const userRoute = express.Router()

userRoute.route('/detail').get(userAuth, userFirestoreDetail)
userRoute.route('/create').post(userAuth, validator.body(userCreateSchema), joiErrorHandling, userFirestoreCreate)
userRoute.route('/update').patch(userAuth, validator.body(userUpdateSchema), joiErrorHandling, userFirestoreUpdate)

module.exports = userRoute
