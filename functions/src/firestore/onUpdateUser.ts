import * as functions from 'firebase-functions';

import { updateAuthDisplayName } from '../api/authentications/updateAuthDisplayName';
import { deleteImage } from '../api/images/deleteImage';
import { updateUserObject } from '../api/users/updateUserObject';
import { isUnchangedOwner } from '../helpers/isUnchangedOwner';

const document = functions.firestore.document('users/{uid}');

export = document.onUpdate(async (snaphost, context) => {
  const { uid } = context.params;

  const user = snaphost.after.data();

  const userBefore = snaphost.before.data();

  if (isUnchangedOwner(user, userBefore)) {
    return {};
  }

  if (user.photoURL !== userBefore.photoURL) {
    const photoIds = Object.keys(userBefore.photoURLs);
    for (let i = 0, len = photoIds.length; i < len; ++i) {
      await deleteImage(photoIds[i]);
    }
  }

  const owner = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL
  };

  await updateAuthDisplayName(uid, owner);

  await updateUserObject(uid, user);
});
