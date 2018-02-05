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
  photoURLs(root) {
    return Object.keys(root.photoURLs).
      map((id) => {
        return Object.assign(root.tags[id], {id: id});
      });
  },
  repliedPostCount(root) {
    return root.repliedPostCount;
  },
  replyPostId(root) {
    return root.replyPostId;
  },
  tags(root) {
    return Object.keys(root.tags).
      map((id) => {
        return Object.assign(root.tags[id], {id: id});
      });
  },
  updatedAt(root) {
    return root.updatedAt;
  },
};
