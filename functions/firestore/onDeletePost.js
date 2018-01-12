const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = functions.firestore.
  document('posts/{id}').
  onDelete((event) => {
    return Promise.all([
      getData(event),
    ]).
      then(([data]) => {
        return deleteTags(event, data);
      });
  });

const getData = (event) => {
  return admin.firestore().
    collection('posts').
    doc(event.params.id).
    get().
    then((snapshot) => {
      return snapshot.exists
        ? Object.assign({uid: snapshot.id}, snapshot.data())
        : null;
    });
};

const deleteTags = (event, data) => {
  const tags = data.tags;
  return Promise.all(tags.map((tag) => {
    return admin.firestore().runTransaction((t) => {
      const ref = admin.firestore().
        collection('tags').
        where('name', '==', tag);
      return t.get(ref).
        then((doc) => {
          const data = doc.data();
          return t.set(ref, {
            name: tag,
            count: Number(data.count || 0) - 1,
          }, {merge: true});
        });
    });
  }));
};
