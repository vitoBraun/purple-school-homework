import dotenv from "dotenv";
dotenv.config();
import express from "express";
const port = 8234;
const app = express();
import pkg from "body-parser";
const { json, urlencoded } = pkg;
import { getForecast } from "./controllers/controllers.js";
const jsonParser = json();
const urlencodedParser = urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);

app.get("/weather", async (req, res) => {
  try {
    const city = await getKeyFromStorage("city");
    const forecast = await getForecast(city);
    res.send(forecast);
  } catch (error) {
    res.status(400).send("No data about city, save it first");
  }
});

app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;
  const forecast = await getForecast(city);
  res.send(forecast);
});

app.post("/city", async (req, res) => {
  const city = req.body.city;
  try {
    await saveCity(city);
    res.status(200).send("Город сохранен");
  } catch (error) {
    res.status(500).send("Не удалось сохранить город");
  }
});

app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`Погоода в городе по умолчанию: GET ${url}/weather`);
  console.log(`Погода в конкретном городе: GET ${url}/weather/moscow`);
  console.log(`Сохранить город по умолчанию: POST ${url}/city`);
});
