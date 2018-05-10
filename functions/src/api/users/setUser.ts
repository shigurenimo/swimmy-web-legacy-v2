export const setUser = async (uid: string, newUser) => {
  await ref.set(newUser);
};
