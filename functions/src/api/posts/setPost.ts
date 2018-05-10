import { firestore } from 'firebase-admin';

import { POSTS } from '../../constants/index';

export const setPost = async (postId: string, newPost) => {
  await firestore().collection(POSTS).doc(postId).set(newPost);

  return { ...newPost, id: postId };
};
