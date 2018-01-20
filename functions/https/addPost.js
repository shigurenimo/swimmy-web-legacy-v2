const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const {default: failureResponse} = require('./methods/failureResponse');
const {default: getContext} = require('./methods/getContext');
const {default: successResponse} = require('./methods/successResponse');

module.exports = functions.https.onRequest((request, response) => {
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
