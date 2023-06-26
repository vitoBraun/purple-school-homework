import { Router } from "express";
import {
  userRegisterController,
  userLoginController,
} from "../controllers/user.controller.js";

const userRouter = new Router();

const baseUrl = "/user";

userRouter.post(`${baseUrl}/register`, userRegisterController);

userRouter.post(`${baseUrl}/login`, userLoginController);

export default userRouter;
