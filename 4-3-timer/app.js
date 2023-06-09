// example  $node app '1h 30m 5s'
const { parseTimeString, call } = require("./utils");

const timeString = process.argv[2];

const time = parseTimeString(timeString);

console.log(`Time in milliseconds ${time}. Waiting for call...`);

setTimeout(call, time);
