import admin from 'firebase-admin';
import functions from 'firebase-functions';

import cors from 'cors';

import {failureResponse} from '../helpers/failureResponse';
import {successResponse} from '../helpers/successResponse';

export default functions.https.onRequest((request, response) => {
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
