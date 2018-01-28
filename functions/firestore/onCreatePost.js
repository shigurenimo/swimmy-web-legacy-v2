const admin = require('firebase-admin');
const functions = require('firebase-functions');

const eventDataLog = require('../helpers/eventDataLog').default;
const failureLog = require('../helpers/failureLog').default;
const getEventData = require('../helpers/getEventData').default;

exports.default = functions.firestore.
  document('posts/{id}').
  onCreate((event) => {
    return Promise.all([
      eventDataLog(event),
      setPostToUser(event),
    ]).
      catch((err) => {
        return failureLog(err);
      });
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
