import User from './user.model.js';
import Communitys from '../Community/community.model.js'
import Payment from '../Payment/payment.model.js';
import Report from '../Reports/report.model.js';
import CommunityCollaboration from '../CommunityCollaboration/communityCollaboration.model.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('community');
        return res.status(200).send({
            success: true,
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const updateUserCommunity = async (req, res) => {
    try {
        const { userId } = req.params;
        const { communityId } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { community: communityId },
            { new: true }
        ).populate('community');
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        return res.status(200).send({
            success: true,
            message: 'Community updated successfully',
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newRole } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { rol: newRole },
            { new: true }
        );
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        return res.status(200).send({
            success: true,
            message: 'Role updated successfully',
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.uid;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        // Buscar todas las comunidades donde el usuario es miembro
        const Community = await Communitys.default;
        const communities = await Community.find({ members: user._id });
        return res.status(200).send({
            success: true,
            user,
            communities
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const getUserCommunities = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        const communities = await Communitys.find({ members: user._id });
        return res.status(200).send({
            success: true,
            communities
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const getUserCampaignsWithContribution = async (req, res) => {
    try {
        const { userId } = req.params;
        // Buscar todos los pagos hechos por el usuario
        const payments = await Payment.find({ user: userId }).populate('campaign');
        // Listar todos los aportes con nombre, monto y descripción de la campaña
        const contributions = payments
            .filter(p => p.campaign)
            .map(p => ({
                name: p.campaign.name,
                amount: p.amount,
                description: p.campaign.description,
                status: p.status,
            }));
        return res.status(200).send({
            success: true,
            contributions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const getUserReports = async (req, res) => {
    try {
        const { userId } = req.params;
        const reports = await Report.find({ reportedBy: userId });
        return res.status(200).send({
            success: true,
            reports
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const getUserCommunityCollaborations = async (req, res) => {
    try {
        const { userId } = req.params;
        // Buscar todas las colaboraciones creadas por el usuario
        const collaborations = await CommunityCollaboration.find({ participants: userId });
        return res.status(200).send({
            success: true,
            collaborations
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select('name rol createdAt profilePicture')
      .lean()

    res.status(200).send(users)
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: 'Error fetching recent users' })
  }
}