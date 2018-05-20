import { Owner } from '../interfaces/owner';

export const isUnchangedOwner = (owner: Owner, previous: Owner): boolean => {
  return owner.displayName === previous.displayName &&
    owner.photoURL === previous.photoURL;
};
