const admin = require('firebase-admin');

exports.default = () => {
  console.log('query: posts');

  return admin.
    firestore().
    collection('posts').
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
