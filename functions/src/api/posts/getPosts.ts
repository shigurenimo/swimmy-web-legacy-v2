import * as admin from 'firebase-admin';

import { POSTS } from '../../constants/index';
import { DESC } from '../../constants/query';

/**
 * Get /posts
 * @return {Promise}
 */
export const getPosts = async (args) => {
  const {
    limit = 15,
    orderBy = {
      direction: 'DESC',
      field: 'createdAt'
    },
    type = 'NONE'
  } = args;

  let ref = admin.firestore().collection(POSTS) as any;

  switch (type) {
    case 'THREAD': {
      ref = ref.orderBy('repliedPostCount', 'DESC')
      break;
    }
    case 'PHOTO': {
      ref = ref.orderBy('photoURL', 'DESC')
      break;
    }
  }

  ref = ref.orderBy(orderBy.field, orderBy.direction);

  ref = ref.limit(limit);

  const querySnapshots = await ref.get();

  if (querySnapshots.empty) {
    return [];
  }

  const posts = querySnapshots.docs.map((snapshot) => {
    const data = snapshot.data();

    return { ...data, id: snapshot.id };
  });

  return posts;
};
