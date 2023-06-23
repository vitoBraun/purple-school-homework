import { homedir } from "os";
import { join } from "path";
import { promises } from "fs";

const filePath = join(homedir(), "Desktop", "weather-data.json");

export const TOKEN_DICTIONARY = {
  token: "token",
  city: "city",
  lat: "lat",
  lon: "lon",
};

const getData = async () => {
  if (await isExist()) {
    const file = await promises.readFile(filePath);
    return JSON.parse(file);
  }
  return {};
};
export const saveToStorage = async (key, value) => {
  const data = getData();
  await promises.writeFile(filePath, JSON.stringify({ ...data, [key]: value }));
};

export const getKeyFromStorage = async (key) => {
  try {
    const data = await getData();
    return data[key];
  } catch {
    return undefined;
  }
};

const isExist = async () => {
  try {
    await promises.stat(filePath);
    return true;
  } catch (error) {
    return false;
  }
};
