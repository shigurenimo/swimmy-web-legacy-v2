import { POSTS } from '../../constants/index';
import { updateObject } from '../algolia/updateObject';
import { createPostObject } from './createPostObject';

export const updatePostObject = async (postId, post) => {
  const object = createPostObject(post);

  await updateObject(POSTS, object);
};
