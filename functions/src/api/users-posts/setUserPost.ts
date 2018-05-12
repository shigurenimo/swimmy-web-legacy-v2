import { firestore } from 'firebase-admin';

import { POSTS, USERS } from '../../constants';

export const setUserPost = async (uid: string, postId: string, post) => {
  const userRef = firestore().collection(USERS).doc(uid)
  const ref = userRef.collection(POSTS).doc(postId);

  await ref.set(post);
};
