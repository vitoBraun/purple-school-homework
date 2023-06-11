function parseTimeString(timeString) {
  const regex = /(\d+)h\s*(\d+)m\s*(\d+)s/;
  const match = timeString.match(regex);

  if (!match) {
    throw new Error("Invalid time string format");
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);

  const totalMilliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;

  return totalMilliseconds;
}

function call() {
  console.log(`This function was called`);
}

module.exports = { parseTimeString, call };
