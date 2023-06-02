const { parentPort } = require("worker_threads");

const generateArray = () => {
  const arr = [];
  for (let i = 1; i <= 1500000; i++) {
    arr.push(i);
  }
  return arr;
};

function countDivisibleByThree(arr) {
  const divisibleByThree = arr.filter((num) => num % 3 === 0);
  return divisibleByThree.length;
}

const compute = () => {
  const arr = generateArray();
  return countDivisibleByThree(arr);
};

parentPort.postMessage(compute());
