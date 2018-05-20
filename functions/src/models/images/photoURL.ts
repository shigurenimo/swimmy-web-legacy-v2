import { getPhotoURL } from '../../api/microservices/getPhotoURL';

interface PhotoObject {
  photoId: string;
  photoURL: string;
}

type photoObjects = PhotoObject[]

export const createPhotoURL = async (photoObject: PhotoObject) => {
  const { photoId, photoURL } = photoObject;
  return getPhotoURL('posts', photoId, photoURL);
};

export const createPhotoURLs = async (photoObjects: photoObjects) => {
  const promises = photoObjects.map(createPhotoURL);

  return Promise.all(promises);
};