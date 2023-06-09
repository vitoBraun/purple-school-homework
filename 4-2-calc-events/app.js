const operations = require("../4-1-calc/operations");

console.dir(operations);

const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("result", function (res) {
  console.log(`Result: ${res}`);
});

myEmitter.on("add", function (a, b) {
  myEmitter.emit("result", +a + +b);
});

myEmitter.on("multiply", function (a, b) {
  myEmitter.emit("result", +a * +b);
});

myEmitter.on("divide", function (a, b) {
  myEmitter.emit("result", +a / +b);
});

myEmitter.on("subtract", function (a, b) {
  myEmitter.emit("result", +a - +b);
});

myEmitter.emit("add", 1, 2);
myEmitter.emit("multiply", 2, 2);
myEmitter.emit("divide", 2, 2);
myEmitter.emit("subtract", 10, 2);
