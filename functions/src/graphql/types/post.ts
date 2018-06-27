export const Post = {
  id(root) {
    return root.id;
  },
  createdAt(root) {
    return new Date(root.createdAt);
  },
  ownerId(root, args, context) {
    if (context && context.user) {
      return context.user.uid === root.ownerId ? root.ownerId : null;
    } else {
      return null;
    }
  },
  photoURL(root) {
    return root.photoURL || null;
  },
  tags(root) {
    return root.tags.filter((tag) => {
      return tag.count;
    }).map((tag) => {
      return {
        id: tag.id,
        postId: root.id,
        tagId: tag.tagId,
        name: tag.name,
        count: tag.count,
      };
    });
  },
  updatedAt(root) {
    return new Date(root.updatedAt);
  },
};
