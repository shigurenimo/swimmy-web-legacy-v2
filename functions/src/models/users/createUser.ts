export const createUser = (user) => {
  if (!user) {
    throw new Error('user not found');
  }

  const uid = user.uid;

  const input = {
    displayName: user.email.match(/^[^@]+/)[0]
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
    postCount: 0,
    updatedAt: createdAt
  };
};
