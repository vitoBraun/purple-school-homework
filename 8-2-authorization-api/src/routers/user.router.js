import { Router } from "express";
import { userRegisterController } from "../controllers/user.controller.js";

const userRouter = new Router();

const baseUrl = "/user";

userRouter.post(`${baseUrl}/register`, userRegisterController);

export default userRouter;
