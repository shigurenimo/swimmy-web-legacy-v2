import { firestore } from 'firebase-admin';

import { TAGS } from '../../constants';
import { DESC } from '../../constants/query';

export const getTags = async ({ limit }) => {
  const ref = firestore()
    .collection(TAGS)
    .orderBy('createdAt', DESC)
    .limit(limit);

  const snapshots = await ref.get();

  return snapshots.docs.map((snapshot) => {
    const data = snapshot.data();

    return { ...data, id: snapshot.id };
  });
};
