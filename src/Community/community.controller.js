import Community from "./community.model.js"

export const gettAllCommunitys = async(req, res)=> {
    try {
        const community = await Community.find()
        .populate(
            [
                {
                    path: 'members',
                    select: 'name surname -_id'
                },
                {
                    path: 'createdBy',
                    select: 'name surname -_id'
                },
                {
                    path: 'reports',
                    select: 'issueTitle -_id'
                }
            ]
        )
        
        if(!community) return res.status(404).send(
            {
                success: false,
                message: `No community's found`
            }
        )
                
        return res.status(200).send(
            {
                success: true,
                message: `community's retrieved successfully`,
                community
            }
        )
    } catch (e) {
        console.error(e);
        return res.status(500).send(
            {
                success: false,
                message: 'Error retrieving communitys'
            }
        )
    }
}