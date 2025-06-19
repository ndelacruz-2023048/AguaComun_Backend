import { Router } from "express";
import {getUsers, updateUserCommunity, getMe, getUserCommunities} from "./user.controller.js";

const user = Router();

user.get("/view", getUsers);
user.put("/community/:userId", updateUserCommunity);
user.get("/me", getMe);
user.get("/communities/:userId", getUserCommunities);

export default user;