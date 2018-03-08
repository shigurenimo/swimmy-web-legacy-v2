import * as admin from 'firebase-admin';

import { POSTS, USERS } from '../../constants/index';

/**
 * Set /users/{uid}/posts/{postId}
 * @param {string} uid
 * @param {string} postId
 * @return {Promise}
 */
export const deleteUserPost = (uid, postId) => {
  if (!postId) {
    throw new Error('postId not found');
  }

  if (!uid) {
    throw new Error('uid not found');
  }

  return admin
    .firestore()
    .collection(USERS)
    .doc(uid)
    .collection(POSTS)
    .doc(postId)
    .delete();
};
