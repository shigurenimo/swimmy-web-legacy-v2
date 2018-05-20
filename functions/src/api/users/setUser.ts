import { firestore } from 'firebase-admin';

import { USERS } from '../../constants';
import { User } from '../../interfaces/user';

export const setUser = async (uid: string, newUser: User): Promise<void> => {
  const ref = firestore().collection(USERS).doc(uid);

  await ref.set(newUser);
};
