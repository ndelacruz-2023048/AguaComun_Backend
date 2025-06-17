import { Router } from "express";
import { getCommunityTurn } from "./communityTurn.controller.js";

const api = Router()

api.get("/:id", getCommunityTurn)

export default api
