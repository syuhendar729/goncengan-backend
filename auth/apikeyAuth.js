const crypto = require('crypto')

function generateRandomToken() {
    return crypto.randomBytes(32).toString('hex')
}

let apiKey = generateRandomToken()

setInterval(() => {
    apiKey = generateRandomToken()
}, 1800000) // 30 mnt

function validateApiKey(req, res, next) {
    const userApiKey = req.headers['apikey']
    console.log(apiKey)

    if (userApiKey && userApiKey === apiKey) {
        return next()
    }

    return res.status(403).json({ message: 'Unauthorized. Invalid API Key.' })
}

module.exports = { validateApiKey, apiKey }
