const crypto = require('crypto');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT;
const directory = path.join('/', 'usr', 'src', 'app', 'files');
const logPath = path.join(directory, 'log.txt');
const pongPath = path.join(directory, 'pong.txt');

const getFile = async (filePath) => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return console.log('FAILED TO READ FILE', '----------------', err);
    res(buffer);
  })
});

const getPongCount = async () => new Promise((resolve, reject) => {
  http.get(`http://ping-pong-svc:80/pings`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

const server =  http.createServer( async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const currentStatus = await getFile(logPath);
    const pongCount = await getPongCount();
    res.statusCode = 200;   
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${currentStatus}\nPing / Pongs: ${pongCount}`);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
