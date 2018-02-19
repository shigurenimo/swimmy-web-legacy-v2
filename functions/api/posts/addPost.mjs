import * as admin from 'firebase-admin';

import {setPost} from './setPost';

/**
 * Add posts/{postId}
 * @param {Object} input
 * @param {Object} owner
 * @return {*}
 */
export const addPost = (input, owner) => {
  const postId = admin.firestore().collection('posts').doc().id;

  return setPost(postId, input, owner);
};
