import Payment from '../Payment/payment.model.js'

let io;
let socket;

export const setIO = (socketIO) => {
  io = socketIO;
};
export const setSocket = (socketIO) => {
  socket = socketIO;
};

// Función principal que configura los eventos del socket para pagos
export const paymentSocket = async (socket, io) => {
  setIO(io);
  setSocket(socket);

  socket.on("evento-servidor-payment", (data) => {
    console.log("Evento recibido del frontend (payment):", data);
  });

  socket.on("get-list-payments", async () => {
    const payments = await Payment.find().populate('user', 'name surname');
    io.emit("list-payments", payments);
  });
};

// Emitir evento al crear un nuevo pago (desde payment.controller.js)
export const emitNewPayment = async (paymentId) => {
  const populatedPayment = await Payment.findById(paymentId)
    .populate('user', 'name surname')
    .populate('campaign', '_id');

  if (io && populatedPayment) {
    io.emit("newPayment", {
      campaignId: populatedPayment.campaign._id.toString(),
      donor: {
        name: `${populatedPayment.user.name} ${populatedPayment.user.surname}`,
        amount: populatedPayment.amount
      }
    });
  }
};

// Permitir obtener `io` si fuera necesario
export const getIO = () => io;
