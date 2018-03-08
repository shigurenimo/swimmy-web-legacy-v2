import { getPost } from '../api/posts/getPost';

export default async (root, { id }) => {
  const post = await getPost(id) as any;

  return post;
};
