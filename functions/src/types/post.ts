export const Post = {
  id (root) {
    return root.id;
  },
  content (root) {
    return root.content;
  },
  createdAt (root) {
    return new Date(root.createdAt);
  },
  ownerId (root, args, context) {
    if (context && context.user) {
      return context.user.uid === root.ownerId;
    } else {
      return root.ownerId;
    }
  },
  owner (root) {
    return root.owner;
  },
  photoCount (root) {
    return root.photoCount;
  },
  photoURLs (root) {
    return root.photoURLs;
  },
  photoURL (root) {
    return root.photoURL || null;
  },
  repliedPostCount (root) {
    return root.repliedPostCount;
  },
  replyPostId (root) {
    return root.replyPostId;
  },
  tags (root) {
    const tags = root.tags.filter((tag) => {
      return tag.count;
    }).map((tag) => {
      return {
        id: tag.id,
        postId: root.id,
        tagId: tag.tagId,
        name: tag.name,
        count: tag.count
      };
    });
    return tags;
  },
  updatedAt (root) {
    return new Date(root.updatedAt);
  }
};
