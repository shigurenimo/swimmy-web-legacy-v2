import { firestore } from 'firebase-admin';

import { IMAGES } from '../../constants/index';

export const deleteImage = async (imageId: string): Promise<void> => {
  if (typeof imageId === 'undefined') {
    throw new Error('imageId not found');
  }

  const ref = firestore().collection(IMAGES).doc(imageId);

  await ref.delete();
};
