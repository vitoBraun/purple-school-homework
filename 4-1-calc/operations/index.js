const add = require("./add");
const multiply = require("./multiply.js");
const divide = require("./divide");
const subtract = require("./subtract");

const convertedNumbers = (a, b) => {
  const numA = Number(a);
  const numB = Number(b);
  if (!isNaN(numA) && !isNaN(numB)) {
    return [numA, numB];
  } else {
    console.error("Error: Invalid input. Values must be numbers.");
  }
};

module.exports = {
  add,
  multiply,
  divide,
  subtract,
  convertedNumbers,
};
