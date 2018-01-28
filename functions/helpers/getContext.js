const admin = require('firebase-admin');

const errors = require('./errorMessage').default;

exports.default = (req) => {
  const {authorization} = req.headers || {};
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error(errors.TOKEN_NOT_FOUND);
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
