import { Router } from "express";
import {getCommunities,
        } from "./Community.controller.js";
const communityRoutesManager= Router();

communityRoutesManager.get("/view", getCommunities);

export default communityRoutesManager;