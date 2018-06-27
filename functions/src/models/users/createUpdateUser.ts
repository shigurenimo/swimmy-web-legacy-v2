import { UserForUpdate } from '../../interfaces/user';
import { PhotoURLs } from '../../types/photoURL';

interface Input {
  description?: string;
  displayName?: string;
  username?: string;
  photoURLs: PhotoURLs;
  photoURL: string | null;
}

export const createUpdateUser = (input: Input): Promise<UserForUpdate> => {
  const updatedAt = new Date();

  const newUser = { updatedAt } as any;

  if (input.description) {
    newUser.description = input.description;
  }

  if (input.displayName) {
    newUser.displayName = input.displayName;
  }

  if (input.username) {
    newUser.username = input.username;
  }

  if (input.photoURL) {
    newUser.photoURL = input.photoURL;
    newUser.photoURLs = input.photoURLs;
  }

  return newUser;
};
