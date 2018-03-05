import * as admin from 'firebase-admin';

import { USERS } from '../../constants/index';

export const getUserByUsername = (username) => {
  if (!username) {
    throw new Error('username not found');
  }

  return admin
    .firestore()
    .collection(USERS)
    .where('username', '==', username)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        throw new Error(`user (${username}) not found`);
      }

      const snapshot = querySnapshot.docs[0];

      const data = snapshot.data();

      return { ...data, id: snapshot.id };
    });
};
