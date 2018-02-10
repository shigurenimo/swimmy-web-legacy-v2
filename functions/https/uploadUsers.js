const {readFile} = require('fs');
const {join} = require('path');

const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const failureResponse = require('../helpers/failureResponse').default;
const successResponse = require('../helpers/successResponse').default;

const batchLimit = 450; // < 500
const limit = 40;
const collectionName = 'test-users';
const merge = false;

exports.default = functions.https.onRequest((request, response) => {
  return cors()(request, response, () => {
    return readData().
      then((data) => {
        return writeData(data);
      }).
      then(() => {
        return successResponse(response);
      }).
      catch((err) => {
        return failureResponse(response, err);
      });
  });
});

const writeData = (tasks) => {
  const firestore = admin.firestore();

  const batches = tasks.map((users) => {
    const batch = firestore.batch();

    users.forEach((user) => {
      const ref = firestore.
        collection(collectionName).
        doc(user.uid);
      batch.set(ref, user, {merge: merge});
    });

    return batch.commit();
  });

  return Promise.all(batches);
};

const readData = () => {
  const inputUserFile = join(__dirname, '..', 'exports', 'posts.json');

  return new Promise((resolve, reject) => {
    return readFile(inputUserFile, 'utf-8', (err, res) => {
      const users = [];

      const resJson = res.
        split('\n').
        filter((line) => {
          return line;
        }).
        map((line) => {
          return JSON.parse(line);
        });

      resJson.forEach((res, index) => {
        if (index > limit) {
          return;
        }
        const batchIndex = Math.ceil((index + 1) / batchLimit) - 1;
        if (!users[batchIndex]) {
          users[batchIndex] = [];
        }
        users[batchIndex].push({
          bycript: res.services.password.bcrypt,
          code: res.profile.code,
          comment: '',
          createdAt: res.createdAt.$date,
          description: '',
          displayName: res.profile.name,
          followeeCount: 0,
          followerCount: 0,
          headerPhotoURL: '',
          links: [],
          photoURL: 0,
          postCount: 0,
          updatedAt: res.createdAt.$date,
          username: res.username,
          uid: res._id,
        });
      });

      resolve(users);
    });
  });
};
