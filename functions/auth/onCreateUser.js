const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = functions.auth.user().onCreate((event) => {
  return Promise.all([
    updateDisplayName(event),
    addUser(event),
  ]).
    catch(failureLog);
});

// update displayName of user
const updateDisplayName = (event) => {
  return admin.auth().updateUser(event.data.uid, {
    displayName: event.data.email.match(/^[^@]+/)[0],
  });
};

// add user to Users collection
const addUser = (event) => {
  const createdAt = new Date();
  return admin.firestore().
    collection('users').
    doc(event.data.uid).
    set({
      comment: '',
      createdAt: createdAt,
      description: '',
      displayName: event.data.email.match(/^[^@]+/)[0],
      followeeCount: 0,
      followerCount: 0,
      headerPhotoURL: '',
      links: [],
      photoURL: 0,
      postCount: 0,
      postLikeCount: 0,
      updatedAt: createdAt,
    });
};

// error handler
const failureLog = (err) => {
  console.error(err);
};
