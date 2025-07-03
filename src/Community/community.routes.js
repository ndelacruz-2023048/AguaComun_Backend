import { Router } from "express"
import { gettAllCommunitys, getCommunityByToken, getLatestCommunities } from './community.controller.js'
import { validateJWT } from "../../middlewares/validateJWT.js"

const api = Router()

api.get(
    '/list',gettAllCommunitys
)
api.get("/community", validateJWT ,getCommunityByToken)
api.get("/latest", getLatestCommunities)

export default api