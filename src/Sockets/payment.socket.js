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

export const paymentSocket = async (socket, io) => {
  setIO(io);
  setSocket(socket);

  // Escuchar si el frontend pide los pagos de una campaña específica
  socket.on('get-payments-campaign', async () => {
  // 1️⃣ Verifica que el frontend esté enviando bien


  try {
    const payments = await Payment.find()
      .populate('user', 'name')

    console.log('💸 Pagos encontrados:', payments) // 2️⃣ Aquí ves si encontró datos en la base

    socket.emit('list-campaign-payments', payments)
  } catch (error) {
    console.error('❌ Error al obtener pagos de campaña:', error)
  }
})

  socket.on('get-list-campaigns', async () => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    io.emit('list-campaigns', campaigns); // 👈 esta línea es CLAVE
  } catch (error) {
    console.error('Error al obtener campañas:', error);
  }
  console.log('📢 get-list-campaigns recibido')
  });

  // Cuando se crea un nuevo pago confirmado, emitir a todos
  socket.on('new-payment-confirmed', async (campaignId) => {
    const payments = await Payment.find({ campaign: campaignId, status: 'Confirmado' })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    io.emit('list-campaign-payments', payments);
  });

  socket.on('confirm-payment', async (paymentId) => {
    const updated = await Payment.findByIdAndUpdate(paymentId, { status: 'Confirmado' }, { new: true });

    // reenviar la lista actualizada o el pago actualizado
    const updatedPayments = await Payment.find(); // o según campaña
    io.emit('list-campaign-payments', updatedPayments);
  });
};


export const emitPaymentUpdate = async (campaignId) => {
  const payments = await Payment.find({ campaign: campaignId, status: 'Confirmado' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  io.emit('list-campaign-payments', payments);
};



