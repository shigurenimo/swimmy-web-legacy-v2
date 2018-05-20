import { firestore } from 'firebase-admin';

import { POSTS } from '../../constants/index';
import { Post } from '../../interfaces/post';

export const setPost = async (postId: string, newPost: Post): Promise<void> => {
  const postRef = firestore().collection(POSTS).doc(postId)

  await postRef.set(newPost);
};
