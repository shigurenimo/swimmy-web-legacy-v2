import { User, UserForUpdate } from '../../interfaces/user';
import { PhotoURLs } from '../../types/photoURL';

interface Input {
  description: string;
  displayName: string;
  username: string;
  photoURLs: PhotoURLs;
  photoURL: string | null;
}

export const createUpdateUser = (uid: string, input: Input): Promise<UserForUpdate> => {
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

  if (Object.keys(input.photoURLs)) {
    newUser.photoURLs = input.photoURLs;
  }

  if (input.photoURL) {
    newUser.photoURL = input.photoURL;
  }

  return newUser;
};
