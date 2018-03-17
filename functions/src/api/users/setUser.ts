import * as admin from 'firebase-admin';

import { USERS } from '../../constants/index';

export const setUser = (uid, input) => {
  if (!input) {
    throw new Error('input not found');
  }

  if (!uid) {
    throw new Error('uid not found');
  }

  const createdAt = new Date();

  return admin
    .firestore()
    .collection(USERS)
    .doc(uid)
    .set({
      uid: uid,
      comment: '',
      createdAt: createdAt,
      description: '',
      username: input.email.match(/^[^@]+/)[0],
      displayName: input.email.match(/^[^@]+/)[0],
      followeeCount: 0,
      followerCount: 0,
      headerPhotoURL: '',
      links: [],
      photoURL: '',
      postCount: 0,
      updatedAt: createdAt
    });
};
