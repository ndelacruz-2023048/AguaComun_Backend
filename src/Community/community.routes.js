import { Router } from "express"
import { gettAllCommunitys } from './community.controller.js'

const api = Router()

api.get(
    '/list',gettAllCommunitys
)

export default api