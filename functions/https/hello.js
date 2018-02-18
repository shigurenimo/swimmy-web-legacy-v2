const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const failureResponse = require('../helpers/failureResponse').default;
const successResponse = require('../helpers/successResponse').default;

exports.default = functions.https.onRequest((request, response) => {
  return cors()(request, response, () => {
    return writeData().
      then(() => {
        return successResponse(response);
      }).
      catch((err) => {
        return failureResponse(response, err);
      });
  });
});

const writeData = () => {
  const firestore = admin.firestore();

  const batch = firestore.batch();

  for (let i = 0; i < 50; ++i) {
    const nycRef = firestore.collection('hello').doc(i.toString());
    batch.set(nycRef, {i: i});
  }

  return batch.commit();
};
