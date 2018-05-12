import { firestore } from 'firebase-admin';

import { POSTS_AS_THREAD } from '../../constants';

export const deletePostAsThread = async (postId: string) => {
  const ref = firestore().collection(POSTS_AS_THREAD).doc(postId);

  await ref.delete();
};
