import CommunityTurn from "./communityTurn.model.js";

export const getAllCampaigns = async (req, res) => {
    try {
        
        const campaigns = await CommunityTurn.findById();
        res.json(campaigns);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};