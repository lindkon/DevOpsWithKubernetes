const https = require('https');
const http = require('http');

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const HOST = requireEnv('HOST');
const PORT = requireEnv('TODO_SERVICE_PORT');

const getRandomArticle = () => {
  return new Promise((resolve, reject) => {
    const fetchUrl = (url) => {
      https.get(
        url,
        { headers: { 'User-Agent': 'todo-creator-cronjob' } },
        (res) => {
          // Follow redirects (301, 302, 303, 307, 308)
          if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
            const redirectUrl = res.headers.location;
            res.resume(); // discard the body
            if (!redirectUrl) {
              reject(new Error(`Redirect with no location header (status ${res.statusCode})`));
              return;
            }
            fetchUrl(redirectUrl);
            return;
          }

          if (res.statusCode !== 200) {
            res.resume();
            reject(new Error(`Unexpected status ${res.statusCode}`));
            return;
          }

          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const json = JSON.parse(body);
              resolve({ title: json.title, url: json.content_urls.desktop.page });
            } catch (err) {
              reject(err);
            }
          });
        }
      ).on('error', reject);
    };

    fetchUrl('https://en.wikipedia.org/api/rest_v1/page/random/summary');
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
  const article = await getRandomArticle();
  const todoText = `Read ${article.url}`;
  await createTodo(todoText);
  console.log('Created todo:', todoText);
};

run()
.then(() => process.exit(0))
.catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});