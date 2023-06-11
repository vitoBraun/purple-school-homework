function validateOperations(operations, operation) {
  if (!Object.keys(operations).includes(operation)) {
    throw new Error(
      "Error: Not existed operation! use add, multiply, divide, subtract"
    );
  }
  return operations;
}

function validateAndConvertNumbers(a, b) {
  const numA = Number(a);
  const numB = Number(b);
  if (!isNaN(numA) && !isNaN(numB)) {
    return [numA, numB];
  } else {
    console.error("Error: Invalid input. Values must be numbers.");
    return [];
  }
}

module.exports = { validateAndConvertNumbers, validateOperations };
