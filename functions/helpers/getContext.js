import * as admin from 'firebase-admin';

import {errorMessage} from './errorMessage';

export const getContext = (req) => {
  const {authorization} = req.headers || {};
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error(errorMessage.TOKEN_NOT_FOUND);
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  return admin.auth().
    verifyIdToken(idToken).
    then((decodedToken) => {
      return admin.firestore().
        collection('users').
        doc(decodedToken.uid).
        get();
    }).
    then((snapshot) => {
      return snapshot.exists
        ? Object.assign({uid: snapshot.id}, snapshot.data())
        : null;
    });
};
