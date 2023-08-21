const axios = require('axios')
const { getUserById } = require('./userFirestoreController')


const tryNotification = async (req, res) => {
	try {
		const user = await getUserById(req.uid)
		if (user.fcmToken === undefined) throw new Error(`For user ${user.name} fcmToken doesn't exists`)
		const message = {
			to: user.fcmToken,
			priority: "high",
			mutable_content: true,
			notification: {
				badge: 42,
				title: req.body.title,
				body: req.body.message
    		}
		}
		const response = await axios.post('https://fcm.googleapis.com/fcm/send', message, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `key=${process.env.FCM_SERVER_KEY}`
			}
		})
		res.send({ message: 'Push notification sent successfully:', data: response.data })
	} catch (error) {
		console.log(error);
		res.send({ message: 'Error sending push notification:', error })
	}
}

const sendNotification = async (uid, data) => {
	try {
		const user = await getUserById(uid)
		if (user.fcmToken === undefined) throw new Error(`For user ${user.name} fcmToken doesn't exists`)
		const message = {
			to: user.fcmToken, 
			priority: "high",
			mutable_content: true,
			notification: {
				badge: 42,
				title: data.title,
				body: data.message
    		}
		}
		const response = await axios.post('https://fcm.googleapis.com/fcm/send', message, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `key=${process.env.FCM_SERVER_KEY}`
			}
		})
	} catch (error) {
		console.log(error);
	}
}

module.exports = { tryNotification, sendNotification }
