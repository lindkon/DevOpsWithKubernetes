const http = require('http');

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const HOST = requireEnv('HOST');
const PORT = requireEnv('TODO_SERVICE_PORT');

const data = JSON.stringify({ todo: `Read https://en.wikipedia.org/wiki/Special:Random` });

const req = http.request(
  {
    host: HOST,
    port: PORT,
    path: '/todos',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
    timeout: 5000,
  },
  (res) => {
    console.log('Status:', res.statusCode);
    process.exit(res.statusCode === 201 ? 0 : 1);
  }
);

req.on('error', (err) => {
  console.error('Request failed:', err);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Request timed out');
  req.destroy();
  process.exit(1);
});


req.write(data);
req.end();