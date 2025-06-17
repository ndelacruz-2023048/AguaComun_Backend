import { Router } from "express";
import {getUsers, updateUserCommunity} from "./user.controller.js";
const user = Router();

user.get("/view", getUsers);
user.put("/community/:userId", updateUserCommunity);

export default user;