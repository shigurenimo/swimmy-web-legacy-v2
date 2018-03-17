import * as admin from 'firebase-admin';

import { POST_TAGS, POSTS, TAGS, USERS } from '../../constants/index';
import { createPostObject } from './createPostObject';

/**
 * Update /posts/{postId}-tags
 * @param {Object} input
 * @param {Object} user
 * @return {Promise<any> | *}
 */
export const updatePostTag = (input, user) => {
  return admin.firestore().runTransaction((t) => {
    const newTagId = admin
      .firestore()
      .collection(TAGS)
      .doc()
      .id;

    const postRef = admin
      .firestore()
      .collection(POSTS)
      .doc(input.postId);

    const userPostTagsRef = admin
      .firestore()
      .collection(USERS)
      .doc(user.uid)
      .collection(POST_TAGS)
      .doc(input.postId);

    const tagNameRef = admin
      .firestore()
      .collection(TAGS)
      .where('name', '==', input.name);

    return Promise.all([
      t.get(postRef),
      t.get(userPostTagsRef),
      t.get(tagNameRef)
    ]).then(([postSnapshot, userPostTagsSnapshot, tagSnapshots]) => {
      const createdAt = new Date();

      const tagSnapshot = tagSnapshots.docs[0];

      const tagExists = tagSnapshot && tagSnapshot.exists;

      const post = postSnapshot.data();

      const postTags = post.tags;

      const postTagExists = !!Object
        .keys(postTags)
        .find((tagId) => postTags[tagId].name === input.name);

      const tagId = postTagExists
        ?
        Object.keys(postTags)
          .filter((tagId) => postTags[tagId].name === input.name)[0]
        :
        newTagId;

      const postTag = postTagExists
        ? postTags[tagId]
        : {
          count: 1,
          createdAt: createdAt,
          name: input.name,
          updatedAt: createdAt
        };

      const userPostTagExists = userPostTagsSnapshot.exists &&
        !!userPostTagsSnapshot.data() &&
        !!userPostTagsSnapshot.data()[tagId];

      // Postに同じ名前のタグが存在する
      if (postTagExists) {
        // 既にユーザが持っている
        if (userPostTagExists) {
          postTag.count = postTag.count - 1;
          postTags[tagId] = postTag;

          if (postTag.count < 1 && postTag.name !== 'スキ') {
            delete postTags[tagId];
          }

          t.update(userPostTagsRef, {
            [tagId]: admin.firestore.FieldValue.delete()
          });
        }

        // ユーザが持っていない
        if (!userPostTagExists) {
          postTag.count = postTag.count + 1;
          postTags[tagId] = postTag;

          t.set(userPostTagsRef, {
            [tagId]: {
              createdAt: createdAt
            }
          }, {merge: true});
        }

        t.update(postRef, {
          tags: postTags
        });
      }

      // Postに同じ名前のタグが存在しない
      if (!postTagExists) {
        t.set(userPostTagsRef, {
          [tagId]: {
            createdAt: createdAt
          }
        }, {merge: true});

        postTags[tagId] = postTag;

        t.update(postRef, {
          tags: postTags
        });
      }

      // タグが存在する
      if (tagExists) {
        const tag = tagSnapshot.data();
        const tagRef = admin
          .firestore()
          .collection(TAGS)
          .doc(tagSnapshot.id);
        const count = tag.count + (userPostTagExists ? -1 : 1);
        if (count < 1) {
          if (tag.name !== 'スキ') {
            t.delete(tagRef);
          }
        } else {
          t.update(tagRef, {
            count: count,
            updatedAt: createdAt
          });
        }
      }

      // タグが存在しない
      if (!tagExists) {
        const tagRef = admin
          .firestore()
          .collection(TAGS)
          .doc(tagId);
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

      const newPost = createPostObject(postSnapshot.id, post);

      return {...newPost, id: postSnapshot.id};
    });
  });
};
