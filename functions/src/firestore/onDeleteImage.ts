import * as functions from 'firebase-functions';

import { deletePhotoURL } from '../api/microservices/deletePhotoURL';

const document = functions.firestore.document('images/{imageId}');

export = document.onDelete(async (snapshot) => {
  const images = snapshot.data();

  await deletePhotoURL(images.objectId);
})
