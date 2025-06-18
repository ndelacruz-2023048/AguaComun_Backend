import Community from '../Community/community.model.js';

export const getCommunities = async (req, res) => {
    try {
        const communities = await Community.find()
        return res.status(200).send({
            success: true,
            message: 'Communities retrieved successfully',
            communities
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
}