const https = require('https');
const http = require('http');

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const HOST = requireEnv('HOST');
const PORT = requireEnv('TODO_SERVICE_PORT');

const getRandomArticleUrl = (url = 'https://en.wikipedia.org/wiki/Special:Random') => {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { method: 'HEAD', headers: { 'User-Agent': 'todo-creator-cronjob' } },
      (res) => {
        res.resume();

        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          const location = res.headers.location;
          if (!location) {
            reject(new Error(`Redirect with no location header (status ${res.statusCode})`));
            return;
          }
          const resolvedUrl = new URL(location, url).toString();
          resolve(getRandomArticleUrl(resolvedUrl));
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Unexpected status ${res.statusCode}`));
          return;
        }
        resolve(url);
      }
    );
    req.on('error', reject);
    req.end();
  });
};

const createTodo = (text) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ todo: text });
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
        res.statusCode === 201 ? resolve() : reject(new Error(`Unexpected status ${res.statusCode}`));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    req.write(data);
    req.end();
  });
};

const run = async () => {
  const articleUrl = await getRandomArticleUrl();
  const todoText = `Read ${articleUrl}`;
  await createTodo(todoText);
  console.log('Created todo:', todoText);
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });