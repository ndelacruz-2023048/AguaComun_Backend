import Payment from './payment.model.js'
import Campaign from '../Campaign/campaign.model.js'
import { emitNewPayment } from '../Sockets/newpayment.socket.js'
import { getIO } from '../Sockets/io.js'

export const savePayment = async (req, res) => {
  try {
    const userId = req.user.uid;
    const data = {
      ...req.body,
      user: userId
    };

    const payment = new Payment(data);
    await payment.save();

    const io = getIO()
    if (io) {
      const totalPayments = await Payment.countDocuments()
      io.emit('payment-count', totalPayments)
    }

    await emitNewPayment(payment._id);

    return res.send({
      message: 'Payment created successfully',
      payment
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'General error during payment creation', err });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'name surname');

    if (payments.length === 0)
      return res.status(404).send({ message: 'No payments found' });

    return res.send({
      message: 'Payments found',
      payments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'General error', err });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).send({ message: 'Payment not found' });
    }

    if (payment.status === 'Confirmado') {
      return res.status(400).send({ message: 'Payment already confirmed' });
    }

    payment.status = 'Confirmado';
    await payment.save();

    const campaign = await Campaign.findById(payment.campaign);

    if (!campaign) {
      return res.status(404).send({ message: 'Campaign not found for this payment' });
    }

    campaign.amountRaised += payment.amount;
    await campaign.save();

    return res.send({
      message: 'Payment confirmed and amount added to campaign',
      payment,
      updatedCampaign: {
        id: campaign._id,
        name: campaign.name,
        amountRaised: campaign.amountRaised
      }
    });
  } catch (err) {
    console.error('Error confirming payment:', err);
    return res.status(500).send({ message: 'General error confirming payment', err });
  }
};

export const getRecentPaymentsByCampaign = async (req, res) => {
    try {
      const { campaignId } = req.params;
  
      const payments = await Payment.find({ campaign: campaignId})
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('user', 'name surname');
  
      const donors = payments.map(p => ({
        name: `${p.user?.name || 'Anonymous'} ${p.user?.surname || ''}`.trim(),
        amount: p.amount
      }));
  
      return res.send({ donors });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error fetching recent payments', err });
    }
};
