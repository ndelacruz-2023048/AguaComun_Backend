import Community from "./community.model.js"
import User from "../User/user.model.js"

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

export const getCommunityByToken = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: 'community',
      populate: [
        { path: 'members', select: 'name surname -_id' },
        { path: 'createdBy', select: 'name surname -_id' },
        { path: 'reports', select: 'issueTitle -_id' }
      ]
    })

    if (!user || !user.community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found for this user',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Community retrieved successfully',
      community: user.community,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving community',
    })
  }
}

// Obtener las 6 comunidades más recientes
export const getLatestCommunities = async(req, res) =>{
  try{
    const latestCommunities = await Community.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate([
        {
          path: 'members',
          select: 'name surname -_id',
        },
        {
          path: 'createdBy',
          select: 'name surname -_id',
        },
        {
          path: 'reports',
          select: 'issueTitle -_id',
        },
      ])

    return res.status(200).json({
      success: true,
      message: 'Latest communities retrieved successfully',
      communities: latestCommunities,
    })
  }catch(error){
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving latest communities',
    })
  }
}