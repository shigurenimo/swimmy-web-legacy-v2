import { getPhotoURL } from '../../api/microservices/getPhotoURL';

export const createPost = async (postId: string, input, owner) => {
  const createdAt = new Date();

  const newPost = {
    id: postId,
    content: input.content,
    createdAt: createdAt,
    ownerId: null,
    owner: null,
    photoURL: null,
    photoURLs: {},
    repliedPostCount: 0,
    replyPostId: input.replyPostId || null,
    tags: {},
    updatedAt: createdAt
  };

  if (owner) {
    newPost.ownerId = owner.uid;
    /*
    newPost.owner = {
      uid: owner.uid,
      displayName: owner.displayName,
      photoURL: owner.photoURL
    };
    */
  }

  newPost.photoURLs = {};

  const photoURLLength = input.photoURLs.length;

  if (photoURLLength) {
    for (let i = 0; i < photoURLLength; ++i) {
      const { photoId, photoURL } = input.photoURLs[i];
      const data = await getPhotoURL('posts', photoId, photoURL);
      newPost.photoURLs[photoId] = data;
    }
    newPost.photoURL = newPost.photoURLs[0].photoURL;
  }

  return newPost;
};
