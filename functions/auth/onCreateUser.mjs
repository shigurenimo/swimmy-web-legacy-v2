import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import {failureLog} from '../helpers/failureLog';

export default functions.auth.user().onCreate((event) => {
  const data = event.data;
  return getExportedUser(data).
    then((expotedUser) => {
      return Promise.all([
        updateDisplayName(data, expotedUser),
        addUser(data, expotedUser),
        getPosts(expotedUser.uid).
          then((posts) => {
            return updatePosts(data.uid, posts);
          }),
      ]);
    }).
    catch((err) => {
      return failureLog(err);
    });
});

const getExportedUser = (data) => {
  return admin.firestore().
    collection('export-users').
    where('email', '==', data.email).
    limit(1).
    get().
    then((snapshots) => {
      const snapshot = snapshots.docs[0];
      return snapshot
        ? snapshot.data()
        : null;
    });
};

// update displayName of user
const updateDisplayName = (data, expotedUser) => {
  return admin.auth().
    updateUser(data.uid, {
      displayName: expotedUser
        ? expotedUser.displayName
        : data.email.match(/^[^@]+/)[0],
    });
};

// add user to Users collection
const addUser = (data, expotedUser) => {
  const createdAt = new Date();
  return admin.firestore().
    collection('users').
    doc(data.uid).
    set({
      uid: data.uid,
      comment: '',
      createdAt: expotedUser
        ? expotedUser.createdAt
        : createdAt,
      description: '',
      username: expotedUser
        ? expotedUser.username
        : data.email.match(/^[^@]+/)[0],
      displayName: expotedUser
        ? expotedUser.displayName
        : data.email.match(/^[^@]+/)[0],
      followeeCount: 0,
      followerCount: 0,
      headerPhotoURL: '',
      links: [],
      photoURL: '',
      postCount: 0,
      updatedAt: expotedUser
        ? expotedUser.updatedAt
        : createdAt,
    });
};

const getPosts = (uid) => {
  return admin.firestore().
    collection('posts').
    where('ownerId', '==', uid).
    get().
    then((snapshots) => {
      return snapshots.docs.
        map((snapshot) => {
          return snapshot.data();
        });
    });
};

const updatePosts = (uid, allPosts) => {
  const tasks = [];

  allPosts.forEach((post, index) => {
    const batchIndex = Math.ceil((index + 1) / 400) - 1;
    if (!tasks[batchIndex]) {
      tasks[batchIndex] = [];
    }
    tasks[batchIndex].push(post);
  });

  const firestore = admin.firestore();

  const batches = tasks.map((posts) => {
    const batch = firestore.batch();

    posts.forEach((post) => {
      const ref = firestore.
        collection('posts').
        doc(post.id);
      batch.update(ref, {ownerId: uid});
    });

    return batch.commit();
  });

  return Promise.all(batches);
};
