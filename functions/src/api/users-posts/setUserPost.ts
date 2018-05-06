import { firestore } from 'firebase-admin';

import { POSTS, USERS } from '../../constants';

export const setUserPost = async (uid: string, postId: string, post) => {
  if (!post) {
    throw new Error('post not found');
  }

  if (!postId) {
    throw new Error('postId not found');
  }

  if (!uid) {
    throw new Error('uid not found');
  }

  const ref = firestore().collection(USERS).doc(uid).collection(POSTS).doc(postId);

  await ref.set(post);
};
