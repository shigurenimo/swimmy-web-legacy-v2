import { https } from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';

import { setImage } from '../api/images/setImage';
import { getPhotoURL } from '../api/microservices/getPhotoURL';
import { updateUser } from '../api/users/updateUser';
import { USERS } from '../constants';
import { Owner } from '../interfaces/owner';
import { createUpdateUser } from '../models/users/createUpdateUser';

interface Data {
  description?: string;
  displayName?: string;
  username?: string;
  photos: { photoId: string, downloadURL: string }[]
}

export = https.onCall(async (data: Data, context: CallableContext) => {
  const owner: Owner = 'auth' in context ? {
    uid: context.auth.uid,
    displayName: context.auth.token.name,
    photoURL: context.auth.token.picture,
  } : null;

  if (!owner) {
    throw new Error('not authenticated');
  }

  const photoURLs = {};

  for (const photo of data.photos) {
    const {photoId, downloadURL} = photo;
    console.log(photoId, downloadURL);
    const photoObject = await getPhotoURL(USERS, photoId, downloadURL);
    await setImage(photoId, photoObject);
    photoURLs[photoId] = photoObject;
  }

  const photoIds = Object.keys(photoURLs) || [];

  const photoURL = photoIds.length ? photoURLs[photoIds[0]].photoURL : null;

  const createUpdateUserInput = {
    description: data.description,
    displayName: data.displayName,
    username: data.username,
    photoURLs,
    photoURL,
  };

  const newUser = await createUpdateUser(createUpdateUserInput);

  await updateUser(owner.uid, newUser);

  return {owner};
});
