import * as functions from 'firebase-functions';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { deleteUserObject } from '../api/users/deleteUserObject';

const document = functions.auth.user();

export = document.onDelete(async (user: UserRecord) => {
  console.info(`delete ${user.displayName}`);

  await deleteUserObject(user.uid);

  return 200;
})
