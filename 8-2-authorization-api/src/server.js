import express from "express";
import dotenv from "dotenv";
import prisma from "./services/prisma.service.js";
dotenv.config();

const PORT = process.env.PORT || 8081;
const app = express();
prisma
  .$connect()
  .then(appInit)
  .catch((err) => {
    console.log("Could not connect to Prisma ", err);
  });

async function appInit() {
  await app.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });
}
