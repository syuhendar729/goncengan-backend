const express = require('express')
const validator = require('../instances/validatorInstance')
const { userAuth } = require('../middlewares/userAuth')
const { userCreateSchema, userUpdateSchema } = require('../middlewares/userValidator')
const { joiErrorHandling } = require('../middlewares/joiError')
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
userRoute.route('/create').post(userAuth, validator.body(userCreateSchema), joiErrorHandling, userFirestoreCreate)
userRoute.route('/update').patch(userAuth, validator.body(userUpdateSchema), joiErrorHandling, userAuthUpdate)

module.exports = userRoute
