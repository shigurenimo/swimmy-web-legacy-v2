const admin = require('firebase-admin');

exports.default = (root, args, context) => {
  return admin.
    firestore().
    collection('tags').
    get().
    then((snapshots) => {
      const nodes = [];
      snapshots.forEach((snapshot) => {
        if (!snapshot.exists) return;
        const node = Object.assign(snapshot.data(), {id: snapshot.id});
        nodes.push(node);
      });
      return {nodes};
    });
};
