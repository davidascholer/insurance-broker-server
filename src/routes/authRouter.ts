import express from "express";
import { postPassword } from "../controllers/auth/authController";
const authRouter = express.Router();

authRouter.post("/", postPassword);

export default authRouter;
