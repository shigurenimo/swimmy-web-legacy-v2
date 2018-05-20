import { firestore } from 'firebase-admin';

import { USERS } from '../../constants/index';
import { UserForUpdate } from '../../interfaces/user';

export const updateUser = async (uid: string, newUser: UserForUpdate): Promise<void> => {
  const ref = firestore().collection(USERS).doc(uid);

  await ref.set(newUser, { merge: true });
};
