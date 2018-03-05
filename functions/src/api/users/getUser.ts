import * as admin from 'firebase-admin';

import { USERS } from '../../constants/index';

export const getUser = (userId) => {
  if (!userId) {
    throw new Error('userId not found');
  }

  console.log('userId', userId);

  return admin
    .firestore()
    .collection(USERS)
    .doc(userId)
    .get()
    .then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error(`user (${userId}) not found`);
      }

      const data = snapshot.data();

      return { ...data, id: snapshot.id };
    });
};
