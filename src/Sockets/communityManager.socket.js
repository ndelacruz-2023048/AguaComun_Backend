import Community from "../Community/community.model.js";
import { getIO } from "./io.js";

export const communityManagerSocket = (socket, io) => {
    socket.on("get-list-communities", async () => {
        const communities = await Community.find();
        io.emit("list-communities", communities);
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected from CommunityManager`);
    });
};

export const emitUpdatedCommunities = async () => {
    const io = getIO();
    if (io) {
        const communities = await Community.find();
        io.emit("list-communities", communities);
    }
};
