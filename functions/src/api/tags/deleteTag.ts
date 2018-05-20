import { firestore } from 'firebase-admin';

import { TAGS } from '../../constants';
import { Tag } from '../../interfaces/tag';

export const deleteTag = async (tag: Tag): Promise<void> => {
  await firestore().runTransaction(async (t) => {
    const findRef = firestore().collection(TAGS).where('name', '==', tag.name);

    const querySnapshot = await t.get(findRef);

    if (querySnapshot.empty) {
      return;
    }

    const snapshot = querySnapshot.docs[0];

    const data = snapshot.data();

    const ref = firestore().collection(TAGS).doc(snapshot.id);

    const newTag = {
      name: tag.name,
      count: Number(data.count || 0) - 1
    };

    t.set(ref, newTag, { merge: true });
  });
};
