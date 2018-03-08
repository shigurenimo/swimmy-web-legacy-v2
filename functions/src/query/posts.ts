import { getPostObjects } from '../api/posts/getPostObjects';

export default async (root, args) => {
  const nodes = await getPostObjects(args);

  return {
    nodes,
    totalCount: nodes.length
  };
};
