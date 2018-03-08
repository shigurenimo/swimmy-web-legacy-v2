import { getPosts } from '../api/posts/getPosts';
import { updatePostObjects } from '../api/posts/updatePostObjects';

export default async (root, { startAfter = null }) => {
  console.log('mutation:refactorPostObjects');

  const posts = await getPosts({ limit: 3000, startAfter });

  await updatePostObjects(posts);

  return {
    lastObjectId: posts.length ? posts[posts.length - 1].id : ''
  };
};
