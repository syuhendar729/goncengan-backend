const { getMessaging } = require('firebase-admin/messaging')
const registrationTokens =
    'AAAAgEEO0d0:APA91bEpxnl0w_sLwVIjBkbGIx3Vt7rM1vPoyzlKs12HNOJv45wimoLAEq-5BQF2v7rjz9V1zPB40YNUPbCPF2YqoC2hcXllD1nEQfl5p3FMahhugTmziQOaSNH6dCYZSNPiQgivXbXs'

const message = {
    data: {
        // score: '850',
        // time: '2:45',
        to: 'e5utsN5gTiSZjv_w-5d3pD:APA91bGYtisaNQyCCom1xsIM6q2N-3FdwBocPyj1pgNZkQW62kGj6BRfJarLE6M_AtWDuPbbp5Jry61-Fq0GtbXnEY0gzifF2GPwKbCEL8PLoZIiwbRgnjs7GKK4 rTyoV6ZcCfTThDaB',
        priority: 'high',
        mutable_content: true,
        notification: {
            badge: 42,
            title: 'Huston! The eagle has landed!',
            body: "A small step for a man, but a giant leap to Flutter's community!",
        },
    },
}

const messageController = async (req, res) => {
    try {
        const response = await getMessaging().sendToDevice(registrationTokens, message)
        res.send({ message: 'Successfully sent message:', response })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error })
    }
}

module.exports = { messageController }
