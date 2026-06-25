const {
  randomUUID,
} = require('node:crypto');

const s = randomUUID();

const printLog = () => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${s}`);
};

printLog();
setInterval(printLog, 5000);
