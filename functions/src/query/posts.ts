import { getPosts } from '../api/posts/getPosts';

export default async () => {
  const nodes = await getPosts({ limit: 40 });
  const sortedNodes = nodes.sort((a, b) => b.createdAt - a.createdAt);

  return { nodes: sortedNodes };
};
