import { firestore } from 'firebase-admin';

import { POSTS_AS_PHOTO } from '../../constants/index';
import { Post } from '../../interfaces/post';

export const setPostAsPhoto = async (postId: string, newPost: Post): Promise<void> => {
  const ref = firestore().collection(POSTS_AS_PHOTO).doc(postId);

  await ref.set(newPost);
};
