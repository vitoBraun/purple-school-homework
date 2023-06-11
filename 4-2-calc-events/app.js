const ops = require("../4-1-calc/operations");

const [, , firstNum, secondNum, operation] = process.argv;

const [a, b] = ops.validateAndConvertNumbers(firstNum, secondNum);

const operations = ops.validateOperations(ops, operation);

const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("result", function (res) {
  console.log(`Result: ${res}`);
});

myEmitter.on(operation, function (a, b) {
  myEmitter.emit("result", operations[operation](a, b));
});

myEmitter.emit(operation, a, b);
