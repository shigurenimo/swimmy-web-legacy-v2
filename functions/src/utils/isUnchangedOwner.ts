export const isUnchangedOwner = (owner, previous) => {
  return owner.displayName === previous.displayName &&
    owner.photoURL === previous.photoURL;
};
