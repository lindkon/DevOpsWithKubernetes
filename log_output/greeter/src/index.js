const http = require('http');

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const PORT = requireEnv("PORT");
const MESSAGE = requireEnv("MESSAGE");

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(MESSAGE);
    } else if (req.method === 'GET' && (req.url === '/healthz')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('ok');
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Not found`);
    }
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`error: ${err.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`Greeter server started in port ${PORT}`);
});
