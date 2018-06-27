import { Post, PostObject } from '../../interfaces/post';

export const createPostObject = (objectID: string, root: Post): PostObject => {
  return {
    objectID: objectID,
    id: objectID,
    content: root.content,
    createdAt: root.createdAt as any / 1,
    ownerId: root.ownerId || '',
    owner: root.owner || null,
    photoCount: Object.keys(root.photoURLs || []).length,
    photoURLs: Object.keys(root.photoURLs || []).map((photoId) => {
      return root.photoURLs[photoId].photoURL;
    }),
    photoURL: root.photoURL || '',
    repliedPostCount: root.repliedPostCount || 0,
    replyPostId: root.replyPostId || '',
    repliedPostIds: root.repliedPostIds,
    tags: Object.keys(root.tags).map((tagId) => {
      const tag = root.tags[tagId];
      return {
        id: `${objectID}-${tagId}`,
        tagId: tagId,
        name: tag.name,
        count: tag.count,
      };
    }),
    updatedAt: root.updatedAt as any / 1,
  };
};
