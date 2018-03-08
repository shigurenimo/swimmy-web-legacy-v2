import { getPost } from '../api/posts/getPost';

export default async (root, { id }) => {
  const post = await getPost(id) as any;

  const tagIds = Object.keys(post.tags);

  tagIds.forEach((tagId) => {
    const tag = post.tags[tagId];
    post.tags[tagId] = {
      name: tag.name,
      count: tag.count
    };
  });

  console.log(post);

  return post;
};
