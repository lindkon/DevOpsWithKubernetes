const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const PORT = process.env.PORT;
const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'image.jpg');

const fileAlreadyExists = async () => new Promise(res => {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats) return res(false);
    return res(true);
  });
});

const findAFile = async () => {
  if (await fileAlreadyExists()) return;
  await new Promise(res => fs.mkdir(directory, (err) => res()));
  const response = await axios.get('https://picsum.photos/200', { responseType: 'stream' });
  response.data.pipe(fs.createWriteStream(filePath));
}

const removeFile = async () => new Promise(res => fs.unlink(filePath, (err) => res()))

const server = http.createServer(async (req, res) => {
  if (req.url.includes('favicon.ico')) {
    res.statusCode = 204;
    res.end();
    return;
  }
  await removeFile();
  await findAFile();
  res.statusCode = 200;
  res.end('OK');
});

findAFile();
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});