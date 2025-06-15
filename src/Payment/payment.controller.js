import Payment from './payment.model.js'
import Campaign from '../Campaign/campaign.model.js'

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

export const confirmPayment = async (req, res) => {
    try {
        const { id } = req.params

        // Buscar el pago
        const payment = await Payment.findById(id)

        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' })
        }

        if (payment.status === 'Confirmado') {
            return res.status(400).send({ message: 'Payment already confirmed' })
        }

        // Actualizar status del pago
        payment.status = 'Confirmado'
        await payment.save()

        // Sumar amount a la campaña relacionada
        const campaign = await Campaign.findById(payment.campaign)

        if (!campaign) {
            return res.status(404).send({ message: 'Campaign not found for this payment' })
        }

        campaign.amountRaised += payment.amount
        await campaign.save()

        return res.send({
            message: 'Payment confirmed and amount added to campaign',
            payment,
            updatedCampaign: {
                id: campaign._id,
                name: campaign.name,
                amountRaised: campaign.amountRaised
            }
        })
    } catch (err) {
        console.error('Error confirming payment:', err)
        return res.status(500).send({ message: 'General error confirming payment', err })
    }
}