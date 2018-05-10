import { firestore } from 'firebase-admin';

import { USERS } from '../../constants';

export const setUser = async (uid: string, newUser) => {
  const ref = firestore().collection(USERS).doc(uid);

  await ref.set(newUser);
};
