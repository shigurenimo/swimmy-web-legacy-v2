const admin = require('firebase-admin');

exports.default = (id) => {
  return admin.firestore().
    collection('tags').
    doc(id).
    get().
    then((snapshot) => {
      return Object.assign({id: snapshot.id}, snapshot.data());
    });
};
