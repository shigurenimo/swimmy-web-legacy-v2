import { firestore } from 'firebase-admin';

import { POST_TAGS, POSTS, TAGS, USERS } from '../../constants';
import { Owner } from '../../interfaces/owner';
import { createId } from '../../utils/createId';

interface Input {
  postId: string;
  name: string;
}

export const updatePostTag = async (input: Input, user: Owner): Promise<void> => {
  if (!input.postId) {
    throw new Error('input.postId not found');
  }

  if (!input.name) {
    throw new Error('input.name not found');
  }

  await firestore().runTransaction(async (t) => {
    const newTagId = createId();

    const postPath = [POSTS, input.postId].join('/');
    const postRef = firestore().doc(postPath);

    const userPostTagsPath = [USERS, user.uid, POST_TAGS, input.postId].join('/');
    const userPostTagsRef = firestore().doc(userPostTagsPath);

    const tagNameRef = firestore().collection(TAGS).where('name', '==', input.name);

    const [
      postSnapshot,
      userPostTagsSnapshot,
      tagSnapshots,
    ] = await Promise.all([
      t.get(postRef),
      t.get(userPostTagsRef),
      t.get(tagNameRef),
    ]);

    const createdAt = new Date();

    const tagSnapshot = tagSnapshots.docs[0];

    const tagExists = tagSnapshot && tagSnapshot.exists;

    const post = postSnapshot.data();

    const postTags = post.tags;

    const postTagExists = !!Object
      .keys(postTags)
      .find((postTagId) => postTags[postTagId].name === input.name);

    const tagId = postTagExists
      ? Object
        .keys(postTags)
        .filter((postTagId) => postTags[postTagId].name === input.name)[0]
      : newTagId;

    const postTag = postTagExists
      ? postTags[tagId]
      : {
        count: 1,
        createdAt: createdAt,
        name: input.name,
        updatedAt: createdAt,
      };

    const userPostTagExists = userPostTagsSnapshot.exists &&
      !!userPostTagsSnapshot.data() &&
      !!userPostTagsSnapshot.data()[tagId];

    // Postに同じ名前のタグが存在する
    if (postTagExists) {
      // 既にユーザが持っている
      if (userPostTagExists) {
        postTag.count -= 1;
        postTags[tagId] = postTag;

        if (postTag.count < 1 && postTag.name !== 'スキ') {
          delete postTags[tagId];
        }

        t.update(userPostTagsRef, {[tagId]: firestore.FieldValue.delete()});
      }

      // ユーザが持っていない
      if (!userPostTagExists) {
        postTag.count += 1;
        postTags[tagId] = postTag;

        t.set(userPostTagsRef, {[tagId]: {createdAt: createdAt}}, {merge: true});
      }

      t.update(postRef, {tags: postTags});
    }

    // Postに同じ名前のタグが存在しない
    if (!postTagExists) {
      t.set(userPostTagsRef, {[tagId]: {createdAt: createdAt}}, {merge: true});

      postTags[tagId] = postTag;

      t.update(postRef, {tags: postTags});
    }

    // タグが存在する
    if (tagExists) {
      const tag = tagSnapshot.data();
      const tagPath = [TAGS, tagSnapshot.id].join('/');
      const tagRef = firestore().doc(tagPath);
      const count = tag.count + (userPostTagExists ? -1 : 1);
      if (count < 1) {
        t.delete(tagRef);
      } else {
        t.update(tagRef, {count: count, updatedAt: createdAt});
      }
    }

    // タグが存在しない
    if (!tagExists) {
      const tagPath = [TAGS, tagId].join('/');
      const tagRef = firestore().doc(tagPath);
      t.set(tagRef, postTag);
    }

    postTag.id = `${postSnapshot.id}-${tagId}`;
    postTag.postId = postSnapshot.id;
    postTag.tagId = tagId;

    for (let i = 0; i < post.tags.length; ++i) {
      if (post.tags[i].name !== postTag.name) {
        continue;
      }
      post.tags[i] = postTag;
    }
  });
};
