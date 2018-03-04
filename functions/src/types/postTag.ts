export const PostTag = {
  id (root) {
    return root.id
  },
  count (root) {
    return root.count
  },
  createdAt (root) {
    return root.createdAt
  },
  name (root) {
    return root.name
  },
  postId (root) {
    return root.postId
  },
  tagId (root) {
    return root.tagId
  },
  updatedAt (root) {
    return root.updatedAt
  }
}
