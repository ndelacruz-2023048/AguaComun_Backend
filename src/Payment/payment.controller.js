import Payment from './payment.model.js'

export const savePayment = async (req, res) => {
    try {
        const data = req.body
        const payment = new Payment(data)

        await payment.save()

        return res.send({
            message: 'Payment created successfully',
            payment
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error during payment creation', err })
    }
}

export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('user', 'name surname')

        if (payments.length === 0) return res.status(404).send({ message: 'No payments found' })

        return res.send({
            message: 'Payments found',
            payments
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'General error', err })
    }
}