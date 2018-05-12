import { firestore } from 'firebase-admin';

import { POSTS } from '../../constants/index';

export const setPost = async (postId: string, newPost) => {
  const postRef = firestore().collection(POSTS).doc(postId)

  await postRef.set(newPost);
};
