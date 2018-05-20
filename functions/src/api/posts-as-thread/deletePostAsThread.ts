import { firestore } from 'firebase-admin';

import { POSTS_AS_THREAD } from '../../constants/index';

export const deletePostAsThread = async (postId: string): Promise<void> => {
  const ref = firestore().collection(POSTS_AS_THREAD).doc(postId);

  await ref.delete();
};
