const snap = require('../config/midtrasnConfig')

const parameter = ({ ...data }) => {
    return {
        transaction_details: {
            order_id: data.order_id,
            gross_amount: data.amount,
        },
        item_details: [
            {
                id: 'ITEM1',
                price: data.amount,
                quantity: 1,
                name: 'Midtrans Bear',
                brand: 'Midtrans',
                category: 'Toys',
                merchant_name: 'Midtrans',
            },
        ],
        customer_details: {
            first_name: 'TEST',
            last_name: 'MIDTRANSER',
            email: data.email,
            phone: '+628123456',
        },
        enabled_payments: ['other_qris'],
    }
}

module.exports = async (req, res) => {
    try {
        const transaction = await snap.createTransaction(parameter(req.body))
        const { token, redirect_url } = transaction
        res.send({ msg: 'Berhasil transaksi!', token, redirect_url })
    } catch (err) {
        res.send({ msg: 'Gagal transaksi!', err })
    }
}
