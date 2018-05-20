import * as functions from 'firebase-functions';
import { updateAuthDisplayName } from '../api/authentications/updateAuthDisplayName';
import { setUser } from '../api/users/setUser';
import { createUser } from '../models/users/createUser';

const document = functions.auth.user();

export = document.onCreate(async (user) => {
  if (user.disabled) {
    return Promise.resolve();
  }

  const newUser = createUser(user);

  await Promise.all([
    updateAuthDisplayName(user.uid, user),
    setUser(user.uid, newUser)
  ]);
})
