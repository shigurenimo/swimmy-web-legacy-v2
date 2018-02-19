const admin = require('firebase-admin');

export const getCntext = (request) => {
  const {authorization} = request.headers || {};

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('Bearer not found');
  }

  const idToken = request.headers.authorization.split('Bearer ')[1];

  return admin.auth().verifyIdToken(idToken).then((token) => {
    return {
      displayName: token.name,
      photoURL: token.picture,
      uid: token.uid,
      email: token.email,
    };
  });
};
