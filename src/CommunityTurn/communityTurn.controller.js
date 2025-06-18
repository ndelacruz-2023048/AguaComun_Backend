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