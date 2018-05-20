import { firestore } from 'firebase-admin';

import { IMAGES } from '../../constants/index';
import { PhotoURL } from '../../interfaces/photoURL';

export const setImage = async (imageId: string, image: PhotoURL): Promise<void> => {
  if (typeof imageId) {
    throw new Error('imageId not found');
  }

  const ref = firestore().collection(IMAGES).doc(imageId);

  await ref.set(image);
};
