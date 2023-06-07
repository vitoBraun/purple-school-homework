const {
  add,
  multiply,
  divide,
  subtract,
  convertedNumbers,
} = require("./operations/index.js");

const [, , firstNum, secondNum, operation] = process.argv;

const [a, b] = convertedNumbers(firstNum, secondNum);

const operations = { add, multiply, divide, subtract };

if (!Object.keys(operations).includes(operation)) {
  console.log(
    "Error: Not existed operation! use add, multiply, divide, subtract"
  );
  return;
}

const result = operations[operation](a, b);
console.log(`Result is ${result}`);
