import User from '../User/user.model.js';

let io;
let socket

export const setIO = (socketIO) => {
    io = socketIO; 
};
export const setSocket = (socketIO) => {
    socket = socketIO; 
};
export const getIO = () => io;
export const getSocket = () => socket;

export const emitUserRoleUpdated = async (userId, newRole) => {
  if (io) {
    io.emit('user-role-updated', { userId, newRole });
  }
};

export const userSocket = (socket, io) => {
  socket.on('get-list-users', async () => {
    const users = await User.find();
    io.emit('list-users', users);
  });

  socket.on('update-user-role', async ({ userId, newRole }) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { rol: newRole },
        { new: true }
      );
      if (user) {
        io.emit('user-role-updated', { userId, newRole });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected from User`);
  });
};

