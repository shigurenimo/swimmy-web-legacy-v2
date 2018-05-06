import { firestore } from 'firebase-admin';

import { USERS } from '../../constants';

export const getUsers = async (query) => {
  const ref = firestore().collection(USERS);

  const { docs } = await ref.get();

  return docs.map((snapshot) => {
    const doc = snapshot.data();
    return Object.assign(doc, { id: snapshot.id });
  });
};
