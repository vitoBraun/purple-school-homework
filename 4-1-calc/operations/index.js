const add = require("./add");
const multiply = require("./multiply.js");
const divide = require("./divide");
const subtract = require("./subtract");
const { validateOperations, validateAndConvertNumbers } = require("./validate");

module.exports = {
  add,
  multiply,
  divide,
  subtract,
  validateAndConvertNumbers,
  validateOperations,
};
