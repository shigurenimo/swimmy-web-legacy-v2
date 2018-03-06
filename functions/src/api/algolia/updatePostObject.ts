import * as functions from 'firebase-functions/lib/index';

import { POSTS } from '../../constants';

import { updateObject } from './updateObject';

export const updatePostObject = (postId, post) => {
  const { projectId } = functions.config().firebase;
  const index = `${projectId}:${POSTS}`;

  return updateObject(index, postId, post);
};
