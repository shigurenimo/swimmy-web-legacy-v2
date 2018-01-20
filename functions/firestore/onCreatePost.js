const admin = require('firebase-admin');
const functions = require('firebase-functions');

const {default: eventDataLog} = require('../methods/eventDataLog');
const {default: failureLog} = require('../methods/failureLog');
const {default: getEventData} = require('../methods/getEventData');

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
