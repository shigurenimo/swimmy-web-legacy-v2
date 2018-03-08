import * as functions from 'firebase-functions/lib/index';

import { POSTS } from '../../constants';
import { updateObjects } from './updateObjects';

export const updatePostObjects = (posts) => {
  const { projectId } = functions.config().firebase;
  const index = `${projectId}:${POSTS}`;

  return updateObjects(index, posts);
};
