import * as admin from 'firebase-admin';

import { POSTS } from '../../constants';

export const getPost = (postId) => {
  if (!postId) {
    throw new Error('postId not found');
  }

  return admin
    .firestore()
    .collection(POSTS)
    .doc(postId)
    .get()
    .then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error(`post(${postId}) not found`);
      }

      const data = snapshot.data();

      return { ...data, id: snapshot.id };
    });
};
