import { POSTS } from '../../constants/index';
import { updateObject } from '../algolia/updateObject';
import { createPostObject } from './createPostObject';

export const updatePostObject = async (post) => {
  const object = createPostObject(post);

  await updateObject(POSTS, object);
};
