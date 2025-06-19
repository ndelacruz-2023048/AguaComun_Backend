import { Router } from "express"
import { gettAllCommunitys, getCommunityByToken } from './community.controller.js'
import { validateJWT } from "../../middlewares/validateJWT.js"

const api = Router()

api.get(
    '/list',gettAllCommunitys
)
api.get("/community", validateJWT ,getCommunityByToken)

export default api