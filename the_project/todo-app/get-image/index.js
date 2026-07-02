const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const IMAGE_SOURCE_URL = requireEnv('IMAGE_SOURCE_URL');
const FILES_DIR = requireEnv('FILES_DIR');
const IMAGE_FILENAME = requireEnv('IMAGE_FILENAME');
const MAX_IMAGE_AGE_MS = Number(requireEnv('MAX_IMAGE_AGE_MS'));
const CHECK_INTERVAL_MS = Number(requireEnv('CHECK_INTERVAL_MS'));

const directory = FILES_DIR;
const filePath = path.join(directory, IMAGE_FILENAME);

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
  const response = await axios.get(IMAGE_SOURCE_URL, { responseType: 'stream' });
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
  if (age > MAX_IMAGE_AGE_MS) {
    console.log(`Image is ${Math.round(age / 1000)}s old, refreshing`);
    await fetchNewImage().catch(err => console.log('Fetch failed:', err.message));
  } else {
    console.log(`Image is ${Math.round(age / 1000)}s old, still fresh`);
  }
};

console.log('Started image refresher');
checkAndUpdate();
setInterval(checkAndUpdate, CHECK_INTERVAL_MS);