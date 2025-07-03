import { Router } from "express";
import { getCommunityTurn,getTurnsByUser } from "./communityTurn.controller.js";

const api = Router()

api.get("/:id", getCommunityTurn)
api.get('/user/:userId', getTurnsByUser)

export default api
