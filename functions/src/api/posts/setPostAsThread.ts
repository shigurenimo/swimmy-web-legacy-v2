import { firestore } from 'firebase-admin';

import { POSTS_AS_THREAD } from '../../constants/index';

export const setPostAsThread = async (postId: string, newPost) => {
  await firestore().collection(POSTS_AS_THREAD).doc(postId).set(newPost);

  return { ...newPost, id: postId };
};
