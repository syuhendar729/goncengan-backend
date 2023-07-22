const { initializeApp, cert } = require('firebase-admin/app')
const serviceAccount =
    process.env.FIREBASE_SECRET || require('./ServiceAccount.json')
const app = () => initializeApp({ credential: cert(serviceAccount) })

module.exports = app
