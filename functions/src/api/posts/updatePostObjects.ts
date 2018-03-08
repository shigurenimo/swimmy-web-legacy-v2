import { POSTS } from '../../constants/index';
import { updateObjects } from '../algolia/updateObjects';
import { createPostObject } from './createPostObject';

export const updatePostObjects = async (posts) => {
  const objects = posts.map(createPostObject);

  await updateObjects(POSTS, objects);
};
