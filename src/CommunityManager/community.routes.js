import { Router } from "express";
import {getCommunities,
        } from "./community.controller.js";
const communityRoutesManager= Router();

communityRoutesManager.get("/view", getCommunities);

export default communityRoutesManager;