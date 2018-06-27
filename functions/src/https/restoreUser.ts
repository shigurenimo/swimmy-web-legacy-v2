import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { auth, firestore } from 'firebase-admin';
import { https } from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { USERS } from '../constants';

interface Data {
  username?: string;
  password?: string;
}

export = https.onCall(async (data: Data, context: CallableContext) => {
  const { username, password } = data;

  const usersRef = firestore().collection(USERS);

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
})

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
