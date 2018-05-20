import { firestore } from 'firebase-admin';

import { TAGS } from '../../constants/index';
import { Tag } from '../../interfaces/tag';

export const getTag = async (tagId: string): Promise<Tag> => {
  if (typeof tagId === 'undefined') {
    throw new Error('postId not found');
  }

  const ref = firestore().collection(TAGS).doc(tagId);

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    throw new Error(`tag(${tagId}) not found`);
  }

  const data = snapshot.data();

  return { ...data, id: snapshot.id } as Tag;
};
