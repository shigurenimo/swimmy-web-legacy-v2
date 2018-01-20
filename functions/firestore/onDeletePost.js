const admin = require('firebase-admin');
const functions = require('firebase-functions');

const eventDataLog = require('./methods/eventDataLog');
const failureLog = require('./methods/failureLog');
const getEventData = require('./methods/getEventData');

module.exports = functions.firestore.
  document('posts/{id}').
  onDelete((event) => {
    return Promise.all([
      eventDataLog(event),
      deleteTags(event),
    ]).
      catch(failureLog);
  });

const deleteTags = (event) => {
  const post = getEventData(event);
  return Promise.all(post.tags.map((tag) => {
    return admin.firestore().runTransaction((t) => {
      const ref = admin.firestore().
        collection('tags').
        where('name', '==', tag);
      return t.get(ref).
        then((doc) => {
          const data = doc.data();
          t.set(ref, {
            name: tag,
            count: Number(data.count || 0) - 1,
          }, {merge: true});
        });
    });
  }));
};
