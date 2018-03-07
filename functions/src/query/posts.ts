import { getPosts } from '../api/posts/getPosts';

export default async (root, args) => {
  const nodes = await getPosts(args);

  return {
    nodes,
    totalCount: nodes.length
  };
};
