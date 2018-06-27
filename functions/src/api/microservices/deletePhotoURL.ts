import { storage } from 'firebase-admin';
import fetch from 'node-fetch';

import { config } from '../../config';

export const deletePhotoURL = async (objectId: string): Promise<void> => {
  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG);

  const bucket = `${projectId}.appspot.com`;

  await storage().bucket(bucket).file(objectId).delete();

  if (!config.service.images) {
    return;
  }

  await fetch(config.service.images, {
    method: 'DELETE',
    body: JSON.stringify({
      bucketID: `${projectId}.appspot.com`,
      objectID: objectId,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
};
