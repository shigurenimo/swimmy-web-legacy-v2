import { auth } from 'firebase-admin';
import { User } from '../../interfaces/user';

export const createUser = (userRecord: auth.UserRecord): User => {
  if (!userRecord) {
    throw new Error('userRecord not found');
  }

  const uid = userRecord.uid;

  const input = {
    displayName: userRecord.email.match(/^[^@]+/)[0]
  } as any;

  const createdAt = new Date();

  return {
    uid: uid,
    comment: '',
    createdAt: createdAt,
    description: '',
    username: input.email.match(/^[^@]+/)[0],
    displayName: input.email.match(/^[^@]+/)[0],
    followeeCount: 0,
    followerCount: 0,
    headerPhotoURL: '',
    links: [],
    photoURL: '',
    photoURLs: {},
    postCount: 0,
    updatedAt: createdAt
  };
};
