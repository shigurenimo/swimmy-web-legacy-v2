import { firestore } from 'firebase-functions';

import { deletePostAsPhoto } from '../api/posts-as-photo/deletePostAsPhoto';
import { setPostAsPhoto } from '../api/posts-as-photo/setPostAsPhoto';
import { deletePostAsThread } from '../api/posts-as-thread/deletePostAsThread';
import { setPostAsThread } from '../api/posts-as-thread/setPostAsThread';
import { setUserPost } from '../api/users-posts/setUserPost';
import { createPostAsAnonymous } from '../models/posts/createPostAsAnonymous';
import { isPostAsPhoto } from '../utils/isPostAsPhoto';
import { isPostAsThread } from '../utils/isPostAsThread';

const document = firestore.document('posts/{postId}');

export = document.onUpdate(async (change, context) => {
  const { postId } = context.params;
  const post = change.after.data();

  await Promise.all([
    post.ownerId &&
    setUserPost(post.ownerId, postId, post)
  ]);

  const publicPost = createPostAsAnonymous(post);

  await Promise.all([
    isPostAsPhoto(post)
      ? setPostAsPhoto(postId, publicPost)
      : deletePostAsPhoto(postId),
    isPostAsThread(post)
      ? setPostAsThread(postId, publicPost)
      : deletePostAsThread(postId)
  ]);

  // await updatePostObject(postId, post);
});
