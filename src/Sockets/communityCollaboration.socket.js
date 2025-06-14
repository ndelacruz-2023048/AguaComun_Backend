export const communityCollaboration = (socket, io) => {
    socket.on("evento-servidor", (data) => {
        console.log("Evento recibido del frontend");
    })
    

}