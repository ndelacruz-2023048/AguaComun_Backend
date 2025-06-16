import { Router } from "express";
import { createCommunityCollaboration } from "./communityCollaboration.controller.js";

const app = Router()

app.post("/", createCommunityCollaboration)

export default app

