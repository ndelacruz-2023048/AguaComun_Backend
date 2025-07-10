import { emitCampaigns } from '../Sockets/payment.socket.js';
import Campaign from './campaign.model.js';

const fixToLocalMidnight = (dateString) => {
  // dateString: "YYYY-MM-DD" o ISO completo
    const parts = dateString.split("-");
    if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
        return new Date(year, month - 1, day); // crea fecha a medianoche local
    } else {
        // fallback
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
};

export const createCampaign = async (req, res) => {
    try {
        const campaign = new Campaign({
        ...req.body,
        startDate: fixToLocalMidnight(req.body.startDate),
        endDate: fixToLocalMidnight(req.body.endDate),
        });

        console.log("Fecha startDate ajustada:", fixToLocalMidnight(req.body.startDate));
        console.log("Fecha endDate ajustada:", fixToLocalMidnight(req.body.endDate));

        await campaign.save();
        res.status(201).json(campaign);
    } catch (e) {
        console.error("Error al crear la campaña", e);
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
        const update = { ...req.body };

        if (update.startDate) {
        update.startDate = fixToLocalMidnight(update.startDate);
        }
        if (update.endDate) {
        update.endDate = fixToLocalMidnight(update.endDate);
        }

        const updated = await Campaign.findByIdAndUpdate(id, update, { new: true });
        if (!updated) return res.status(404).json({ message: "Campaña no encontrada" });

        res.json(updated);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Campaign.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Campaña no encontrada' });

    await emitCampaigns(req); // 👈 Emitir tiempo real

    res.json({ message: 'Campaña eliminada correctamente' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Activa', 'Pausada', 'Finalizada'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const campaign = await Campaign.findByIdAndUpdate(id, { status }, { new: true });
    if (!campaign) return res.status(404).json({ message: 'Campaña no encontrada' });

    await emitCampaigns(req); // 👈 Emitir tiempo real

    res.json(campaign);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

