import * as functions from 'firebase-functions';

import { updateAuthDisplayName } from '../api/authentications/updateAuthDisplayName';
import { deleteImage } from '../api/images/deleteImage';

import { failureLog } from '../helpers/failureLog';
import { getEventData } from '../helpers/getEventData';
import { isUnchangedOwner } from '../helpers/isUnchangedOwner';

export = functions.firestore
  .document('users/{uid}')
  .onUpdate(async (event) => {
    const { uid } = event.params;

    const { current: user, previous } = getEventData(event);

    if (isUnchangedOwner(user, previous)) {
      return {};
    }

    try {
      if (user.photoURL !== previous.photoURL) {
        const photoIds = Object.keys(previous.photoURLs);
        for (let i = 0, len = photoIds.length; i < len; ++i) {
          await deleteImage(photoIds[i]);
        }
      }

      const owner = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      };

      await Promise.all([
        updateAuthDisplayName(uid, owner)
      ]);
    } catch (err) {
      failureLog(err);
    }
  });
