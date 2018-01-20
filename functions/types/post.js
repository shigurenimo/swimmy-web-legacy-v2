exports.default = {
  content(root) {
    return root.content;
  },
  createdAt(root) {
    return root.createdAt;
  },
  id(root) {
    return root.id;
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
  tags() {
    return [];
  },
  updatedAt(root) {
    return root.updatedAt;
  },
};
