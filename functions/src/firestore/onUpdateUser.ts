import { Change, EventContext, firestore } from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

import { updateAuthDisplayName } from '../api/authentications/updateAuthDisplayName';
import { deleteImage } from '../api/images/deleteImage';
import { User } from '../interfaces/user';
import { isUnchangedOwner } from '../utils/isUnchangedOwner';

const document = firestore.document('users/{uid}');

const handler = async (snapshot: Change<DocumentSnapshot>, context: EventContext): Promise<void> => {
  const { uid } = context.params;
  const user = snapshot.after.data() as User;
  const userBefore = snapshot.before.data() as User;

  if (isUnchangedOwner(user, userBefore)) {
    console.log('no change');
    return;
  }

  if (user.photoURL !== userBefore.photoURL) {
    const photoIds = Object.keys(userBefore.photoURLs);
    for (const photoId of photoIds) {
      await deleteImage(photoId);
    }
  }

  const owner = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };

  await updateAuthDisplayName(uid, owner);
};

export = document.onUpdate(handler);
