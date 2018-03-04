export const Post = {
  id (root) {
    return root.id;
  },
  content (root) {
    return root.content;
  },
  createdAt (root) {
    return root.createdAt;
  },
  ownerId (root, args, context) {
    if (context.user) {
      return context.user.uid === root.ownerId;
    } else {
      return root.ownerId;
    }
  },
  owner (root) {
    return root.owner;
  },
  photoURLs (root) {
    return Object.keys(root.photoURLs).map((id) => {
      return root.photoURLs[id].photoURL;
    });
  },
  repliedPostCount (root) {
    return root.repliedPostCount;
  },
  replyPostId (root) {
    return root.replyPostId;
  },
  tags (root) {
    return Object.keys(root.tags).filter((tagId) => {
      return root.tags[tagId].count;
    }).map((tagId) => {
      return Object.assign(root.tags[tagId], {
        id: `${root.id}-${tagId}`,
        postId: root.id,
        tagId: tagId
      });
    });
  },
  updatedAt (root) {
    return root.updatedAt;
  }
};
