import * as admin from 'firebase-admin';

import { POSTS } from '../../constants/index';
import { createPostObject } from './createPostObject';

import { setPost } from './setPost';

export const addPost = async (input, owner) => {
  const postId = admin.firestore().collection(POSTS).doc().id;

  const newPost = await setPost(postId, input, owner);

  return createPostObject(postId, newPost);
};
