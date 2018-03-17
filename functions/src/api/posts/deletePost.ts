import * as admin from 'firebase-admin';

import { POSTS } from '../../constants/index';

/**
 * Delete /posts/{postId}
 * @param {string} postId
 * @param {Object} post
 * @param {Object} owner
 */
export const deletePost = async (postId, post, owner) => {
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

  await admin.firestore().collection(POSTS).doc(postId).delete();
};
