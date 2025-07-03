import Payment from '../Payment/payment.model.js';
import Campaign from '../Campaign/campaign.model.js';

let io;
let socket;

export const setIO = (socketIO) => {
  io = socketIO;
};

export const setSocket = (socketIO) => {
  socket = socketIO;
};

// 🔁 Función auxiliar para emitir campañas actualizadas
export const emitCampaigns = async () => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    io.emit('list-campaigns', campaigns);
  } catch (error) {
    console.error('❌ Error al emitir campañas:', error);
  }
};

export const paymentSocket = async (socket, io) => {
  setIO(io);
  setSocket(socket);

  // 📥 Petición de pagos por campaña
  socket.on('get-payments-campaign', async () => {
    try {
      const payments = await Payment.find().populate('user', 'name');
      console.log('💸 Pagos encontrados:', payments);
      socket.emit('list-campaign-payments', payments);
    } catch (error) {
      console.error('❌ Error al obtener pagos de campaña:', error);
    }
  });

  // 📥 Petición para obtener campañas
  socket.on('get-list-campaigns', async () => {
    console.log('📢 get-list-campaigns recibido');
    await emitCampaigns(); // 👈 Emite campañas actualizadas
  });

  // ✅ Confirmación de un nuevo pago
  socket.on('new-payment-confirmed', async (campaignId) => {
    const payments = await Payment.find({ campaign: campaignId, status: 'Confirmado' })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    io.emit('list-campaign-payments', payments);

    // 👇 Si quieres que esto también actualice campañas en tiempo real
    // await emitCampaigns(); // Descomenta si los pagos afectan a las campañas
  });

  // ✅ Confirmar manualmente un pago
  socket.on('confirm-payment', async (paymentId) => {
    const updated = await Payment.findByIdAndUpdate(paymentId, { status: 'Confirmado' }, { new: true });

    const updatedPayments = await Payment.find();
    io.emit('list-campaign-payments', updatedPayments);

    // 👇 Si confirmar un pago cambia alguna lógica en la campaña
    // await emitCampaigns(); // Descomenta si aplica
  });
};

// 🔁 Función externa para emitir pagos actualizados (si la necesitas en controladores)
export const emitPaymentUpdate = async (campaignId) => {
  const payments = await Payment.find({ campaign: campaignId, status: 'Confirmado' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  io.emit('list-campaign-payments', payments);
};



