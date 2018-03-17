import { updateUser } from '../../api/users/updateUser';

export default async (root, { id, input }, context) => {
  console.log('mutation: updateUser');

  if (!context.user) {
    throw new Error('context.user not found')
  }

  if (id !== context.user.uid) {
    throw new Error('not authenticated')
  }

  const newUser = await updateUser(id, input);

  return newUser;
};
