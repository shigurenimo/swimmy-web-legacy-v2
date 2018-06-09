import { firestore } from 'firebase-admin';

import { USERS } from '../../constants/index';
import { UserForUpdate } from '../../interfaces/user';

export const updateUser = async (uid: string, newUser: UserForUpdate): Promise<void> => {
  if (!uid) {
    throw new Error('uid not found');
  }

  const documentPath = [USERS, uid].join('/');

  const documentReference = firestore().doc(documentPath);

  console.log('set', documentPath, newUser);

  await documentReference.set(newUser, {merge: true});
};
