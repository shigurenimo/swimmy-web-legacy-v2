import * as admin from 'firebase-admin';

import { USERS } from '../../constants/index';
import { getPhotoURL } from '../microservices/getPhotoURL';

/**
 * Add User to users/{userId}
 * @param {string} uid
 * @param {Object} input
 */
export const updateUser = async (uid, input) => {
  if (!uid) {
    throw new Error('uid not found');
  }

  const updatedAt = new Date();

  const newUser = {
    updatedAt: updatedAt
  } as any;

  if (input.description) {
    newUser.description = input.description;
  }

  if (input.displayName) {
    newUser.displayName = input.displayName;
  }

  newUser.photoURLs = {};

  if (input.photoURLs && input.photoURLs[0]) {
    const { photoId, photoURL } = input.photoURLs[0];
    const data = await getPhotoURL('users', photoId, photoURL);
    newUser.photoURLs[photoId] = data;
    newUser.photoURL = data.photoURL;
  }

  return admin.firestore()
    .collection(USERS)
    .doc(uid)
    .set(newUser, { merge: true })
    .then(() => {
      return { ...newUser, uid };
    });
};
