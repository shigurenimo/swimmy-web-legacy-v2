import { setUser } from './setUser';

export const addUser = (user) => {
  if (!user) {
    throw new Error('user not found');
  }

  const uid = user.uid;

  const input = {
    displayName: user.email.match(/^[^@]+/)[0]
  };

  return setUser(uid, input);
};
