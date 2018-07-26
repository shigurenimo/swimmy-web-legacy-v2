const fs = require('fs');

const readFile = (filePath) => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const writeFile = (filePath, data) => new Promise((resolve, reject) => {
  fs.writeFile(filePath, data, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const a = 'onFetch(event) {';

const b = `onFetch(event) {
        if (event.request.url.indexOf('firebasestorage.googleapis.com') !== -1) { return; }
`;

const main = async () => {
  const text = await readFile('./public/ngsw-worker.js');
  const newText = text.replace(a, b);
  await writeFile('./public/ngsw-worker.js', newText);
};

main().catch(err => {
  console.error(err);
});
