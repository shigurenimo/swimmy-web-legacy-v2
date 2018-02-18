import * as admin from 'firebase-admin';

import {TAGS} from '../../constants';

/**
 * Get /tags
 * @return {Promise}
 */
export const getTags = ({limit}) => {
  return admin.firestore().
    collection(TAGS).
    orderBy('createdAt', 'desc').
    limit(limit).
    get().
    then((snapshots) => {
      return snapshots.docs.map((snapshot) => {
        const data = snapshot.data();

        return Object.assign(data, {id: snapshot.id});
      });
    });
};
