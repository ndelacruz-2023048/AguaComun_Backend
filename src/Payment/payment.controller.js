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

    const campaign = await Campaign.findById(data.campaign);
    if (!campaign) {
      return res.status(404).send({
        message: 'Campaña no encontrada',
        errorCode: 'CAMPAIGN_NOT_FOUND'
      });
    }

    if (campaign.status !== 'Activa') {
      return res.status(400).send({
        message: `No se puede realizar el pago porque la campaña está ${campaign.status.toLowerCase()}`,
        errorCode: 'CAMPAIGN_NOT_ACTIVE'
      });
    }

    const now = new Date();
    if (now < campaign.startDate || now > campaign.endDate) {
      return res.status(400).send({
        message: 'No se puede realizar el pago porque está fuera del rango de fechas',
        errorCode: 'DATE_OUT_OF_RANGE'
      });
    }

    const remaining = campaign.goalAmount - campaign.amountRaised;
    if (data.amount > remaining) {
      return res.status(400).send({
        message: `El pago excede la cantidad restante (${remaining} Q)`,
        errorCode: 'EXCEEDS_GOAL_LIMIT'
      });
    }

    const payment = new Payment(data);
    await payment.save();

    const io = getIO()
    if (io) {
      const totalPayments = await Payment.countDocuments()
      io.emit('payment-count', totalPayments)
    }

    await emitNewPayment(payment._id);

    return res.send({
      message: 'Pago creado exitosamente',
      payment
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'Error general al crear el pago',
      errorCode: 'INTERNAL_ERROR',
      err
    });
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

    const payment = await Payment.findById(id).populate('user', 'name surname');
    if (!payment) {
      return res.status(404).send({ message: 'Payment not found', errorCode: 'PAYMENT_NOT_FOUND' });
    }

    if (payment.status === 'Confirmado') {
      return res.status(400).send({ message: 'Payment already confirmed', errorCode: 'ALREADY_CONFIRMED' });
    }

    const campaign = await Campaign.findById(payment.campaign);
    if (!campaign) {
      return res.status(404).send({ message: 'Campaign not found', errorCode: 'CAMPAIGN_NOT_FOUND' });
    }

    const remaining = campaign.goalAmount - campaign.amountRaised;

    if (payment.amount > remaining) {
      await Payment.findByIdAndDelete(payment._id);
      return res.status(400).send({
        message: `El pago (${payment.amount} Q) excede lo que falta (${remaining} Q). El pago ha sido eliminado.`,
        errorCode: 'EXCEEDS_GOAL_ON_CONFIRMATION'
      });
    }

    // Confirmar el pago
    payment.status = 'Confirmado';
    await payment.save();

    // Actualizar campaña
    campaign.amountRaised += payment.amount;

    // FINALIZAR si se llegó a la meta
    if (campaign.amountRaised >= campaign.goalAmount) {
      campaign.status = 'Finalizada';
    }

    await campaign.save();

    // Emitir evento socket para recaudaciones recientes
    const io = getIO();
    if (io) {
      io.emit('newPayment', {
        campaignId: payment.campaign.toString(),
        donor: {
          name: `${payment.user?.name || 'Anonymous'} ${payment.user?.surname || ''}`.trim(),
          amount: payment.amount,
          status: payment.status
        }
      });
    }

    return res.send({
      message: 'Payment confirmed and campaign updated',
      payment,
      updatedCampaign: {
        id: campaign._id,
        name: campaign.name,
        amountRaised: campaign.amountRaised,
        status: campaign.status
      }
    });
  } catch (err) {
    console.error('Error confirming payment:', err);
    return res.status(500).send({
      message: 'General error confirming payment',
      errorCode: 'INTERNAL_ERROR',
      err
    });
  }
}

export const getRecentPaymentsByCampaign = async (req, res) => {
    try {
      const { campaignId } = req.params;
  
      const payments = await Payment.find({ campaign: campaignId})
        .sort({ updatedAt: -1 })
        .limit(4)
        .populate('user', 'name surname');
  
      const donors = payments.map(p => ({
        name: `${p.user?.name || 'Anonymous'} ${p.user?.surname || ''}`.trim(),
        amount: p.amount,
        status: p.status
      }));
  
      return res.send({ donors });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error fetching recent payments', err });
    }
};
