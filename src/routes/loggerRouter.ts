import express from "express";
import { postLog } from "../controllers/logger/loggerController";
const loggerRouter = express.Router();

loggerRouter.post("/", postLog);

export default loggerRouter;
