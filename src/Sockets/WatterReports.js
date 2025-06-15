export const watterReports = (socket, io) => {
    socket.on('watterReport', (data) => {
        console.log('Received watter report:', data);
        io.emit('watterReport', data);
        console.log(`Broadcasted watter report to all connected sockets`);
        
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
}