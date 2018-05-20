import { Post } from '../interfaces/post';

export const isPostAsThread = (post: Post): boolean => {
  return post.repliedPostCount > 0;
};
