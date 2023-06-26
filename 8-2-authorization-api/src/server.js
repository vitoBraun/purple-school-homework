import express from "express";
import dotenv from "dotenv";
import prisma from "./services/prisma.service.js";
import userRouter from "./routers/user.router.js";
import bodyParser from "body-parser";
dotenv.config();

const PORT = process.env.PORT || 8081;

export const app = express();
export async function appInit() {
  await prisma
    .$connect()
    .then(console.log("Connected to database"))
    .catch((err) => {
      console.log("Could not connect to Prisma ", err);
    });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(userRouter);

  await app.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });
}

appInit();
