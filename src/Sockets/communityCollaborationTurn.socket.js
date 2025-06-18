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

export const communityCollaborationTurn = async(socket, io) => {
    setIO(io);
    setSocket(socket)
    
    socket.on("get-turns-by-activity", async(activityId) => {
        console.log(activityId);
        
        const turns = await CommunityTurn.find({activityId: activityId}).populate('activityId');
        io.emit("list-turns", turns);
    })
    
    socket.on("update-turn", async(data) => {
        
        const updatedTurn = await CommunityTurn.findByIdAndUpdate(data.communityTurnId, {status: "occupied", assignedTo: data.idUser},{new:true});
        console.log(updatedTurn);
        
        const turns = await CommunityTurn.find({activityId: data.activityId}).populate('activityId');
        const communityCollaboration = await CommunityCollaboration.find().populate("community").populate("turns")
       io.emit("list-community-collaboration", communityCollaboration);
        io.emit("list-turns", turns);
    })
}