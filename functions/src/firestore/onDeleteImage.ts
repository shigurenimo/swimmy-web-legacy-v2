import { firestore } from 'firebase-functions';

import { deletePhotoURL } from '../api/microservices/deletePhotoURL';

const document = firestore.document('images/{imageId}');

export = document.onDelete(async (snapshot) => {
  const images = snapshot.data();

  await deletePhotoURL(images.objectId);
})
