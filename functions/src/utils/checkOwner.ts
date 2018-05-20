import { Owner } from '../interfaces/owner';

interface Doc {
  ownerId?: string;
}

export const checkOwner = (doc: Doc, owner: Owner) => {
  if (!doc.ownerId) {
    throw new Error('ownerId not found');
  }

  if (doc.ownerId !== owner.uid) {
    throw new Error('ownerId !== user.uid');
  }
};
