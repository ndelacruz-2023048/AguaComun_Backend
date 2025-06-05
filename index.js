import { initServer } from "./config/app.js";
import { config } from "dotenv";
import { connect } from "./config/mongo.js";

config()
connect()
initServer()