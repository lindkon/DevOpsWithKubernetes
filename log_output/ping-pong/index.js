const http = require('http');

const PORT = process.env.PORT;

let pongCount = 0;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/pingpong') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    pongCount++;
    res.end(`pong ${pongCount}`);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Pingpong server started in port ${PORT}`);
});
