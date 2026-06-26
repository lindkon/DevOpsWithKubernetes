const crypto = require('crypto');
const http = require('http');


const s = crypto.randomUUID();
let currentStatus = new Date().toISOString() + ": " + s;

const printLog = () => {
  const timestamp = new Date().toISOString();
  currentStatus = `${timestamp}: ${s}`;
  console.log(currentStatus);
};

printLog();
setInterval(printLog, 5000);

const PORT = process.env.PORT;

let pongCount = 0;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(currentStatus);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
