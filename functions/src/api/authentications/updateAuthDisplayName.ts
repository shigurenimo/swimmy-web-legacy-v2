import { auth } from 'firebase-admin';

interface Input {
  displayName: string,
  photoURL: string
}

export const updateAuthDisplayName = async (uid: string, input: Input): Promise<void> => {
  await auth().updateUser(uid, {
    displayName: input.displayName,
    photoURL: input.photoURL
  });
};
