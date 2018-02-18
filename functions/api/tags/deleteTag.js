import * as admin from 'firebase-admin';

import {TAGS} from '../../constants';

/**
 * Delete /tags/{tagId}
 * @param {Object} tag
 * @return {Promise<any[]>}
 */
export const deleteTag = (tag) => {
  return admin.firestore().runTransaction((t) => {
    const ref = admin.firestore().
      collection(TAGS).
      where('name', '==', tag.name);

    return t.get(ref).then((doc) => {
      const data = doc.data();

      t.set(ref, {
        name: tag.name,
        count: Number(data.count || 0) - 1,
      }, {merge: true});
    });
  });
};
