import express from "express";
import { postEmail } from "../controllers/mail/mailController";
const emailRouter = express.Router();

emailRouter.post("/", postEmail);

export default emailRouter;
