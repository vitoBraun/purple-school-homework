const add = require("./operations/add");
const multiply = require("./operations/multiply");
const divide = require("./operations/divide");
const subtract = require("./operations/subtract");

const firstNum = process.argv[2];
const secondNum = process.argv[3];
const operation = process.argv[4];

switch (operation) {
  case "add": {
    const result = add(firstNum, secondNum);
    console.log(`Result is ${result}`);
    break;
  }
  case "multiply": {
    const result = multiply(firstNum, secondNum);
    console.log(`Result is ${result}`);
    break;
  }
  case "divide": {
    const result = divide(firstNum, secondNum);
    console.log(`Result is ${result}`);
    break;
  }
  case "subtract": {
    const result = subtract(firstNum, secondNum);
    console.log(`Result is ${result}`);
    break;
  }
  default: {
    console.log("Not existing operation");
  }
}
