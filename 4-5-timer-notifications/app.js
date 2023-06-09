// example  $node app '1h 30m 5s'
const notifier = require("node-notifier");
const timeString = process.argv[2];

const parseTimeString = require("../4-3-timer/utils");

const time = parseTimeString(timeString);

console.log(`Time in milliseconds ${time}. Waiting for call...`);

setTimeout(notify, time);

function notify() {
  notifier.notify({
    title: "Notification",
    message: "Hello, world!",
  });
}
