import { Post } from '../interfaces/post';

export const isPostAsPhoto = (post: Post): boolean => {
  return !!post.photoURL;
};
