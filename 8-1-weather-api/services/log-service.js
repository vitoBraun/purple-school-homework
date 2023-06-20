import chalk from "chalk";

const printError = (errorMsg) => {
  console.log(chalk.bgRed(`ERROR: ${errorMsg}`));
};

const printSuccess = (msg) => {
  console.log(chalk.bgGreen(`SUCCESS: ${msg}`));
};

const printHelp = () => {
  console.log(
    chalk.bgCyan(`Theese are commands:
    -h              Shows help information
    -t <tocken>     Adds tocken
    No parameters   Shows Weather
    -s <city>       Saves city
    `)
  );
};

export const printWeather = (res) => {
  console.log(
    chalk.bgYellow(
      `Weather in city: ${res.name}
      Temperature: ${res.main.temp}
      Description: ${res.weather[0].description}
      Humidity: ${res.main.humidity}`
    )
  );
};

export { printError, printSuccess, printHelp };
