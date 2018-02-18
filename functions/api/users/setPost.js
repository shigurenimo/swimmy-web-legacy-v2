import * as admin from 'firebase-admin';

import {POSTS, USERS} from '../../constants';

/**
 * Set /users/{uid}/posts/{postId}
 * @param {string} uid
 * @param {string} postId
 * @param {Object} post
 * @return {Promise}
 */
export const setPostToUser = (uid, postId, post) => {
  if (!post) {
    throw new Error('post not found');
  }

  if (!postId) {
    throw new Error('postId not found');
  }

  if (!uid) {
    throw new Error('uid not found');
  }

  return admin.firestore().
    collection(USERS).
    doc(uid).
    collection(POSTS).
    doc(postId).
    set(post);
};
