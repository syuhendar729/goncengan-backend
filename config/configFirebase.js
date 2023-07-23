const { initializeApp, cert } = require('firebase-admin/app')
let serviceAccount =  require('./vercelConfig') 
// if (serviceAccount.private_key === undefined) serviceAccount = require('./ServiceAccount.json')

const app = () =>  initializeApp({ credential: cert(serviceAccount) })

module.exports = app
