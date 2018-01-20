const admin = require('firebase-admin');
const functions = require('firebase-functions');

const eventDataLog = require('./methods/eventDataLog');
const failureLog = require('./methods/failureLog');
const getEventData = require('./methods/getEventData');

module.exports = functions.firestore.
  document('posts/{id}').
  onCreate((event) => {
    return Promise.all([
      eventDataLog(event),
      setPostToUser(event),
    ]).
      catch(failureLog);
  });

const setPostToUser = (event) => {
  const post = getEventData(event);
  return admin.firestore().
    collection('users').
    doc(post.owner.uid).
    collection('posts').
    doc(event.params.id).
    set(post);
};
