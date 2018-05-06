import { firestore } from 'firebase-admin';

import { POSTS } from '../../constants';

export const deletePost = async (postId: string, post, owner) => {
  if (!owner) {
    throw new Error('owner not found');
  }

  if (!post) {
    throw new Error('post not found');
  }

  if (!postId) {
    throw new Error('postId not found');
  }

  if (post.ownerId !== owner.uid) {
    throw new Error('post.ownerId !== owner.uid');
  }

  const ref = firestore().collection(POSTS).doc(postId);

  await ref.delete();
};
