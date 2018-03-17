import * as functions from 'firebase-functions';

import { deletePhotoURL } from '../api/microservices/deletePhotoURL';
import { getEventData } from '../helpers/getEventData';

export = functions.firestore
  .document('images/{imageId}')
  .onDelete(async (event) => {
    const images = getEventData(event);

    await deletePhotoURL(images.objectId);
  })
