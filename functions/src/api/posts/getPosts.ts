import { firestore } from 'firebase-admin';

import { POSTS } from '../../constants';
import { DESC } from '../../constants/query';
import { DocsQuery } from '../../interfaces/doc';
import { Post } from '../../interfaces/post';

interface PostDocsQuery extends DocsQuery {
  type: string;
}

export const getPosts = async (docsQuery: PostDocsQuery): Promise<Post[]> => {
  const {
    limit = 15,
    orderBy = {
      direction: 'DESC',
      field: 'createdAt'
    },
    type,
    startAfter
  } = docsQuery;

  let ref = firestore().collection(POSTS) as any;

  ref = ref.orderBy(orderBy.field, orderBy.direction);

  switch (type) {
    case 'THREAD': {
      ref = ref.orderBy('repliedPostCount', 'DESC');
      break;
    }
    case 'PHOTO': {
      ref = ref.orderBy('photoURL', 'ASC');
      break;
    }
  }

  if (startAfter) {
    const prevSnapshot = await firestore().collection(POSTS).doc(startAfter).get();
    ref = ref.startAfter(prevSnapshot);
  }

  ref = ref.limit(limit);

  const querySnapshots = await ref.get();

  if (querySnapshots.empty) {
    return [];
  }

  return querySnapshots.docs.map((snapshot) => {
    const data = snapshot.data();

    const tagIds = Object.keys(data.tags);

    tagIds.forEach((tagId) => {
      const tag = data.tags[tagId];
      data.tags[tagId] = {
        name: tag.name,
        count: tag.count
      };
    });

    return { ...data, id: snapshot.id };
  });
};
