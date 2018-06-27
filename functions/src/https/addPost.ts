import { https } from 'firebase-functions';
import { CallableContext } from 'firebase-functions/lib/providers/https';

import { setImage } from '../api/images/setImage';
import { getPhotoURL } from '../api/microservices/getPhotoURL';
import { setPostAsAnonymous } from '../api/posts-as -anonymous/setPostAsAnonymous';
import { setPost } from '../api/posts/setPost';
import { POSTS } from '../constants';
import { Owner } from '../interfaces/owner';
import { createPost } from '../models/posts/createPost';
import { createPostAsAnonymous } from '../models/posts/createPostAsAnonymous';
import { createPostObject } from '../models/posts/createPostObject';
import { createId } from '../utils/createId';

interface Data {
  content: string;
  replyPostId: string;
  photos: { photoId: string, downloadURL: string }[]
}

export = https.onCall(async (data: Data, context: CallableContext) => {
  const owner: Owner = 'auth' in context ? {
    uid: context.auth.uid,
    displayName: context.auth.token.name,
    photoURL: context.auth.token.picture,
  } : null;

  const photoURLs = {};

  for (const photo of data.photos) {
    const { photoId, downloadURL } = photo;
    const photoObject = await getPhotoURL(POSTS, photoId, downloadURL);
    await setImage(photoId, photoObject);
    photoURLs[photoId] = photoObject;
  }

  const photoIds = Object.keys(photoURLs) || [];

  const photoURL = photoIds.length ? photoURLs[photoIds[0]].photoURL : null;

  const createPostInput = {
    content: data.content,
    replyPostId: data.replyPostId,
    photoURLs,
    photoURL,
  };

  const postId = createId();

  const newPost = await createPost(postId, createPostInput, owner);
  const newPostAsAnonymous = createPostAsAnonymous(newPost);

  await setPostAsAnonymous(postId, newPostAsAnonymous);
  await setPost(postId, newPost);

  return createPostObject(postId, newPost);
});
