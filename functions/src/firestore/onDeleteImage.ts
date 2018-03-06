import * as functions from 'firebase-functions';

import { deletePhotoURL } from '../api/microservices/deletePhotoURL';

import { failureLog } from '../helpers/failureLog';
import { getEventData } from '../helpers/getEventData';

export = functions.firestore
  .document('images/{imageId}')
  .onDelete(async (event) => {
    const images = getEventData(event);

    try {
      await deletePhotoURL(images.objectId);
    } catch (err) {
      failureLog(err);
    }
  })
