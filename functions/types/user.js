exports.default = {
  createdAt(root) {
    return root.createdAt;
  },
  description(root) {
    return root.description;
  },
  displayName(root) {
    return root.displayName;
  },
  followeeCount(root) {
    return root.followeeCount;
  },
  followerCount(root) {
    return root.followerCount;
  },
  headerPhotoURL(root) {
    return root.headerPhotoURL;
  },
  id(root) {
    return root.uid;
  },
  links(root) {
    return root.links;
  },
  photoURL(root) {
    return root.photoURL;
  },
  postCount(root) {
    return root.postCount;
  },
  updatedAt(root) {
    return root.updatedAt;
  },
};
