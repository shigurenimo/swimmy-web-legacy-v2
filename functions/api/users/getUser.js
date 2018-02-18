import * as admin from 'firebase-admin';

import {USERS} from '../../constants';

export const getUser = (root, args) => {
  return admin.
    firestore().
    collection(USERS).
    doc(args.id).
    get().
    then((snapshot) => {
      if (!snapshot.exists) {
        throw new Error('user not found');
      }

      const data = snapshot.data();

      return Object.assign(data, {id: snapshot.id});
    });
};
