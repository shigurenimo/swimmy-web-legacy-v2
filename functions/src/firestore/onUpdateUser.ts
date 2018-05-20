import { firestore } from 'firebase-functions';

import { updateAuthDisplayName } from '../api/authentications/updateAuthDisplayName';
import { deleteImage } from '../api/images/deleteImage';
import { User } from '../interfaces/user';
import { isUnchangedOwner } from '../utils/isUnchangedOwner';

const document = firestore.document('users/{uid}');

export = document.onUpdate(async (snaphost, context) => {
  const { uid } = context.params;
  const user = snaphost.after.data() as User;
  const userBefore = snaphost.before.data() as User;

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
});
