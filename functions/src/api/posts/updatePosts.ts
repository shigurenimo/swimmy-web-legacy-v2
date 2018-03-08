import * as admin from 'firebase-admin';
import { POSTS } from '../../constants';

export const updatePosts = async (fields) => {
  const batch = admin.firestore().batch();

  fields.forEach((field) => {
    if (!field.id) {
      throw new Error('field.id not found');
    }
    const ref = admin.firestore().collection(POSTS).doc(field.id);

    batch.update(ref, field);
  });

  await batch.commit();
};
