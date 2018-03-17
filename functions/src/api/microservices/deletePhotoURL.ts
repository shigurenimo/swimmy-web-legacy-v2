import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

import { config } from '../../config';

export const deletePhotoURL = async (objectId) => {
  const {projectId} = functions.config().firebase;

  const bucket = `${projectId}.appspot.com`;

  try {
    await admin.storage().bucket(bucket).file(objectId).delete();
  } catch (err) {
    console.error(err);
  }

  if (!config.service.images) {
    return;
  }

  try {
    await fetch(config.service.images, {
      method: 'DELETE',
      body: JSON.stringify({
        bucketID: `${projectId}.appspot.com`,
        objectID: objectId
      }),
      headers: {'Content-Type': 'application/json'}
    });
  } catch (err) {
    console.error(err);
  }
};
