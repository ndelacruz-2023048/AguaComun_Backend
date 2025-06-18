import Payment from '../Payment/payment.model.js';

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
  socket.on('get-payments-campaign', async (campaignId) => {
  console.log('📥 Recibido ID de campaña:', campaignId) // 1️⃣ Verifica que el frontend esté enviando bien

  try {
    const payments = await Payment.find({ campaign: campaignId, status: 'Confirmado' })
      .populate('user', 'name')

    console.log('💸 Pagos encontrados:', payments) // 2️⃣ Aquí ves si encontró datos en la base

    socket.emit('list-campaign-payments', payments)
  } catch (error) {
    console.error('❌ Error al obtener pagos de campaña:', error)
  }
})

  // Cuando se crea un nuevo pago confirmado, emitir a todos
  socket.on('new-payment-confirmed', async (campaignId) => {
    const payments = await Payment.find({ campaign: campaignId, status: 'Confirmado' })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    io.emit('list-campaign-payments', payments);
  });
};

export const emitPaymentUpdate = async (campaignId) => {
  const payments = await Payment.find({ campaign: campaignId, status: 'Confirmado' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  io.emit('list-campaign-payments', payments);
};