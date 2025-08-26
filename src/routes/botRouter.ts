import express from "express";
import { postBotConversation } from "../controllers/bot/botController";
const botRouter = express.Router();

botRouter.post("/", postBotConversation);

export default botRouter;
