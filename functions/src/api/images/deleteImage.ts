import { firestore } from 'firebase-admin';

import { IMAGES } from '../../constants/index';

export const deleteImage = async (imageId: string): Promise<void> => {
  if (typeof imageId === 'undefined') {
    throw new Error('imageId not found');
  }

  const documentPath = [IMAGES, imageId].join('/');

  const documentReference = firestore().doc(documentPath);

  console.log('delete', documentPath);

  await documentReference.delete();
};
