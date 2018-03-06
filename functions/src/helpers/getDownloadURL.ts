import * as functions from 'firebase-functions/lib/index';

const api = 'firebasestorage.googleapis.com';
const v = 'v0';

export const getDownloadURL = (bucket, photoId) => {
  const { projectId } = functions.config().firebase;
  return `https://${api}/${v}/b/${projectId}.appspot.com/o/${bucket}%2${photoId}?alt=media`;
};
