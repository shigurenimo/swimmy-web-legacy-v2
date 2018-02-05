const admin = require('firebase-admin');

exports.default = () => {
  console.log('query: posts');

  return admin.
    firestore().
    collection('posts').
    orderBy('createdAt').
    get().
    then((snapshots) => {
      const nodes = [];
      snapshots.forEach((snapshot) => {
        if (!snapshot.exists) return;
        const node = Object.assign({id: snapshot.id}, snapshot.data());
        nodes.push(node);
      });
      const sortedNodes = nodes.sort((a, b) => b.createdAt - a.createdAt);
      return {nodes: sortedNodes};
    });
};
