const midtransClient = require('midtrans-client')
// Create Snap API instance
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

const parameter = (orderId, price, user) => {
    return {
        transaction_details: {
            order_id: orderId,
            gross_amount: price,
        },
        item_details: [
            {
                id: 'item_1',
                price: price,
                quantity: 1,
                name: 'Goncengan Payment',
                brand: 'Goncengan',
                category: 'Motorcycle Taxi',
                merchant_name: 'Midtrans',
            },
        ],
        customer_details: {
            first_name: user.name.split(' ')[0],
            last_name: user.name.split(' ')[1],
            email: user.email,
        },
        enabled_payments: ['other_qris'],
        callbacks: {
            finish: process.env.MIDTRANS_FINISH_URL,
			error: process.env.MIDTRANS_ERROR_URL,
			// notification: process.env.MIDTRANS_NOTIFICATION_URL
			// unfinish: process.env.MIDTRANS_UNFINISH_URL,
        },
    }
}

module.exports = { snap, parameter }
