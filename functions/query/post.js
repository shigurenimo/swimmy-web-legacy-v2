const admin = require('firebase-admin');

exports.default = (root, args, context) => {
  return admin.
    firestore().
    collection('posts').
    doc(args.id).
    get().
    then((snapshot) => {
      if (!snapshot.exists) return null;
      return Object.assign(snapshot.data(), {id: snapshot.id});
    });
};
