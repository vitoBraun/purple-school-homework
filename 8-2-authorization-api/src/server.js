import express from "express";
import dotenv from "dotenv";
import prisma from "./services/prisma.service.js";
import userRouter from "./routers/user.router.js";
import bodyParser from "body-parser";
dotenv.config();

const PORT = process.env.PORT || 8081;

const app = express();
export function appInit() {
  prisma
    .$connect()
    .then(console.log("Connected to database"))
    .catch((err) => {
      console.log("Could not connect to Prisma ", err);
    });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(userRouter);

  app.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });
}

appInit();
export default app;
