import { firestore } from 'firebase-admin';

import { POSTS } from '../../constants';

export const deletePost = async (postId: string): Promise<void> => {
  const ref = firestore().collection(POSTS).doc(postId);

  await ref.delete();
};
