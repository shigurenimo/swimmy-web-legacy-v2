import { firestore } from 'firebase-admin';

import { POSTS } from '../../constants';

export const getPost = async (postId: string) => {
  if (typeof postId === 'undefined') {
    throw new Error('postId not found');
  }

  const ref = firestore().collection(POSTS).doc(postId);

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`post(${postId}) not found`);
  }

  const data = snapshot.data();

  return { ...data, id: snapshot.id };
};
