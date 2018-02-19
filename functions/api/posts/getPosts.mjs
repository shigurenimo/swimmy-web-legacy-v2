import * as admin from 'firebase-admin';

import {POSTS} from '../../constants/index';

/**
 * Get /posts
 * @return {Promise}
 */
export const getPosts = ({limit}) => {
  if (!limit) {
    throw new Error('limit not found');
  }

  return admin.
    firestore().
    collection(POSTS).
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
