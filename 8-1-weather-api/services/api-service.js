import https from "https";
import axios from "axios";

export const getLatLonByCityName = async (city) => {
  const token = process.env.WEATHER_API_KEY;
  if (!token) {
    throw new Error(
      "API KEY is not setup. Apply it by command `weather -t <API_KEY>`"
    );
  }

  const { data } = await axios.get(
    "https://api.openweathermap.org/geo/1.0/direct",
    {
      params: {
        q: city,
        appid: token,
        units: "metric",
        lang: "ru",
      },
    }
  );

  return { lat: data[0].lat, lon: data[0].lon };
};

export const getWeather = async (city) => {
  const { lat, lon } = await getLatLonByCityName(city);
  const token = process.env.WEATHER_API_KEY;

  const { data } = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        lat,
        lon,
        appid: token,
        units: "metric",
        lang: "ru",
      },
    }
  );

  return data;
};
