const admin = require('firebase-admin');
const functions = require('firebase-functions');

const {default: eventDataLog} = require('./methods/eventDataLog');
const {default: failureLog} = require('./methods/failureLog');
const {default: getEventData} = require('./methods/getEventData');

exports.default = functions.firestore.
  document('posts/{id}').
  onDelete((event) => {
    return Promise.all([
      eventDataLog(event),
      deleteTags(event),
    ]).
      catch((err) => {
        return failureLog(err);
      });
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
