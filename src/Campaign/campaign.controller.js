import Campaign from './campaign.model.js';

export const createCampaign = async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        await campaign.save();
        res.status(201).json(campaign);
    } catch (e) {
        console.error('Error al crear la campaña', e);
        res.status(400).json({ message: e.message });
    }
};

export const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.json(campaigns);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (!campaign) return res.status(404).json({ message: 'Campaña no encontrada' });
        res.json(campaign);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const update = await Campaign.findByIdAndUpdate(id, req.body, { new: true });
        if (!update) return res.status(404).json({ message: 'Campaña no encontrada' });
        res.json(update);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Campaign.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Campaña no encontrada' });
        res.json({ message: 'Campaña eliminada correctamente' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const updateCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // ✅ Cambiar "Activada" por "Activa" para que coincida con el frontend
        const validStatuses = ['Activa', 'Pausada', 'Finalizada'];
        if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Estado no válido' });
        }

    const campaign = await Campaign.findByIdAndUpdate(id, { status }, { new: true });
    if (!campaign) return res.status(404).json({ message: 'Campaña no encontrada' });

        res.json(campaign);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};
