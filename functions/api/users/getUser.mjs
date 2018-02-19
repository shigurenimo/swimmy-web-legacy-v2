import * as admin from 'firebase-admin';

import {USERS} from '../../constants/index';

export const getUser = (root, userId) => {
  if (!userId) {
    throw new Error('userId not found');
  }

  return admin.
    firestore().
    collection(USERS).
    doc(userId).
    get().
    then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error('user not found');
      }

      const data = snapshot.data();

      return Object.assign(data, {id: snapshot.id});
    });
};
