const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const failureResponse = require('../helpers/failureResponse').default;
const getContext = require('../helpers/getContext').default;
const successResponse = require('../helpers/successResponse').default;

exports.default = functions.https.onRequest((request, response) => {
  return cors({origin: true})(request, response, () => {
    const args = getArguments(request);
    return getContext(request).
      then((user) => {
        return addPost(args, user);
      }).
      then(() => {
        return successResponse(response);
      }).
      catch((err) => {
        return failureResponse(response, err);
      });
  });
});

const getArguments = (request) => {
  return request.body;
};

const addPost = (args, user) => {
  if (!user) {
    throw new Error('user not found');
  }
  const createdAt = new Date();
  return admin.firestore().
    collection('posts').
    add({
      content: args.content,
      createdAt: createdAt,
      owner: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      photoURLs: {},
      repliedPostIds: [],
      replyPostIds: null,
      tags: {},
      updatedAt: createdAt,
    });
};
