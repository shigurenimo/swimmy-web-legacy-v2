const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const errors = require('./errors');

module.exports = functions.https.onRequest((request, response) => {
  return cors({origin: true})(request, response, () => {
    return getUser(request).
      then((user) => {
        return addPost(request, user);
      }).
      then(() => {
        return successResponse(response);
      }).
      catch((err) => {
        return failureResponse(response, err);
      });
  });
});

const getUser = (request) => {
  const {authorization} = request.headers || {};
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error(errors.TOKEN_NOT_FOUND);
  }
  const idToken = request.headers.authorization.split('Bearer ')[1];
  return admin.auth().
    verifyIdToken(idToken).
    then((decodedToken) => {
      return admin.firestore().
        collection('users').
        doc(decodedToken.uid).
        get();
    }).
    then((snapshot) => {
      return snapshot.exists
        ? Object.assign({uid: snapshot.id}, snapshot.data())
        : null;
    });
};

const addPost = (request, user) => {
  if (!user) {
    throw new Error('user not found');
  }
  const createdAt = new Date();
  return admin.firestore().
    collection('posts').
    add({
      content: request.body.content,
      createdAt: createdAt,
      owner: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      images: [],
      repliedPostIds: [],
      replyPostIds: null,
      updatedAt: createdAt,
    });
};

const successResponse = (res) => {
  res.end('200');
};

const failureResponse = (err) => {
  console.error(err);
};
