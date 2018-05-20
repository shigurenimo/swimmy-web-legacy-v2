import { firestore } from 'firebase-functions';

import { deletePhotoURL } from '../api/microservices/deletePhotoURL';
import { PhotoURL } from '../interfaces/photoURL';

const document = firestore.document('images/{imageId}');

export = document.onDelete(async (snapshot) => {
  const images = snapshot.data() as PhotoURL;

  await deletePhotoURL(images.objectId);
})
