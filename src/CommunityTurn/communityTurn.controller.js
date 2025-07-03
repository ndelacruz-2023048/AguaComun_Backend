import CommunityTurn from "./communityTurn.model.js";

export const getCommunityTurn = async (req, res) => {
    try {
        const { id } = req.params;
        const communityTurn = await CommunityTurn.find({activityId: id}).populate('activityId');
        if (!communityTurn) return res.status(404).send({success: false, message: "Turno no encontrado"});
        res.status(200).send(communityTurn);
    } catch (e) {
        res.status(500).send({success: false, message: e.message });
    }
};

export const getTurnsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const turns = await CommunityTurn.find({ assignedTo: userId, status: 'occupied' }).populate('activityId');
    res.status(200).send(turns);
  } catch (e) {
    console.error("Error en getTurnsByUser:", e); // <-- Agrega este log
    res.status(500).send([]);
  }
}