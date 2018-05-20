import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

import { config } from '../../config';
import { PhotoURL } from '../../interfaces/photoURL';
import { getStorageURL } from '../../utils/getStorageURL';

export const getPhotoURL = async (
  collection: string,
  photoId: string,
  downloadURL: string
): Promise<PhotoURL> => {
  const objectId = `${collection}/${photoId}`;

  const storageURL = getStorageURL(objectId);

  const simple = {
    objectId: objectId,
    photoURL: downloadURL,
    downloadURL,
    storageURL
  };

  if (!config.service.images) {
    return simple;
  }

  const { projectId } = functions.config().firebase;

  const res = await fetch(config.service.images, {
    method: 'POST',
    body: JSON.stringify({
      bucketID: `${projectId}.appspot.com`,
      objectID: objectId
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    return simple;
  }

  const { data } = await res.json();

  return {
    objectId: objectId,
    photoURL: data,
    downloadURL,
    storageURL
  };
};
