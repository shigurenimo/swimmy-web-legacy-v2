import { firestore } from 'firebase-admin';

import { USERS } from '../../constants/index';

export const updateUser = async (uid, newUser) => {
  const ref = firestore().collection(USERS).doc(uid);

  await ref.set(newUser, { merge: true });
};
