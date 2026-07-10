const http = require('http');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const PORT = requireEnv('PORT');
const PGHOST = requireEnv('PGHOST');
const PGPORT = requireEnv('PGPORT');
const PGDATABASE = requireEnv('PGDATABASE');
const PGUSER = requireEnv('PGUSER');
const PGPASSWORD = requireEnv('POSTGRES_PASSWORD');

let dbReady = false;

const pool = new Pool({
  host: PGHOST,
  port: Number(PGPORT),
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
});



const getCount = async () => {
  const result = await pool.query('SELECT COUNT(*)::int AS count FROM pings');
  return result.rows[0].count;
};

const getAndIncrementCount = async () => {
  await pool.query('INSERT INTO pings DEFAULT VALUES');
  const count = await getCount();
  console.log(count);
  return count;
};

const initTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pings (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now()
    )
  `);
};
  
const initWithRetry = async () => {
  try {
    await initTable();
    dbReady = true;
    console.log('Database initialized');
  } catch (err) {
    console.log(`DB not available yet (${err.message}), retrying in 5s`);
    setTimeout(initWithRetry, 5000);
  }
};


const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/') {
      const pongCount = await getAndIncrementCount();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`pong ${pongCount}`);
    } else if (req.method === 'GET' && (req.url === '/pings' || req.url === '/healthz')) {
      const pongCount = await getCount();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(String(pongCount));
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
  console.log(`Pingpong server started in port ${PORT}`);
});
initWithRetry();
