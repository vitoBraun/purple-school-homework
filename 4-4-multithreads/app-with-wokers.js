const { Worker } = require("worker_threads");

const compute = () => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js");
    worker.on("message", (msg) => {
      console.log(worker.threadId);
      resolve(msg);
    });
    worker.on("error", (err) => {
      reject(err);
    });
    worker.on("exit", (err) => {
      console.log("worker completed");
    });
  });
};

async function main() {
  performance.mark("start");
  try {
    const result = await Promise.all([compute(), compute()]);
    console.log(result);
  } catch (error) {
    console.log("Error in main: ", error.message);
  }
  performance.mark("end");
  performance.measure("main", "start", "end");
  console.log(performance.getEntriesByName("main").pop());
}

main();
