import { updatePostObjects } from '../../api/posts/updatePostObjects';
import { getPosts } from '../../api/posts/getPosts';
import { updatePosts } from '../../api/posts/updatePosts';

export default async (root, { startAfter = null }) => {
  console.log('mutation:refactorPostObjects');

  console.log('get posts');

  const posts = await getPosts({ limit: 2, startAfter });

  console.log('posts.length', posts.length);

  console.log('update objects');

  await updatePosts(posts);

  return posts[posts.length - 1].id;
};
