const crypto = require('crypto');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT;
const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'log.txt');
const s = crypto.randomUUID();
let currentStatus = '';

const writeLog = async () => {
  const timestamp = new Date().toISOString();
  currentStatus = `${timestamp}: ${s}`;

  await new Promise((res, rej) => {
    fs.writeFile(filePath, currentStatus, (err) => { 
      if (err) return rej(err);
      return res();
    });
  });
  console.log(currentStatus);
};

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false);
    return res(true);
  })
})

const initFile = async () => {
  if (await fileAlreadyExists()) return;
  await new Promise(res => fs.mkdir(directory, (err) => res()));
  await writeLog();
}

console.log('Log write started');
initFile();
setInterval(writeLog, 5000);