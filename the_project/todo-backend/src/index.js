const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { Pool } = require('pg');

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};
let isHealthy = false;

const PORT = requireEnv('PORT');
const PGHOST = requireEnv('PGHOST');
const PGPORT = requireEnv('PGPORT');
const PGDATABASE = requireEnv('PGDATABASE');
const PGUSER = requireEnv('PGUSER');
const PGPASSWORD = requireEnv('POSTGRES_PASSWORD');

const pool = new Pool({
  host: PGHOST,
  port: Number(PGPORT),
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
});

const initTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    )
  `);
};

const initWithRetry = async () => {
  try {
    await initTable();
    isHealthy = true;
    console.log('Database initialized');
  } catch (err) {
    console.log(`DB not available yet (${err.message}), retrying in 5s`);
    setTimeout(initWithRetry, 5000);
  }
};

const getTodos = async () => {
  const result = await pool.query('SELECT id, text FROM todos ORDER BY id ASC');
  return result.rows;
};

const addTodo = async (text) => {
  const result = await pool.query(
    'INSERT INTO todos (text) VALUES ($1) RETURNING id, text',
    [text]
  );
  return result.rows[0];
};

const requestLogger = async (ctx, next) => {
  const start = Date.now();
  await next(); 

  const log = {
    timestamp: new Date().toISOString(),
    method: ctx.method,
    path: ctx.originalUrl,
    status: ctx.status,
    durationMs: Date.now() - start,
    body: ctx.method === 'POST' ? ctx.request.body : undefined,
  };
  console.log(JSON.stringify(log));
};

const app = new Koa();
const router = new Router();

router.get('/todos', async (ctx) => {
  try {
    const todos = await getTodos();
    ctx.status = 200;
    ctx.body = todos;
  } catch (err) {
    isHealthy = false;
    ctx.status = 500;
    ctx.body = `error: ${err}`
  }

});

router.get('/', async (ctx) => {
  ctx.status = 200;
  ctx.body = 'Todo health OK';
});

router.get('/healthz', async (ctx) => {
  if (!isHealthy) {
    ctx.status = 500;
    ctx.body = {error: 'app unhealthy'};
  } else {
    ctx.status = 200;
    ctx.body = 'Todo health OK';
  }
});

router.post('/todos', async (ctx) => {
  const { todo } = ctx.request.body;

  if (!todo || typeof todo !== 'string' || todo.trim() === '') {
    ctx.status = 400;
    ctx.body = { error: 'todo required' };
    return;
  }
  if (todo.length > 140) {
    ctx.status = 400;
    ctx.body = { error: 'todo length exceeds 140 characters' };
    return;
  }

  try {
    const newTodo = await addTodo(todo.trim());
    ctx.status = 201;
    ctx.body = newTodo;
  } catch (err) {
    isHealthy = false;
    ctx.status = 500;
    ctx.body = { error: 'failed to save todo' };
  }
});

router.post('/break', async (ctx) => {
  isHealthy = false;

  ctx.status = 200;
  ctx.body = 'app broken';
});

app.use(bodyParser());
app.use(requestLogger);
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
initWithRetry();