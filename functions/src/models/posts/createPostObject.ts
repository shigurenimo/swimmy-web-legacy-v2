export const createPostObject = (objectID: string, root) => {
  return {
    objectID: objectID,
    id: objectID,
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
        id: `${objectID}-${tagId}`,
        tagId: tagId,
        name: tag.name,
        count: tag.count
      };
    }),
    typeReply: !!root.replyPostId,
    typeThread: root.repliedPostCount > 0,
    typePhoto: Object.keys(root.photoURLs || []).length > 0,
    updatedAt: root.updatedAt / 1
  };
};
