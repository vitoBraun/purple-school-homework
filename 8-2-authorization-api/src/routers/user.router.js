import { Router } from "express";
import {
  userRegisterController,
  userLoginController,
  userGetInfoController,
} from "../controllers/user.controller.js";

import { auth } from "../middleware/auth.middleware.js";

const userRouter = new Router();

const baseUrl = "/user";

userRouter.post(`${baseUrl}/register`, userRegisterController);

userRouter.post(`${baseUrl}/login`, userLoginController);
userRouter.get(`${baseUrl}/info`, auth, userGetInfoController);

export default userRouter;
