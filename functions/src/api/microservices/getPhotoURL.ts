import fetch from 'node-fetch';

import { config } from '../../config';
import { PhotoURL } from '../../interfaces/photoURL';
import { getStorageURL } from '../../utils/getStorageURL';

export const getPhotoURL = async (
  collection: string,
  photoId: string,
  downloadURL: string,
): Promise<PhotoURL> => {
  if (!collection) {
    throw new Error('collection not found');
  }

  if (!photoId) {
    throw new Error('photoId not found');
  }

  if (!downloadURL) {
    throw new Error('downloadURL not found');
  }

  const objectId = `${collection}/${photoId}`;

  const storageURL = getStorageURL(objectId);

  const simple = {
    objectId: objectId,
    photoURL: downloadURL,
    downloadURL,
    storageURL,
  };

  if (!config.service.images) {
    return simple;
  }

  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG);

  const res = await fetch(config.service.images, {
    method: 'POST',
    body: JSON.stringify({
      bucketID: `${projectId}.appspot.com`,
      objectID: objectId,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    return simple;
  }

  const { data } = await res.json();

  return {
    objectId: objectId,
    photoURL: data,
    downloadURL,
    storageURL,
  };
};
