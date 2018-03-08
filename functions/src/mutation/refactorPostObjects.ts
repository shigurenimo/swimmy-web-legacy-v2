import { updatePostObjects } from '../api/algolia/updatePostObjects';
import { getPosts } from '../api/posts/getPosts';

export default async (root, { startAfter = null }) => {
  console.log('mutation:refactorPostObjects');

  console.log('get posts');

  const posts = await getPosts({ limit: 4000, startAfter });

  console.log('posts.length', posts.length);

  console.log('update objects');

  await updatePostObjects(posts);

  return posts[posts.length - 1].id;
};
