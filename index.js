import { initServer } from "./config/app.js";
import { config } from "dotenv";
import { connect } from "./config/mongo.js";
import { initAdmin } from "./config/init.configs.js"

config()
connect()
initServer()
initAdmin()