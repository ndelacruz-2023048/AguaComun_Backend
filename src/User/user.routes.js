import { Router } from "express";
import {getUsers, 
        updateUserCommunity, 
        getMe, 
        getUserCommunities, 
        getUserCampaignsWithContribution, 
        getUserReports, 
        getUserCommunityCollaborations,
        getRecentUsers
    } from "./user.controller.js";

const user = Router();

user.get("/view", getUsers);
user.put("/community/:userId", updateUserCommunity);
user.get("/me", getMe);
user.get("/communities/:userId", getUserCommunities);
user.get("/campaigns-contributed/:userId", getUserCampaignsWithContribution);
user.get("/reports/:userId", getUserReports);
user.get("/collaborations/:userId",  getUserCommunityCollaborations);
user.get('/recent', getRecentUsers)

export default user;