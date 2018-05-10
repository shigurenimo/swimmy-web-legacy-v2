export const createUserObject = (objectID, root) => {
  return {
    objectID: objectID,
    id: objectID,
    createdAt: root.createdAt / 1,
    description: root.description,
    displayName: root.displayName,
    followeeCount: root.followeeCount,
    followerCount: root.followerCount,
    headerPhotoURL: root.headerPhotoURL,
    photoURL: root.photoURL,
    postCount: root.postCount,
    updatedAt: root.updatedAt / 1,
    username: root.username
  };
};
