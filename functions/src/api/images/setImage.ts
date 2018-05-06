import { firestore } from 'firebase-admin';

import { IMAGES } from '../../constants/index';

export const setImage = async (imageId: string, image: Object): Promise<Object> => {
  if (typeof imageId) {
    throw new Error('imageId not found');
  }

  const ref = firestore().collection(IMAGES).doc(imageId);

  await ref.set(image);

  return { ...image, id: imageId };
};
