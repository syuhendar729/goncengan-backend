const crypto = require('crypto')
const verifySignature = (req, res, next) => {
    const { order_id, status_code, gross_amount, signature_key } = req.body
    const dataToHash = order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY
    const hash = crypto.createHash('sha512')
    const calculatedHash = hash.update(dataToHash, 'utf8').digest('hex')
    if (calculatedHash === signature_key) next()
    else res.status(401).send({ message: 'Invalid signature key!' })
}

module.exports = { verifySignature }
