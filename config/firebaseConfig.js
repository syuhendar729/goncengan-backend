const { initializeApp, cert } = require('firebase-admin/app')
let serviceAccount = require('./vercelConfig')
initializeApp({ credential: cert(serviceAccount) })
