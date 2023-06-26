import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const WEATHER_API_URI = "https://api.openweathermap.org";
const token = process.env.WEATHER_API_KEY;

const getLatLonByCityName = async (city) => {
  if (!token) {
    throw new Error("API KEY is not setup.");
  }

  const { data } = await axios.get(`${WEATHER_API_URI}/geo/1.0/direct`, {
    params: {
      q: city,
      appid: token,
      units: "metric",
      lang: "ru",
    },
  });

  return { lat: data[0].lat, lon: data[0].lon };
};

export const getWeather = async (city) => {
  const { lat, lon } = await getLatLonByCityName(city);

  const { data } = await axios.get(`${WEATHER_API_URI}/data/2.5/weather`, {
    params: {
      lat,
      lon,
      appid: token,
      units: "metric",
      lang: "ru",
    },
  });

  return data;
};
