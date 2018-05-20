export const PostConnection = {
  nodes (root) {
    return root.nodes;
  },
  totalCount (root) {
    return root.nodes.length;
  }
};
