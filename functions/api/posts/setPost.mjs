import * as admin from 'firebase-admin';

import {POSTS, TAGS} from '../../constants/index';
import {COUNT} from '../../constants/tags';
import {toStorageURL} from '../../helpers/toStorageURL';
import config from '../../config';

/**
 * Set posts/{postId}
 * @param {string} postId
 * @param {Object} input
 * @param {Object} owner
 * @return {Promise}
 */
export const setPost = (postId, input, owner) => {
  const createdAt = new Date();

  const payload = {
    id: postId,
    content: input.content,
    createdAt: createdAt,
    owner: {
      uid: owner.uid,
      displayName: owner.displayName,
      photoURL: owner.photoURL,
    },
    photoURLs: {},
    repliedPostCount: 0,
    replyPostId: input.replyPostId || null,
    tags: {},
    updatedAt: createdAt,
  };

  input.photoURLs.forEach((photoURL) => {
    payload.photoURLs[photoURL] = {
      full: toStorageURL(config.projectId, photoURL),
      xx512: null,
      xx1024: null,
      x512: null,
      x1024: null,
      x2048: null,
    };
  });

  return admin.firestore().
    collection(TAGS).
    orderBy(COUNT).
    limit(1).
    get().
    then((snapshots) => {
      const snapshot = snapshots.docs[0];

      if (snapshot) {
        const data = snapshot.data();
        payload.tags[snapshot.id] = {
          name: data.name,
          count: 0,
          createdAt: createdAt,
          updatedAt: createdAt,
        };
      }

      return admin.firestore().
        collection(POSTS).
        doc(postId).
        set(payload);
    }).
    then(() => {
      return Object.assign(payload, {id: postId});
    });
};
