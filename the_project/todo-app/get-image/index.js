const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const PORT = process.env.PORT;
const directory = path.join('/', 'usr', 'src', 'app', 'files');
const filePath = path.join(directory, 'image.jpg');

const TEN_MINUTES = 10 * 60 * 1000;
const CHECK_INTERVAL = 60 * 1000;

const getFileAge = () => new Promise(resolve => {
  fs.stat(filePath, (err, stats) => {
    if (err) return resolve(null);
    resolve(Date.now() - stats.mtimeMs);
  });
});

const checkDirectory = () => new Promise(resolve => {
  fs.mkdir(directory, { recursive: true }, () => resolve());
});

const fetchNewImage = async () => {
  console.log('Fetching a new image from picsum...');
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' });
  const tmpPath = filePath + '.tmp';
  await new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(tmpPath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
  await new Promise(resolve => fs.rename(tmpPath, filePath, () => resolve()));
  console.log('New image saved');
};

const checkAndUpdate = async () => {
  await checkDirectory();
  const age = await getFileAge();
  if (age === null) {
    console.log('No image yet, fetching one');
    await fetchNewImage().catch(err => console.log('Fetch failed:', err.message));
    return;
  }
  if (age > TEN_MINUTES) {
    console.log(`Image is ${Math.round(age / 1000)}s old, refreshing`);
    await fetchNewImage().catch(err => console.log('Fetch failed:', err.message));
  } else {
    console.log(`Image is ${Math.round(age / 1000)}s old, still fresh`);
  }
};

console.log('Started image refresher');
checkAndUpdate();
setInterval(checkAndUpdate, CHECK_INTERVAL);