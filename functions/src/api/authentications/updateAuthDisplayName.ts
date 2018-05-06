import { auth } from 'firebase-admin';

interface Input {
  displayName: string,
  photoURL: string
}

export const updateAuthDisplayName = async (uid: string, input: Input): Promise<void> => {
  if (!input) {
    throw new Error('input not found');
  }

  if (typeof input.displayName === 'undefined') {
    throw new Error('input.displayName not found');
  }

  if (typeof input.photoURL === 'undefined') {
    throw new Error('input.photoURL not found');
  }

  if (typeof uid === 'undefined') {
    throw new Error('uid not found');
  }

  await auth().updateUser(uid, {
    displayName: input.displayName,
    photoURL: input.photoURL
  });
};
