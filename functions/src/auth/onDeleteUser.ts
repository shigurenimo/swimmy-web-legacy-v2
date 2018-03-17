import * as functions from 'firebase-functions';
import { deleteUserObject } from '../api/users/deleteUserObject';

export = functions.auth.user().onDelete(async (event) => {
  const user = event.data;

  console.info(`delete ${user.displayName}`);

  await deleteUserObject(user.uid);

  return 200;
})
