import { firestore } from 'firebase-admin';

import { TAGS } from '../../constants';

export const deleteTag = (tag) => {
  return firestore().runTransaction(async (t) => {
    const findRef = firestore().collection(TAGS).where('name', '==', tag.name);

    const querySnapshot = await t.get(findRef);

    if (querySnapshot.empty) {
      return;
    }

    const snapshot = querySnapshot.docs[0];

    const data = snapshot.data();

    const ref = firestore().collection(TAGS).doc(snapshot.id);

    t.set(ref, {
      name: tag.name,
      count: Number(data.count || 0) - 1
    }, {
      merge: true
    });
  });
};
