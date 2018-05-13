import { firestore } from 'firebase-admin';

import { POSTS_AS_ANONYMOUS } from '../../constants/index';

export const setPostAsAnonymous = async (postId: string, newPost) => {
  await firestore().collection(POSTS_AS_ANONYMOUS).doc(postId).set(newPost);

  return { ...newPost, id: postId };
};
