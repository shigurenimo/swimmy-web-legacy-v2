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
      then(([user, data]) => {
        return getData(args).
          then(() => {
            deletePost(args, user, data);
          });
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

const getData = (args) => {
  return admin.firestore().
    collection('posts').
    doc(args.id).
    get().
    then((snapshot) => {
      return snapshot.exists
        ? Object.assign({uid: snapshot.id}, snapshot.data())
        : null;
    });
};

const deletePost = (args, user, data) => {
  if (!user) {
    throw new Error('user not found');
  }
  if (user.uid !== data.owner.uid) {
    throw new Error('user.uid !== data.owner.uid');
  }
  return admin.firestore().
    collection('posts').
    doc(args.id).
    delete();
};
