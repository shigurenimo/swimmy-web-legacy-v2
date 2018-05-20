import { firestore } from 'firebase-admin';

import { POSTS_AS_ANONYMOUS } from '../../constants/index';
import { Post } from '../../interfaces/post';

export const setPostAsAnonymous = async (postId: string, newPost: Post): Promise<void> => {
  const ref = firestore().collection(POSTS_AS_ANONYMOUS).doc(postId);

  await ref.set(newPost);
};
