import { firestore } from 'firebase-admin';

import { POSTS } from '../../constants';

export const deletePost = async (postId: string, postOwnerId: string, ownerId: string) => {
  if (postOwnerId !== ownerId) {
    throw new Error('postOwnerId !== owner.uid');
  }

  const ref = firestore().collection(POSTS).doc(postId);

  await ref.delete();
};
