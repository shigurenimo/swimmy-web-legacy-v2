import { firestore } from 'firebase-admin';

import { POSTS } from '../../constants';
import { Post } from '../../interfaces/post';

export const getPost = async (postId: string): Promise<Post> => {
  const ref = firestore().collection(POSTS).doc(postId);

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`post(${postId}) not found`);
  }

  const data = snapshot.data();

  return { ...data, id: snapshot.id } as Post;
};
