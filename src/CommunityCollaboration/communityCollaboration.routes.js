import { Router } from "express";
import { createCommunityCollaboration, getAllCollaborations } from "./communityCollaboration.controller.js";

const app = Router()

app.post("/", createCommunityCollaboration)
app.get('/get', getAllCollaborations)

export default app

