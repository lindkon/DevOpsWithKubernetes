const http = require('http');
const path = require('path')
const fs = require('fs');

const PORT = process.env.PORT;
const HTML_PATH = path.join(__dirname, 'index.html');
const DIRECTORY = path.join('/', 'usr', 'src', 'app', 'files')
const IMAGE_PATH = path.join(DIRECTORY, 'image.jpg')

const getFile = async (filePath) => new Promise((resolve, reject) => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return reject(err);
    resolve(buffer);
  });
});

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const html = await getFile(HTML_PATH);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } else if (req.method === 'GET' && req.url === '/image.jpg') {
    try {
      const image = await getFile(IMAGE_PATH);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/jpeg');
      res.end(image);
    } catch (err) {
      res.statusCode = 404;
      res.end('Not Found');
    }
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  };
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});