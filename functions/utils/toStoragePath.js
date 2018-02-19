const api = 'firebasestorage.googleapis.com';
const alt = 'alt=media';

export const toFileUrl = (bucketName, filePath, query = {}) => {
  const queryStr = Object.keys(query).
    map((name) => {
      return `${name}&${query[name]}`;
    }).
    join('&');
  console.log(queryStr);
  return `https://${api}/v0/b/${bucketName}/o/${filePath}?${alt}&${queryStr}`;
};
