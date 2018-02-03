const admin = require('firebase-admin');

exports.default = (root, args) => {
  return admin.
    firestore().
    collection('tags').
    doc(args.id).
    get().
    then((snapshot) => {
      if (!snapshot.exists) return null;
      return Object.assign({id: snapshot.id}, snapshot.data());
    });
};
