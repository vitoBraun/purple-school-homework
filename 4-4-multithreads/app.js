const generateArray = () => {
  const arr = [];
  for (let i = 1; i <= 3000000; i++) {
    arr.push(i);
  }
  return arr;
};

function countDivisibleByThree(arr) {
  const divisibleByThree = arr.filter((num) => num % 3 === 0);
  return divisibleByThree.length;
}

function main() {
  performance.mark("start");
  const arr = generateArray();
  console.log(countDivisibleByThree(arr));
  performance.mark("end");
  performance.measure("main", "start", "end");
  console.log(performance.getEntriesByName("main").pop());
}

main();
