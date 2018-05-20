import { firestore } from 'firebase-admin';

import { POSTS_AS_PHOTO } from '../../constants/index';

export const deletePostAsPhoto = async (postId: string): Promise<void> => {
  const ref = firestore().collection(POSTS_AS_PHOTO).doc(postId);

  await ref.delete();
};
