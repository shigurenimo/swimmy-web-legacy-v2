import * as admin from 'firebase-admin';

import {TAGS} from '../../constants/index';

/**
 * Get /tags/{tagId}
 * @param {string} tagId
 * @return {Promise}
 */
export const getTag = (tagId) => {
  if (!tagId) {
    throw new Error('postId not found');
  }

  return admin.firestore().
    collection(TAGS).
    doc(tagId).
    get().
    then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error(`tag(${tagId}) not found`);
      }

      const data = snapshot.data();

      return Object.assign(data, {id: snapshot.id});
    });
};
