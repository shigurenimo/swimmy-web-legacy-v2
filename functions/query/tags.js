const admin = require('firebase-admin');

exports.default = (root) => {
  return admin.
    firestore().
    collection('tags').
    get().
    then((snapshots) => {
      const nodes = [];
      snapshots.forEach((snapshot) => {
        if (!snapshot.exists) return;
        const node = Object.assign({id: snapshot.id}, snapshot.data());
        nodes.push(node);
      });
      return {nodes};
    });
};
