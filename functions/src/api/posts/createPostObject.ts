export const createPostObject = (root) => {
  return {
    objectID: root.id,
    id: root.id,
    content: root.content,
    createdAt: root.createdAt / 1,
    ownerId: root.ownerId || '',
    owner: root.owner || null,
    photoCount: Object.keys(root.photoURLs || []).length,
    photoURLs: Object.keys(root.photoURLs || []).map((photoId) => {
      return root.photoURLs[photoId].photoURL;
    }),
    photoURL: root.photoURL || '',
    repliedPostCount: root.repliedPostCount || 0,
    replyPostId: root.replyPostId || '',
    tags: Object.keys(root.tags).map((tagId) => {
      const tag = root.tags[tagId];
      return {
        id: `${root.id}-${tagId}`,
        tagId: tagId,
        name: tag.name,
        count: tag.count
      };
    }),
    typeThread: root.repliedPostCount > 0,
    typePhoto: Object.keys(root.photoURLs || []).length > 0,
    updatedAt: root.updatedAt / 1
  };
};
