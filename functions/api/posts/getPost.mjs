import * as admin from 'firebase-admin';

import {POSTS} from '../../constants/index';

/**
 * Get /posts/{postId}
 * @param {string} postId
 * @return {Promise}
 */
export const getPost = (postId) => {
  if (!postId) {
    throw new Error('postId not found');
  }

  return admin.firestore().
    collection(POSTS).
    doc(postId).
    get().
    then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error('post not found');
      }

      const data = snapshot.data();

      return Object.assign(data, {id: snapshot.id});
    });
};
