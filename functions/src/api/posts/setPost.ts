import * as admin from 'firebase-admin';

import { POSTS } from '../../constants/index';
import { getPhotoURL } from '../microservices/getPhotoURL';

/**
 * Set /posts/{postId}
 * @param {string} postId
 * @param {Object} input
 * @param {Object} owner
 * @return {Promise}
 */
export const setPost = async (postId, input, owner) => {
  const createdAt = new Date();

  const newPost = {
    id: postId,
    content: input.content,
    createdAt: createdAt,
    ownerId: null,
    owner: null,
    photoURL: null,
    photoURLs: {},
    repliedPostCount: 0,
    replyPostId: input.replyPostId || null,
    tags: {},
    updatedAt: createdAt
  };

  if (owner) {
    newPost.ownerId = owner.uid;
    /*
    newPost.owner = {
      uid: owner.uid,
      displayName: owner.displayName,
      photoURL: owner.photoURL
    };
    */
  }

  newPost.photoURLs = {};

  input.photoURLs = input.photoURLs || [];

  if (input.photoURLs[0]) {
    for (let i = 0; i < input.photoURLs.length; ++i) {
      const {photoId, photoURL} = input.photoURLs[i];
      const data = await getPhotoURL('posts', photoId, photoURL);
      newPost.photoURLs[photoId] = data;
    }
    newPost.photoURL = newPost.photoURLs[0].photoURL;
  }

  await admin.firestore().collection(POSTS).doc(postId).set(newPost);

  return {...newPost, id: postId};
};
