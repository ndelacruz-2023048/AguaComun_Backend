import Community from "../Community/community.model.js";
import CommunityCollaboration from "../CommunityCollaboration/communityCollaboration.model.js";
import CommunityTurn from "../CommunityTurn/communityTurn.model.js";
let io;
let socket

export const setIO = (socketIO) => {
    io = socketIO; 
};
export const setSocket = (socketIO) => {
    socket = socketIO; 
};

export const communityCollaboration = async(socket, io) => {
    setIO(io);
    setSocket(socket)
    socket.on("evento-servidor", (data) => {
        console.log("Evento recibido del frontend");
    })

    socket.on("get-list-communities", async() => {
        const community = await Community.find()
        io.emit("list-communities", community)
    });
    
    socket.on("new-user", async(data) => {
        const communityCollaboration = await CommunityCollaboration.find()
       socket.emit("list-activity-collaboration", communityCollaboration);
    })
    
    socket.on("get-list-community-collaboration",async()=>{
        const communityCollaboration = await CommunityCollaboration.find().populate("community").populate("turns").populate({
            path: "turns",
            populate: {
              path: "assignedTo",  // Aquí está el usuario asignado a cada turno
              model: "User"
            }
          });
        
       socket.emit("list-community-collaboration", communityCollaboration);
    })
}

export const emitNewCollaboration = async(newCollaboration) => {
    const communityCollaboration = await CommunityCollaboration.find()
    io.emit("list-activity-collaboration", communityCollaboration);
    
};

