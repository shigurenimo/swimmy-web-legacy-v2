import { firestore } from 'firebase-admin';

import { USERS } from '../../constants';
import { User } from '../../interfaces/user';

export const getUser = async (userId: string): Promise<User> => {
  if (!userId) {
    throw new Error('userId not found');
  }

  const ref = firestore().collection(USERS).doc(userId);

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`user (${userId}) not found`);
  }

  const data = snapshot.data();

  return { ...data, id: snapshot.id } as User;
};
