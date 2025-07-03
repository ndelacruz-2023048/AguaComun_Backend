import Community from "../Community/community.model.js";
import { getIO } from "./io.js";

export const communitySocket = (socket, io) => {
  // El cliente pide las últimas 6 comunidades
  socket.on("community:get-latest", async () => {
    console.log("[Socket] Evento 'community:get-latest' recibido");

    const latest = await Community.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate([
        { path: "members", select: "name surname -_id" },
        { path: "createdBy", select: "name surname -_id" },
        { path: "reports", select: "issueTitle -_id" },
      ]);

    console.log("[Socket] Enviando 'community:latest' con:", latest);
    socket.emit("community:latest", latest);
  });

  // El servidor puede recibir una lista y transformarla a últimas 6
  socket.on("community:push-all", async (allCommunities) => {
    const latest = [...allCommunities]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    io.emit("community:latest", latest);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] ${socket.id} desconectado de communitySocket`);
  });
};
