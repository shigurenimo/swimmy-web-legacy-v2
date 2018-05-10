import { getPhotoURL } from '../microservices/getPhotoURL';

export const createUpdateUser = (uid: string, input) => {
  const updatedAt = new Date();

  const newUser = {
    updatedAt: updatedAt
  } as any;

  if (input.description) {
    newUser.description = input.description;
  }

  if (input.displayName) {
    newUser.displayName = input.displayName;
  }

  if (input.username) {
    newUser.username = input.username;
  }

  newUser.photoURLs = {};

  if (input.photoURLs && input.photoURLs[0]) {
    const { photoId, photoURL } = input.photoURLs[0];
    const data = await;
    getPhotoURL('users', photoId, photoURL);
    newUser.photoURLs[photoId] = data;
    newUser.photoURL = data.photoURL;
  }

  return newUser;
};
