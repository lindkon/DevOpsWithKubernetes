const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT;
const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'pong.txt');

const getCount = async () => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return res('0');
    res(buffer);
  });
});

const getAndIncrementCount = async () => {
  const count = parseInt(await getCount()) + 1;

  await new Promise((res, rej) => {
    fs.writeFile(filePath, String(count), (err) => { 
      if (err) return rej(err);
      return res();
    });
  });
  console.log(count);
  return count;
};

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false);
    return res(true);
  })
})

const initFile = async () => {
  if (await fileAlreadyExists()) return;
  await new Promise(res => fs.mkdir(directory, (err) => res()));
    await new Promise((res, rej) => fs.writeFile(filePath, '0', (err) => {
    if (err) return rej(err);
  res();
  }));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/pingpong') {
    const pongCount = await getAndIncrementCount();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`pong ${pongCount}`);
  } else if (req.method === 'GET' && req.url === '/pings') {
    const pongCount = await getCount();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(pongCount);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

initFile().then(() => {
  server.listen(PORT, () => {
    console.log(`Pingpong server started in port ${PORT}`);
  });
});