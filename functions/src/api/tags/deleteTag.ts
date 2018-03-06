import * as admin from 'firebase-admin';

import { TAGS } from '../../constants/index';

/**
 * Delete /tags/{tagId}
 * @param {Object} tag
 * @return {Promise}
 */
export const deleteTag = (tag) => {
  return admin.firestore().runTransaction((t) => {
    const findRef = admin
      .firestore()
      .collection(TAGS)
      .where('name', '==', tag.name);

    return t.get(findRef).then((querySnapshot) => {
      if (querySnapshot.empty) { return; }

      const snapshot = querySnapshot.docs[0];

      const data = snapshot.data();

      const ref = admin
        .firestore()
        .collection(TAGS)
        .doc(snapshot.id);

      t.set(ref, {
        name: tag.name,
        count: Number(data.count || 0) - 1
      }, {
        merge: true
      });
    });
  });
};
