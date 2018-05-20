export const User = {
  id (root) {
    return root.id;
  },
  createdAt (root) {
    return root.createdAt;
  },
  description (root) {
    return root.description;
  },
  displayName (root) {
    return root.displayName;
  },
  followeeCount (root) {
    return root.followeeCount;
  },
  followerCount (root) {
    return root.followerCount;
  },
  headerPhotoURL (root) {
    return root.headerPhotoURL;
  },
  links (root) {
    return root.links;
  },
  photoURL (root) {
    return root.photoURL;
  },
  postCount (root) {
    return root.postCount;
  },
  uid (root) {
    return root.id;
  },
  updatedAt (root) {
    return root.updatedAt;
  }
};
