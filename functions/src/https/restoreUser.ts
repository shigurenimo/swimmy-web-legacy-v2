import * as bcrypt from 'bcrypt';
import * as cors from 'cors';
import * as crypto from 'crypto';
import { auth, firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';

import { failureResponse } from '../utils/failureResponse';
import { successResponse } from '../utils/successResponse';

export = functions.https.onRequest((request, response) => {
  return cors({ origin: true })(request, response, async () => {
    const args = getArguments(request.body);

    try {
      const result = await updateAuthentication(args.username, args.password);
      successResponse(response, result);
    } catch (err) {
      failureResponse(response, err);
    }
  });
})

const getArguments = (body) => {
  return {
    username: body.username,
    password: body.password
  };
};

const updateAuthentication = async (username, password) => {
  const usersRef = firestore().collection('users');

  const snapshots = await usersRef.where('username', '==', username).limit(1).get();

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

  const result = await compare(hash, user.bycript);

  if (!result) {
    return { valid: false, error: 'auth/wrong-password' };
  }

  await auth().updateUser(user.uid, { password, disabled: false });

  return { valid: true, error: null };
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
