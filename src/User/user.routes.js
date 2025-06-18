import { Router } from "express";
import {getUsers, updateUserCommunity, getMe} from "./user.controller.js";
const user = Router();

user.get("/view", getUsers);
user.put("/community/:userId", updateUserCommunity);
user.get("/me", getMe);

export default user;