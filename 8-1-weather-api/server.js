import dotenv from "dotenv";
dotenv.config();
import express from "express";

import pkg from "body-parser";
const { json, urlencoded } = pkg;
const jsonParser = json();
const urlencodedParser = urlencoded({ extended: false });

import {
  getWeatherController,
  getWeatherByCityController,
  saveCityController,
} from "./controllers/controllers.js";

const port = process.env.PORT || 8234;
const app = express();

app.use(jsonParser);
app.use(urlencodedParser);

app.get("/weather", getWeatherController);

app.get("/weather/:city", getWeatherByCityController);

app.post("/city", saveCityController);

app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`Погоода в городе по умолчанию: GET ${url}/weather`);
  console.log(`Погода в конкретном городе: GET ${url}/weather/moscow`);
  console.log(`Сохранить город по умолчанию: POST ${url}/city`);
});
