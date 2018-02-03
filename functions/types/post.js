exports.default = {
  id(root) {
    return root.id;
  },
  content(root) {
    return root.content;
  },
  createdAt(root) {
    return root.createdAt;
  },
  owner(root) {
    return root.owner;
  },
  photoURL(root) {
    return root.photoURL;
  },
  photoURLs(root) {
    return root.photoURLs;
  },
  repliedPostIds(root) {
    return root.repliedPostIds;
  },
  replyPostIds(root) {
    return root.replyPostIds;
  },
  tags(root) {
    return Object.keys(root.tags).
      map((tagId) => {
        return Object.assign({id: tagId}, root.tags[tagId]);
      });
  },
  updatedAt(root) {
    return root.updatedAt;
  },
};
