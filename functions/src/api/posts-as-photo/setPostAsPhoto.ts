import { firestore } from 'firebase-admin';

import { POSTS_AS_PHOTO } from '../../constants/index';

export const setPostAsPhoto = async (postId: string, newPost) => {
  await firestore().collection(POSTS_AS_PHOTO).doc(postId).set(newPost);

  return { ...newPost, id: postId };
};
