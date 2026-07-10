const crypto = require('crypto');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT;
const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join('/', 'etc', 'config', 'information.txt');
const logPath = path.join(directory, 'log.txt');

const getFile = async (filePath) => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return reject(err);
    resolve(buffer);
  });
});

const getPongCount = async () => new Promise((resolve, reject) => {
  http.get(`http://ping-pong-svc:80/pings`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

const server =  http.createServer( async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      const currentStatus = await getFile(logPath);
      const pongCount = await getPongCount();
      const fileInfo = await getFile(filePath);
      const message  = `MESSAGE=${process.env.MESSAGE}`;
      res.statusCode = 200;   
      res.setHeader('Content-Type', 'text/plain');
      res.end(
        `file content: ${fileInfo}\n` +
        `env variable: ${message}\n` +
        `${currentStatus}\n` +
        `Ping / Pongs: ${pongCount}`
      );
    } else if (req.method === 'GET' && req.url === '/healthz') {
      const pongCount = await getPongCount();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Reading pong count ${pongCount}`);
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
    }
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`error: ${err.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
