import { firestore } from 'firebase-admin';

import { POSTS_AS_THREAD } from '../../constants/index';
import { Post } from '../../interfaces/post';

export const setPostAsThread = async (postId: string, newPost: Post): Promise<void> => {
  const ref = firestore().collection(POSTS_AS_THREAD).doc(postId);

  await ref.set(newPost);
};
