import Report from "../Reports/report.model.js";

export const reportStatsSocket = (socket, io) => {
    socket.on("report:get-summary", async () => {
        console.log("Evento recibido: report:get-summary");

        const summary = await Report.aggregate([
        {
            $group: {
            _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } } // orden cronológico ascendente
        ])

        const formatted = summary.map((entry) => ({
        name: entry._id,
        value: entry.count
        }))

        console.log("📤 Enviando resumen de reportes:", formatted);
        socket.emit("report:summary", formatted);
    })

    socket.on("disconnect", () => {
        console.log(`🔌 Cliente desconectado de reportStats: ${socket.id}`);
    })
}