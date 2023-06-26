import {
  printError,
  printSuccess,
  decorateResponse,
} from "../services/log-service.js";
import { getWeather } from "../services/api-service.js";

import {
  TOKEN_DICTIONARY,
  saveToStorage,
  getKeyFromStorage,
} from "../services/storage-service.js";

const saveCity = async (city) => {
  if (!city.length) {
    printError(`City has not been passed`);
    return;
  }
  try {
    await saveToStorage(TOKEN_DICTIONARY.city, city);
    printSuccess("City saved successfully");
  } catch (error) {
    printError(`City did not save. Error: ${error.message}`);
  }
};

const getForecast = async (city) => {
  try {
    const weather = await getWeather(
      city || (await getKeyFromStorage(TOKEN_DICTIONARY.city))
    );
    return decorateResponse(weather);
  } catch (error) {
    if (error?.response?.status === 404) {
      printError("Wrong city or other request params");
    } else if (error?.response?.status === 401) {
      printError("Invalid API");
    } else {
      printError(error.message);
    }
  }
};

export const getWeatherController = async (req, res) => {
  try {
    const city = await getKeyFromStorage("city");
    const forecast = await getForecast(city);
    res.send(forecast);
  } catch (error) {
    res.status(400).send("No data about city, save it first");
  }
};

export const getWeatherByCityController = async (req, res) => {
  const city = req.params.city;
  const forecast = await getForecast(city);
  res.send(forecast);
};

export const saveCityController = async (req, res) => {
  const city = req.body.city;
  try {
    await saveCity(city);
    res.status(200).send("Город сохранен");
  } catch (error) {
    res.status(500).send("Не удалось сохранить город");
  }
};
