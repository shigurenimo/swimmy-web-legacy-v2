import { firestore } from 'firebase-admin';

import { POSTS_AS_ANONYMOUS } from '../../constants/index';

export const deletePostAsAnonymous = async (postId: string) => {
  const ref = firestore().collection(POSTS_AS_ANONYMOUS).doc(postId);

  await ref.delete();
};
