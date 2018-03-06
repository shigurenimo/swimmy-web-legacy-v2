import * as bcrypt from 'bcrypt';
import * as cors from 'cors';
import * as crypto from 'crypto';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { failureResponse } from '../helpers/failureResponse';
import { successResponse } from '../helpers/successResponse';

export = functions.https.onRequest((request, response) => {
  return cors({ origin: true })(request, response, () => {
    const args = getArguments(request.body);
    return updateAuthentication(args.username, args.password).then((result) => {
      return successResponse(response, result);
    }).catch((err) => {
      return failureResponse(response, err);
    });
  });
})

const getArguments = (body) => {
  return {
    username: body.username,
    password: body.password
  };
};

const updateAuthentication = (username, password) => {
  return admin
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .limit(1)
    .get()
    .then((snapshots) => {
      const snapshot = snapshots.docs[0];

      if (!snapshot) {
        return { valid: false, error: 'auth/user-disabled' };
      }

      const user = snapshot.data();

      if (!user.bycript) {
        return { valid: false, error: 'auth/user-disabled' };
      }

      const sha512 = crypto.createHash('sha256');

      sha512.update(password);

      const hash = sha512.digest('hex');

      return compare(hash, user.bycript).then((result) => {
        if (!result) {
          return { valid: false, error: 'auth/wrong-password' };
        }

        return admin
          .auth()
          .updateUser(user.uid, { password, disabled: false })
          .then(() => {
            return { valid: true, error: null };
          });
      });
    });
};

const compare = (hash, bcryptHash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(hash, bcryptHash, (err, res) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
};
