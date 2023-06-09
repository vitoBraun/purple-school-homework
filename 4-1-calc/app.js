const {
  add,
  multiply,
  divide,
  subtract,
  validateAndConvertNumbers,
  validateOperations,
} = require("./operations/index.js");

const [, , firstNum, secondNum, operation] = process.argv;

const [a, b] = validateAndConvertNumbers(firstNum, secondNum);

const operations = validateOperations(
  { add, multiply, divide, subtract },
  operation
);

const result = operations[operation](a, b);
result && console.log(`Result is ${result}`);
