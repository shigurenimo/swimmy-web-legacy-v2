const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const errors = require('./errors');

module.exports = functions.https.onRequest((request, response) => {
  return cors({origin: true})(request, response, () => {
    return Promise.all([
      getUser(request),
      getData(request),
    ]).
      then(([user, data]) => {
        return deletePost(request, user, data);
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

const getData = (request) => {
  return admin.firestore().
    collection('posts').
    doc(request.body.id).
    get().
    then((snapshot) => {
      return snapshot.exists
        ? Object.assign({uid: snapshot.id}, snapshot.data())
        : null;
    });
};

const deletePost = (request, user, data) => {
  if (!user) {
    throw new Error('user not found');
  }
  if (user.uid !== data.owner.uid) {
    throw new Error('user.uid !== data.owner.uid');
  }
  return admin.firestore().
    collection('posts').
    doc(request.body.id).
    delete();
};

const successResponse = (res) => {
  res.end('200');
};

const failureResponse = (err) => {
  console.error(err);
};
