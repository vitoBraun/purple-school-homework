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

export const saveCity = async (city) => {
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

export const getForecast = async (city) => {
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
